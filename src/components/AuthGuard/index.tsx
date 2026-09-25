"use client";

import { useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@hooks/useAuth";
import { getPostAuthRoute } from "@utils/getPostAuthRoute";

/**
 * Redirects an already-signed-in user away from an auth page (signin/signup/etc.)
 * to the right home for their role. Renders children immediately regardless —
 * matches the previous PageWrapper behavior where the form is visible until the
 * auth check resolves, rather than blocking on a loading screen.
 */
const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, authenticatedUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    // A freshly signed-up user is signed in but must stay on the verify page to enter the code
    // and see the success screen; the page itself routes them onward afterwards.
    if (pathname === "/auth/verify-otp") return;

    router.replace(getPostAuthRoute(authenticatedUser));
  }, [isAuthenticated, isLoading, authenticatedUser, pathname, router]);

  return <>{children}</>;
};

export default AuthGuard;
