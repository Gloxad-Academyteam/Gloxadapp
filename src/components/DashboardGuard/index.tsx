"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@hooks/useAuth";
import { needsEmailVerification, verifyEmailRoute } from "@utils/getPostAuthRoute";

/** Redirects unauthenticated visitors to sign in, and unverified users to email verification. */
const DashboardGuard = ({ children }: { children: ReactNode }) => {
  const { isLoading, isAuthenticated, authenticatedUser } = useAuth();
  const mustVerify = needsEmailVerification(authenticatedUser);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/auth/signin");
    } else if (mustVerify) {
      router.replace(verifyEmailRoute(authenticatedUser?.email || ""));
    }
  }, [isLoading, isAuthenticated, mustVerify, authenticatedUser, router]);

  if (isLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-[#fcfcfd]">Loading...</div>;
  }

  if (!isAuthenticated || mustVerify) return null;

  return <>{children}</>;
};

export default DashboardGuard;
