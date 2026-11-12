import React from "react";
import { LuAward, LuBell, LuBookOpen, LuCalendarClock, LuClipboardCheck, LuCreditCard, LuMegaphone, LuStar, LuUserPlus, LuVideo, LuXCircle } from "react-icons/lu";

type TStyle = { icon: React.ElementType; tint: string };

/** Picks an icon and colour from the notification type, so each kind is easy to tell apart at a glance. */
export const styleForType = (type: string): TStyle => {
  const value = type.toLowerCase();
  if (value.includes("rejected") || value.includes("revoked")) return { icon: LuXCircle, tint: "bg-[#fdeaea] text-[#c43232]" };
  if (value.includes("certificate")) return { icon: LuAward, tint: "bg-[#efe9ff] text-[#6a3fd0]" };
  if (value.includes("scholarship")) return { icon: LuAward, tint: "bg-[#fff1df] text-[#b8650b]" };
  if (value.includes("live_class") || value.includes("session")) return { icon: LuVideo, tint: "bg-[#fde8e8] text-[#d93a3a]" };
  if (value.includes("assignment") || value.includes("submission") || value.includes("graded")) return { icon: LuClipboardCheck, tint: "bg-[#e3f6ec] text-[#13804d]" };
  if (value.includes("enrol")) return { icon: LuUserPlus, tint: "bg-[#e1f1ff] text-[#1f6fc4]" };
  if (value.includes("review")) return { icon: LuStar, tint: "bg-[#fff4dc] text-[#a86a00]" };
  if (value.includes("payment")) return { icon: LuCreditCard, tint: "bg-[#e3f6ec] text-[#13804d]" };
  if (value.includes("course")) return { icon: LuBookOpen, tint: "bg-[#e9eaff] text-[#4a4cd6]" };
  if (value.includes("announcement") || value.includes("broadcast")) return { icon: LuMegaphone, tint: "bg-[#e9eaff] text-[#4a4cd6]" };
  if (value.includes("schedule")) return { icon: LuCalendarClock, tint: "bg-[#e1f1ff] text-[#1f6fc4]" };
  return { icon: LuBell, tint: "bg-[#eef0f6] text-[#6b7087]" };
};

export const timeAgo = (iso: string) => {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

export type TCategory = "courses" | "classes" | "learning" | "payments" | "updates";

export const CATEGORY_LABELS: Record<TCategory, string> = {
  courses: "Courses",
  classes: "Live classes",
  learning: "Learning",
  payments: "Payments",
  updates: "Updates",
};

/** Groups the many notification types into a few categories people can filter by. */
export const categoryForType = (type: string): TCategory => {
  const value = type.toLowerCase();
  if (value.includes("live_class") || value.includes("session")) return "classes";
  if (value.includes("payment")) return "payments";
  if (value.includes("assignment") || value.includes("submission") || value.includes("graded") || value.includes("certificate") || value.includes("scholarship") || value.includes("enrol")) return "learning";
  if (value.includes("course") || value.includes("review")) return "courses";
  return "updates";
};

// A short, soft two-note chime made in the browser, so no sound file is needed
export const playChime = () => {
  try {
    const Context = window.AudioContext || (window as any).webkitAudioContext;
    if (!Context) return;
    const context = new Context();
    const now = context.currentTime;
    [660, 880].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.14 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.14 + 0.28);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + index * 0.14);
      oscillator.stop(now + index * 0.14 + 0.3);
    });
    setTimeout(() => context.close().catch(() => undefined), 800);
  } catch {
    // Sound is a nice extra; ignore browsers that block it
  }
};

const SOUND_KEY = "gloxad.notificationSound";
export const getSoundEnabled = () => {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
};
export const setSoundEnabled = (on: boolean) => {
  try {
    localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {
    // Storage can be blocked; the setting then lasts until the page closes
  }
};
