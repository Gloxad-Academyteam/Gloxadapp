"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { io, Socket } from "socket.io-client";
import { MdOutlineBackHand, MdOutlineOndemandVideo, MdOutlineSend } from "react-icons/md";
import { LuMenu } from "react-icons/lu";
import { toast } from "react-toastify";
import { lmsApi, TLiveMessage, TLiveSession, TRoomCredentials } from "@services/lms";
import LmsShell from "./components/LmsShell";
import LiveRoomStage, { TRoomPerson } from "./components/LiveRoomStage";
import LiveClassPreview from "./LiveClassPreview";
import useDemoMode from "./useDemoMode";

type TTab = "chat" | "polls" | "people";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gloxard-backend.onrender.com";

const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const dateLabel = (iso: string) => new Date(iso).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const errorText = (error: unknown, fallback: string) => (error as AxiosError<{ error?: string }>)?.response?.data?.error ?? fallback;
const instructorName = (session: TLiveSession) => (typeof session.instructor === "object" ? session.instructor.name : "Tutor");

const countdownLabel = (target: number, now: number) => {
  const seconds = Math.max(0, Math.floor((target - now) / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
};

type TChannelHandlers = { onPoll: () => void; onEnded: () => void };

/** The class's real-time channel: chat, raised hands, new polls and the end of the class. */
const useLiveChannel = (sessionId: string | undefined, active: boolean, handlers: TChannelHandlers) => {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const [live, setLive] = useState<TLiveMessage[]>([]);
  const [hands, setHands] = useState<Record<string, string>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!sessionId || !active) return undefined;
    const socket = io(`${SOCKET_URL}/live`, { auth: { token: localStorage.getItem("token") }, transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.on("connect", () => {
      setConnected(true);
      socket.emit("session:join", { sessionId });
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("chat:message", (message: { _id: string; authorId: string; authorName: string; text: string; createdAt: string }) =>
      setLive((current) => (current.some((item) => item._id === message._id) ? current : [...current, { _id: message._id, system: false, text: message.text, author: { _id: message.authorId, name: message.authorName }, createdAt: message.createdAt }]))
    );
    socket.on("hand:raise", (data: { userId: string; name: string }) => setHands((current) => ({ ...current, [data.userId]: data.name })));
    socket.on("hand:lower", (data: { userId: string }) =>
      setHands((current) => {
        const { [data.userId]: _removed, ...rest } = current;
        return rest;
      })
    );
    socket.on("poll:launched", () => handlersRef.current.onPoll());
    socket.on("poll:closed", () => handlersRef.current.onPoll());
    socket.on("session:ended", () => handlersRef.current.onEnded());
    return () => {
      socket.emit("session:leave", { sessionId });
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
      setLive([]);
      setHands({});
    };
  }, [sessionId, active]);

  const send = useCallback((text: string) => socketRef.current?.emit("chat:message", { sessionId, text }), [sessionId]);
  const hand = useCallback((raised: boolean) => socketRef.current?.emit(raised ? "hand:raise" : "hand:lower", { sessionId }), [sessionId]);
  return { live, hands, connected, send, hand };
};

const LiveClassPage = () => {
  const demo = useDemoMode();
  if (demo === null) return null;
  return demo ? <LiveClassPreview /> : <LiveClassLive />;
};

const LiveClassLive = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TTab>("chat");
  const [text, setText] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState("");
  const [credentials, setCredentials] = useState<TRoomCredentials | null>(null);
  const [people, setPeople] = useState<TRoomPerson[]>([]);
  const [handUp, setHandUp] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const meQuery = useQuery({ queryKey: ["lms", "me"], queryFn: lmsApi.me });
  const activeCohort = meQuery.data?.cohorts.find((cohort) => cohort._id === meQuery.data?.activeCohortId) ?? meQuery.data?.cohorts[0];
  const cohortId = activeCohort?._id;
  const isTeacher = activeCohort?.role === "instructor" || activeCohort?.role === "admin";

  const sessionsQuery = useQuery({ queryKey: ["lms", "live-sessions", cohortId], queryFn: () => lmsApi.liveSessions(cohortId), enabled: Boolean(cohortId), refetchInterval: 20000 });

  // The class to show: whatever is live, else the next one coming up, else the most recent
  const session = useMemo(() => {
    const list = sessionsQuery.data ?? [];
    return (
      list.find((item) => item.status === "live") ??
      list.filter((item) => item.status === "scheduled").sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))[0] ??
      list.filter((item) => item.status === "ended").sort((a, b) => +new Date(b.startsAt) - +new Date(a.startsAt))[0]
    );
  }, [sessionsQuery.data]);
  const sessionId = session?._id;

  const detailQuery = useQuery({ queryKey: ["lms", "live-session", sessionId], queryFn: () => lmsApi.liveSession(sessionId as string), enabled: Boolean(sessionId), refetchInterval: credentials ? 30000 : 10000 });
  const detail = detailQuery.data ?? session;
  const joined = Boolean(credentials);

  const refreshAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["lms", "live-sessions"] });
    queryClient.invalidateQueries({ queryKey: ["lms", "live-session", sessionId] });
  }, [queryClient, sessionId]);

  const leaveRoom = useCallback(() => {
    if (sessionId && credentials) void lmsApi.leave(sessionId).catch(() => undefined);
    setCredentials(null);
    setPeople([]);
    setHandUp(false);
  }, [sessionId, credentials]);

  const channel = useLiveChannel(sessionId, joined, {
    onPoll: () => queryClient.invalidateQueries({ queryKey: ["lms", "live-session", sessionId] }),
    onEnded: () => {
      toast.info("The class has ended.");
      leaveRoom();
      refreshAll();
    },
  });

  const historyQuery = useQuery({ queryKey: ["lms", "live-chat", sessionId], queryFn: () => lmsApi.chat(sessionId as string), enabled: Boolean(sessionId) && joined });
  const messages = useMemo(() => {
    const history = historyQuery.data ?? [];
    const seen = new Set(history.map((item) => item._id));
    return [...history, ...channel.live.filter((item) => !seen.has(item._id))];
  }, [historyQuery.data, channel.live]);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length, tab]);

  const fail = (fallback: string) => (error: unknown) => toast.error(errorText(error, fallback));
  const join = useMutation({ mutationFn: () => lmsApi.join(sessionId as string), onSuccess: (result) => setCredentials(result), onError: fail("Could not join the class.") });
  const vote = useMutation({
    mutationFn: ({ pollId, option }: { pollId: string; option: number }) => lmsApi.vote(pollId, option),
    onSuccess: () => {
      toast.success("Your vote was recorded.");
      refreshAll();
    },
    onError: fail("Could not record your vote."),
  });
  const createPoll = useMutation({
    mutationFn: () => lmsApi.createPoll(sessionId as string, pollQuestion.trim(), pollOptions.split("\n").map((line) => line.trim()).filter(Boolean)),
    onSuccess: () => {
      toast.success("Poll launched.");
      setPollQuestion("");
      setPollOptions("");
      refreshAll();
    },
    onError: fail("Could not launch the poll."),
  });
  const closePoll = useMutation({ mutationFn: (pollId: string) => lmsApi.closePoll(pollId), onSuccess: refreshAll, onError: fail("Could not close the poll.") });
  const end = useMutation({
    mutationFn: () => lmsApi.endSession(sessionId as string),
    onSuccess: () => {
      toast.success("The class has ended.");
      leaveRoom();
      refreshAll();
    },
    onError: fail("Could not end the class."),
  });

  const submitChat = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim() || !channel.connected) return;
    channel.send(text.trim());
    setText("");
  };
  const toggleHand = () => {
    channel.hand(!handUp);
    setHandUp((value) => !value);
  };

  const status = detail?.status;
  const isLive = status === "live";
  const startsAt = detail ? new Date(detail.startsAt).getTime() : 0;
  const mayEnter = Boolean(detail && status !== "ended" && (isTeacher || detail.canJoin));
  const polls = detailQuery.data?.polls ?? [];
  const raised = Object.values(channel.hands);

  const topBar = (openMenu: () => void) => (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between gap-3 border-b border-[#dedcec] bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" aria-label="Open navigation" onClick={openMenu} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-[#eceefd] lg:hidden">
          <LuMenu size={24} />
        </button>
        {isLive ? (
          <span className="flex shrink-0 items-center gap-2 rounded-full bg-[#fde8e8] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#c62828]">
            <span className="h-2 w-2 rounded-full bg-[#d62828]" /> Live Now
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-[#e7e8fb] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#1a1a7a]">{status === "ended" ? "Ended" : "Upcoming"}</span>
        )}
        <h1 className="truncate text-[15px] font-medium text-[#14162b] sm:text-[20px]">{detail?.title ?? "Live Class"}</h1>
      </div>
      {isTeacher && detail && status !== "ended" && joined && (
        <button type="button" disabled={end.isPending} onClick={() => end.mutate()} className="shrink-0 rounded-[4px] bg-[#d62828] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#b81f1f] disabled:opacity-60">
          End class for everyone
        </button>
      )}
    </header>
  );

  const renderStage = () => {
    if (!detail) return null;
    if (joined && credentials) return <LiveRoomStage credentials={credentials} onLeave={leaveRoom} onPeople={setPeople} />;
    return (
      <div className="relative flex aspect-video flex-col items-center justify-center gap-3 overflow-hidden rounded-[18px] bg-[#1b2230] px-6 text-center text-white shadow-[0_20px_50px_-24px_rgba(20,20,80,0.5)]">
        <MdOutlineOndemandVideo size={44} className="text-white/70" aria-hidden />
        {status === "ended" ? (
          <>
            <p className="text-[18px] font-bold">This class has ended</p>
            <p className="max-w-[420px] text-[14px] text-white/75">{detail.title} was held on {dateLabel(detail.startsAt)}.</p>
          </>
        ) : mayEnter ? (
          <>
            <p className="text-[18px] font-bold">{isLive ? "The class is live" : "The class is about to start"}</p>
            <p className="max-w-[420px] text-[14px] text-white/75">{isTeacher ? "Join to start teaching. Your camera and microphone stay off until you turn them on." : "Join to watch and take part. Your camera and microphone stay off."}</p>
            <button type="button" disabled={join.isPending} onClick={() => join.mutate()} className="mt-1 rounded-full bg-[#FF5A5F] px-8 py-3 text-[15px] font-bold text-white transition hover:bg-[#f0444a] disabled:opacity-60">
              {join.isPending ? "Joining..." : isTeacher ? "Start and join" : "Join class"}
            </button>
          </>
        ) : (
          <>
            <p className="text-[18px] font-bold">This class has not started yet</p>
            <p className="max-w-[420px] text-[14px] text-white/75">Starts {dateLabel(detail.startsAt)}. Joining opens in {countdownLabel(startsAt - 10 * 60 * 1000, now)}, 10 minutes before the start.</p>
            <span className="rounded-full bg-white/15 px-6 py-2.5 text-[14px] font-semibold text-white/80">Join opens 10 minutes before</span>
          </>
        )}
      </div>
    );
  };

  const tabButton = (key: TTab, label: string) => (
    <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`flex-1 px-3 py-3 text-[13px] font-medium transition-colors ${tab === key ? "border-b-2 border-[#020060] text-[#020060]" : "text-[#4a4d66] hover:text-[#14162b]"}`}>
      {label}
    </button>
  );

  return (
    <LmsShell active="live" topBar={topBar} showUser flush>
      <div className="grid min-h-[calc(100vh-68px)] lg:grid-cols-[minmax(0,1fr)_380px]">
        <section aria-label="Class video" className="min-w-0 p-4 sm:p-6">
          {meQuery.isLoading || sessionsQuery.isLoading ? (
            <p className="py-24 text-center text-[14px] text-[#4a4d66]">Loading your live classes...</p>
          ) : meQuery.isError ? (
            <Empty title="We couldn't load your classes" text={errorText(meQuery.error, "Check your connection and refresh the page.")} />
          ) : !cohortId ? (
            <Empty title="You're not in a trimester cohort yet" text="Once you're added to a cohort, your live classes show up here." />
          ) : !detail ? (
            <Empty title="No live classes scheduled" text="Your tutor hasn't scheduled a class yet. Check back soon." />
          ) : (
            <>
              {renderStage()}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-bold text-[#14162b]">{detail.title}</h2>
                  <p className="mt-0.5 text-[13px] text-[#4a4d66]">
                    {instructorName(detail)} &bull; {dateLabel(detail.startsAt)} - {timeLabel(detail.endsAt)}
                  </p>
                </div>
                {joined && !isTeacher && (
                  <button type="button" onClick={toggleHand} aria-pressed={handUp} className={`inline-flex items-center gap-2 rounded-[6px] border px-3 py-2.5 text-[13px] font-medium ${handUp ? "border-[#d9a400] bg-[#fff6d6] text-[#7a5b00]" : "border-[#c9c8dc] bg-white text-[#1b1d33] hover:bg-[#f3f2fb]"}`}>
                    <MdOutlineBackHand size={18} aria-hidden /> {handUp ? "Lower hand" : "Raise hand"}
                  </button>
                )}
              </div>
              {detail.description && <p className="mt-3 max-w-[720px] text-[14px] leading-relaxed text-[#2a2c42]">{detail.description}</p>}
              <p className="mt-4 text-[13px] text-[#6a6d83]">
                <Link href="/lms/curriculum" className="font-medium text-[#1a1a7a] hover:underline">Back to the weekly path</Link>
              </p>
            </>
          )}
        </section>

        <aside aria-label="Class tools" className="flex min-h-[420px] flex-col border-t border-[#dedcec] bg-white lg:border-l lg:border-t-0">
          <div role="tablist" aria-label="Class tools" className="flex border-b border-[#dedcec]">
            {tabButton("chat", "Chat")}
            {tabButton("polls", `Polls${polls.some((poll) => poll.isOpen) ? " •" : ""}`)}
            {tabButton("people", `People${people.length ? ` (${people.length})` : ""}`)}
          </div>

          {tab === "chat" && (
            <>
              <div ref={listRef} role="log" aria-live="polite" className="flex-1 overflow-y-auto p-4">
                {!joined ? (
                  <p className="text-[13.5px] text-[#4a4d66]">Join the class to read and send messages.</p>
                ) : messages.length === 0 ? (
                  <p className="text-[13.5px] text-[#4a4d66]">No messages yet. Say hello.</p>
                ) : (
                  messages.map((message) => (
                    <div key={message._id} className="mb-3 text-[13.5px]">
                      <b className="text-[#14162b]">{message.author?.name ?? "Someone"}</b> <span className="text-[11px] text-[#6a6d83]">{timeLabel(message.createdAt)}</span>
                      <p className="mt-0.5 break-words text-[#2a2c42]">{message.text}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={submitChat} className="flex gap-2 border-t border-[#dedcec] p-3">
                <input value={text} onChange={(event) => setText(event.target.value)} disabled={!joined || !channel.connected} maxLength={500} placeholder={joined ? (channel.connected ? "Type a message" : "Connecting chat...") : "Join to chat"} aria-label="Message" className="min-w-0 flex-1 rounded-full border border-[#c9c8dc] px-4 py-2.5 text-[14px] outline-none focus:border-[#020060] disabled:bg-[#f4f4fa]" />
                <button type="submit" disabled={!joined || !channel.connected || !text.trim()} aria-label="Send message" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#020060] text-white disabled:opacity-40">
                  <MdOutlineSend size={18} />
                </button>
              </form>
            </>
          )}

          {tab === "polls" && (
            <div className="flex-1 overflow-y-auto p-4">
              {isTeacher && joined && (
                <form onSubmit={(event) => { event.preventDefault(); createPoll.mutate(); }} className="mb-5 rounded-[12px] bg-[#f4f4fa] p-3">
                  <input value={pollQuestion} onChange={(event) => setPollQuestion(event.target.value)} placeholder="Ask a question" aria-label="Poll question" className="mb-2 w-full rounded-[8px] border border-[#c9c8dc] px-3 py-2 text-[13.5px]" />
                  <textarea value={pollOptions} onChange={(event) => setPollOptions(event.target.value)} placeholder={"One answer per line\nAt least two"} aria-label="Poll answers" rows={3} className="w-full rounded-[8px] border border-[#c9c8dc] px-3 py-2 text-[13.5px]" />
                  <button type="submit" disabled={createPoll.isPending || !pollQuestion.trim() || pollOptions.split("\n").filter((line) => line.trim()).length < 2} className="mt-2 rounded-full bg-[#020060] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50">Launch poll</button>
                </form>
              )}
              {polls.length === 0 ? (
                <p className="text-[13.5px] text-[#4a4d66]">No polls yet.</p>
              ) : (
                [...polls].reverse().map((poll) => (
                  <div key={poll._id} className="mb-4 rounded-[12px] border border-[#dedcec] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <b className="text-[14px] text-[#14162b]">{poll.question}</b>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${poll.isOpen ? "bg-[#e6f6ec] text-[#15803d]" : "bg-[#eef1f8] text-[#52607A]"}`}>{poll.isOpen ? "Open" : "Closed"}</span>
                    </div>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {poll.options.map((option) => {
                        const percent = poll.totalVotes ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                        const canVote = poll.isOpen && poll.myVote === null && joined && !isTeacher;
                        return (
                          <li key={option.index}>
                            <button type="button" disabled={!canVote || vote.isPending} onClick={() => vote.mutate({ pollId: poll._id, option: option.index })} className={`relative w-full overflow-hidden rounded-[8px] border px-3 py-2 text-left text-[13px] ${poll.myVote === option.index ? "border-[#020060]" : "border-[#dedcec]"} ${canVote ? "hover:bg-[#f4f4fa]" : "cursor-default"}`}>
                              <span aria-hidden className="absolute inset-y-0 left-0 bg-[#e3e6fb]" style={{ width: `${percent}%` }} />
                              <span className="relative flex justify-between gap-2"><span>{option.text}</span><span className="text-[#4a4d66]">{poll.myVote !== null || !poll.isOpen || isTeacher ? `${percent}%` : ""}</span></span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="mt-2 text-[11.5px] text-[#6a6d83]">{poll.totalVotes} {poll.totalVotes === 1 ? "vote" : "votes"}{poll.myVote !== null ? " · you voted" : ""}</p>
                    {isTeacher && poll.isOpen && (
                      <button type="button" disabled={closePoll.isPending} onClick={() => closePoll.mutate(poll._id)} className="mt-2 rounded-full border border-[#c9c8dc] px-3 py-1 text-[12px] font-medium text-[#14162b] hover:bg-[#f4f4fa]">Close poll</button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "people" && (
            <div className="flex-1 overflow-y-auto p-4">
              {!joined ? (
                <p className="text-[13.5px] text-[#4a4d66]">Join the class to see who is in the room.</p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {people.map((person) => (
                    <li key={person.identity} className="flex items-center justify-between gap-2 text-[13.5px]">
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#020060] text-[11px] font-bold text-white">{person.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}</span>
                        <span>{person.name}{person.isYou ? " (you)" : ""}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[11.5px] text-[#6a6d83]">
                        {raised.includes(person.name) && <MdOutlineBackHand aria-label="Hand raised" className="text-[#d9a400]" size={16} />}
                        {person.canPublish ? "Tutor" : "Student"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </aside>
      </div>
    </LmsShell>
  );
};

const Empty = ({ title, text }: { title: string; text: string }) => (
  <div className="mx-auto max-w-[460px] py-24 text-center">
    <h2 className="text-[20px] font-bold text-[#14162b]">{title}</h2>
    <p className="mt-2 text-[14px] text-[#4a4d66]">{text}</p>
    <Link href="/lms" className="mt-5 inline-block rounded-[6px] bg-[#020060] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#10107a]">Back to dashboard</Link>
  </div>
);

export default LiveClassPage;
