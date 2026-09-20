"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaPaperPlane, FaCircle } from "react-icons/fa";
import axiosInstance from "@utils/axiosInstance";
import { useSocket } from "@hooks/useSocket";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";

interface IConversation {
  _id: string;
  participants: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    role: string;
  }>;
  course?: { title: string };
  lastMessageAt: string;
}

interface IMessage {
  _id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: string;
  isRead?: boolean;
}

export default function MessagesPage() {
  const { authenticatedUser } = useAuth();
  const socket = useSocket();

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevConvRef = useRef<string | null>(null);

  // ── Fetch conversations ──────────────────────────────────────────────
  useEffect(() => {
    axiosInstance
      .get("/messages/conversations")
      .then((res) => {
        setConversations(res.data.conversations || []);
        if (res.data.conversations?.length > 0 && !activeConvId) {
          setActiveConvId(res.data.conversations[0]._id);
        }
      })
      .catch(() => toast.error("Failed to load conversations"))
      .finally(() => setIsLoadingConvs(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch messages when active conversation changes ──────────────────
  useEffect(() => {
    if (!activeConvId) return;

    // Leave previous conversation room
    if (prevConvRef.current && socket) {
      socket.emit("leave_conversation", prevConvRef.current);
    }
    prevConvRef.current = activeConvId;

    setIsLoadingMsgs(true);
    axiosInstance
      .get(`/messages/${activeConvId}`)
      .then((res) => {
        setMessages(res.data.messages || []);
      })
      .catch(() => toast.error("Failed to load messages"))
      .finally(() => setIsLoadingMsgs(false));

    // Join the conversation room for typing indicators
    if (socket) {
      socket.emit("join_conversation", activeConvId);
    }
  }, [activeConvId, socket]);

  // ── Socket.io real-time listeners ───────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ conversationId, message }: { conversationId: string; message: IMessage }) => {
      if (conversationId === activeConvId) {
        setMessages((prev) => {
          // Avoid duplicates (our own optimistic update already added it)
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
      // Bump conversation to top of list
      setConversations((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((c) => c._id === conversationId);
        if (idx > -1) {
          updated[idx] = { ...updated[idx], lastMessageAt: new Date().toISOString() };
          const [conv] = updated.splice(idx, 1);
          updated.unshift(conv);
        }
        return updated;
      });
    };

    const handleUserTyping = ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => new Set(prev).add(userId));
    };

    const handleUserStopTyping = ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [socket, activeConvId]);

  // ── Auto-scroll to bottom ────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // ── Send message ─────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!messageText.trim() || !activeConvId || isSending) return;

    const text = messageText.trim();
    setMessageText("");
    setIsSending(true);

    // Optimistic update
    const optimistic: IMessage = {
      _id: `optimistic_${Date.now()}`,
      conversation: activeConvId,
      sender: authenticatedUser?._id || "",
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    // Stop typing
    if (socket) socket.emit("stop_typing", { conversationId: activeConvId, userId: authenticatedUser?._id });

    try {
      await axiosInstance.post(`/messages/${activeConvId}`, { text });
    } catch {
      toast.error("Failed to send message");
      // Revert optimistic
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      setMessageText(text);
    } finally {
      setIsSending(false);
    }
  }, [messageText, activeConvId, isSending, socket, authenticatedUser]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Typing indicator ─────────────────────────────────────────────────
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    if (!socket || !activeConvId) return;
    socket.emit("typing", { conversationId: activeConvId, userId: authenticatedUser?._id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { conversationId: activeConvId, userId: authenticatedUser?._id });
    }, 2000);
  };

  // ── Helpers ──────────────────────────────────────────────────────────
  const getOtherParticipant = (conv: IConversation) =>
    conv.participants.find((p) => p._id !== authenticatedUser?._id);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatConvTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return formatTime(dateStr);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  const filteredConvs = conversations.filter((c) => {
    const other = getOtherParticipant(c);
    const name = other ? `${other.firstName} ${other.lastName}` : c.course?.title || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeConv = conversations.find((c) => c._id === activeConvId);
  const activeOther = activeConv ? getOtherParticipant(activeConv) : null;

  return (
    <div className="flex flex-col h-full bg-[#fcfcfd] p-6 lg:p-10 text-[#202127]">
      <div className="mb-10 shrink-0">
        <h1 className="text-[28px] font-bold">Messages</h1>
        <p className="text-[14px] text-[#717480]">Manage your communications and student interactions.</p>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-[#e2e8f0] rounded-[20px] shadow-sm overflow-hidden flex">

          {/* ── Left Sidebar ─────────────────────────────────── */}
          <div className="w-[300px] shrink-0 border-r border-[#e2e8f0] flex flex-col">
            <div className="p-6 pb-4">
              <h2 className="text-[20px] font-bold text-[#202127] mb-4">Messages</h2>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aab8] text-[12px]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations"
                  className="w-full h-[42px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] pl-10 pr-4 text-[13px] outline-none focus:border-[#cbd5e1] transition-colors placeholder:text-[#a0aab8]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-4">
              {isLoadingConvs ? (
                <div className="p-6 text-center text-[13px] text-[#717480]">Loading...</div>
              ) : filteredConvs.length === 0 ? (
                <div className="p-6 text-center text-[13px] text-[#717480]">No conversations yet.</div>
              ) : (
                filteredConvs.map((conv) => {
                  const other = getOtherParticipant(conv);
                  const name = other ? `${other.firstName} ${other.lastName}` : conv.course?.title || "Conversation";
                  const avatarUrl = other?.avatarUrl || `https://i.pravatar.cc/150?u=${other?._id}`;
                  const isActive = conv._id === activeConvId;

                  return (
                    <div
                      key={conv._id}
                      onClick={() => setActiveConvId(conv._id)}
                      className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition-colors ${
                        isActive ? "bg-[#e0f2fe]" : "hover:bg-[#f8fafc]"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img src={avatarUrl} alt={name} className="w-[42px] h-[42px] rounded-full object-cover" />
                        {other?.role === "instructor" && (
                          <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-[#22c55e] border-[2px] border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="text-[13px] font-bold text-[#202127] truncate pr-2">{name}</h4>
                          <span className="text-[11px] text-[#a0aab8] whitespace-nowrap">
                            {formatConvTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#717480] truncate">
                          {other?.role === "instructor" ? "Instructor" : "Student"}
                          {conv.course ? ` · ${conv.course.title}` : ""}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Right Chat Area ───────────────────────────────── */}
          <div className="flex-1 flex flex-col bg-white">
            {!activeConvId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                <div className="w-16 h-16 rounded-full bg-[#e0f2fe] flex items-center justify-center mb-4">
                  <FaPaperPlane className="text-[#3e92cc] text-[24px]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#202127] mb-2">Start a conversation</h3>
                <p className="text-[14px] text-[#717480]">Select a conversation from the list to begin messaging.</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="h-[72px] border-b border-[#e2e8f0] px-6 flex items-center gap-4 shrink-0">
                  {activeOther ? (
                    <>
                      <div className="relative">
                        <img
                          src={activeOther.avatarUrl || `https://i.pravatar.cc/150?u=${activeOther._id}`}
                          alt={`${activeOther.firstName} ${activeOther.lastName}`}
                          className="w-[44px] h-[44px] rounded-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-[#22c55e] border-[2px] border-white rounded-full" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-[#202127]">
                          {activeOther.firstName} {activeOther.lastName}
                        </h3>
                        <p className="text-[12px] text-[#22c55e] flex items-center gap-1.5">
                          <FaCircle className="text-[8px]" /> Online
                        </p>
                      </div>
                    </>
                  ) : (
                    <h3 className="text-[15px] font-bold text-[#202127]">
                      {activeConv?.course?.title || "Conversation"}
                    </h3>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                  <div className="flex justify-center mb-2">
                    <span className="bg-[#f1f5f9] text-[#4e515c] text-[11px] font-bold px-4 py-1.5 rounded-[6px]">
                      Today
                    </span>
                  </div>

                  {isLoadingMsgs ? (
                    <div className="flex-1 flex items-center justify-center text-[#717480]">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-[#717480] text-[14px]">
                      No messages yet. Say hello! 👋
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender === authenticatedUser?._id;
                      return (
                        <div
                          key={msg._id}
                          className={`flex gap-3 max-w-[72%] ${isMe ? "self-end flex-row-reverse" : "self-start"}`}
                        >
                          {!isMe && activeOther && (
                            <img
                              src={activeOther.avatarUrl || `https://i.pravatar.cc/150?u=${activeOther._id}`}
                              alt="avatar"
                              className="w-[30px] h-[30px] rounded-full object-cover shrink-0 mt-5"
                            />
                          )}
                          <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <span className="text-[10px] text-[#a0aab8] mb-1 px-1">
                              {formatTime(msg.createdAt)}
                            </span>
                            <div
                              className={`px-4 py-3 rounded-[10px] text-[13px] leading-[1.6] max-w-full break-words ${
                                isMe
                                  ? "bg-[#3e92cc] text-white rounded-tr-none"
                                  : "bg-[#f1f5f9] text-[#4e515c] rounded-tl-none"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Typing indicator */}
                  {typingUsers.size > 0 && (
                    <div className="self-start flex items-center gap-2 px-4 py-3 bg-[#f1f5f9] rounded-[10px] rounded-tl-none max-w-[100px]">
                      <span className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-[6px] h-[6px] bg-[#a0aab8] rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="p-5 pt-2 shrink-0 border-t border-[#e2e8f0]">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={handleTyping}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message…"
                      className="flex-1 h-[46px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-5 text-[14px] outline-none focus:border-[#3e92cc] transition-colors"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!messageText.trim() || isSending}
                      className="h-[46px] px-6 bg-[#3e92cc] text-white rounded-[8px] hover:bg-[#327bb0] transition-colors flex items-center gap-2 font-bold text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send <FaPaperPlane className="text-[12px]" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
    </div>
  );
}
