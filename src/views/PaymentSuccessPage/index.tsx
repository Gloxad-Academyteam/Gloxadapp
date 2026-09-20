"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiCheck } from "react-icons/fi";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const courseId = searchParams.get("courseId");
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-white px-5 py-14 text-[#202127]">
      <div className="flex w-full max-w-[520px] flex-col items-center text-center">
        <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#15803d] text-[52px] text-white sm:h-[112px] sm:w-[112px]">
          <FiCheck strokeWidth={3} />
        </div>

        <h1 className="mt-8 text-[26px] font-bold sm:text-[30px]">Payment Successful!</h1>
        <p className="mt-4 text-[14px] leading-[1.7] text-[#4e515c] sm:text-[15px]">
          We&apos;re excited to have you join us!
          <br />
          You have been added to the course group. Kindly check your in-app messages for further details and session reminders.
        </p>

        <button
          type="button"
          onClick={() => router.push(courseId ? `/learning/${courseId}` : "/dashboard/courses")}
          className="btn-interactive mt-8 h-[46px] w-full max-w-[360px] rounded-full bg-[#07004d] text-[14px] font-medium text-white transition hover:bg-[#111456]"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/courses")}
          className="mt-4 text-[13px] font-medium text-[#07004d] hover:underline"
        >
          Go to dashboard
        </button>
      </div>
    </div>
  );
}
