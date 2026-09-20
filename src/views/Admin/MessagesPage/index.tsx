"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiSettings, FiImage, FiPaperclip, FiSmile, FiSend, FiMoreVertical } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConversations, getMessages, sendMessage } from "@services/messages";
import useAuth from "@hooks/useAuth";
import io from "socket.io-client";

const MessagesPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { authenticatedUser: user } = useAuth();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Conversations
  const { data: conversationsData } = useQuery({
    queryKey: ["messages.conversations"],
    queryFn: async () => {
      const res = await getConversations();
      return res.data?.conversations || [];
    }
  });

  // Fetch Messages for active chat
  const { data: messagesData } = useQuery({
    queryKey: ["messages.chat", activeChatId],
    queryFn: async () => {
      if (!activeChatId) return [];
      const res = await getMessages(activeChatId);
      return res.data?.messages || [];
    },
    enabled: !!activeChatId
  });

  // Send Message Mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatId, text }: { chatId: string; text: string }) => {
      return await sendMessage(chatId, text);
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["messages.chat", activeChatId] });
      queryClient.invalidateQueries({ queryKey: ["messages.conversations"] });
    }
  });

  // Socket.io logic
  useEffect(() => {
    if (!user?._id) return;
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001", {
      transports: ["websocket"]
    });
    
    socket.emit("join_user", user._id);
    
    socket.on("new_message", (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages.chat", data.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["messages.conversations"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id, queryClient]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  // Derived active chat
  const activeChat = conversationsData?.find((c: any) => c._id === activeChatId);
  const isGroup = activeChat?.course != null;

  let activeChatTitle = "Unknown";
  if (activeChat) {
    if (isGroup) {
      activeChatTitle = activeChat.course.title;
    } else {
      const other = activeChat.participants.find((p: any) => p._id !== user?._id);
      if (other) {
        activeChatTitle = `${other.firstName} ${other.lastName}`;
      }
    }
  }

  const handleSend = () => {
    if (!messageText.trim() || !activeChatId) return;
    sendMessageMutation.mutate({ chatId: activeChatId, text: messageText });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full h-full flex bg-white overflow-hidden">
      
      {/* LEFT SIDEBAR - CHATS LIST */}
      <div className="w-[320px] md:w-[350px] border-r border-[#e2e8f0] flex flex-col bg-white">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-bold text-[#202127]">Chat</h2>
            <button className="text-[#181C7B] bg-[#f0f4ff] px-4 py-2 rounded-[6px] text-[13px] font-bold hover:bg-[#e0e7ff] transition-colors flex items-center gap-1">
              + Create Group
            </button>
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-white border border-[#e2e8f0] rounded-[8px] pl-9 pr-4 py-2 text-[14px] outline-none focus:border-[#3b82f6]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          {conversationsData?.map((chat: any) => {
            // Determine display name and avatar (if direct message, use other participant's info)
            const isGroupChat = chat.course != null;
            let displayTitle = "Unknown";
            let displayAvatar = "https://ui-avatars.com/api/?name=G&background=random";

            if (isGroupChat) {
              displayTitle = chat.course.title;
            } else {
              const other = chat.participants.find((p: any) => p._id !== user?._id);
              if (other) {
                displayTitle = `${other.firstName} ${other.lastName}`;
                displayAvatar = other.avatarUrl || `https://ui-avatars.com/api/?name=${other.firstName}+${other.lastName}&background=random`;
              }
            }

            return (
              <div 
                key={chat._id} 
                onClick={() => setActiveChatId(chat._id)}
                className={`flex items-center gap-4 p-3 mb-2 rounded-[12px] cursor-pointer transition-colors ${
                  activeChatId === chat._id ? "bg-[#f0f4f8]" : "hover:bg-black/5"
                }`}
              >
                <div className="relative shrink-0">
                  <img src={displayAvatar} alt={displayTitle} className="w-10 h-10 rounded-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[14px] font-bold text-[#202127] truncate">{displayTitle}</h3>
                    <span className="text-[11px] text-[#A0AEC0] shrink-0">{formatTime(chat.lastMessageAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-[#717480] truncate pr-2">{"Tap to view chat"}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {!conversationsData?.length && (
            <div className="p-8 text-center text-[#A0AEC0] text-[13px]">No conversations yet.</div>
          )}
        </div>
      </div>

      {/* MIDDLE SECTION - CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-[#f8fafc]">
        
        {!activeChat ? (
           <div className="flex-1 flex items-center justify-center text-[#A0AEC0]">
             Select a chat to start messaging
           </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-[90px] bg-white border-b border-[#e2e8f0] flex items-center justify-between px-8 shrink-0 m-4 rounded-[12px] shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#eef2ff] rounded-full flex items-center justify-center text-[#181C7B] font-bold">
                  {isGroup ? "G" : "U"}
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#202127] uppercase tracking-wider mb-1">
                    {activeChatTitle}
                  </h2>
                  <p className="text-[12px] text-[#717480]">Active Now</p>
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messagesData?.map((msg: any) => {
                const isMe = msg.sender === user?._id;
                // find sender in participants
                const senderUser = activeChat.participants.find((p: any) => p._id === msg.sender);
                const senderName = isMe ? "Me" : senderUser ? `${senderUser.firstName} ${senderUser.lastName}` : "Unknown";
                const avatar = senderUser?.avatarUrl || `https://ui-avatars.com/api/?name=${senderName}&background=random`;

                return (
                  <div key={msg._id} className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {!isMe && <img src={avatar} alt="User" className="w-6 h-6 rounded-full" />}
                      <span className="text-[11px] text-[#A0AEC0]">{formatTime(msg.createdAt)}</span>
                    </div>
                    <div className={`${isMe ? 'bg-[#d8d8fc] text-[#202127] rounded-br-none mr-2' : 'bg-[#eef2ff] text-[#202127] rounded-bl-none ml-2'} rounded-[8px] px-4 py-3 max-w-[70%] text-[13px] shadow-sm`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-3 bg-white border border-[#e2e8f0] rounded-[8px] p-2 w-full max-w-4xl mx-auto">
                <input 
                  type="text" 
                  placeholder="Type your message" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-transparent text-[14px] outline-none px-2"
                />
                <button 
                  onClick={handleSend}
                  disabled={sendMessageMutation.isPending}
                  className="bg-[#181C7B] hover:bg-[#11145a] text-white px-4 py-2 rounded-[6px] text-[13px] font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {sendMessageMutation.isPending ? "Sending..." : "Send"} <FiSend />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT SIDEBAR - GROUP INFO (Only visible for groups) */}
      {isGroup && (
        <div className="w-[300px] bg-white border-l border-[#e2e8f0] flex flex-col">
          <div className="h-[72px] border-b border-[#e2e8f0] flex items-center justify-between px-6 shrink-0">
            <h2 className="text-[14px] font-bold text-[#202127]">GROUP INFO</h2>
            <FiSettings className="text-[#3b82f6] cursor-pointer" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <img src="https://ui-avatars.com/api/?name=Course&background=random" alt="Cover" className="w-full h-[140px] object-cover rounded-[8px] mb-4" />
            <h3 className="text-[16px] font-bold text-[#181C7B] mb-2">{activeChat.course.title}</h3>
            <p className="text-[12px] text-[#717480] leading-relaxed mb-6">
              Official group chat for {activeChat.course.title}.
            </p>

            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[14px] font-bold text-[#202127] flex items-center gap-2">
                Participants
              </h4>
              <button className="text-[#181C7B] text-[12px] font-bold hover:underline">
                + Add Members
              </button>
            </div>

            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search by name or..." 
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] px-3 py-2 text-[12px] outline-none"
              />
            </div>

            <div className="space-y-4 mb-8">
              {activeChat.participants.map((p: any) => (
                <div key={p._id} className="flex items-center gap-3">
                  <img src={p.avatarUrl || `https://ui-avatars.com/api/?name=${p.firstName}+${p.lastName}&background=random`} className="w-8 h-8 rounded-full" alt="User" />
                  <div>
                    <p className="text-[13px] font-bold text-[#202127]">{p.firstName} {p.lastName}</p>
                    <p className="text-[10px] text-[#717480]">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[12px] font-bold text-[#A0AEC0] uppercase tracking-wider">Shared Media</h4>
              <button className="text-[#3b82f6] text-[11px] font-bold hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-gray-200 rounded-[6px] overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=media1" className="w-full h-full object-cover" alt="Media" />
              </div>
              <div className="aspect-square bg-gray-200 rounded-[6px] overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=media2" className="w-full h-full object-cover" alt="Media" />
              </div>
              <div className="aspect-square bg-gray-200 rounded-[6px] overflow-hidden relative">
                <img src="https://i.pravatar.cc/150?u=media3" className="w-full h-full object-cover opacity-50" alt="Media" />
                <div className="absolute inset-0 flex items-center justify-center text-white text-[12px] font-bold">+18</div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MessagesPage;
