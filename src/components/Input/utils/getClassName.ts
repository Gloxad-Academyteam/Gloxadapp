import { TInputProps } from "../types_";

type TGetClassNameOpts = Partial<
  Pick<TInputProps, "LeftIcon" | "RightIcon" | "error" | "disabled">
> & { asTextarea?: boolean };

const getClassName = ({
  LeftIcon,
  RightIcon,
  error,
  disabled,
  asTextarea
}: TGetClassNameOpts = {}) => {
  let className =
    "border border-secondary-6 py-[16px] px-[24px] rounded-[8px] top-0 right-0 left-0 bottom-0 w-full focus:outline focus:outline-3 outline-secondary-6 ";

  if (asTextarea) {
    className += "min-h-[156px] resize-none ";
  }

  if (error) {
    className += "!border-error-source !outline-error-source ";
  }

  if (disabled) {
    className +=
      "!border-neutral-5 text-neutral-5 bg-neutral-3 cursor-not-allowed !outline-0 ";
  }

  if (LeftIcon) {
    className += "!pl-[48px] ";
  }
  if (RightIcon) {
    className += "!pr-[48px] ";
  }

  return className;
};

const getWrapperClassName = (disabled: TInputProps["disabled"], label: TInputProps["label"]) => {
  let className = "relative flex items-center w-full "
  if (label) {
    className += "pt-6 input-wrapper ";
  }

  if (disabled) {
    className += "!text-neutral-6 ";
  }

  return className;
};

export { getClassName, getWrapperClassName };
