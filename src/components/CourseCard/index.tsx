import React from "react";
import Link from "next/link";
import { FiUser } from "react-icons/fi";

type TProps = {
  href: string;
  title: string;
  image?: string | null;
  // Who offers it, shown under the title
  provider?: string;
  providerAvatar?: boolean;
  // Small facts joined with dots, e.g. level, lessons, hours
  meta?: (string | undefined | null | false)[];
  // Bottom line: "Free" or a price
  priceLabel?: string;
  // A short label above the title, e.g. a programme or category
  tag?: string;
  className?: string;
};

// One fluid grid for every list of course cards: as many columns as fit, never narrower than ~260px, never an orphan layout
export const COURSE_GRID = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,264px),1fr))] gap-[clamp(14px,2vw,24px)]";

// One course, laid out like Coursera or Udemy: a wide picture, the title, who teaches it, a line of facts and the price.
// The whole card is the link. On hover only the border darkens and a faint shadow appears.
const CourseCard = ({ href, title, image, provider, providerAvatar = false, meta = [], priceLabel, tag, className = "" }: TProps) => {
  const facts = meta.filter(Boolean).join(" · ");
  return (
    <Link
      href={href}
      className={`cc group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#e3e5ee] bg-white transition-[border-color,box-shadow] duration-200 hover:border-[#c3c7d9] hover:shadow-[0_2px_10px_rgba(20,20,60,0.07)] ${className}`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[#eef0f7]">
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            onError={(event) => {
              if (!event.currentTarget.src.endsWith("/og-image.jpg")) event.currentTarget.src = "/og-image.jpg";
            }}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#dfe7ff] to-[#c3d2ff]" />
        )}
      </div>

      <div className="cc-body flex flex-1 flex-col">
        {tag && <p className="cc-tag mb-1 truncate text-[11px] font-semibold uppercase tracking-[0.05em] text-[#3e6ab3]">{tag}</p>}
        <h3 className="cc-title line-clamp-2 font-bold leading-[1.35] text-[#201633] group-hover:text-[#07004d]">{title}</h3>
        {provider && (
          <div className="cc-meta mt-1 flex min-w-0 items-center gap-2 text-[#6b6d76]">
            {providerAvatar && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#07004d]" aria-hidden="true"><FiUser size={12} /></span>}
            <span className="truncate">{provider}</span>
          </div>
        )}
        {facts && <p className="cc-meta mt-2 line-clamp-2 leading-[1.5] text-[#6b6d76]">{facts}</p>}
        {priceLabel && <p className="cc-price mt-auto pt-3 font-bold text-[#201633]">{priceLabel}</p>}
      </div>
    </Link>
  );
};

export default CourseCard;
