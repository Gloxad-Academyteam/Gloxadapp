"use client";

import { useState, useEffect } from "react";
import Button from "@components/Button";
import Input from "@components/Input";
import PasswordInput from "@components/Input/PasswordInput";
import TextLink from "@components/TextLink";
import AuthCard from "@components/AuthCard";
import SocialAuthButtons from "@components/AuthCard/SocialAuthButtons";
import { FiMail } from "react-icons/fi";
import useSignUpPage from "./hooks/useSignUpPage";
import SignupHeroImage from "@assets/images/Frame 2147227544.png";
import TutorSignupImage from "@assets/images/Rectangle 4239.png";
import StudentImage3 from "@assets/images/student-learning-3.png";
import StudentImage4 from "@assets/images/student-learning-4.png";

const STUDENT_IMAGES = [
  {
    image: SignupHeroImage,
    alt: "Student Learning 1",
    fit: "object-cover object-center",
    bg: "bg-gradient-to-br from-[#126888] to-[#1a90bc]",
    hideText: false,
  },
  {
    image: StudentImage3,
    alt: "Student Learning 2",
    fit: "object-cover object-center",
    bg: "bg-gradient-to-br from-[#126888] to-[#1a90bc]",
    hideText: true,
  },
  {
    image: StudentImage4,
    alt: "Student Learning 3",
    fit: "object-cover object-center",
    bg: "bg-gradient-to-br from-[#126888] to-[#1a90bc]",
    hideText: false,
  },
];

const SignUpPage = () => {
  const { formErrors, formFieldRegister, handleFormSubmit, mutationIsLoading, role, setRole } =
    useSignUpPage();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (role !== "student") return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % STUDENT_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [role]);

  const slideHidesText = role === "student" && !!STUDENT_IMAGES[currentImageIndex]?.hideText;

  const panel = (
    <>
      {/* Student slideshow (all preloaded for zero flicker) */}
      {STUDENT_IMAGES.map((item, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
            role === "student" && currentImageIndex === idx ? "z-[1] opacity-100" : "z-0 opacity-0"
          }`}
        >
          <img
            src={item.image.src}
            alt={item.alt}
            className={`h-full w-full ${item.fit} ${
              role === "student" && currentImageIndex === idx ? "animate-kenburns" : ""
            }`}
          />
        </div>
      ))}

      {/* Tutor image */}
      <img
        src={TutorSignupImage.src}
        alt="Tutor teaching"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
          role === "instructor" ? "z-[1] animate-kenburns opacity-100" : "z-0 opacity-0"
        }`}
      />
    </>
  );

  return (
    <AuthCard
      panel={panel}
      headlineHidden={slideHidesText}
      headline={role === "instructor" ? ["Inspire & Educate", "Start Teaching Today!"] : ["Unlock Your Potential", "Start Learning Today!"]}
    >
      {/* Role Toggle */}
      <div className="mx-auto mb-7 flex h-[44px] w-full max-w-[240px] items-center rounded-full bg-[#e3e3fc] p-1">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`flex h-full flex-1 items-center justify-center rounded-full text-[14px] font-medium transition ${
            role === "student" ? "bg-[#07004d] text-white" : "text-[#5b5e8a]"
          }`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole("instructor")}
          className={`flex h-full flex-1 items-center justify-center rounded-full text-[14px] font-medium transition ${
            role === "instructor" ? "bg-[#07004d] text-white" : "text-[#5b5e8a]"
          }`}
        >
          Tutor
        </button>
      </div>

      <h2 className="mb-6 text-center text-[24px] font-bold leading-[1.25] text-[#202127] sm:text-[28px]">
        Sign up and start learning
      </h2>

      <form className="flex w-full flex-col gap-4 sm:gap-5" onSubmit={handleFormSubmit}>
        <Input variant="pill"
          label="Full Name"
          placeholder="Enter Full Name"
          {...formFieldRegister("fullName", { required: "Full Name is required" })}
          error={formErrors.fullName?.message}
        />

        <Input variant="pill"
          label="Email address"
          placeholder="Enter Email Address"
          RightIcon={FiMail}
          {...formFieldRegister("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Valid email required" },
          })}
          error={formErrors.email?.message}
        />

        {role === "instructor" && (
          <div className="flex flex-col gap-1">
            <label className="mb-1 text-[13px] font-medium text-[#202127]">Area of Expertise</label>
            <div className="relative">
              <select
                defaultValue=""
                className="h-[46px] w-full appearance-none rounded-full border border-[#e6e8ee] bg-white px-5 pr-11 text-[14px] text-[#202127] outline-none transition focus:border-[#07004d] focus:ring-4 focus:ring-[#07004d]/10"
                {...formFieldRegister("areaOfExpertise", { required: "Area of Expertise is required for Tutors" })}
              >
                <option value="" disabled>Select your Area of expertise</option>
                <option value="Front-end Development">Front-end Development</option>
                <option value="Back-end Development">Back-end Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Data Science">Data Science</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-[#8a8d99]">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            {formErrors.areaOfExpertise && <p className="pl-4 text-red-500 text-xs">{formErrors.areaOfExpertise.message}</p>}
          </div>
        )}

        <PasswordInput variant="pill"
          label="Password"
          placeholder="Enter Password"
          {...formFieldRegister("password", { required: "Password is required" })}
          error={formErrors.password?.message}
        />

        <PasswordInput variant="pill"
          label="Confirm Password"
          placeholder="Enter Password"
          {...formFieldRegister("confirmPassword", { required: "Required" })}
          error={formErrors.confirmPassword?.message}
        />

        {/* Checkbox */}
        <div className="mt-2 flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            className="mt-0.5 h-4 w-4 shrink-0 rounded-[4px] border-[#cfd2da] text-[#07004d] focus:ring-[#07004d]"
            {...formFieldRegister("terms", { required: "You must agree to the terms" })}
          />
          <label htmlFor="terms" className="text-[13px] text-[#717480] leading-[1.5]">
            By signing up you agree to our <span className="font-semibold text-[#202127]">Terms and conditions</span> and <span className="font-semibold text-[#202127]">Privacy policy</span>.
          </label>
        </div>
        {formErrors.terms && <p className="text-red-500 text-xs">{formErrors.terms.message}</p>}

        <div className="mt-4">
          <Button text="Create account" type="submit" isBlock testID="sign-up-submit" disabled={mutationIsLoading} className="!h-[46px] !rounded-full bg-[#07004d] !text-[14px]" />
        </div>

        <div className="mt-2 text-center text-[13px] text-[#717480]">
          Already have an account? <TextLink text="Sign In" to="/auth/signin" className="font-bold text-[#07004d]" />
        </div>

        <SocialAuthButtons />
      </form>
    </AuthCard>
  );
};

export default SignUpPage;
