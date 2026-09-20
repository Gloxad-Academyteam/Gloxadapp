import { forwardRef } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { TSelectProps } from "./types_";
import { getClassName, getWrapperClassName } from "./utils/getClassName";

const Select = forwardRef<HTMLSelectElement, TSelectProps>(
  (
    {
      value,
      onChange,
      LeftIcon,
      RightIcon,
      disabled,
      error,
      showErrorIcon = true,
      renderRightIcon,
      options,
      label,
      ...rest
    },
    ref
  ) => {
    const showError = error && showErrorIcon && !renderRightIcon;

    if (showError) {
      RightIcon = FaCircleExclamation;
    }

    return (
      <div className={getWrapperClassName(disabled, label)}>
        {LeftIcon && (
          <div className="absolute left-0 pl-4">
            <LeftIcon />
          </div>
        )}

        {label && (
          <label className="text-body-medium text-neutral-11" htmlFor="select">
            {label}
          </label>
        )}

        <select
          aria-label="select"
          className={getClassName({ LeftIcon, RightIcon, error, disabled })}
          ref={ref}
          disabled={disabled}
          value={value}
          onChange={onChange}
          {...rest}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
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

export default Select;
