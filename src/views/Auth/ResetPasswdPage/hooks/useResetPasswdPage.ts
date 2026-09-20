"use client";

import { resetPasswd } from "@services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Bounce, toast } from "react-toastify";

type TInputs = {
  password: string;
  confirmPassword: string;
};

const useResetPasswdPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const email = searchParams?.get("email") || "";
  const otp = searchParams?.get("otp") || "";

  useEffect(() => {
    if (!email || !otp) {
      toast.error("Invalid session. Please start over.");
      router.push("/auth/forgot-password");
    }
  }, [email, otp, router]);

  const {
    register,
    handleSubmit: _handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<TInputs>();

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.password === value.confirmPassword)
        return setError("confirmPassword", { type: "manual", message: "" });

      setError("confirmPassword", {
        type: "manual",
        message: "Passwords must match",
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, setError]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswd,
    onSuccess: async () => {
      queryClient.setQueryData(["auth.me"], null);
      setIsSuccess(true);
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Reset Password failed! Try again later", {
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

  const handleSubmit = _handleSubmit((values: TInputs) => {
    mutate({
      email,
      newPassword: values.password,
      otp,
    });
  });

  return {
    formErrors: errors,
    formFieldRegister: register,
    handleFormSubmit: handleSubmit,
    mutationIsLoading: isPending,
    email,
    isSuccess,
  };
};

export default useResetPasswdPage;
