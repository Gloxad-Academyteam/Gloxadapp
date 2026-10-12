"use client";

import { useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import { needsEmailVerification, verifyEmailRoute } from "@utils/getPostAuthRoute";

/**
 * Requires authentication and (optionally) a specific role, redirecting otherwise.
 * With `returnAfterLogin`, signed-out visitors come back to the page they asked for after signing in.
 */
const RoleGuard = ({
  children,
  allowedRoles,
  returnAfterLogin = false,
}: {
  children: ReactNode;
  allowedRoles?: string[];
  returnAfterLogin?: boolean;
}) => {
  const { isLoading, isAuthenticated, authenticatedUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const mustVerify = needsEmailVerification(authenticatedUser);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(returnAfterLogin && pathname ? `/auth/signin?redirect=${encodeURIComponent(pathname)}` : "/auth/signin");
      return;
    }

    if (mustVerify) {
      router.replace(verifyEmailRoute(authenticatedUser?.email || ""));
      return;
    }

    const userRole = authenticatedUser?.role || "student";
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      toast.error("You do not have permission to access this page.");
      router.replace(userRole === "admin" ? "/admin" : "/dashboard");
    }
  }, [isLoading, isAuthenticated, authenticatedUser, mustVerify, allowedRoles, router, pathname, returnAfterLogin]);

  if (isLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-[#fcfcfd]">Loading...</div>;
  }

  if (!isAuthenticated || mustVerify) return null;

  return <>{children}</>;
};

export default RoleGuard;
