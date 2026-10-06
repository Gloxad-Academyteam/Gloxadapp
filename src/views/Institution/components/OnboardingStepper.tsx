import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import { ONBOARDING_STEPS, TStepKey } from "../steps";

// Six-step progress bar: finished steps show a check, the current step is highlighted, later steps are muted.
// Labels collapse to the current step on small screens so the six circles always fit.
const OnboardingStepper = ({ current }: { current: TStepKey }) => {
  const currentIndex = ONBOARDING_STEPS.findIndex((step) => step.key === current);

  return (
    <nav aria-label="Onboarding progress" className="relative">
      <div className="absolute inset-x-0 top-[22px] h-[3px] bg-[#dfe3f7] sm:top-[25px]" aria-hidden />
      <ol className="relative flex items-start justify-between">
        {ONBOARDING_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <li key={step.key} className="flex flex-col items-center gap-3">
              <Link
                href={step.href}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${step.label}${isDone ? " (completed)" : ""}`}
                className="group flex flex-col items-center gap-3"
              >
                <span
                  className={`flex h-[44px] w-[44px] items-center justify-center rounded-full transition-colors sm:h-[50px] sm:w-[50px] ${
                    isDone || isActive
                      ? "bg-[#030069] text-white"
                      : "bg-[#e4e7fa] text-[#030069] group-hover:bg-[#d6dbf6]"
                  } ${isActive ? "ring-[6px] ring-[#dfe3f7]" : ""}`}
                >
                  {isDone ? <FiCheck size={20} /> : <step.Icon size={20} />}
                </span>
                <span
                  className={`${isActive ? "block" : "hidden sm:block"} whitespace-nowrap text-[13px] sm:text-[17px] ${
                    isDone || isActive ? "font-bold text-[#030069]" : "text-[#6a6d83]"
                  }`}
                >
                  {step.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default OnboardingStepper;
