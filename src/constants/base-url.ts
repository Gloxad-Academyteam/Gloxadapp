const PROD_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";
const DEV_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const getBaseUrl = (environment: string) => {
  switch (environment) {
    case "production":
      return PROD_BASE_URL;
    case "development":
      return DEV_BASE_URL;
    case "test":
      return PROD_BASE_URL;
    default:
      throw new Error(
        "Invalid environment! Set NODE_ENV to development, production"
      );
  }
};

export default getBaseUrl;
