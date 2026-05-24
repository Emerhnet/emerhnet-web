import axios from 'axios';
import { useAuthStore } from '@/features/auth/store';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
    const csrf = getCookie('XSRF-TOKEN');
    if (csrf) config.headers['X-XSRF-TOKEN'] = csrf;
  }
  return config;
});

let refreshInFlight: Promise<void> | null = null;

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url: string = original?.url ?? '';

    if (status !== 401 || original?._retried) return Promise.reject(error);

    // Never attempt refresh for auth endpoints themselves.
    // sign-in/forgot/reset legitimately 401 on bad input and must surface as-is.
    // me/refresh failures mean the session is gone — clear and bail.
    if (url.includes('/auth/')) {
      if (url.includes('/auth/me') || url.includes('/auth/refresh')) {
        useAuthStore.getState().clear();
      }
      return Promise.reject(error);
    }

    original._retried = true;
    if (!refreshInFlight) {
      refreshInFlight = api
        .post('/auth/refresh')
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
