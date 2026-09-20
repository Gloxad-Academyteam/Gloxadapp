import { FaEyeSlash } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Input from ".";
import { forwardRef, useState } from "react";
import { TInputProps } from "./types_";
import ButtonSecondary from "@components/Button/ButtonSecondary";

const PasswordInput = forwardRef<HTMLInputElement, TInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const type = showPassword ? "text" : "password";

    if (props.variant === "pill") {
      return (
        <Input
          {...props}
          ref={ref}
          type={type}
          renderRightIcon={() => (
            <button
              type="button"
              data-testid="toggle-button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={togglePassword}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[18px] text-[#8a8d99] transition hover:text-[#07004d]"
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          )}
        />
      );
    }

    return (
      <Input
        {...props}
        ref={ref}
        type={type}
        renderRightIcon={() => (
          <div
            data-testid="toggle-button"
            className="password-input-toggle-button"
          >
            <ButtonSecondary
              ghost
              isRound
              Icon={FaEyeSlash}
              onClick={togglePassword}
            />
          </div>
        )}
      />
    );
  }
);

export default PasswordInput;
