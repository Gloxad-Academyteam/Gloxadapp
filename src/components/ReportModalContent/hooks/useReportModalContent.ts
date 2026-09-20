import { useMutation } from "@tanstack/react-query";
import { sendReport } from "@services/report";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import testLogger from "@utils/testLogger";
import { MODAL_CLOSED } from "@constants/modal-logs";

type TInputs = {
  reportMessage: string;
  reportType: string;
};

const useReportModalContent = (onCancelClick?: () => void) => {
  const handleCancelClick = () => {
    if (!onCancelClick) return;

    testLogger(MODAL_CLOSED);
    onCancelClick();
  };

  const {
    register,
    handleSubmit: _handleSubmit,
    formState: { errors },
  } = useForm<TInputs>();

  const { mutate, isSuccess, isError, error, isPending } = useMutation({
    mutationFn: sendReport,
    onSuccess: () => {
      toast.success("Report sent successfully", {
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

      handleCancelClick();
    },

    onError: () => {
      toast.error("Report failed! Try again", {
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
    mutate(values);
  });

  return {
    register,
    handleSubmit,
    handleCancelClick,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    errors,
  };
};

export default useReportModalContent;
