import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";
import { uploadFile } from "@services/upload";

export type TShowcaseExpertisePayload = {
  areaOfExpertise: string;
  expertiseBio: string;
  title?: string;
  experienceYears?: number;
  university?: string;
  skills?: string[];
  certificationsUrl?: string;
  certifications?: string[];
};

export async function showcaseExpertise(payload: TShowcaseExpertisePayload): Promise<TService<any>> {
  const { data } = await axiosInstance.post("/tutor/showcase-expertise", payload);
  return { data: data.user };
}

/**
 * Uploads credential documents to S3, then submits them for admin review.
 * The API stores document links (not files), so `certifications` holds the uploaded URLs.
 */
export async function submitExpertise({
  files,
  ...payload
}: Omit<TShowcaseExpertisePayload, "certifications" | "certificationsUrl"> & { files: File[] }): Promise<TService<any>> {
  const urls = await Promise.all(files.map((file) => uploadFile(file, "certifications")));
  return showcaseExpertise({
    ...payload,
    ...(urls.length > 0 && { certifications: urls, certificationsUrl: urls[0] }),
  });
}

export async function getDashboardStats(): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/tutor/dashboard-stats");
  return { data };
}

export async function getEarnings(): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/tutor/earnings");
  return { data };
}
