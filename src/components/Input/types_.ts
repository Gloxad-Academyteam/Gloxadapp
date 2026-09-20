import { IconType } from "react-icons";

type TInputProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterPress?: () => void;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  disabled?: boolean;
  error?: string;
  showErrorIcon?: boolean;
  renderRightIcon?: () => JSX.Element;
  type?: string;
  label?: string;
  placeholder?: string;
  id?: string;
  /** "pill" = fully rounded auth-form look (Figma). Default keeps the app-wide style. */
  variant?: "default" | "pill";
};

type TSelectProps = Omit<TInputProps, "type" | "onChange" | "placeholder"> & {
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
};

type TTextareaProps = Omit<
  TInputProps,
  | "type"
  | "LeftIcon"
  | "RightIcon"
  | "renderRightIcon"
  | "showErrorIcon"
  | "onChange"
> & { onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void };

export type { TInputProps, TTextareaProps, TSelectProps };
