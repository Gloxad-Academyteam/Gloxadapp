import Link from "next/link";
import Image from "next/image";
import { FaLinkedinIn, FaFacebookF, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import FooterLogo from "@assets/images/footer-logo.png";

const Footer = () => {
  return (
    <footer className="w-full bg-[#2552a0] text-white py-20 px-5 md:px-10 lg:px-[60px] xl:px-[120px]">
      <div className="mx-auto max-w-[1400px] grid grid-cols-2 lg:flex lg:flex-row justify-between items-start gap-x-4 gap-y-8 lg:gap-6 xl:gap-10 w-full">
        
        {/* Logo and Socials (Row 1, Col 1 on mobile) */}
        <div className="col-span-1 flex flex-col items-start shrink-0 w-full lg:w-auto">
          <Link href="/">
            <Image src={FooterLogo} alt="Gloxad Logo" className="h-[48px] lg:h-[72px] w-auto -ml-2 lg:-ml-0" priority={false} />
          </Link>
          <div className="flex items-center gap-2 lg:gap-4 mt-4 lg:mt-12">
            <a href="#" className="flex h-[28px] w-[28px] lg:h-[32px] lg:w-[32px] items-center justify-center rounded-[6px] bg-white text-[#2552a0] transition hover:scale-105">
              <FaLinkedinIn size={14} className="lg:text-[16px]" />
            </a>
            <a href="#" className="flex h-[28px] w-[28px] lg:h-[32px] lg:w-[32px] items-center justify-center rounded-[6px] bg-white text-[#2552a0] transition hover:scale-105">
              <FaFacebookF size={14} className="lg:text-[16px]" />
            </a>
            <a href="#" className="flex h-[28px] w-[28px] lg:h-[32px] lg:w-[32px] items-center justify-center rounded-[6px] bg-white text-[#2552a0] transition hover:scale-105">
              <FaXTwitter size={14} className="lg:text-[16px]" />
            </a>
            <a href="#" className="flex h-[28px] w-[28px] lg:h-[32px] lg:w-[32px] items-center justify-center rounded-[6px] bg-white text-[#2552a0] transition hover:scale-105">
              <FaInstagram size={14} className="lg:text-[16px]" />
            </a>
          </div>
        </div>

        {/* Quick Links (Row 1, Col 2 on mobile) */}
        <div className="col-span-1 flex flex-col gap-3 lg:gap-4 lg:ml-8">
          <h4 className="text-[13px] lg:text-[14px] font-bold">Quick Links</h4>
          <Link href="/" className="text-[12px] lg:text-[13px] text-white/90 hover:underline">Home</Link>
          <Link href="/courses" className="text-[12px] lg:text-[13px] text-white/90 hover:underline">Explore Courses</Link>
          <Link href="/free" className="text-[12px] lg:text-[13px] text-white/90 hover:underline">Free Courses</Link>
          <Link href="/scholarships" className="text-[12px] lg:text-[13px] text-white/90 hover:underline">Scholarships</Link>
          <Link href="/#faqs" className="text-[12px] lg:text-[13px] text-white/90 hover:underline">FAQ & Help Center</Link>
        </div>
          
        {/* Contact (Row 2, Col 1 on mobile) */}
        <div className="col-span-1 flex flex-col gap-3 lg:gap-4 mt-2 lg:mt-0">
          <h4 className="text-[13px] lg:text-[14px] font-bold">Contact</h4>
          <Link href="/contact" className="text-[12px] lg:text-[13px] text-white/90 hover:underline">Contact Us</Link>
          <Link href="/help" className="text-[12px] lg:text-[13px] text-white/90 hover:underline">Help Center</Link>
        </div>

        {/* Legal & Support (Row 2, Col 2 on mobile) */}
        <div className="col-span-1 flex flex-col gap-3 lg:gap-4 mt-2 lg:mt-0">
          <h4 className="text-[13px] lg:text-[14px] font-bold">Legal & Support</h4>
          <Link href="/privacy" className="text-[12px] lg:text-[13px] text-white/90 hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-[12px] lg:text-[13px] text-white/90 hover:underline">Terms & Conditions</Link>
        </div>

        {/* Subscribe (Row 3, spanning both columns on mobile) */}
        <div className="col-span-2 lg:col-span-1 flex flex-col gap-4 lg:gap-5 shrink-0 mt-6 lg:mt-0">
          <h4 className="text-[14px] lg:text-[15px] font-medium">Subscribe to our newsletter</h4>
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 lg:gap-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full xl:w-[260px] rounded-full border border-white/60 bg-transparent px-5 py-[10px] lg:py-[11px] pr-12 text-[13px] lg:text-[14px] text-white placeholder-white/70 focus:border-white focus:outline-none"
              />
              <HiOutlineMail className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70" size={18} />
            </div>
            <button className="rounded-full bg-white px-8 py-[10px] lg:py-[11px] text-[13px] lg:text-[14px] font-medium text-[#2552a0] hover:bg-gray-100 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      <div className="mx-auto max-w-[1512px] mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-white/90">
        <p>© 2026 Gloxad Academy Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          {/* INACTIVE LINKS LOGGED FOR LATER:
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/cookie-settings" className="hover:underline">Cookie Settings</Link>
          */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
