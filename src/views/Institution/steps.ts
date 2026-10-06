import { IconType } from "react-icons";
import { LuBanknote, LuBuilding2, LuFileUp, LuGraduationCap, LuPalette, LuUsers } from "react-icons/lu";

export type TStepKey = "logo" | "departments" | "tutors" | "students" | "subscription" | "branding";

export const ONBOARDING_STEPS: { key: TStepKey; label: string; href: string; Icon: IconType }[] = [
  { key: "logo", label: "Upload Logo", href: "/institution/onboarding/logo", Icon: LuFileUp },
  { key: "departments", label: "Departments", href: "/institution/onboarding/departments", Icon: LuBuilding2 },
  { key: "tutors", label: "Tutors", href: "/institution/onboarding/tutors", Icon: LuGraduationCap },
  { key: "students", label: "Students", href: "/institution/onboarding/students", Icon: LuUsers },
  { key: "subscription", label: "Subscription", href: "/institution/onboarding/subscription", Icon: LuBanknote },
  { key: "branding", label: "Branding", href: "/institution/onboarding/branding", Icon: LuPalette },
];

export const nextStepHref = (key: TStepKey) => {
  const index = ONBOARDING_STEPS.findIndex((step) => step.key === key);
  return ONBOARDING_STEPS[index + 1]?.href ?? "/institution/submitted";
};

export const previousStepHref = (key: TStepKey) => {
  const index = ONBOARDING_STEPS.findIndex((step) => step.key === key);
  return ONBOARDING_STEPS[index - 1]?.href ?? "/institution/activate";
};
