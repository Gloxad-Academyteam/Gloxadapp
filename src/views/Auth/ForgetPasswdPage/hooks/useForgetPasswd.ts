import { forgetPasswd } from "@services/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import { useState } from "react";

type TInputs = {
  email: string;
};

const useResetPasswd = () => {

  const {
    register,
    handleSubmit: _handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<TInputs>();

  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: forgetPasswd,
    onSuccess: () => {
      setIsSuccess(true);
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
    isSuccess,
    getValues,
  };
};

export default useResetPasswd;
