"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@studio-freight/react-lenis";

// The header is fixed: 64px bar on mobile, 128px (2 rows) on desktop. Keep anchored sections clear of it.
const getHeaderOffset = () => (typeof window !== "undefined" && window.innerWidth >= 1024 ? -140 : -76);

const scrollToHash = (lenis: ReturnType<typeof useLenis>, hash: string) => {
  const target = hash ? document.querySelector(hash) : null;
  if (target) {
    lenis?.scrollTo(target as HTMLElement, { offset: getHeaderOffset() });
  } else {
    lenis?.scrollTo(0);
  }
};

/**
 * Keeps navigation in sync with Lenis's virtual scroll. Without this, clicking
 * the logo/"Home" while already on that page does nothing (same-route Links
 * don't trigger Next navigation), and hash links like "/#faqs" fight Lenis's
 * transform-based scrolling instead of gliding to the target smoothly.
 */
const ScrollManager = () => {
  const pathname = usePathname() ?? "";
  const lenis = useLenis();

  // Real route change: jump to the URL's hash if present, otherwise reset to top.
  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => scrollToHash(lenis, hash));
    } else {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  // Same-page link clicks (logo/"Home"/"#faqs") never trigger a Next.js route
  // change, so intercept them here and drive the scroll through Lenis instead.
  useEffect(() => {
    if (!lenis) return;

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      const isSameOrigin = url.origin === window.location.origin;
      const isSamePath = url.pathname === window.location.pathname;
      if (!isSameOrigin || !isSamePath) return;

      event.preventDefault();
      if (url.hash) {
        window.history.pushState(null, "", url.hash);
        scrollToHash(lenis, url.hash);
      } else {
        window.history.pushState(null, "", url.pathname + url.search);
        lenis.scrollTo(0);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [lenis]);

  return null;
};

export default ScrollManager;
