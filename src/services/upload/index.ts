import axios from "axios";
import axiosInstance from "@utils/axiosInstance";

// S3 folder prefixes accepted by POST /upload/presigned-url
export type TUploadFolder = "avatars" | "courses" | "certifications" | "resources" | "documents";

type TPresignedUrl = {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  expiresIn: number;
};

export async function getPresignedUrl(file: File, folder: TUploadFolder): Promise<TPresignedUrl> {
  const { data } = await axiosInstance.post("/upload/presigned-url", {
    filename: file.name,
    fileType: file.type,
    folder,
  });
  return data;
}

/**
 * Uploads a file straight to S3 (the API only signs the request, it never receives the bytes)
 * and returns the public URL to save on the resource that references it.
 */
export async function uploadFile(
  file: File,
  folder: TUploadFolder,
  onProgress?: (percent: number) => void
): Promise<string> {
  const { uploadUrl, fileUrl } = await getPresignedUrl(file, folder);

  // Plain axios: the S3 signature breaks if our Authorization header is attached
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (event) => {
      if (event.total) onProgress?.(Math.round((event.loaded * 100) / event.total));
    },
  });

  return fileUrl;
}
