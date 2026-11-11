import { sendDownvote, sendUpvote } from "@services/vote";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useReviewItemBox = () => {
  const { mutate: upVoteMutate, isPending: isUpVoteLoading } = useMutation({
    mutationFn: sendUpvote,
    onSuccess: () => {
      toast.success("Upvote Success", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    onError: () => {
      toast.error("Upvote Failed! Try again later", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });

  const { mutate: downVoteMutate, isPending: isDownVoteLoading } = useMutation({
    mutationFn: sendDownvote,
    onSuccess: () => {
      toast.success("Downvote Success", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    onError: () => {
      toast.error("Downvote Failed! Try again later", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  });

  const handleUpVote = () => {
    upVoteMutate();
  };

  const handleDownVote = () => {
    downVoteMutate();
  };

  return {
    isUpVoteLoading,
    handleUpVote,
    isDownVoteLoading,
    handleDownVote,
  };
};

export default useReviewItemBox;
