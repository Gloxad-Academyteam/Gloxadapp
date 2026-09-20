"use client";


import Button from "@components/Button";
import TextLink from "@components/TextLink";
import AuthCard from "@components/AuthCard";
import LocalPinInput from "@components/LocalPinInput";
import useVerifyOtpPage from "./hooks/useVerifyOtpPage";
import SignupHeroImage from "@assets/images/Frame 2147227544.png";
import { HiOutlineMail } from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";

const VerifyOtpPage = () => {
  const router = useRouter();
  const {
    isVerified,
    otp,
    email,
    type,
    countdown,
    isVerifying,
    isResending,
    onOtpComplete,
    handleVerify,
    handleResend,
  } = useVerifyOtpPage();

  const isReset = type === "reset";

  return (
    <AuthCard
      image={SignupHeroImage}
      imageAlt="Student learning"
      headline={isReset ? ["Reset Your Password", "Secure your account"] : ["Unlock Your Potential", "Start Learning Today!"]}
    >
      <div className="flex flex-col items-center">
        {isVerified ? (
          <>
            {/* Success Icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#07004d]">
              <FiCheck className="text-[32px] text-[#07004d]" strokeWidth={1.5} />
            </div>

            <h2 className="mb-2 text-center text-[24px] font-bold leading-[1.25] text-[#202127] sm:text-[28px]">
              Email Verified
            </h2>

            <p className="mb-7 text-center text-[14px] text-[#717480]">
              Your email has been successfully verified. You're all set to continue!
            </p>

            <Button
              text="Continue"
              onClick={() => router.push(isReset ? `/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otp}` : `/tutor/onboarding`)}
              isBlock
              className="!h-[46px] !rounded-full bg-[#07004d] !text-[14px]"
            />
          </>
        ) : (
          <>
            {/* Envelope Icon */}
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf2fd]">
              <HiOutlineMail className="text-[28px] text-[#07004d]" />
            </div>

            <h2 className="mb-1.5 text-center text-[24px] font-bold leading-[1.25] text-[#202127] sm:text-[28px]">
              {isReset ? "Password Reset" : "Verify your email"}
            </h2>

            <p className="mb-7 break-words text-center text-[14px] text-[#717480]">
              Please enter the verification code sent to {email?.replace(/\w{2,4}.@/, () => "****@")}
            </p>

            <div className="mb-7 flex w-full justify-center" data-testid="otp">
              <LocalPinInput initialValue="" length={isReset ? 5 : 4} onComplete={onOtpComplete} />
            </div>

            <div className="flex w-full flex-col gap-4">
              <Button text="Continue" onClick={handleVerify} isBlock disabled={isVerifying} className="!h-[46px] !rounded-full bg-[#07004d] !text-[14px]" />

              <div className="flex flex-col items-center justify-center gap-3 text-center text-[13px] text-[#717480]">
                {countdown > 0 ? (
                  <p>
                    Didn't receive code? Resend in <span className="font-bold">{countdown}s</span>
                  </p>
                ) : (
                  <p>
                    Didn't receive code?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending}
                      className="font-bold text-[#07004d] hover:underline"
                    >
                      Resend Code
                    </button>
                  </p>
                )}
                <TextLink text="Back to login" to="/auth/signin" className="font-bold text-[#07004d]" />
              </div>
            </div>
          </>
        )}
      </div>
    </AuthCard>
  );
};

export default VerifyOtpPage;
