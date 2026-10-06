import { ReactNode } from "react";
import { TStepKey } from "../steps";
import OnboardingStepper from "./OnboardingStepper";

type TProps = {
  step: TStepKey;
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
};

// Page heading + stepper + content width shared by the six onboarding steps
const OnboardingFrame = ({ step, title, subtitle, children }: TProps) => (
  <main className="mx-auto w-full max-w-[1240px] px-4 pb-16 pt-10 sm:px-8 sm:pt-14 lg:pt-16">
    <div className="mx-auto max-w-[760px] text-center">
      <h1 className="text-[30px] font-bold leading-tight text-[#14162b] sm:text-[38px] lg:text-[44px]">{title}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#4a4d66] sm:text-[18px]">{subtitle}</p>
    </div>
    <div className="mt-10 sm:mt-12">
      <OnboardingStepper current={step} />
    </div>
    <div className="mt-10 sm:mt-14">{children}</div>
  </main>
);

export default OnboardingFrame;
