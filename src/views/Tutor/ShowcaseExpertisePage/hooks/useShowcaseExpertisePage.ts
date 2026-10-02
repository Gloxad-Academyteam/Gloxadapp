"use client";

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitExpertise as submitExpertiseService } from "@services/tutor";
import useAuth from "@hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";

export const useShowcaseExpertisePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { authenticatedUser } = useAuth();
  const [certifications, setCertifications] = useState<File[]>([]);
  const [experienceProofs, setExperienceProofs] = useState<File[]>([]);
  const [teachingExperienceBio, setTeachingExperienceBio] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: submitExpertise, isPending: isSubmitting } = useMutation({
    mutationFn: submitExpertiseService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth.me"] });
      setIsModalOpen(true);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Upload failed! Try again later";
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

  const handleFileDrop = useCallback((acceptedFiles: File[], type: "cert" | "exp") => {
    if (type === "cert") {
      setCertifications((prev) => [...prev, ...acceptedFiles]);
    } else {
      setExperienceProofs((prev) => [...prev, ...acceptedFiles]);
    }
  }, []);

  const removeFile = (index: number, type: "cert" | "exp") => {
    if (type === "cert") {
      setCertifications((prev) => prev.filter((_, i) => i !== index));
    } else {
      setExperienceProofs((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleSubmit = () => {
    if (certifications.length === 0 && experienceProofs.length === 0 && !teachingExperienceBio.trim()) {
      toast.error("Please upload at least one document or enter a brief about your teaching experience before submitting.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    const user: any = authenticatedUser;
    submitExpertise({
      files: [...certifications, ...experienceProofs],
      // Tutors give their area of expertise at sign-up
      areaOfExpertise: user?.areaOfExpertise || user?.title || "General",
      expertiseBio: teachingExperienceBio.trim() || `Tutor specializing in ${user?.areaOfExpertise || "teaching"}.`,
    });
  };

  return {
    certifications,
    experienceProofs,
    teachingExperienceBio,
    setTeachingExperienceBio,
    handleFileDrop,
    removeFile,
    handleSkip,
    handleSubmit,
    isSubmitting,
    isModalOpen,
    setIsModalOpen,
  };
};
