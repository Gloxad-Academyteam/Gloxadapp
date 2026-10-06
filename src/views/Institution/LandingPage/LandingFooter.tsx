import Link from "next/link";
import { LuGlobe, LuShare2 } from "react-icons/lu";

const columns = [
  { title: "Company", links: [["About", "/institution"], ["Careers", "/institution"]] },
  { title: "Resources", links: [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]] },
  { title: "Support", links: [["Contact Us", "/contact"], ["Partnerships", "/institution/activate"]] },
] as const;

const LandingFooter = () => (
  <footer className="bg-[#eff3fa]">
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-8 pt-14 sm:px-8">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-[300px]">
          <p className="text-[18px] font-bold text-[#0a3d91]">Gloxad Academy</p>
          <p className="mt-3 text-[13px] leading-[1.7] text-[#6a6d83]">
            Empowering institutions to lead the digital transformation of education through precision and technology.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0a3d91]">{column.title}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-[13px] text-[#6a6d83] transition-colors hover:text-[#030069]">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-12 flex items-center justify-between gap-4 border-t border-[#dfe5f1] pt-6">
        <p className="text-[12px] text-[#6a6d83]">© {new Date().getFullYear()} Gloxad Academy. All rights reserved.</p>
        <div className="flex items-center gap-4 text-[#6a6d83]">
          <LuGlobe size={18} aria-label="Language" />
          <LuShare2 size={18} aria-label="Share" />
        </div>
      </div>
    </div>
  </footer>
);

export default LandingFooter;
