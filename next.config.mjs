// Authentication API (hosted on Render). Requests to /api/auth/* on the Next app are proxied here.
const AUTH_BACKEND_URL = process.env.AUTH_BACKEND_URL || "https://gloxard-backend.onrender.com";

// Everything else (courses, notifications, tutor, ...) still lives on ng_backend (Hono).
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src"],
  },
  async rewrites() {
    // Order matters: the more specific /api/auth rule must come before the catch-all /api rule.
    return [
      {
        source: "/api/auth/:path*",
        destination: `${AUTH_BACKEND_URL}/api/auth/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
