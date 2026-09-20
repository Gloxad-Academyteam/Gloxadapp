"use client";

import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { toast } from "react-toastify";

// TODO: wire to the backend OAuth endpoints once they exist (none in src/services/auth yet).
const handleSocialAuth = (provider: "Google" | "Apple") => {
  toast.info(`${provider} sign-in is coming soon`);
};

const buttonClass =
  "flex h-[44px] w-full items-center justify-center gap-3 rounded-full border border-[#e6e8ee] bg-white text-[13px] font-medium text-[#202127] transition hover:bg-[#f5f7fb] focus:outline-none focus:ring-4 focus:ring-[#07004d]/10";

/** "or" divider + Continue with Google / Apple, used on sign in and sign up. */
const SocialAuthButtons = () => (
  <>
    <div className="flex items-center gap-4 py-1">
      <div className="h-px flex-1 bg-[#e6e8ee]" />
      <span className="text-[13px] text-[#717480]">or</span>
      <div className="h-px flex-1 bg-[#e6e8ee]" />
    </div>

    <div className="flex flex-col gap-3">
      <button type="button" onClick={() => handleSocialAuth("Google")} className={buttonClass}>
        <FcGoogle className="text-[20px]" />
        Continue with Google
      </button>
      <button type="button" onClick={() => handleSocialAuth("Apple")} className={buttonClass}>
        <FaApple className="text-[20px] text-black" />
        Continue with Apple
      </button>
    </div>
  </>
);

export default SocialAuthButtons;
