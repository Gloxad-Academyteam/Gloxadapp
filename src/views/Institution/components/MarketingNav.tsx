"use client";

import { useState } from "react";
import Link from "next/link";
import { LuMenu, LuX } from "react-icons/lu";

const links = [
  { label: "Features", href: "/institution#features" },
  { label: "How it work", href: "/institution#how-it-works" },
];

// Logo, anchors, login and get-started row used on the landing and confirmation pages
const MarketingNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative bg-white">
      <div className="mx-auto flex w-full max-w-[1512px] items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-[22px] xl:px-[84px]">
        <Link href="/" aria-label="Gloxad home" className="shrink-0">
          <img src="/gloxadlogo.png" alt="Gloxad" className="h-[40px] w-auto object-contain sm:h-[56px]" />
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-16 pl-[11vw] text-[14px] font-medium md:flex lg:gap-[clamp(100px,15vw,216px)]">
          {links.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-[#030069] ${index === 0 ? "text-[#030069]" : "text-[#1b1d33]"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="inline-flex h-[40px] items-center justify-center rounded-full border border-[#cfd6ea] bg-white px-5 text-[14px] font-semibold text-[#0B1F4D] transition-colors hover:border-[#0B1F4D] hover:bg-[#f4f6fb]"
          >
            Log in
          </Link>
          <Link
            href="/institution/activate"
            className="inline-flex h-[40px] items-center justify-center rounded-full bg-[#0B1F4D] px-5 text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(11,31,77,0.25)] transition-colors hover:bg-[#13306f]"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e3e6f0] bg-white text-[#0B1F4D] transition-colors hover:bg-[#f4f6fb] md:hidden"
        >
          {isOpen ? <LuX size={20} /> : <LuMenu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute inset-x-0 top-full z-30 rounded-b-2xl border-b border-[#e8eaf3] bg-white px-4 pb-5 pt-1 shadow-[0_16px_30px_rgba(11,31,77,0.12)] md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-0.5 text-[15px] font-medium">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-3.5 py-3 text-[#2b2f45] transition-colors hover:bg-[#f4f6fb]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex gap-3 border-t border-[#efeff5] pt-4">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex h-[46px] flex-1 items-center justify-center rounded-full border border-[#cfd6ea] bg-white text-[14px] font-semibold text-[#0B1F4D] hover:border-[#0B1F4D]"
            >
              Log in
            </Link>
            <Link
              href="/institution/activate"
              onClick={() => setIsOpen(false)}
              className="flex h-[46px] flex-1 items-center justify-center rounded-full bg-[#0B1F4D] text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(11,31,77,0.25)] hover:bg-[#13306f]"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default MarketingNav;
