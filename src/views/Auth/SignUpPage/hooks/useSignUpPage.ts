"use client";

import { signUp } from "@services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { Bounce, toast } from "react-toastify";

import { useState } from "react";

type TInputs = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  areaOfExpertise?: string;
};

const useSignUpPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const routeRole = useParams<{ role?: string }>()?.role;
  const initialRole = routeRole === "instructor" ? "instructor" : "student";
  const [role, setRole] = useState<"student" | "instructor">(initialRole);

  const {
    register,
    handleSubmit: _handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<TInputs>();

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.password === value.confirmPassword) {
        clearErrors("confirmPassword");
        return;
      }

      setError("confirmPassword", {
        type: "manual",
        message: "Passwords must match",
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, setError, clearErrors]);

  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: async (response) => {
      // Directly seed the auth cache from the signup response
      if (response?.data?.user) {
        queryClient.setQueryData(["auth.me"], { data: response.data.user });
      }
      await queryClient.invalidateQueries({ queryKey: ["auth.me"] });

      toast.success("Sign-up successfully", {
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

      // Redirect to Verify OTP or Onboarding if tutor, otherwise dashboard for student
      if (role === "instructor") {
        if (response?.data?.otpSkipped) {
          router.push("/tutor/onboarding");
        } else {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(watch("email"))}&type=verify`);
        }
      } else {
        router.push("/dashboard");
      }
    },

    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Sign-up failed! Try again later";
      toast.error(errorMessage, {
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
    // Split full name
    const nameParts = values.fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || " ";

    // Auto-generate username from email
    const username = values.email.split("@")[0] + Math.floor(Math.random() * 1000);

    mutate({
      email: values.email,
      password: values.password,
      firstName,
      lastName,
      username,
      role,
      ...(role === "instructor" && values.areaOfExpertise && { areaOfExpertise: values.areaOfExpertise }),
    });
  });

  return {
    formErrors: errors,
    formFieldRegister: register,
    handleFormSubmit: handleSubmit,
    mutationIsLoading: isPending,
    role,
    setRole,
  };
};

export default useSignUpPage;
