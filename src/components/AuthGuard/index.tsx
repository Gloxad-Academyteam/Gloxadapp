"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@hooks/useAuth";

/**
 * Redirects an already-signed-in user away from an auth page (signin/signup/etc.)
 * to the right home for their role. Renders children immediately regardless —
 * matches the previous PageWrapper behavior where the form is visible until the
 * auth check resolves, rather than blocking on a loading screen.
 */
const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, authenticatedUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    if (authenticatedUser?.role === "admin") {
      router.replace("/admin");
      return;
    }

    if (authenticatedUser?.role === "instructor") {
      const hasCertifications = Array.isArray(authenticatedUser?.certifications) && authenticatedUser.certifications.length > 0;
      const status = (authenticatedUser?.approvalStatus || "").toLowerCase();
      const isApproved = status === "approved";
      const isPendingReview = status === "pending" && hasCertifications;

      if (isApproved || isPendingReview) {
        router.replace("/dashboard");
      } else {
        router.replace("/tutor/onboarding");
      }
      return;
    }

    router.replace("/dashboard");
  }, [isAuthenticated, isLoading, authenticatedUser, router]);

  return <>{children}</>;
};

export default AuthGuard;
