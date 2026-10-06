"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type TDepartment = {
  id: string;
  name: string;
  faculty: string;
  head: string;
  code: string;
  description: string;
};

export type TPerson = {
  id: string;
  name: string;
  email: string;
  departments: string[];
  designation?: string;
  autoInvite: boolean;
};

export type TPlan = "premium" | "enterprise";
export type TBilling = "monthly" | "annual";

export type TOnboardingState = {
  logo: { name: string; dataUrl: string } | null;
  departments: TDepartment[];
  tutors: TPerson[];
  students: TPerson[];
  plan: TPlan;
  billing: TBilling;
  branding: { displayName: string; color: string; tagline: string };
  requestId: string | null;
};

const STORAGE_KEY = "gloxad.institution.onboarding";

const initialState: TOnboardingState = {
  logo: null,
  departments: [],
  tutors: [],
  students: [],
  plan: "enterprise",
  billing: "annual",
  branding: { displayName: "", color: "#030069", tagline: "" },
  requestId: null,
};

type TContextValue = {
  state: TOnboardingState;
  // False until the saved draft has been read, so pages can avoid flashing empty content
  isReady: boolean;
  update: (patch: Partial<TOnboardingState>) => void;
  reset: () => void;
};

const OnboardingContext = createContext<TContextValue | null>(null);

const readDraft = (): Partial<TOnboardingState> => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeDraft = (state: TOnboardingState) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage is full or blocked (a large logo can do this): keep the draft in memory only
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, logo: null }));
    } catch {
      /* nothing else to try */
    }
  }
};

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TOnboardingState>(initialState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Read now, not inside the updater: the updater runs later, after the save effect below could overwrite the draft
    const draft = readDraft();
    setState((current) => ({ ...current, ...draft }));
    setIsReady(true);
  }, []);

  useEffect(() => {
    // isReady and the loaded draft land in the same render, so this never saves the empty initial state
    if (isReady) writeDraft(state);
  }, [state, isReady]);

  const update = useCallback((patch: Partial<TOnboardingState>) => {
    setState((current) => ({ ...current, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo(() => ({ state, isReady, update, reset }), [state, isReady, update, reset]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return context;
};

export const newId = () => Math.random().toString(36).slice(2, 10);

export const makeRequestId = () => `#GLX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
