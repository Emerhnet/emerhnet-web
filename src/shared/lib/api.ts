import axios from "axios";
import { useAuthStore } from "@/features/auth/store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshInFlight: Promise<void> | null = null;

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url: string = original?.url ?? "";

    if (status !== 401 || original?._retried) return Promise.reject(error);

    // Never attempt refresh for auth endpoints themselves.
    // sign-in/forgot/reset legitimately 401 on bad input and must surface as-is.
    // me/refresh failures mean the session is gone — clear and bail.
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