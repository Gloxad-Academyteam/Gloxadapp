// Without NEXT_PUBLIC_API_URL, routes stay relative ("/auth/me") and axiosInstance's baseURL
// ("/api", proxied to the backend by next.config.mjs rewrites) is prepended to them.
// Set NEXT_PUBLIC_API_URL only to call a backend directly instead of through the proxy.
const PROD_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const DEV_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const TEST_BASE_URL = "https://api.example.com";

const getBaseUrl = (environment: string) => {
  switch (environment) {
    case "production":
      return PROD_BASE_URL;
    case "development":
      return DEV_BASE_URL;
    case "test":
      return TEST_BASE_URL;
    default:
      throw new Error(
        "Invalid environment! Set NODE_ENV to development, production"
      );
  }
};

export default getBaseUrl;
