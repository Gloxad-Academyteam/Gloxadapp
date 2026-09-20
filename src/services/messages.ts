import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";

export async function getConversations(): Promise<TService<any>> {
  const { data } = await axiosInstance.get("/messages/conversations");
  return { data };
}

export async function getMessages(conversationId: string): Promise<TService<any>> {
  const { data } = await axiosInstance.get(`/messages/${conversationId}`);
  return { data };
}

export async function sendMessage(conversationId: string, text: string): Promise<TService<any>> {
  const { data } = await axiosInstance.post(`/messages/${conversationId}`, { text });
  return { data };
}

export async function createConversation(recipientId: string, courseId?: string): Promise<TService<any>> {
  const { data } = await axiosInstance.post("/messages/conversations/new", { recipientId, courseId });
  return { data };
}
