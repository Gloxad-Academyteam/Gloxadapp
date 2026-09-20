"use client";

import Button from "@components/Button";
import PasswordInput from "@components/Input/PasswordInput";
import TextLink from "@components/TextLink";
import AuthCard from "@components/AuthCard";
import { FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";
import useResetPasswdPage from "./hooks/useResetPasswdPage";
import ResetPasswordImage from "@assets/images/resetpassword.png";

const ResetPasswdPage = () => {
  const router = useRouter();
  const { formErrors, formFieldRegister, handleFormSubmit, mutationIsLoading, isSuccess } =
    useResetPasswdPage();

  return (
    <AuthCard image={ResetPasswordImage} imageAlt="Padlock" headline={["Reset Your Password", "Secure your account"]}>
      {isSuccess ? (
        <div className="flex flex-col items-center">
          {/* Success Icon */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#07004d]">
            <FiCheck className="text-[32px] text-[#07004d]" strokeWidth={1.5} />
          </div>

          <h2 className="mb-2 text-center text-[24px] font-bold leading-[1.25] text-[#202127] sm:text-[28px]">
            Password Reset Successful
          </h2>

          <p className="mb-7 text-center text-[14px] text-[#717480]">
            Your password has been successfully reset. You can now login
          </p>

          <Button
            text="Continue to login"
            onClick={() => router.push("/auth/signin")}
            isBlock
            className="!h-[46px] !rounded-full bg-[#07004d] !text-[14px]"
          />
        </div>
      ) : (
        <>
          <h2 className="mb-1.5 text-center text-[24px] font-bold leading-[1.25] text-[#202127] sm:text-[28px]">
            Reset your Password
          </h2>

          <p className="mb-7 text-center text-[14px] text-[#717480]">Enter a new password for your account</p>

          <form className="flex w-full flex-col gap-5" onSubmit={handleFormSubmit}>
            <PasswordInput variant="pill"
              label="Password"
              placeholder="Enter Password"
              {...formFieldRegister("password", {
                required: "Password is required",
              })}
              error={formErrors.password?.message}
              id="password"
            />

            <PasswordInput variant="pill"
              label="Confirm Password"
              placeholder="Enter Password"
              {...formFieldRegister("confirmPassword", {
                required: "Confirm Password is required",
              })}
              error={formErrors.confirmPassword?.message}
              id="confirm-password"
            />

            <div className="flex flex-col gap-4">
              <Button
                text="Reset Password"
                type="submit"
                isBlock
                testID="reset-passwd-submit"
                disabled={mutationIsLoading}
                className="!h-[46px] !rounded-full bg-[#07004d] !text-[14px]"
              />

              <div className="text-center">
                <TextLink text="Back to login" to="/auth/signin" className="text-[13px] font-bold text-[#07004d]" />
              </div>
            </div>
          </form>
        </>
      )}
    </AuthCard>
  );
};

export default ResetPasswdPage;
