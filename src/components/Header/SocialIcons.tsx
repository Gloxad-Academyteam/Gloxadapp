import { OFFICIAL_SOCIAL_LINKS } from "@constants/socialLinks";

// The social links as small quiet icons that take on the brand navy on hover, instead of five brand colours
const SocialIcons = ({ className = "" }: { className?: string }) => (
  <ul className={`flex items-center gap-1 ${className}`}>
    {OFFICIAL_SOCIAL_LINKS.map(({ label, href, Icon }) => (
      <li key={label}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Gloxad Academy on ${label}`}
          title={label}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b7389] transition-colors hover:bg-[#eef1f8] hover:text-[#0B1F4D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4D]/30"
        >
          <Icon size={15} aria-hidden="true" />
        </a>
      </li>
    ))}
  </ul>
);

export default SocialIcons;
