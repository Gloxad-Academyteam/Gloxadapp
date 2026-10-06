"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { LuKeyRound, LuShieldCheck } from "react-icons/lu";
import { inputClass, labelClass, primaryButton } from "../styles";

const MIN_LENGTH = 12;

type TPasswordFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  Icon: typeof LuKeyRound;
  error?: string;
};

const PasswordField = ({ id, label, placeholder, value, onChange, Icon, error }: TPasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <Icon aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6a6d83]" size={20} />
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          autoComplete="new-password"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputClass} !bg-[#f8f8ff] !pl-12 !pr-12 ${error ? "!border-[#d93025]" : ""}`}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#6a6d83] hover:bg-[#eceefa]"
        >
          {isVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] text-[#d93025]">
          {error}
        </p>
      )}
    </div>
  );
};

const ActivatePage = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (password.length < MIN_LENGTH) next.password = `Use at least ${MIN_LENGTH} characters.`;
    if (confirm !== password) next.confirm = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    // The password is never stored on the client; the activation call goes here once the API supports it.
    router.push("/institution/onboarding/logo");
  };

  return (
    <main className="mx-auto flex w-full max-w-[1240px] justify-center px-4 py-12 sm:px-8 sm:py-20 lg:py-28">
      <section className="w-full max-w-[640px] rounded-[18px] border border-[#d9dcec] bg-white px-6 py-10 shadow-[0_20px_50px_-30px_rgba(30,40,120,0.25)] sm:px-16 sm:py-14">
        <div className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-[14px] bg-[#f4f5fb] p-3 sm:h-[104px] sm:w-[104px]">
          <img src="/gloxadlogo.png" alt="Gloxad" className="max-h-full w-full object-contain" />
        </div>
        <h1 className="mt-6 text-center text-[26px] font-bold leading-tight text-[#14162b] sm:text-[32px]">
          Welcome to Gloxad Academy
        </h1>
        <p className="mt-2 text-center text-[15px] text-[#3f4257] sm:text-[18px]">Institutional Admin Portal Activation</p>

        <form onSubmit={handleSubmit} noValidate className="mt-9 flex flex-col gap-6">
          <PasswordField
            id="activate-password"
            label="Set Password"
            placeholder="Min. 12 characters"
            value={password}
            onChange={setPassword}
            Icon={LuKeyRound}
            error={errors.password}
          />
          <PasswordField
            id="activate-confirm"
            label="Confirm Password"
            placeholder="Repeat your password"
            value={confirm}
            onChange={setConfirm}
            Icon={LuShieldCheck}
            error={errors.confirm}
          />
          <button type="submit" className={`${primaryButton} mt-1 w-full !py-4`}>
            Activate Workspace <FiArrowRight />
          </button>
        </form>

        <div className="mt-9 flex items-center gap-4 text-[13px] text-[#6a6d83]">
          <span className="h-px flex-1 bg-[#dcdfee]" />
          Security Protocol
          <span className="h-px flex-1 bg-[#dcdfee]" />
        </div>
        <ul className="mt-6 flex flex-col gap-2 text-[14px] text-[#3a3d5c]">
          {["Enterprise-grade encryption active", "Compliance with Institutional Standards"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <FiCheckCircle className="shrink-0 text-[#030069]" size={16} /> {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default ActivatePage;
