import Link from "next/link";

const links = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Institutional Standards", href: "/terms" },
  { label: "Contact Support", href: "/contact" },
];

const InstitutionFooter = () => (
  <footer className="border-t border-[#d3d8ef] bg-[#dde2f5]">
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-8 sm:px-8 md:flex-row md:items-center md:justify-between xl:px-14">
      <div>
        <p className="font-display text-[20px] font-bold text-[#3c3fc4]">Gloxad Academy</p>
        <p className="mt-1 text-[13px] text-[#3a3d5c]">
          © {new Date().getFullYear()} Gloxad Academy. Academic Excellence &amp; Enterprise Scalability.
        </p>
      </div>
      <nav aria-label="Legal" className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-[#3a3d5c]">
        {links.map((link) => (
          <Link key={link.label} href={link.href} className="transition-colors hover:text-[#030069] hover:underline">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  </footer>
);

export default InstitutionFooter;
