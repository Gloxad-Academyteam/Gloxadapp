"use client";

import { FormEvent, useEffect, useState } from "react";
import { MdOutlineChatBubbleOutline, MdOutlineShare, MdOutlineThumbUp, MdThumbUp } from "react-icons/md";
import { LuPlus, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import CategoryImage from "@components/CategoryImage";
import useAuth from "@hooks/useAuth";
import LmsShell from "./components/LmsShell";
import { cardClass, inputClass, primaryButton } from "./components/ui";
import { CHANNELS, POSTS, TPost } from "./data";

const CHANNEL_LABEL = Object.fromEntries(CHANNELS.map((channel) => [channel.id, channel.label])) as Record<string, string>;

const CommunityPage = () => {
  const { authenticatedUser: user } = useAuth();
  const [channel, setChannel] = useState<string>("general");
  const [posts, setPosts] = useState<TPost[]>(POSTS);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "", channel: "general" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isComposerOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setIsComposerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isComposerOpen]);

  // "General" is the cohort-wide feed, so it shows every channel's posts
  const visible = channel === "general" ? posts : posts.filter((post) => post.channel === channel);

  const toggleLike = (id: string) => {
    const isLiked = !!liked[id];
    setLiked((state) => ({ ...state, [id]: !isLiked }));
    setPosts((list) => list.map((post) => (post.id === id ? { ...post, likes: post.likes + (isLiked ? -1 : 1) } : post)));
  };

  const share = async (post: TPost) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/lms/community#${post.id}`);
      toast.success("Link copied to clipboard.");
    } catch {
      toast.info("Copy the page address to share this post.");
    }
  };

  const publish = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.body.trim()) return setError("Add a title and a message.");
    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "You";
    setPosts((list) => [
      {
        id: `p${Date.now()}`,
        author: name,
        initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
        time: "Just now",
        channel: draft.channel as TPost["channel"],
        tag: draft.channel === "showcase" ? "Showcase" : "Discussion",
        title: draft.title.trim(),
        body: draft.body.trim(),
        likes: 0,
        replies: 0,
      },
      ...list,
    ]);
    setDraft({ title: "", body: "", channel: draft.channel });
    setError("");
    setIsComposerOpen(false);
    toast.success("Post published.");
  };

  return (
    <LmsShell active="community" search="Search community...">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-bold leading-tight text-[#1a1a7a] sm:text-[34px]">Community Forum</h1>
            <p className="mt-1.5 text-[15px] text-[#2a2c42]">Connect, discuss, and share with your cohort.</p>
          </div>
          <button type="button" onClick={() => setIsComposerOpen(true)} className={`${primaryButton} shadow-[0_12px_24px_-12px_rgba(2,0,96,0.8)]`}>
            <LuPlus size={16} /> New Post
          </button>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <nav aria-label="Channels" className={`${cardClass} p-4`}>
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#4a4d66]">Channels</p>
            <ul className="flex flex-col gap-1">
              {CHANNELS.map((item) => {
                const isActive = channel === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setChannel(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex w-full items-center justify-between gap-3 rounded-[6px] px-3 py-2.5 text-left text-[14px] transition-colors ${
                        isActive ? "bg-[#eceefd] font-bold text-[#1a1a7a]" : "text-[#2a2c42] hover:bg-[#f3f1fb]"
                      }`}
                    >
                      <span># {item.label}</span>
                      {"count" in item && item.count ? <span className="rounded-full bg-[#dedcf0] px-2 py-0.5 text-[11px] font-medium">{item.count}</span> : null}
                      {"isNew" in item && item.isNew ? <span className="rounded-full bg-[#fde8e8] px-2 py-0.5 text-[11px] font-medium text-[#c62828]">New</span> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-col gap-5">
            {visible.map((post) => (
              <article key={post.id} id={post.id} className={`${cardClass} p-5 sm:p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className={`relative flex h-[50px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] text-[16px] font-bold ${post.instructor ? "bg-[#d3e8f8] text-[#1a1a7a]" : "bg-[#e7e8fb] text-[#1a1a7a]"}`}>
                      {post.initials}
                      {post.image && (
                        <span className="absolute inset-0">
                          <CategoryImage src={post.image} className="h-full w-full object-cover" fallback={null} />
                        </span>
                      )}
                    </span>
                    <div>
                      <p className="flex flex-wrap items-center gap-2 text-[15px] font-bold text-[#1a1a7a]">
                        {post.author}
                        {post.instructor && <span className="rounded-[3px] bg-[#1a1a7a] px-2 py-0.5 text-[11px] font-medium text-white">Instructor</span>}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#4a4d66]">
                        {post.time} in <span className="font-medium text-[#00658f]">#{CHANNEL_LABEL[post.channel]}</span>
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-[4px] bg-[#dce6fa] px-3 py-1 text-[11px] font-medium text-[#1a1a7a]">{post.tag}</span>
                </div>
                <h2 className="mt-4 text-[20px] font-medium leading-snug text-[#14162b]">{post.title}</h2>
                <p className="mt-2 max-w-[640px] text-[15px] leading-[1.7] text-[#4a4d66]">{post.body}</p>
                <div className="mt-4 flex items-center justify-between gap-4 text-[14px] text-[#4a4d66]">
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      aria-pressed={!!liked[post.id]}
                      aria-label={`Like post, ${post.likes} likes`}
                      className={`flex items-center gap-1.5 transition-colors hover:text-[#1a1a7a] ${liked[post.id] ? "font-bold text-[#1a1a7a]" : ""}`}
                    >
                      {liked[post.id] ? <MdThumbUp size={18} /> : <MdOutlineThumbUp size={18} />} {post.likes}
                    </button>
                    <button type="button" onClick={() => toast.info("Threaded replies are coming soon.")} className="flex items-center gap-1.5 transition-colors hover:text-[#1a1a7a]">
                      <MdOutlineChatBubbleOutline size={17} /> {post.replies} Replies
                    </button>
                  </div>
                  <button type="button" onClick={() => share(post)} className="flex items-center gap-1.5 transition-colors hover:text-[#1a1a7a]">
                    <MdOutlineShare size={17} /> Share
                  </button>
                </div>
              </article>
            ))}
            {!visible.length && <p className={`${cardClass} p-10 text-center text-[14px] text-[#4a4d66]`}>No posts in this channel yet. Be the first to start a conversation.</p>}
          </div>
        </div>
      </div>

      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0a2a]/50 p-4 backdrop-blur-sm" onClick={() => setIsComposerOpen(false)}>
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-post-title"
            onSubmit={publish}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[520px] rounded-[16px] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 id="new-post-title" className="text-[22px] font-bold text-[#1a1a7a]">New Post</h2>
              <button type="button" aria-label="Close" onClick={() => setIsComposerOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f3f1fb]">
                <LuX size={20} />
              </button>
            </div>
            <label htmlFor="post-channel" className="mt-5 block text-[13px] font-medium text-[#2a2c42]">Channel</label>
            <select id="post-channel" value={draft.channel} onChange={(event) => setDraft({ ...draft, channel: event.target.value })} className={`${inputClass} mt-1.5`}>
              {CHANNELS.map((item) => (
                <option key={item.id} value={item.id}># {item.label}</option>
              ))}
            </select>
            <label htmlFor="post-title" className="mt-4 block text-[13px] font-medium text-[#2a2c42]">Title</label>
            <input id="post-title" autoFocus value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="What's on your mind?" className={`${inputClass} mt-1.5`} />
            <label htmlFor="post-body" className="mt-4 block text-[13px] font-medium text-[#2a2c42]">Message</label>
            <textarea id="post-body" rows={5} value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} placeholder="Share details with your cohort..." className={`${inputClass} mt-1.5 resize-y`} />
            {error && <p role="alert" className="mt-2 text-[13px] text-[#c62828]">{error}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setIsComposerOpen(false)} className="rounded-[8px] px-4 py-2.5 text-[14px] font-medium text-[#2a2c42] hover:bg-[#f3f1fb]">Cancel</button>
              <button type="submit" className={primaryButton}>Publish</button>
            </div>
          </form>
        </div>
      )}
    </LmsShell>
  );
};

export default CommunityPage;
