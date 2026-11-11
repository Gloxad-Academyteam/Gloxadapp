import axiosInstance from "@utils/axiosInstance";

export type TPracticeLanguage = "javascript" | "python" | "web";
export type TPracticeFile = { name: string; content: string };
export type TWorkspaceSummary = { id: string; title: string; language: TPracticeLanguage; version: number; updatedAt: string };
export type TWorkspace = TWorkspaceSummary & { files: TPracticeFile[] };
export type TWorkspaceVersion = { version: number; savedAt: string; files: string[]; characters: number };

// Saved practice workspaces. The code itself only ever runs in the learner's browser.
export const practiceApi = {
  list: async (): Promise<TWorkspaceSummary[]> => (await axiosInstance.get("/practice/workspaces")).data.workspaces,
  create: async (language: TPracticeLanguage, title?: string): Promise<TWorkspace> => (await axiosInstance.post("/practice/workspaces", { language, title })).data.workspace,
  get: async (id: string): Promise<TWorkspace> => (await axiosInstance.get(`/practice/workspaces/${id}`)).data.workspace,
  autosave: async (id: string, body: { baseVersion: number; files: TPracticeFile[]; title?: string }): Promise<{ version: number; savedAt: string }> =>
    (await axiosInstance.put(`/practice/workspaces/${id}/autosave`, body)).data,
  versions: async (id: string): Promise<{ current: number; versions: TWorkspaceVersion[] }> => (await axiosInstance.get(`/practice/workspaces/${id}/versions`)).data,
  restore: async (id: string, version: number): Promise<TWorkspace> => (await axiosInstance.post(`/practice/workspaces/${id}/restore`, { version })).data.workspace,
  remove: async (id: string) => axiosInstance.delete(`/practice/workspaces/${id}`),
};
