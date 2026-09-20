import type { TUser } from "@services/auth/types_";

/**
 * Demo login — lets you open the dashboards without a backend account.
 *
 * ON  in `next dev`, or anywhere NEXT_PUBLIC_ENABLE_DEMO_LOGIN=true
 * OFF in production builds by default
 *
 * Demo accounts (all use the same password):
 *   student@gloxad.test / Demo1234!   → student dashboard
 *   tutor@gloxad.test   / Demo1234!   → tutor dashboard (approved)
 *   admin@gloxad.test   / Demo1234!   → admin dashboard
 *
 * The session is a fake token in localStorage; data requests to the API will still
 * fail without a backend, but the layouts/pages render so responsiveness can be checked.
 */
const DEMO_PASSWORD = "Demo1234!";
const DEMO_TOKEN_PREFIX = "demo-token-";

const demoAuthEnabled = () =>
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === "true";

const DEMO_USERS: Record<string, TUser> = {
  "student@gloxad.test": {
    _id: "demo-student",
    name: "Demo Student",
    firstName: "Demo",
    lastName: "Student",
    email: "student@gloxad.test",
    avatar: "",
    role: "student",
  },
  "tutor@gloxad.test": {
    _id: "demo-tutor",
    name: "Demo Tutor",
    firstName: "Demo",
    lastName: "Tutor",
    email: "tutor@gloxad.test",
    avatar: "",
    role: "instructor",
    approvalStatus: "approved",
    certifications: ["demo-certification"],
  },
  "admin@gloxad.test": {
    _id: "demo-admin",
    name: "Demo Admin",
    firstName: "Demo",
    lastName: "Admin",
    email: "admin@gloxad.test",
    avatar: "",
    role: "admin",
  },
};

/** Returns a demo session if the credentials match a demo account, otherwise null. */
const matchDemoLogin = (email: string, password: string) => {
  if (!demoAuthEnabled() || password !== DEMO_PASSWORD) return null;
  const user = DEMO_USERS[email.trim().toLowerCase()];
  return user ? { user, token: `${DEMO_TOKEN_PREFIX}${user.email}` } : null;
};

/** Returns the demo user for a stored demo token, or null for real / missing tokens. */
const getDemoUserFromToken = (token: string | null) => {
  if (!demoAuthEnabled() || !token?.startsWith(DEMO_TOKEN_PREFIX)) return null;
  return DEMO_USERS[token.slice(DEMO_TOKEN_PREFIX.length)] ?? null;
};

export { matchDemoLogin, getDemoUserFromToken, DEMO_TOKEN_PREFIX };
