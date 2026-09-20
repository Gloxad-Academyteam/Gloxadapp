"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";

/** Requires authentication and (optionally) a specific role, redirecting otherwise. */
const RoleGuard = ({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) => {
  const { isLoading, isAuthenticated, authenticatedUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/auth/signin");
      return;
    }

    const userRole = authenticatedUser?.role || "student";
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      toast.error("You do not have permission to access this page.");
      router.replace(userRole === "admin" ? "/admin" : "/dashboard");
    }
  }, [isLoading, isAuthenticated, authenticatedUser, allowedRoles, router]);

  if (isLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-[#fcfcfd]">Loading...</div>;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default RoleGuard;
