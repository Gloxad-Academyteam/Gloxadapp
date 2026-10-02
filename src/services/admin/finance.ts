import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";

export async function getFinance(): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/admin/finance");
  return { data: data.finance };
}

export async function getRecentTransactions(limit = 10): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/admin/recent-transactions", { params: { limit } });
  return { data };
}
