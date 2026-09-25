"use client";

import { verifyOtp, verifyEmail, forgetPasswd, resendVerification } from "@services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TUser } from "@services/auth/types_";
import { getPostAuthRoute } from "@utils/getPostAuthRoute";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bounce, toast } from "react-toastify";

const useVerifyOtpPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
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
    mutationFn: async (vars: { email: string; otp: string }): Promise<{ data?: TUser | true | null }> =>
      type === "reset" ? verifyOtp(vars) : verifyEmail(vars),
    onSuccess: (response) => {
      // Email verification returns the now-verified, signed-in user (or null if they still need to sign in)
      if (type !== "reset") {
        const user = response?.data && response.data !== true ? response.data : null;
        queryClient.setQueryData(["auth.me"], user ? { data: user } : null);
      }
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

  const { mutate: resendOtpMutate, isPending: isResending } = useMutation<unknown, Error, { email: string }>({
    // Reset flow re-sends a password-reset code; signup flow re-sends an email-verification code
    mutationFn: type === "reset" ? forgetPasswd : resendVerification,
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
    onError: (error) => {
      // Axios errors carry the API's message; plain Errors (e.g. resend not supported) carry their own
      const apiError = (error as any)?.response?.data?.error;
      toast.error(apiError || error?.message || "Failed to resend OTP", {
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

  // Where the "Continue" button goes after a successful verification
  const handleContinue = () => {
    if (type === "reset") {
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
      return;
    }
    const cached = queryClient.getQueryData<{ data?: TUser } | null>(["auth.me"]);
    if (cached?.data) {
      router.push(getPostAuthRoute(cached.data));
      return;
    }
    // Verified but no session (e.g. the page was reloaded after signup): sign in to continue
    toast.info("Email verified! Please sign in to continue.");
    router.push("/auth/signin");
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
    handleContinue,
  };
};

export default useVerifyOtpPage;
