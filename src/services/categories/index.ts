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
  // Search tags, cross-category learning pathways (e.g. "AI for Agriculture"), and older names that still find this category
  tags?: string[];
  pathways?: string[];
  aliases?: string[];
  // Deactivated categories are hidden from public pages but keep their courses and history
  isActive?: boolean;
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

export const isCategoryActive = (category: Pick<TCategory, "isActive">) => category.isActive !== false;

// Public pages only ever see active categories; the admin screen asks for all of them so it can switch one back on
export async function getCategories(options: { includeInactive?: boolean } = {}): Promise<TService<TCategory[]>> {
  const { data } = await axiosInstance.get("/categories");
  const all: TCategory[] = data?.categories ?? [];
  return { data: options.includeInactive ? all : all.filter(isCategoryActive) };
}

export async function setCategoryActive(id: string, isActive: boolean): Promise<TService<TCategory>> {
  const { data } = await axiosInstance.put(`/admin/categories/${id}/status`, { isActive });
  return { data: data.category };
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
