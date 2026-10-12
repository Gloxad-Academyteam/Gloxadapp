"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MdCallEnd,
  MdOutlineBackHand,
  MdOutlineMic,
  MdOutlineMicOff,
  MdOutlineScreenShare,
  MdOutlineSend,
  MdOutlineVideocam,
  MdOutlineVideocamOff,
} from "react-icons/md";
import { LuMenu } from "react-icons/lu";
import { toast } from "react-toastify";
import CategoryImage from "@components/CategoryImage";
import useAuth from "@hooks/useAuth";
import LmsShell from "./components/LmsShell";
import { LIVE_CLASS } from "./data";
import { lmsImages } from "./images";

type TTab = "chat" | "polls" | "people";
type TMessage = { id: string; author: string; time: string; text: string; self?: boolean; system?: boolean };

const mmss = (total: number) => `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
const nowLabel = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const RoundButton = ({ label, active, onClick, children, danger }: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode; danger?: boolean }) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={active}
    onClick={onClick}
    className={`flex h-11 w-11 items-center justify-center rounded-[10px] transition-colors sm:h-12 sm:w-12 ${
      danger ? "bg-[#d62828] text-white hover:bg-[#b81f1f]" : active ? "bg-[#1a1a7a] text-white" : "bg-white/90 text-[#14162b] hover:bg-white"
    }`}
  >
    {children}
  </button>
);

const LiveClassPage = () => {
  const router = useRouter();
  const { authenticatedUser: user } = useAuth();
  const [tab, setTab] = useState<TTab>("chat");
  const [messages, setMessages] = useState<TMessage[]>([
    ...LIVE_CLASS.chat,
    { id: "sys1", author: "System", time: "", text: "Instructor launched a poll", system: true },
  ]);
  const [text, setText] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [vote, setVote] = useState<number | null>(null);
  const [selectedThumb, setSelectedThumb] = useState(2);
  const [countdown, setCountdown] = useState(LIVE_CLASS.next.startsIn);
  const listRef = useRef<HTMLDivElement>(null);

  const selfName = `${user?.firstName ?? "You"} ${user?.lastName?.[0] ? `${user.lastName[0]}.` : ""}`.trim();

  useEffect(() => {
    const id = window.setInterval(() => setCountdown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, tab]);

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    setMessages((list) => [...list, { id: `m${Date.now()}`, author: selfName, time: nowLabel(), text: text.trim(), self: true }]);
    setText("");
  };

  const toggleHand = () => {
    const next = !handRaised;
    setHandRaised(next);
    setMessages((list) => [...list, { id: `s${Date.now()}`, author: "System", time: "", text: next ? `${selfName} raised a hand` : `${selfName} lowered their hand`, system: true }]);
  };

  const topBar = (openMenu: () => void) => (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between gap-3 border-b border-[#dedcec] bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" aria-label="Open navigation" onClick={openMenu} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-[#eceefd] lg:hidden">
          <LuMenu size={24} />
        </button>
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-[#fde8e8] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#c62828]">
          <span className="h-2 w-2 rounded-full bg-[#d62828]" /> Live Now
        </span>
        <h1 className="truncate text-[15px] font-medium text-[#14162b] sm:text-[20px]">{LIVE_CLASS.title}</h1>
      </div>
      <div className="hidden shrink-0 items-center gap-4 rounded-[8px] border border-[#dedcec] bg-[#f6f5fb] px-4 py-2 md:flex">
        <div className="text-[12px] leading-tight text-[#4a4d66]">
          <p>Next: {LIVE_CLASS.next.title}</p>
          <p className="mt-0.5 font-bold text-[#14162b]">Starts in {mmss(countdown)}</p>
        </div>
        <button
          type="button"
          onClick={() => toast.info(countdown > 0 ? `${LIVE_CLASS.next.title} opens in ${mmss(countdown)}.` : `${LIVE_CLASS.next.title} is starting now.`)}
          className="rounded-[4px] bg-[#020060] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#10107a]"
        >
          Join Now
        </button>
      </div>
    </header>
  );

  return (
    <LmsShell active="live" topBar={topBar} showUser flush>
      <div className="grid min-h-[calc(100vh-68px)] lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <section aria-label="Class video" className="min-w-0 p-4 sm:p-6">
          <div className="relative aspect-[16/9.6] overflow-hidden rounded-[18px] bg-[#1b2230] shadow-[0_20px_50px_-24px_rgba(20,20,80,0.5)]">
            <CategoryImage src={lmsImages.instructor} className={`h-full w-full object-cover ${camOn ? "" : "opacity-0"}`} fallback={null} />
            {!camOn && <div className="absolute inset-0 flex items-center justify-center text-[14px] text-white/80">Instructor video is off</div>}
            {sharing && <div className="absolute left-4 top-4 rounded-full bg-[#1a1a7a] px-3 py-1 text-[12px] font-medium text-white">You are sharing your screen</div>}
            <div className="absolute bottom-4 left-4 flex max-w-[46%] items-center gap-2 rounded-[8px] bg-white/85 px-3 py-2 text-[12px] text-[#14162b] backdrop-blur sm:text-[13px]">
              <MdOutlineMic size={16} className="shrink-0 text-[#1a1a7a]" />
              <span className="truncate">{LIVE_CLASS.instructor}</span>
            </div>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-[14px] bg-white/70 p-2 backdrop-blur sm:gap-3">
              <RoundButton label={micOn ? "Mute microphone" : "Unmute microphone"} active={micOn} onClick={() => setMicOn((value) => !value)}>
                {micOn ? <MdOutlineMic size={22} /> : <MdOutlineMicOff size={22} />}
              </RoundButton>
              <RoundButton label={camOn ? "Turn camera off" : "Turn camera on"} active={!camOn} onClick={() => setCamOn((value) => !value)}>
                {camOn ? <MdOutlineVideocam size={22} /> : <MdOutlineVideocamOff size={22} />}
              </RoundButton>
              <RoundButton label={sharing ? "Stop sharing screen" : "Share screen"} active={sharing} onClick={() => setSharing((value) => !value)}>
                <MdOutlineScreenShare size={22} />
              </RoundButton>
              <RoundButton label="Leave class" danger onClick={() => router.push("/lms")}>
                <MdCallEnd size={22} />
              </RoundButton>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
            {LIVE_CLASS.participants.map((person, index) => {
              const isSelected = selectedThumb === index;
              return (
                <button
                  key={person.name}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedThumb(index)}
                  className={`relative aspect-[16/10.5] overflow-hidden rounded-[8px] bg-[#c9cde0] ${isSelected ? "ring-2 ring-[#020060] ring-offset-2" : "border border-[#dedcec]"}`}
                >
                  <CategoryImage src={person.image} className="h-full w-full object-cover" fallback={null} />
                  <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-[4px] bg-white/90 px-2 py-1 text-[11px] text-[#14162b]">
                    {person.muted ? <MdOutlineMicOff size={13} className="text-[#c62828]" /> : <MdOutlineMic size={13} className="text-[#1a1a7a]" />} {person.name}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-[11px] text-[#4a4d66]">Preview of the live room. Video and audio are connected when a live session is scheduled.</p>
        </section>

        <aside className="flex min-h-[520px] flex-col border-t border-[#dedcec] bg-white lg:min-h-0 lg:border-l lg:border-t-0">
          <div role="tablist" aria-label="Class panels" className="flex border-b border-[#dedcec]">
            {([
              ["chat", "Live Chat"],
              ["polls", "Polls"],
              ["people", `People (${LIVE_CLASS.people.length})`],
            ] as [TTab, string][]).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`-mb-px flex-1 border-b-2 px-3 py-4 text-[14px] transition-colors ${tab === key ? "border-[#1a1a7a] font-bold text-[#1a1a7a]" : "border-transparent text-[#4a4d66] hover:text-[#1a1a7a]"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-5">
            {tab === "chat" && (
              <ul className="flex flex-col gap-4">
                {messages.map((message) =>
                  message.system ? (
                    <li key={message.id} className="text-center">
                      <span className="inline-block rounded-full bg-[#e3eef8] px-4 py-1.5 text-[12px] text-[#1a4a7a]">{message.text}</span>
                    </li>
                  ) : (
                    <li key={message.id}>
                      <p className="text-[12px]">
                        <span className="font-bold text-[#14162b]">{message.author}</span> <span className="text-[#4a4d66]">{message.time}</span>
                      </p>
                      <p className={`mt-1.5 rounded-[8px] px-4 py-3 text-[14px] leading-[1.6] text-[#14162b] ${message.self ? "bg-[#e7e8fb]" : "bg-[#f3f1fa]"}`}>{message.text}</p>
                    </li>
                  )
                )}
              </ul>
            )}

            {tab === "polls" && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#c62828]">Live poll</p>
                <h2 className="mt-2 text-[16px] font-bold leading-snug text-[#14162b]">{LIVE_CLASS.poll.question}</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {LIVE_CLASS.poll.options.map((option, index) => {
                    const isChosen = vote === index;
                    return (
                      <li key={option}>
                        <button
                          type="button"
                          disabled={vote !== null}
                          onClick={() => {
                            setVote(index);
                            toast.success("Your vote was recorded.");
                          }}
                          className={`flex w-full items-center justify-between rounded-[8px] border px-4 py-3 text-left text-[14px] transition-colors disabled:cursor-default ${
                            isChosen ? "border-[#020060] bg-[#eef0fd] font-bold text-[#1a1a7a]" : "border-[#dedcec] hover:bg-[#f7f6fd]"
                          }`}
                        >
                          {option} {isChosen && <span className="text-[12px]">Your vote</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {vote !== null && <p className="mt-4 text-[12px] text-[#4a4d66]">Results are shared by your instructor when the poll closes.</p>}
              </div>
            )}

            {tab === "people" && (
              <ul className="flex flex-col divide-y divide-[#eceaf5]">
                {LIVE_CLASS.people.map((name, index) => (
                  <li key={name} className="flex items-center gap-3 py-2.5 text-[14px] text-[#14162b]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e7e8fb] text-[11px] font-bold text-[#1a1a7a]">
                      {name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                    </span>
                    {index === 1 && user?.firstName ? `${user.firstName} ${user.lastName ?? ""} (You)` : name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-[#dedcec] p-5">
            <button
              type="button"
              aria-pressed={handRaised}
              onClick={toggleHand}
              className={`flex w-full items-center justify-center gap-2 rounded-[6px] border px-4 py-3 text-[14px] font-medium transition-colors ${
                handRaised ? "border-[#00658f] bg-[#e3f1f8] text-[#00658f]" : "border-[#00658f] bg-white text-[#00658f] hover:bg-[#eef6fb]"
              }`}
            >
              <MdOutlineBackHand size={20} /> {handRaised ? "Lower Hand" : "Raise Hand"}
            </button>
            <form onSubmit={send} className="relative mt-3">
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                aria-label="Type a message"
                placeholder="Type a message..."
                className="h-[52px] w-full rounded-[6px] border border-[#d6d4e6] bg-white pl-4 pr-12 text-[14px] text-[#14162b] placeholder:text-[#8d8fa6] outline-none focus:border-[#020060]"
              />
              <button type="submit" aria-label="Send message" disabled={!text.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a7a] disabled:text-[#b6b7c8]">
                <MdOutlineSend size={22} />
              </button>
            </form>
          </div>
        </aside>
      </div>
    </LmsShell>
  );
};

export default LiveClassPage;
