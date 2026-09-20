import { getMe, signOut } from "@services/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Bounce, toast } from "react-toastify";

const useAuth = () => {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["auth.me"],
    queryFn: getMe,
    retry: false,
    staleTime: 0,
  });

  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: () => {
      toast.error("Logout failed! Try again later", {
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

  useEffect(() => {
    if (!result.error) return;

    if (
      (result.error as AxiosError).response?.status === 401 ||
      (result.error as AxiosError).response?.status === 403
    ) {
      queryClient.setQueryData(["auth.me"], null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.error]);

  const authenticatedUser = result.data?.data;
  const isAuthenticated = !!authenticatedUser;
  const isLoading = result.isPending && !authenticatedUser;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return {
    isAuthenticated,
    isLoading,
    authenticatedUser,
    handleLogout,
    isLoggingOut: logoutMutation.isPending,
  };
};

export default useAuth;
