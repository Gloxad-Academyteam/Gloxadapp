"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import { needsEmailVerification, verifyEmailRoute } from "@utils/getPostAuthRoute";

/** Requires authentication and (optionally) a specific role, redirecting otherwise. */
const RoleGuard = ({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) => {
  const { isLoading, isAuthenticated, authenticatedUser } = useAuth();
  const router = useRouter();
  const mustVerify = needsEmailVerification(authenticatedUser);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/auth/signin");
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
  }, [isLoading, isAuthenticated, authenticatedUser, mustVerify, allowedRoles, router]);

  if (isLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-[#fcfcfd]">Loading...</div>;
  }

  if (!isAuthenticated || mustVerify) return null;

  return <>{children}</>;
};

export default RoleGuard;
