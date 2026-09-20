"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@hooks/useAuth";

/** Redirects unauthenticated visitors away from /dashboard/* to sign in. */
const DashboardGuard = ({ children }: { children: ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-[#fcfcfd]">Loading...</div>;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default DashboardGuard;
