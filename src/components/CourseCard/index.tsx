import React from "react";
import Link from "next/link";

type TProps = {
  href: string;
  title: string;
  image?: string | null;
  // Who offers it, shown under the title
  provider?: string;
  // Small facts joined with dots, e.g. level, lessons, hours
  meta?: (string | undefined | null | false)[];
  // Bottom line: "Free" or a price
  priceLabel?: string;
  // A short label above the title, e.g. a programme or category
  tag?: string;
  className?: string;
};

// One course, laid out like Coursera or Udemy: a wide picture, the title, who teaches it, a line of facts and the price.
// The whole card is the link. On hover only the border darkens and a faint shadow appears.
const CourseCard = ({ href, title, image, provider, meta = [], priceLabel, tag, className = "" }: TProps) => {
  const facts = meta.filter(Boolean).join(" · ");
  return (
    <Link
      href={href}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-[#e3e5ee] bg-white transition-[border-color,box-shadow] duration-200 hover:border-[#c3c7d9] hover:shadow-[0_2px_10px_rgba(20,20,60,0.07)] ${className}`}
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

      <div className="flex flex-1 flex-col p-4">
        {tag && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#3e6ab3]">{tag}</p>}
        <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.35] text-[#201633] group-hover:text-[#07004d]">{title}</h3>
        {provider && <p className="mt-1 text-[13px] text-[#6b6d76]">{provider}</p>}
        {facts && <p className="mt-2 line-clamp-2 text-[13px] leading-[1.5] text-[#6b6d76]">{facts}</p>}
        {priceLabel && <p className="mt-auto pt-3 text-[15px] font-bold text-[#201633]">{priceLabel}</p>}
      </div>
    </Link>
  );
};

export default CourseCard;
