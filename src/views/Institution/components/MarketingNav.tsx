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

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/auth/signin" className="text-[13px] font-bold uppercase text-[#030069] hover:underline">
            Login
          </Link>
          <Link
            href="/institution/activate"
            className="rounded-[4px] bg-[#3e92cc] px-6 py-3 text-[13px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-[#2f7fb8]"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#030069] hover:bg-[#f2f3ff] md:hidden"
        >
          {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute inset-x-0 top-full z-30 border-b border-[#e8eaf3] bg-white px-4 pb-5 shadow-lg md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1 text-[16px] font-medium">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-[8px] px-3 py-3 text-[#1b1d33] hover:bg-[#f2f3ff]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth/signin"
              onClick={() => setIsOpen(false)}
              className="rounded-[8px] px-3 py-3 font-bold uppercase text-[#030069] hover:bg-[#f2f3ff]"
            >
              Login
            </Link>
            <Link
              href="/institution/activate"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-[4px] bg-[#3e92cc] px-6 py-3.5 text-center font-medium uppercase tracking-wide text-white"
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MarketingNav;
