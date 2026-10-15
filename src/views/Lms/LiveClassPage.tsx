"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MdCallEnd, MdOutlineBackHand, MdOutlineOndemandVideo, MdOutlineSend } from "react-icons/md";
import { LuMenu } from "react-icons/lu";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import { lmsApi, TLiveSession, TStream } from "@services/lms";
import LmsShell from "./components/LmsShell";
import SharedCodePanel from "./components/SharedCodePanel";
import LiveClassPreview from "./LiveClassPreview";
import useDemoMode from "./useDemoMode";

type TTab = "chat" | "polls" | "code" | "people";

const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const dateLabel = (iso: string) => new Date(iso).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const errorText = (error: unknown, fallback: string) => (error as AxiosError<{ error?: string }>)?.response?.data?.error ?? fallback;
const instructorName = (session: TLiveSession) => (typeof session.instructor === "object" ? session.instructor.name : "Instructor");

const countdownLabel = (target: number, now: number) => {
  const seconds = Math.max(0, Math.floor((target - now) / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
};

const LiveClassPage = () => {
  const demo = useDemoMode();
  if (demo === null) return null;
  return demo ? <LiveClassPreview /> : <LiveClassLive />;
};

const LiveClassLive = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { authenticatedUser: user } = useAuth();
  const [tab, setTab] = useState<TTab>("chat");
  const [text, setText] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [streamLink, setStreamLink] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const meQuery = useQuery({ queryKey: ["lms", "me"], queryFn: lmsApi.me });
  const activeCohort = meQuery.data?.cohorts.find((cohort) => cohort._id === meQuery.data?.activeCohortId) ?? meQuery.data?.cohorts[0];
  const cohortId = activeCohort?._id;
  const isTeacher = activeCohort?.role === "instructor" || activeCohort?.role === "admin";

  const sessionsQuery = useQuery({
    queryKey: ["lms", "live-sessions", cohortId],
    queryFn: () => lmsApi.liveSessions(cohortId),
    enabled: Boolean(cohortId),
    refetchInterval: 20000,
  });

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

  const detailQuery = useQuery({
    queryKey: ["lms", "live-session", sessionId],
    queryFn: () => lmsApi.liveSession(sessionId as string),
    enabled: Boolean(sessionId),
    refetchInterval: 8000,
  });
  const detail = detailQuery.data ?? session;

  const joinable = Boolean(session?.canJoin);
  const streamQuery = useQuery<TStream>({
    queryKey: ["lms", "live-stream", sessionId, session?.status, session?.hasStream],
    queryFn: () => lmsApi.join(sessionId as string),
    enabled: Boolean(sessionId) && joinable,
    staleTime: 60000,
    refetchInterval: (query) => (query.state.data?.configured ? false : 15000),
  });
  const stream = streamQuery.data;

  const chatQuery = useQuery({
    queryKey: ["lms", "live-chat", sessionId],
    queryFn: () => lmsApi.chat(sessionId as string),
    enabled: Boolean(sessionId) && joinable,
    refetchInterval: 4000,
  });
  const peopleQuery = useQuery({
    queryKey: ["lms", "live-people", sessionId],
    queryFn: () => lmsApi.people(sessionId as string),
    enabled: Boolean(sessionId) && joinable && tab === "people",
    refetchInterval: 15000,
  });

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["lms", "live-sessions"] });
    queryClient.invalidateQueries({ queryKey: ["lms", "live-session", sessionId] });
    queryClient.invalidateQueries({ queryKey: ["lms", "live-stream"] });
  };
  const fail = (fallback: string) => (error: unknown) => toast.error(errorText(error, fallback));

  const send = useMutation({
    mutationFn: (value: string) => lmsApi.sendChat(sessionId as string, value),
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["lms", "live-chat", sessionId] });
    },
    onError: fail("Could not send your message."),
  });
  const hand = useMutation({
    mutationFn: () => lmsApi.toggleHand(sessionId as string),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lms", "live-session", sessionId] }),
    onError: fail("Could not update your hand."),
  });
  const vote = useMutation({
    mutationFn: ({ pollId, option }: { pollId: string; option: number }) => lmsApi.vote(sessionId as string, pollId, option),
    onSuccess: () => {
      toast.success("Your vote was recorded.");
      queryClient.invalidateQueries({ queryKey: ["lms", "live-session", sessionId] });
    },
    onError: fail("Could not record your vote."),
  });
  const saveStream = useMutation({
    mutationFn: (link: string) => lmsApi.setStream(sessionId as string, link),
    onSuccess: (result) => {
      toast.success(result.message);
      setStreamLink("");
      refreshAll();
    },
    onError: fail("Could not save the YouTube link."),
  });
  const start = useMutation({ mutationFn: () => lmsApi.startSession(sessionId as string), onSuccess: () => { toast.success("The class is live."); refreshAll(); }, onError: fail("Could not start the class.") });
  const end = useMutation({ mutationFn: () => lmsApi.endSession(sessionId as string), onSuccess: () => { toast.success("The class has ended."); refreshAll(); }, onError: fail("Could not end the class.") });
  const createPoll = useMutation({
    mutationFn: () => lmsApi.createPoll(sessionId as string, pollQuestion.trim(), pollOptions.split("\n").map((line) => line.trim()).filter(Boolean)),
    onSuccess: () => {
      toast.success("Poll launched.");
      setPollQuestion("");
      setPollOptions("");
      queryClient.invalidateQueries({ queryKey: ["lms", "live-session", sessionId] });
    },
    onError: fail("Could not launch the poll."),
  });
  const closePoll = useMutation({
    mutationFn: (pollId: string) => lmsApi.closePoll(sessionId as string, pollId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lms", "live-session", sessionId] }),
    onError: fail("Could not close the poll."),
  });

  const messages = chatQuery.data ?? [];
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length, tab]);

  const submitChat = (event: FormEvent) => {
    event.preventDefault();
    if (text.trim() && sessionId) send.mutate(text.trim());
  };
  const submitPoll = (event: FormEvent) => {
    event.preventDefault();
    createPoll.mutate();
  };

  const isLive = detail?.status === "live";
  const startsAt = detail ? new Date(detail.startsAt).getTime() : 0;
  const chatOpen = isLive && joinable;
  const polls = detailQuery.data?.polls ?? [];
  const handRaised = Boolean(detailQuery.data?.myHandRaised);

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
          <span className="shrink-0 rounded-full bg-[#e7e8fb] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#1a1a7a]">{detail?.status === "ended" ? "Ended" : "Upcoming"}</span>
        )}
        <h1 className="truncate text-[15px] font-medium text-[#14162b] sm:text-[20px]">{detail?.title ?? "Live Class"}</h1>
      </div>
      {isTeacher && detail && (
        <div className="flex shrink-0 items-center gap-2">
          {detail.status === "scheduled" && (
            <button type="button" disabled={start.isPending} onClick={() => start.mutate()} className="rounded-[4px] bg-[#020060] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#10107a] disabled:opacity-60">
              Start class
            </button>
          )}
          {detail.status === "live" && (
            <button type="button" disabled={end.isPending} onClick={() => end.mutate()} className="rounded-[4px] bg-[#d62828] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#b81f1f] disabled:opacity-60">
              End class
            </button>
          )}
        </div>
      )}
    </header>
  );

  const renderVideo = () => {
    if (!detail) return null;
    if (detail.status === "ended" || detail.status === "cancelled") {
      return <Placeholder title={detail.status === "ended" ? "This class has ended" : "This class was cancelled"} text={`${detail.title} was scheduled for ${dateLabel(detail.startsAt)}.`} />;
    }
    if (!joinable) {
      return <Placeholder title="This class hasn't started yet" text={`Starts ${dateLabel(detail.startsAt)} (in ${countdownLabel(startsAt, now)}). You can join 15 minutes before.`} />;
    }
    if (stream?.configured && stream.embedUrl) {
      return (
        <iframe
          title={detail.title}
          src={stream.embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      );
    }
    return (
      <Placeholder
        title={isLive ? "Stream starting soon" : "Waiting for the stream"}
        text={isTeacher ? "Add your YouTube live link below and students will see the video here." : "The video appears here as soon as your instructor adds the YouTube link."}
      />
    );
  };

  return (
    <LmsShell active="live" topBar={topBar} showUser flush>
      <div className="grid min-h-[calc(100vh-68px)] lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <section aria-label="Class video" className="min-w-0 p-4 sm:p-6">
          {meQuery.isLoading || sessionsQuery.isLoading ? (
            <p className="py-24 text-center text-[14px] text-[#4a4d66]">Loading your live classes...</p>
          ) : meQuery.isError ? (
            <Empty title="We couldn't load your classes" text={errorText(meQuery.error, "Check your connection and refresh the page.")} />
          ) : !cohortId ? (
            <Empty title="You're not in a trimester cohort yet" text="Once you're added to a cohort, your live classes show up here." />
          ) : !detail ? (
            <Empty title="No live classes scheduled" text="Your instructor hasn't scheduled a class yet. Check back soon." />
          ) : (
            <>
              <div className="relative aspect-video overflow-hidden rounded-[18px] bg-[#1b2230] shadow-[0_20px_50px_-24px_rgba(20,20,80,0.5)]">{renderVideo()}</div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-bold text-[#14162b]">{detail.title}</h2>
                  <p className="mt-0.5 text-[13px] text-[#4a4d66]">
                    {instructorName(detail)} &bull; {dateLabel(detail.startsAt)} - {timeLabel(detail.endsAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {stream?.watchUrl && (
                    <a href={stream.watchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-[6px] border border-[#c9c8dc] bg-white px-3 py-2.5 text-[13px] font-medium text-[#1b1d33] hover:bg-[#f3f2fb]">
                      <MdOutlineOndemandVideo size={18} aria-hidden /> Open on YouTube
                    </a>
                  )}
                  <button type="button" onClick={() => router.push("/lms")} className="inline-flex items-center gap-2 rounded-[6px] bg-[#d62828] px-3 py-2.5 text-[13px] font-medium text-white hover:bg-[#b81f1f]">
                    <MdCallEnd size={18} aria-hidden /> Leave class
                  </button>
                </div>
              </div>

              {isTeacher && detail.status !== "ended" && detail.status !== "cancelled" && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveStream.mutate(streamLink.trim());
                  }}
                  className="mt-5 rounded-[12px] border border-[#dedcec] bg-white p-4"
                >
                  <label htmlFor="yt-link" className="text-[13px] font-bold text-[#14162b]">YouTube live link</label>
                  <p className="mt-1 text-[12px] text-[#4a4d66]">Create the broadcast in YouTube Studio (Unlisted works well), then paste its link. Students watch it here.</p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      id="yt-link"
                      value={streamLink}
                      onChange={(event) => setStreamLink(event.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="h-11 flex-1 rounded-[6px] border border-[#d6d4e6] px-3 text-[14px] outline-none focus:border-[#020060]"
                    />
                    <button type="submit" disabled={saveStream.isPending || !streamLink.trim()} className="h-11 rounded-[6px] bg-[#020060] px-5 text-[14px] font-medium text-white hover:bg-[#10107a] disabled:opacity-60">
                      {stream?.configured ? "Replace link" : "Save link"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </section>

        <aside className="flex min-h-[520px] flex-col border-t border-[#dedcec] bg-white lg:min-h-0 lg:border-l lg:border-t-0">
          <div role="tablist" aria-label="Class panels" className="flex border-b border-[#dedcec]">
            {([
              ["chat", "Live Chat"],
              ["polls", "Polls"],
              ["code", "Code"],
              ["people", `People${peopleQuery.data ? ` (${peopleQuery.data.total})` : ""}`],
            ] as [TTab, string][]).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`-mb-px flex-1 whitespace-nowrap border-b-2 px-1.5 py-4 text-[13px] transition-colors sm:text-[14px] ${tab === key ? "border-[#1a1a7a] font-bold text-[#1a1a7a]" : "border-transparent text-[#4a4d66] hover:text-[#1a1a7a]"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-5">
            {!joinable && <p className="text-[13px] text-[#4a4d66]">Chat, polls and shared code open when you can join the class.</p>}

            {joinable && tab === "chat" && (
              <ul className="flex flex-col gap-4">
                {messages.length === 0 && <li className="text-center text-[13px] text-[#4a4d66]">No messages yet. Say hello.</li>}
                {messages.map((message) =>
                  message.system ? (
                    <li key={message._id} className="text-center">
                      <span className="inline-block rounded-full bg-[#e3eef8] px-4 py-1.5 text-[12px] text-[#1a4a7a]">{message.text}</span>
                    </li>
                  ) : (
                    <li key={message._id}>
                      <p className="text-[12px]">
                        <span className="font-bold text-[#14162b]">{message.author?.name ?? "Member"}</span> <span className="text-[#4a4d66]">{timeLabel(message.createdAt)}</span>
                      </p>
                      <p className={`mt-1.5 break-words rounded-[8px] px-4 py-3 text-[14px] leading-[1.6] text-[#14162b] ${message.author?._id === user?._id ? "bg-[#e7e8fb]" : "bg-[#f3f1fa]"}`}>{message.text}</p>
                    </li>
                  )
                )}
              </ul>
            )}

            {joinable && tab === "polls" && (
              <div className="flex flex-col gap-6">
                {polls.length === 0 && <p className="text-[13px] text-[#4a4d66]">No polls yet.</p>}
                {polls.map((poll) => (
                  <div key={poll._id}>
                    <p className={`text-[11px] font-bold uppercase tracking-wide ${poll.isOpen ? "text-[#c62828]" : "text-[#4a4d66]"}`}>{poll.isOpen ? "Live poll" : "Closed poll"}</p>
                    <h3 className="mt-2 text-[16px] font-bold leading-snug text-[#14162b]">{poll.question}</h3>
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {poll.options.map((option) => {
                        const chosen = poll.myVote === option.index;
                        const showResults = !poll.isOpen || poll.myVote !== null || isTeacher;
                        const percent = poll.totalVotes ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                        return (
                          <li key={option.index}>
                            <button
                              type="button"
                              disabled={!poll.isOpen || vote.isPending}
                              onClick={() => vote.mutate({ pollId: poll._id, option: option.index })}
                              className={`relative flex w-full items-center justify-between overflow-hidden rounded-[8px] border px-4 py-3 text-left text-[14px] transition-colors disabled:cursor-default ${chosen ? "border-[#020060] bg-[#eef0fd] font-bold text-[#1a1a7a]" : "border-[#dedcec] hover:bg-[#f7f6fd]"}`}
                            >
                              {showResults && <span aria-hidden className="absolute inset-y-0 left-0 bg-[#d6ebf8]/60" style={{ width: `${percent}%` }} />}
                              <span className="relative">{option.text} {chosen && <span className="text-[12px]">(your vote)</span>}</span>
                              {showResults && <span className="relative text-[12px]">{percent}%</span>}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    {isTeacher && poll.isOpen && (
                      <button type="button" onClick={() => closePoll.mutate(poll._id)} className="mt-3 text-[13px] font-medium text-[#00658f] hover:underline">Close poll</button>
                    )}
                  </div>
                ))}
                {isTeacher && isLive && (
                  <form onSubmit={submitPoll} className="rounded-[10px] border border-[#dedcec] p-4">
                    <p className="text-[13px] font-bold text-[#14162b]">Launch a poll</p>
                    <input value={pollQuestion} onChange={(event) => setPollQuestion(event.target.value)} placeholder="Question" aria-label="Poll question" className="mt-3 h-10 w-full rounded-[6px] border border-[#d6d4e6] px-3 text-[14px] outline-none focus:border-[#020060]" />
                    <textarea value={pollOptions} onChange={(event) => setPollOptions(event.target.value)} placeholder={"One option per line (2 to 6)"} aria-label="Poll options" rows={4} className="mt-2 w-full rounded-[6px] border border-[#d6d4e6] px-3 py-2 text-[14px] outline-none focus:border-[#020060]" />
                    <button type="submit" disabled={createPoll.isPending || !pollQuestion.trim() || pollOptions.split("\n").filter((line) => line.trim()).length < 2} className="mt-3 rounded-[6px] bg-[#020060] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-60">Launch poll</button>
                  </form>
                )}
              </div>
            )}

            {joinable && tab === "code" && <SharedCodePanel code={detailQuery.data?.sharedCode?.content} instructor={detail ? instructorName(detail) : undefined} />}

            {joinable && tab === "people" && (
              <ul className="flex flex-col divide-y divide-[#eceaf5]">
                {(peopleQuery.data?.people ?? []).map((person) => (
                  <li key={person._id} className="flex items-center gap-3 py-2.5 text-[14px] text-[#14162b]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e7e8fb] text-[11px] font-bold text-[#1a1a7a]">
                      {person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                    </span>
                    <span className="flex-1">{person.name}{person.isYou ? " (You)" : ""}</span>
                    {person.handRaised && <MdOutlineBackHand size={18} className="text-[#00658f]" aria-label="Hand raised" />}
                    <span className={`h-2 w-2 rounded-full ${person.joined ? "bg-[#2e9e5b]" : "bg-[#c9cbd9]"}`} aria-label={person.joined ? "Joined" : "Not joined"} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-[#dedcec] p-5">
            {!isTeacher && (
              <button
                type="button"
                aria-pressed={handRaised}
                disabled={!chatOpen || hand.isPending}
                onClick={() => hand.mutate()}
                className={`flex w-full items-center justify-center gap-2 rounded-[6px] border px-4 py-3 text-[14px] font-medium transition-colors disabled:opacity-50 ${handRaised ? "border-[#00658f] bg-[#e3f1f8] text-[#00658f]" : "border-[#00658f] bg-white text-[#00658f] hover:bg-[#eef6fb]"}`}
              >
                <MdOutlineBackHand size={20} /> {handRaised ? "Lower Hand" : "Raise Hand"}
              </button>
            )}
            {isTeacher && detail && <p className="text-[13px] text-[#4a4d66]">{detail.handsRaised} {detail.handsRaised === 1 ? "hand" : "hands"} raised</p>}
            <form onSubmit={submitChat} className="relative mt-3">
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                disabled={!chatOpen}
                maxLength={1000}
                aria-label="Type a message"
                placeholder={chatOpen ? "Type a message..." : "Chat opens when the class is live"}
                className="h-[52px] w-full rounded-[6px] border border-[#d6d4e6] bg-white pl-4 pr-12 text-[14px] text-[#14162b] outline-none placeholder:text-[#8d8fa6] focus:border-[#020060] disabled:bg-[#f6f5fb]"
              />
              <button type="submit" aria-label="Send message" disabled={!chatOpen || !text.trim() || send.isPending} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a7a] disabled:text-[#b6b7c8]">
                <MdOutlineSend size={22} />
              </button>
            </form>
          </div>
        </aside>
      </div>
    </LmsShell>
  );
};

const Placeholder = ({ title, text }: { title: string; text: string }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-white">
    <MdOutlineOndemandVideo size={44} className="text-white/70" aria-hidden />
    <p className="text-[18px] font-bold">{title}</p>
    <p className="max-w-[420px] text-[14px] text-white/75">{text}</p>
  </div>
);

const Empty = ({ title, text }: { title: string; text: string }) => (
  <div className="mx-auto max-w-[460px] py-24 text-center">
    <h2 className="text-[20px] font-bold text-[#14162b]">{title}</h2>
    <p className="mt-2 text-[14px] text-[#4a4d66]">{text}</p>
    <Link href="/lms" className="mt-5 inline-block rounded-[6px] bg-[#020060] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#10107a]">Back to dashboard</Link>
  </div>
);

export default LiveClassPage;
