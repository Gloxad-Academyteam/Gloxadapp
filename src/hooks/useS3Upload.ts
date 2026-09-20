import { useState } from "react";
import axiosInstance from "@utils/axiosInstance";
import axios from "axios";

export const useS3Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file: File, folder: string = "courses"): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Get presigned URL
      const { data } = await axiosInstance.post("/upload/presigned-url", {
        filename: file.name,
        fileType: file.type,
        folder,
      });

      const { uploadUrl, fileUrl } = data;

      // 2. Upload directly to S3
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      return fileUrl;
    } catch (error) {
      console.error("S3 Upload Failed:", error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return { uploadFile, isUploading, uploadProgress };
};
