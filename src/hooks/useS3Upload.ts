import { useState } from "react";
import { uploadFile as uploadToS3, TUploadFolder } from "@services/upload";

export const useS3Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file: File, folder: TUploadFolder = "courses"): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      return await uploadToS3(file, folder, setUploadProgress);
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
