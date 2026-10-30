"use client";

import React, { useEffect, useState } from "react";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import { isFullscreen } from "@utils/fullscreen";

type TProps = {
  onClick: () => void;
  className?: string;
};

// "Full screen" button that sits next to a video, never on top of it, so the player's own controls stay clear
const FullscreenButton = ({ onClick, className = "" }: TProps) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const update = () => setActive(isFullscreen());
    document.addEventListener("fullscreenchange", update);
    document.addEventListener("webkitfullscreenchange", update);
    return () => {
      document.removeEventListener("fullscreenchange", update);
      document.removeEventListener("webkitfullscreenchange", update);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? "Exit full screen" : "Play full screen"}
      className={`inline-flex h-[36px] items-center gap-2 rounded-[8px] border border-[#dedee7] bg-white px-3.5 text-[13px] font-semibold text-[#201633] transition hover:bg-[#f6f7fb] ${className}`}
    >
      {active ? <FiMinimize className="text-[15px]" /> : <FiMaximize className="text-[15px]" />}
      <span>{active ? "Exit full screen" : "Full screen"}</span>
    </button>
  );
};

export default FullscreenButton;
