"use client";

import { verifyOtp, verifyEmail, forgetPasswd } from "@services/auth";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bounce, toast } from "react-toastify";

const useVerifyOtpPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const email = searchParams?.get("email") || "";
  const type = searchParams?.get("type") || "verify"; // "reset" or "verify"
  const [otp, setOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/auth/forgot-password");
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown]);

  const { mutate: verifyOtpMutate, isPending: isVerifying } = useMutation({
    mutationFn: type === "reset" ? verifyOtp : verifyEmail,
    onSuccess: () => {
      setIsVerified(true);
    },
    onError: () => {
      toast.error("Invalid or expired OTP", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  const { mutate: resendOtpMutate, isPending: isResending } = useMutation({
    mutationFn: forgetPasswd,
    onSuccess: () => {
      toast.success("OTP resent successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setCountdown(60);
    },
    onError: () => {
      toast.error("Failed to resend OTP", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  const onOtpComplete = (otpValue: string) => {
    setOtp(otpValue);
  };

  const handleVerify = () => {
    const isReset = type === "reset";
    const expectedLength = isReset ? 5 : 4;
    if (!otp || otp.length !== expectedLength) {
      toast.error(`Please enter a valid ${expectedLength}-digit OTP`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    verifyOtpMutate({ email, otp });
  };

  const handleResend = () => {
    resendOtpMutate({ email });
  };

  return {
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
  };
};

export default useVerifyOtpPage;
