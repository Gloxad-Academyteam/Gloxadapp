"use client";

import Button from "@components/Button";
import Input from "@components/Input";
import TextLink from "@components/TextLink";
import AuthCard from "@components/AuthCard";
import { HiOutlineMail } from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";
import useforgetPasswd from "./hooks/useForgetPasswd";
import ResetPasswordImage from "@assets/images/resetpassword.png";

const ForgetPasswdPage = () => {
  const router = useRouter();
  const { formErrors, formFieldRegister, handleFormSubmit, mutationIsLoading, isSuccess, getValues } =
    useforgetPasswd();

  return (
    <AuthCard image={ResetPasswordImage} imageAlt="Padlock" headline={["Forgot your password?", "We've got you covered"]}>
      {/* Success modal */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="flex w-full max-w-[460px] flex-col items-center rounded-[16px] bg-white p-6 shadow-xl sm:p-10">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#07004d]">
              <FiCheck className="text-[32px] text-[#07004d]" strokeWidth={1.5} />
            </div>
            <h3 className="mb-8 break-all text-center text-[18px] font-bold leading-[1.4] text-[#202127] sm:text-[22px]">
              <span className="break-normal">A 5 digit code has been sent to</span>
              <br />
              {getValues("email")}
            </h3>
            <div className="w-full">
              <Button
                text="Check your email"
                onClick={() => router.push(`/auth/verify-otp?email=${encodeURIComponent(getValues("email"))}&type=reset`)}
                isBlock
                className="!h-[46px] !rounded-full bg-[#07004d] !text-[14px]"
              />
            </div>
          </div>
        </div>
      )}

      <h2 className="mb-1.5 text-center text-[24px] font-bold leading-[1.25] text-[#202127] sm:text-[28px]">
        Forgot Your Password?
      </h2>
      <p className="mb-7 text-center text-[14px] text-[#717480]">
        Kindly enter your email. We'll send you a password reset code.
      </p>

      <form className="flex w-full flex-col gap-5" onSubmit={handleFormSubmit}>
        <Input variant="pill"
          label="Email address"
          placeholder="calebandrews@gmail.com"
          RightIcon={HiOutlineMail}
          {...formFieldRegister("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Valid email required",
            },
          })}
          error={formErrors.email?.message}
          id="email"
        />

        <div className="flex flex-col gap-4">
          <Button
            text="Send Reset Link"
            type="submit"
            isBlock
            testID="log-in-submit"
            disabled={mutationIsLoading}
            className="!h-[46px] !rounded-full bg-[#07004d] !text-[14px]"
          />

          <div className="text-center">
            <TextLink text="Back to login" to="/auth/signin" className="text-[13px] font-bold text-[#07004d]" />
          </div>
        </div>
      </form>
    </AuthCard>
  );
};

export default ForgetPasswdPage;
