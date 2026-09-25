import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { DEMO_TOKEN_PREFIX } from "@utils/demoAuth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach Authorization Bearer token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints that must never trigger a refresh attempt (would loop or mask real errors)
const NO_REFRESH_PATHS = ["/auth/signin", "/auth/signup", "/auth/refresh", "/auth/signout"];

let refreshPromise: Promise<string | null> | null = null;
// Set once the auth API answers 404 for /auth/refresh, so we stop trying
let refreshUnsupported = false;

// Uses the httpOnly refreshToken cookie to get a new access token. Concurrent 401s share one call.
const refreshAccessToken = () => {
  if (refreshUnsupported) return Promise.resolve(null);
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${axiosInstance.defaults.baseURL}/auth/refresh`, null, { withCredentials: true })
      .then(({ data }) => {
        if (data?.token) localStorage.setItem("token", data.token);
        return data?.token ?? null;
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 404) {
          // The auth API has no refresh endpoint: keep the token, the 401 wasn't about it expiring
          refreshUnsupported = true;
        } else {
          localStorage.removeItem("token");
        }
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const url = original?.url || "";

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retried ||
      // Signed-out visitor (signin/signup always store a token), nothing to refresh
      !localStorage.getItem("token") ||
      // Demo sessions have no backend account; their API 401s are expected and must not log them out
      localStorage.getItem("token")?.startsWith(DEMO_TOKEN_PREFIX) ||
      NO_REFRESH_PATHS.some((path) => url.endsWith(path))
    ) {
      return Promise.reject(error);
    }

    original._retried = true;
    const newToken = await refreshAccessToken();
    if (!newToken) return Promise.reject(error);

    original.headers.Authorization = `Bearer ${newToken}`;
    return axiosInstance(original);
  }
);

export default axiosInstance;
