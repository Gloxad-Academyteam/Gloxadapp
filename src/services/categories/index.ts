import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";

export type TSubCategory = {
  _id?: string;
  name: string;
  slug?: string;
  topics: string[];
};

export type TCategory = {
  _id: string;
  name: string;
  slug: string;
  // Icon identifier, e.g. "code". Older categories may hold the uploaded image URL here instead
  icon?: string;
  imageUrl?: string;
  order?: number;
  subCategories: TSubCategory[];
};

export type TCategoryPayload = {
  name?: string;
  icon?: string;
  imageUrl?: string;
  order?: number;
  subCategories?: { name: string; topics: string[] }[];
};

// The API recalculates slugs and ids from names, so only send what it accepts
const toPayload = (payload: TCategoryPayload): TCategoryPayload => ({
  ...payload,
  ...(payload.subCategories && {
    subCategories: payload.subCategories.map(({ name, topics }) => ({ name, topics: topics ?? [] })),
  }),
});

export const isImageIcon = (icon?: string) => !!icon && /^(https?:)?\/\//.test(icon);

// The category's uploaded image: imageUrl, or an image URL saved in icon before imageUrl existed
export const getCategoryImage = (category?: Pick<TCategory, "imageUrl" | "icon"> | null) =>
  category?.imageUrl || (isImageIcon(category?.icon) ? category?.icon : undefined);

export async function getCategories(): Promise<TService<TCategory[]>> {
  const { data } = await axiosInstance.get("/categories");
  return { data: data?.categories ?? [] };
}

export async function createCategory(payload: TCategoryPayload): Promise<TService<TCategory>> {
  const { data } = await axiosInstance.post("/admin/categories", toPayload(payload));
  return { data: data.category };
}

export async function updateCategory(id: string, payload: TCategoryPayload): Promise<TService<TCategory>> {
  const { data } = await axiosInstance.put(`/admin/categories/${id}`, toPayload(payload));
  return { data: data.category };
}

export async function deleteCategory(id: string): Promise<TService<true>> {
  await axiosInstance.delete(`/admin/categories/${id}`);
  return { data: true };
}
