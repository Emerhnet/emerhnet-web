import axios from "axios";

export type ApiErrorBody = {
  success: false;
  code: string;
  message: string;
  details?: unknown;
};

export function getApiErrorMessage(
  err: unknown,
  fallback = "Something went wrong",
): string {
  if (axios.isAxiosError(err)) {
    if (err.code === "ERR_NETWORK" || !err.response) {
      return "Could not reach the server. Check your connection and try again.";
    }
    const body = err.response.data as Partial<ApiErrorBody> | undefined;
    if (body?.message) return body.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export function getApiErrorCode(err: unknown): string | null {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as Partial<ApiErrorBody> | undefined;
    return body?.code ?? null;
  }
  return null;
}
