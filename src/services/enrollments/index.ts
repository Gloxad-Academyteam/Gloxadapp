import axiosInstance from "@utils/axiosInstance";

export async function getMyEnrollments(): Promise<any[]> {
  const response = await axiosInstance.get("/enrollments/my-courses");
  return response.data;
}
