"use client";

import { resendVerification, signIn } from "@services/auth";
import { getPostAuthRoute, needsEmailVerification, verifyEmailRoute } from "@utils/getPostAuthRoute";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {AxiosError} from "axios";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Bounce, toast } from "react-toastify";

type TInputs = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

const useSignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const redirectUrl = searchParams?.get("redirect") || "/dashboard";
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit: _handleSubmit,
    formState: { errors },
  } = useForm<TInputs>();

  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      const user = data?.data?.user;

      // Seed the auth cache from the login response (the backend returns the same user shape as /auth/me)
      // so guards see the user as authenticated instantly — no second network call needed.
      queryClient.setQueryData(["auth.me"], { data: user });

      // Tutor who never entered their signup code: send a fresh one and finish verification first
      if (needsEmailVerification(user)) {
        resendVerification({ email: user.email })
          .then(() => toast.info("Please verify your email. We've sent you a new code."))
          .catch(() => toast.info("Please verify your email with the code we sent when you signed up."));
        router.push(verifyEmailRoute(user.email));
        return;
      }

      toast.success("Login successfully", {
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

      router.push(getPostAuthRoute(user, redirectUrl));
    },

    onError: (error) => {
      const err: AxiosError = error as AxiosError;
     
      const handleToast = (message: string) => {
        toast.error(message, {
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
      };

      if (err?.response?.status === 401) {
        handleToast("Invalid email or password");
        return;
      }

      // e.g. 429 "Too many attempts, please try again later" from the auth API's rate limiter
      const apiMessage = (err?.response?.data as { error?: string } | undefined)?.error;
      handleToast(apiMessage || "Login failed! Try again later");
    },
  });

  const handleSubmit = _handleSubmit((values: TInputs) => {
    mutate(values);
  });

  return {
    formErrors: errors,
    formFieldRegister: register,
    handleFormSubmit: handleSubmit,
    mutationIsLoading: isPending,
  };
};

export default useSignInPage;
