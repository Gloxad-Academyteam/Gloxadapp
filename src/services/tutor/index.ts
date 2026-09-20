import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";

export async function uploadExpertise(payload: FormData): Promise<TService<true>> {
  const token = localStorage.getItem("token");
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  
  const response = await fetch(`${baseURL}/tutor/upload-expertise`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: payload,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return { data: true };
}

export async function getDashboardStats(): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/tutor/dashboard-stats");
  return { data };
}
