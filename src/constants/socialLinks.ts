import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaXTwitter } from "react-icons/fa6";

export const OFFICIAL_SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/gloxad-academy/",
    Icon: FaLinkedinIn,
    color: "#0A66C2",
  },
  {
    label: "X",
    href: "https://x.com/Gloxad_Academy1",
    Icon: FaXTwitter,
    color: "#111111",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/gloxad16/",
    Icon: FaInstagram,
    color: "#E4405F",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/gloxadacademy?_rdc=1&_rdr#",
    Icon: FaFacebookF,
    color: "#1877F2",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@gloxad.academy",
    Icon: FaTiktok,
    color: "#111111",
  },
] as const;
