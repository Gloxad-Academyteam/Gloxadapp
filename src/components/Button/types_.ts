import { IconType } from "react-icons";

type TProps = {
  text?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  outline?: boolean;
  ghost?: boolean;
  Icon?: IconType;
  isRound?: boolean;
  renderDropdown?: () => JSX.Element;
  dropdownIsSolid?: boolean;
  renderContent?: (opts: {
    isDisplayDropdown: boolean;
  }) => JSX.Element;
  onClick?: () => void;
  testID?: string;
  isBlock?: boolean;
  width?: string;
  className?: string;
};

export type { TProps };
