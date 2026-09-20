"use client";

import { useEffect, useState } from "react";

type TypewriterTextProps = {
  /** Each entry is rendered on its own line. */
  lines: string[];
  /** Milliseconds per character. */
  speed?: number;
  /** Milliseconds to wait before typing starts. */
  startDelay?: number;
  className?: string;
};

/**
 * Types its text out once (per text) and then stops. The full text is always
 * rendered invisibly underneath so the block never changes height while typing,
 * and screen readers get the complete sentence immediately.
 */
const TypewriterText = ({ lines, speed = 55, startDelay = 400, className = "" }: TypewriterTextProps) => {
  const full = lines.join("\n");
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setCount(full.length);
      return;
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= full.length) {
            if (interval) clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [full, speed, startDelay]);

  const typed = full.slice(0, count);
  const done = count >= full.length;

  return (
    <h1 className={`relative whitespace-pre-line ${className}`}>
      <span className="sr-only">{lines.join(" ")}</span>
      {/* Reserves the final height/width so nothing jumps while typing */}
      <span aria-hidden="true" className="invisible block">
        {full}
      </span>
      <span aria-hidden="true" className="absolute inset-0 block">
        {typed}
        <span
          className={`ml-[2px] inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-white ${
            done ? "opacity-0 transition-opacity duration-700" : "animate-pulse"
          }`}
        />
      </span>
    </h1>
  );
};

export default TypewriterText;
