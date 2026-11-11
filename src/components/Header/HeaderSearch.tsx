"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

// The search box in the header. It opens the course list with the words typed, which filters it.
const HeaderSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      role="search"
      className="hidden w-full min-w-0 max-w-[520px] lg:block"
      onSubmit={(event) => {
        event.preventDefault();
        const text = query.trim();
        router.push(text ? `/free?search=${encodeURIComponent(text)}` : "/free");
      }}
    >
      <label className="group relative flex h-[44px] items-center">
        <FiSearch aria-hidden className="pointer-events-none absolute left-4 text-[17px] text-[#8a90a6] transition-colors group-focus-within:text-[#0B1F4D]" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search courses"
          placeholder="Search courses, skills and topics"
          className="h-full w-full rounded-full border border-transparent bg-[#f1f3f9] pl-11 pr-4 text-[14px] text-[#201633] outline-none transition placeholder:text-[#8a90a6] hover:bg-[#eceff7] focus:border-[#0B1F4D]/25 focus:bg-white focus:shadow-[0_0_0_4px_rgba(11,31,77,0.08)] [&::-webkit-search-cancel-button]:hidden"
        />
      </label>
    </form>
  );
};

export default HeaderSearch;
