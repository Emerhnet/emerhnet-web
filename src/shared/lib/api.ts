import axios from "axios";
import { useAuthStore } from "@/features/auth/store";

let csrfToken: string | null = null;
export function setCsrfToken(t: string | null) {
  csrfToken = t;
}
export function getCsrfToken() {
  return csrfToken;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Capture CSRF token from response header on every response (server echoes it on all routes).
api.interceptors.response.use(
  (res) => {
    const t = res.headers["x-csrf-token"];
    if (typeof t === "string" && t.length > 0) csrfToken = t;
    return res;
  },
  (err) => {
    const t = err?.response?.headers?.["x-csrf-token"];
    if (typeof t === "string" && t.length > 0) csrfToken = t;
    return Promise.reject(err);
  },
);

// Attach CSRF header on state-changing requests.
api.interceptors.request.use((config) => {
  const m = config.method?.toLowerCase();
  if (m && ["post", "put", "patch", "delete"].includes(m) && csrfToken) {
    config.headers["X-XSRF-TOKEN"] = csrfToken;
  }
  return config;
});

export async function bootstrapCsrf(): Promise<void> {
  const { data } = await api.get<{ csrfToken: string }>("/auth/csrf");
  csrfToken = data.csrfToken;
}

let refreshInFlight: Promise<void> | null = null;

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url: string = original?.url ?? "";

    if (status !== 401 || original?._retried) return Promise.reject(error);

    if (url.includes("/auth/")) {
      if (url.includes("/auth/me") || url.includes("/auth/refresh")) {
        useAuthStore.getState().clear();
      }
      return Promise.reject(error);
    }

    original._retried = true;
    if (!refreshInFlight) {
      refreshInFlight = api
        .post("/auth/refresh")
        .then(() => undefined)
        .finally(() => {
          refreshInFlight = null;
        });
    }

    try {
      await refreshInFlight;
      return api(original);
    } catch (e) {
      useAuthStore.getState().clear();
      return Promise.reject(e);
    }
  },
);
