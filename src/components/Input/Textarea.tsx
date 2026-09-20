import { forwardRef } from "react";
import { TTextareaProps } from "./types_";
import { getClassName, getWrapperClassName } from "./utils/getClassName";

const Textarea = forwardRef<HTMLTextAreaElement, TTextareaProps>(
  ({ value, onChange, disabled, error, label, placeholder, ...rest }, ref) => {
    return (
      <div className={getWrapperClassName(disabled, label)}>
        {label && (
          <label
            className="text-body-medium text-neutral-11"
            htmlFor="textarea"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={getClassName({ error, disabled, asTextarea: true })}
          {...rest}
        />

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

export default Textarea;
