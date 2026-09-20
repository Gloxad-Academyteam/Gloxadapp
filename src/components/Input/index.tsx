import { forwardRef } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { TInputProps } from "./types_";
import { getClassName, getWrapperClassName } from "./utils/getClassName";

const Input = forwardRef<HTMLInputElement, TInputProps>(
  (
    {
      value,
      onChange,
      onEnterPress,
      LeftIcon,
      RightIcon,
      disabled,
      error,
      showErrorIcon = true,
      renderRightIcon,
      type = "text",
      label,
      placeholder,
      id,
      variant = "default",
      ...rest
    },
    ref
  ) => {
    const showError = error && showErrorIcon && !renderRightIcon;

    const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onEnterPress) {
        onEnterPress();
      }
    };

    if (showError) {
      RightIcon = FaCircleExclamation;
    }

    // ===================== PILL variant (auth forms, matches Figma) =====================
    if (variant === "pill") {
      const RightIconPill = RightIcon;
      return (
        <div className="w-full">
          {label && (
            <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-[#202127]">
              {label}
            </label>
          )}
          <div className="relative flex items-center">
            <input
              type={type}
              aria-label="input"
              ref={ref}
              disabled={disabled}
              value={value}
              onChange={onChange}
              onKeyPress={handleEnterPress}
              placeholder={placeholder}
              id={id}
              className={`h-[46px] w-full rounded-full border bg-white px-5 text-[14px] text-[#202127] outline-none transition placeholder:text-[#a5a8b3] focus:ring-4 disabled:cursor-not-allowed disabled:bg-neutral-3 ${
                RightIconPill || renderRightIcon ? "pr-12" : ""
              } ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                  : "border-[#e6e8ee] focus:border-[#07004d] focus:ring-[#07004d]/10"
              }`}
              {...rest}
            />
            {renderRightIcon ? (
              <div className="absolute right-3" data-testid="right-icon">
                {renderRightIcon()}
              </div>
            ) : (
              RightIconPill && (
                <div
                  className={`pointer-events-none absolute right-5 text-[18px] ${error ? "text-red-500" : "text-[#8a8d99]"}`}
                  data-testid={showError ? "error-icon" : "right-icon"}
                >
                  <RightIconPill />
                </div>
              )
            )}
          </div>
          {error && <p className="mt-1.5 pl-4 text-[12px] font-medium text-red-500">{error}</p>}
        </div>
      );
    }

    return (
      <div className={getWrapperClassName(disabled, label)}>
        {LeftIcon && (
          <div className="absolute left-0 pl-4">
            <LeftIcon />
          </div>
        )}

        {label && (
          <label className="text-body-medium text-neutral-11" htmlFor={id}>
            {label}
          </label>
        )}

        <input
          type={type}
          aria-label="input"
          className={getClassName({ LeftIcon, RightIcon, error, disabled })}
          ref={ref}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onKeyPress={handleEnterPress}
          placeholder={placeholder}
          id={id}
          {...rest}
        />
        {RightIcon && !renderRightIcon && (
          <div
            className={`absolute right-0 pr-4 ${
              showError ? "text-error-source" : ""
            }`}
            data-testid={showError ? "error-icon" : "right-icon"}
          >
            <RightIcon />
          </div>
        )}
        {renderRightIcon && (
          <div className="absolute right-0 pr-4" data-testid="right-icon">
            {renderRightIcon()}
          </div>
        )}

        {error && (
          <p
            className="absolute left-0 mt-2 italic font-medium text-error-source text-label-medium"
            style={{ top: "calc(100% - 8px)" }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default Input;
