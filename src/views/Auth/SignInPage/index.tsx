"use client";

import Button from "@components/Button";
import Input from "@components/Input";
import PasswordInput from "@components/Input/PasswordInput";
import TextLink from "@components/TextLink";
import AuthCard from "@components/AuthCard";
import SocialAuthButtons from "@components/AuthCard/SocialAuthButtons";
import { HiOutlineMail } from "react-icons/hi";
import useSignInPage from "./hooks/useSignInPage";
import SignupHeroImage from "@assets/images/Frame 2147227544.png";

const SignInPage = () => {
  const {
    formErrors,
    formFieldRegister,
    handleFormSubmit,
    mutationIsLoading,
  } = useSignInPage();

  return (
    <AuthCard
      image={SignupHeroImage}
      imageAlt="Student smiling while learning"
      headline={["Your future starts with", "learning begin today"]}
    >
      <h2 className="mb-1.5 text-center text-[24px] font-bold leading-[1.25] text-[#202127] sm:text-[28px]">
        Welcome Back!
      </h2>
      <p className="mb-7 text-center text-[14px] text-[#717480]">Sign in to continue learning.</p>

      <form className="flex w-full flex-col gap-5" onSubmit={handleFormSubmit}>
        <Input variant="pill"
          label="Email address"
          placeholder="Enter Email Address"
          RightIcon={HiOutlineMail}
          {...formFieldRegister("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Email must be a valid email address" } })}
          error={formErrors.email?.message}
          id="email"
        />

        <PasswordInput variant="pill"
          label="Password"
          placeholder="Enter Password"
          {...formFieldRegister("password", { required: "Password is required" })}
          error={formErrors.password?.message}
          id="password"
        />

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13px]">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              {...formFieldRegister("rememberMe")}
              className="h-4 w-4 rounded border-gray-300 text-[#07004d] focus:ring-[#07004d]"
            />
            <span className="text-[#717480]">Remember me</span>
          </label>
          <TextLink text="Forgot password?" to="/auth/forgot-password" className="font-bold text-[#07004d]" />
        </div>

        <div className="mt-1 flex flex-col gap-4">
          <Button
            text="Sign in"
            type="submit"
            isBlock
            testID="log-in-submit"
            disabled={mutationIsLoading}
            className="!h-[46px] !rounded-full bg-[#07004d] !text-[14px]"
          />

          <div className="text-center text-[13px] text-[#717480]">
            Don't have an account? <TextLink text="Sign up" to="/auth/signup" className="font-bold text-[#07004d]" />
          </div>

          <SocialAuthButtons />
        </div>
      </form>
    </AuthCard>
  );
};

export default SignInPage;
