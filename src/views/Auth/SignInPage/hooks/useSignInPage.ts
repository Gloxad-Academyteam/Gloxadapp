"use client";

import { signIn } from "@services/auth";
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
      // Directly seed the auth cache from the login response so the dashboard
      // sees the user as authenticated instantly — no second network call needed.
      if (data?.data?.user) {
        queryClient.setQueryData(["auth.me"], { data: data.data.user });
      }
      await queryClient.invalidateQueries({ queryKey: ["auth.me"] });
      
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

      const user = data?.data?.user;
      const userRole = user?.role;

      // Update auth cache with fresh logged in user object
      queryClient.setQueryData(["auth.me"], { data: user });
      queryClient.invalidateQueries({ queryKey: ["auth.me"] });

      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "instructor") {
        const hasCertifications = Array.isArray(user?.certifications) && user.certifications.length > 0;
        const status = (user?.approvalStatus || "").toLowerCase();
        const isApproved = status === "approved";
        const isPendingReview = status === "pending" && hasCertifications;

        if (isApproved) {
          router.push(redirectUrl || "/dashboard");
        } else if (!isApproved && !isPendingReview && (redirectUrl === "/dashboard" || !redirectUrl)) {
          router.push("/tutor/onboarding");
        } else {
          router.push(redirectUrl || "/dashboard");
        }
      } else {
        router.push(redirectUrl || "/dashboard");
      }
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

      handleToast("Login failed! Try again later");
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
