import axiosInstance from "@utils/axiosInstance";

export type TOwnershipClass = "gloxad_produced" | "licensed_partner" | "externally_curated";

// Who made the content: shown wherever a course or lesson is credited
export type TProvider = {
  _id: string;
  name: string;
  slug: string;
  type?: "creator" | "institution";
  platform?: "youtube" | "s3";
  channelUrl?: string;
  originalUrl?: string;
  ownershipClass: TOwnershipClass;
  // false means the content must be opened at its source instead of played inside Gloxad
  embedAllowed: boolean;
  isActive?: boolean;
  bio?: string;
};

export const providersApi = {
  list: async (filters: { platform?: string; type?: string; ownershipClass?: TOwnershipClass } = {}): Promise<TProvider[]> =>
    (await axiosInstance.get("/providers", { params: filters })).data.providers ?? [],
  get: async (idOrSlug: string): Promise<TProvider> => (await axiosInstance.get(`/providers/${idOrSlug}`)).data.provider,
};

export const OWNERSHIP_TEXT: Record<TOwnershipClass, { label: string; note: string }> = {
  externally_curated: {
    label: "Curated from an external creator",
    note: "This content is created and owned by its respective creator. Gloxad Academy links to the original and does not claim authorship or ownership.",
  },
  gloxad_produced: { label: "Produced by Gloxad Academy", note: "This content was produced by Gloxad Academy." },
  licensed_partner: { label: "Provided by a licensed partner", note: "This content is provided by a partner under licence." },
};
