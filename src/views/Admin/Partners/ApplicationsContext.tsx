"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { SEED_APPLICATIONS, TApplication, TApplicationStatus, TPlanName } from "./data";

type TPatch = Partial<Pick<TApplication, "status" | "plan" | "notes">>;

type TContextValue = {
  applications: TApplication[];
  pendingCount: number;
  update: (id: string, patch: TPatch) => void;
};

const ApplicationsContext = createContext<TContextValue | null>(null);

const stamp = () =>
  new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

// Review decisions live in memory for now; the partner-applications API replaces this provider
export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<TApplication[]>(SEED_APPLICATIONS);

  const update = useCallback((id: string, patch: TPatch) => {
    setApplications((list) =>
      list.map((item) => (item.id === id ? { ...item, ...patch, updatedBy: "Admin_Reviewer (you)", updatedAt: stamp() } : item))
    );
  }, []);

  const value = useMemo(
    () => ({
      applications,
      pendingCount: applications.filter((item) => item.status === "pending" || item.status === "under_review").length,
      update,
    }),
    [applications, update]
  );

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>;
};

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) throw new Error("useApplications must be used inside ApplicationsProvider");
  return context;
};

export type { TApplicationStatus, TPlanName };
