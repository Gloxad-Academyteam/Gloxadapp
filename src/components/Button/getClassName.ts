import { TProps } from "./types_";

type TOpts = Pick<TProps, "isRound" | "disabled" | "outline" | "ghost"> & { 
  isBlock?: boolean;
  width?: string;
}

export const getPrimaryClassName = ({
  isRound,
  disabled,
  outline,
  ghost,
  isBlock,
}: TOpts = {}) => {
  let className =
    "border-2 border-transparent gap-[8px] font-medium text-body-large flex items-center justify-center transition-all duration-200 ease-in-out ";

  if (isRound) className += "h-[56px] w-[56px] p-0 rounded-full ";
  else className += "h-[56px] px-[24px] py-[16px] rounded-[6px] ";

  if (isBlock) className += "!w-full ";

  if (disabled) {
    className += "cursor-not-allowed bg-primary-4 text-neutral-6 ";

    if (outline) className += "!border-neutral-6 ";
  } else {
    if (outline)
      className +=
        "cursor-pointer bg-transparent text-primary-source !border-primary-source hover:bg-primary-4 active:bg-primary-4 active:border-primary-12 focus:bg-primary-4 focus:border-primary-12 focus:outline-none hover:text-primary-source active:text-primary-source focus:text-primary-source ";
    else
      className +=
        "cursor-pointer bg-primary-source text-primary-1 hover:bg-primary-10 active:bg-primary-11 active:border-primary-12 focus:bg-primary-11 focus:border-primary-12 focus:outline-none ";
  }

  if (ghost)
    className +=
      "!bg-transparent !border-transparent !text-primary-source custom-ghost ";

  return className;
};


export const getSecondaryClassName = ({
  isRound,
  disabled,
  outline,
  ghost,
}: TOpts = {}) => {
  let className =
    "border-2 border-transparent gap-[8px] font-medium text-body-large flex items-center justify-center transition-all duration-200 ease-in-out ";

  if (isRound) className += "h-[56px] w-[56px] p-0 rounded-full ";
  else className += "h-[56px] px-[24px] py-[16px] rounded-[6px] ";

  if (disabled) {
    className += "cursor-not-allowed bg-secondary-4 text-neutral-6 ";

    if (outline) className += "!border-neutral-6 ";
  } else {
    if (outline)
      className +=
        "cursor-pointer bg-transparent text-secondary-source !border-secondary-source hover:bg-secondary-4 active:bg-secondary-4 active:border-secondary-12 focus:bg-secondary-4 focus:border-secondary-12 focus:outline-none hover:text-secondary-source active:text-secondary-source focus:text-secondary-source ";
    else
      className +=
        "cursor-pointer bg-secondary-source text-secondary-1 hover:bg-secondary-10 active:bg-secondary-11 active:border-secondary-12 focus:bg-secondary-11 focus:border-secondary-12 focus:outline-none ";
  }

  if (ghost)
    className +=
      "!bg-transparent !border-transparent !text-secondary-source custom-secondary-ghost ";

  return className;
}
