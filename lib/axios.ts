import axios from "axios";
import { ApiEndpoint } from "@/constants/api-endpoints";
import { AppRoute } from "@/constants/routes";

const HTTP_UNAUTHORIZED = 401;
const REQUEST_TIMEOUT_MS = 20_000;

/** Satu-satunya instance HTTP client di aplikasi. */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const data: unknown = error.response?.data;
    if (data instanceof Blob && data.type.includes("json")) {
      error.response.data = JSON.parse(await data.text());
    }
    const isLoginRequest = error.config?.url === ApiEndpoint.AuthLogin;
    const sessionExpired = error.response?.status === HTTP_UNAUTHORIZED && !isLoginRequest;
    if (sessionExpired && typeof window !== "undefined" && window.location.pathname !== AppRoute.Login) {
      window.location.assign(AppRoute.Login);
    }
    return Promise.reject(error);
  },
);
