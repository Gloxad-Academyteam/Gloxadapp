// Gloxad API (hosted on Render): auth, profile, uploads, categories, courses, tutor, admin,
// enrollments, learning, messages and notifications. Requests to /api/* on the Next app are proxied here.
// Set BACKEND_URL=http://localhost:3001 to run against a local copy of the backend instead.
const BACKEND_URL = process.env.BACKEND_URL || "https://gloxard-backend.onrender.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src"],
  },
  // Old addresses still work: they go to the short ones
  async redirects() {
    return [
      { source: "/auth/signin", destination: "/login", permanent: true },
      { source: "/auth/signup", destination: "/signup", permanent: true },
      { source: "/auth/signup/:role", destination: "/signup/:role", permanent: true },
      { source: "/auth/forgot-password", destination: "/forgot-password", permanent: true },
      { source: "/auth/reset-password", destination: "/reset-password", permanent: true },
      { source: "/auth/verify-otp", destination: "/verify-otp", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
