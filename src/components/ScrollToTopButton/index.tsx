"use client";

import { useState } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import { FaArrowUp } from "react-icons/fa6";

const SHOW_AFTER_PX = 480;

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const lenis = useLenis((instance) => {
    setVisible(instance.scroll > SHOW_AFTER_PX);
  });

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => lenis?.scrollTo(0)}
      className={`btn-interactive fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#181C7B] text-white shadow-lg transition-all duration-300 sm:bottom-8 sm:right-8 ${
        visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
      }`}
    >
      <FaArrowUp className="text-[16px]" />
    </button>
  );
};

export default ScrollToTopButton;
