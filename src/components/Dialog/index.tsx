"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { LuAlertTriangle, LuCheck, LuInfo, LuTrash2, LuX } from "react-icons/lu";

type TTone = "success" | "error" | "info" | "warning" | "danger";

type TOptions = {
  title: string;
  message?: string;
  // Label of the button that confirms or closes. Defaults depend on the dialog.
  confirmLabel?: string;
  cancelLabel?: string;
};

type TConfirmOptions = TOptions & { tone?: "danger" | "warning" | "info" };

type TActive = {
  id: number;
  tone: TTone;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  resolve: (value: boolean) => void;
};

// A tiny store so dialogs can be opened from anywhere (event handlers, async code) without a hook.
let queue: TActive[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => queue;
const getServerSnapshot = () => [] as TActive[];

const open = (config: Omit<TActive, "id" | "resolve">) =>
  new Promise<boolean>((resolve) => {
    queue = [...queue, { ...config, id: nextId++, resolve }];
    emit();
  });

const close = (id: number, value: boolean) => {
  const item = queue.find((entry) => entry.id === id);
  if (!item) return;
  queue = queue.filter((entry) => entry.id !== id);
  emit();
  item.resolve(value);
};

/**
 * Popups that replace the browser's alert and confirm boxes.
 *   await dialog.success("Saved", "Your changes are live.");
 *   dialog.error("Could not save", "Check your connection and try again.");
 *   if (await dialog.confirm({ title: "Delete this?", tone: "danger" })) { ... }
 */
export const dialog = {
  success: (title: string, message?: string, confirmLabel = "Done") => open({ tone: "success", title, message, confirmLabel }),
  error: (title: string, message?: string, confirmLabel = "Close") => open({ tone: "error", title, message, confirmLabel }),
  info: (title: string, message?: string, confirmLabel = "Got it") => open({ tone: "info", title, message, confirmLabel }),
  confirm: ({ tone = "warning", confirmLabel, cancelLabel = "Cancel", ...rest }: TConfirmOptions) =>
    open({ tone: tone === "danger" ? "danger" : tone, confirmLabel: confirmLabel || (tone === "danger" ? "Delete" : "Continue"), cancelLabel, ...rest }),
};

const STYLE: Record<TTone, { icon: React.ElementType; ring: string; bg: string; fg: string; button: string }> = {
  success: { icon: LuCheck, ring: "ring-[#d3f1e0]", bg: "bg-[#e3f6ec]", fg: "text-[#13804d]", button: "bg-[#12142b] hover:bg-[#1d2040] focus-visible:ring-[#12142b]" },
  error: { icon: LuX, ring: "ring-[#f9d6d6]", bg: "bg-[#fdeaea]", fg: "text-[#c43232]", button: "bg-[#12142b] hover:bg-[#1d2040] focus-visible:ring-[#12142b]" },
  info: { icon: LuInfo, ring: "ring-[#d6e6fb]", bg: "bg-[#e6f0fd]", fg: "text-[#2563c9]", button: "bg-[#12142b] hover:bg-[#1d2040] focus-visible:ring-[#12142b]" },
  warning: { icon: LuAlertTriangle, ring: "ring-[#fbe8c4]", bg: "bg-[#fff4dc]", fg: "text-[#b7791f]", button: "bg-[#12142b] hover:bg-[#1d2040] focus-visible:ring-[#12142b]" },
  danger: { icon: LuTrash2, ring: "ring-[#f9d6d6]", bg: "bg-[#fdeaea]", fg: "text-[#c43232]", button: "bg-[#d93a3a] hover:bg-[#c02f2f] focus-visible:ring-[#d93a3a]" },
};

const DialogCard = ({ item }: { item: TActive }) => {
  const style = STYLE[item.tone];
  const Icon = style.icon;
  const confirmRef = useRef<HTMLButtonElement>(null);
  const isConfirm = Boolean(item.cancelLabel);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(item.id, false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [item.id]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <button type="button" aria-label="Close" tabIndex={-1} className="absolute inset-0 cursor-default bg-[#0b0d1a]/55 backdrop-blur-[3px] animate-[dialogFade_.15s_ease-out]" onClick={() => close(item.id, false)} />
      <div
        role={isConfirm ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={`dialog-title-${item.id}`}
        aria-describedby={item.message ? `dialog-message-${item.id}` : undefined}
        className="relative w-full max-w-[400px] rounded-[22px] bg-white px-7 pb-6 pt-8 text-center shadow-[0_24px_60px_-12px_rgba(11,13,26,0.35)] animate-[dialogPop_.18s_ease-out]"
      >
        <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ring-8 ${style.bg} ${style.ring} ${style.fg}`}>
          <Icon size={26} strokeWidth={2.4} aria-hidden />
        </span>
        <h2 id={`dialog-title-${item.id}`} className="mt-5 text-[18px] font-semibold tracking-tight text-[#12142b]">{item.title}</h2>
        {item.message && <p id={`dialog-message-${item.id}`} className="mt-2 text-[14px] leading-relaxed text-[#6b7087]">{item.message}</p>}
        <div className={`mt-7 flex gap-3 ${isConfirm ? "flex-col-reverse sm:flex-row" : ""}`}>
          {isConfirm && (
            <button type="button" onClick={() => close(item.id, false)} className="h-11 flex-1 rounded-xl border border-[#dfe2ee] bg-white text-[14px] font-semibold text-[#3b3f58] transition hover:bg-[#f6f7fb]">
              {item.cancelLabel}
            </button>
          )}
          <button
            ref={confirmRef}
            type="button"
            onClick={() => close(item.id, true)}
            className={`h-11 flex-1 rounded-xl text-[14px] font-semibold text-white outline-none transition focus-visible:ring-4 focus-visible:ring-offset-2 ${style.button}`}
          >
            {item.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/** Renders whichever popup is open. Mounted once, in Providers. */
export const DialogHost = () => {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The page behind should not scroll while a popup is open
  useEffect(() => {
    if (items.length === 0) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [items.length]);

  if (!mounted || items.length === 0) return null;
  return createPortal(<DialogCard key={items[0].id} item={items[0]} />, document.body);
};

export default dialog;
