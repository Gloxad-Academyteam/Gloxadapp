import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { outlineButton, primaryButton } from "../styles";

type TProps = {
  backHref: string;
  onSkip?: () => void;
  skipLabel?: string;
  onContinue: () => void;
  continueLabel?: string;
  isContinueDisabled?: boolean;
};

// Back / Skip / Save row at the bottom of each onboarding step
const ActionBar = ({
  backHref,
  onSkip,
  skipLabel = "Skip for Now",
  onContinue,
  continueLabel = "Save & Continue",
  isContinueDisabled,
}: TProps) => (
  <div className="mt-10 flex flex-col-reverse gap-4 border-t border-[#e3e6f3] bg-[#fafaff] px-2 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
    <Link
      href={backHref}
      className="inline-flex items-center justify-center gap-2 py-2 text-[15px] font-medium text-[#3a3d5c] transition-colors hover:text-[#030069] sm:justify-start"
    >
      <FiArrowLeft /> Back
    </Link>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {onSkip && (
        <button type="button" onClick={onSkip} className={`${outlineButton} !px-7`}>
          {skipLabel}
        </button>
      )}
      <button type="button" onClick={onContinue} disabled={isContinueDisabled} className={`${primaryButton} !px-8`}>
        {continueLabel}
      </button>
    </div>
  </div>
);

export default ActionBar;
