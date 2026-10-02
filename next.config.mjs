// Gloxad API (hosted on Render): auth, profile, uploads, categories, courses, tutor, admin,
// enrollments, learning, messages and notifications. Requests to /api/* on the Next app are proxied here.
// Set BACKEND_URL=http://localhost:3001 to run against a local copy of the backend instead.
const BACKEND_URL = process.env.BACKEND_URL || "https://gloxard-backend.onrender.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src"],
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
