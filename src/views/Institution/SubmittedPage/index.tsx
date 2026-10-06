"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { LuClock, LuHeadphones, LuMail, LuReceipt, LuShieldCheck } from "react-icons/lu";
import InstitutionFooter from "../components/InstitutionFooter";
import { useOnboarding } from "../context/OnboardingContext";
import { outlineButton, primaryButton } from "../styles";

const SubmittedPage = () => {
  const { state } = useOnboarding();

  const details = [
    { Icon: LuReceipt, label: "Request ID", value: state.requestId ?? "Pending" },
    { Icon: LuClock, label: "Est. Review Time", value: "24-48 Hours" },
    { Icon: LuMail, label: "Notification Method", value: "Email & Portal" },
  ];

  return (
    <>
    <main className="mx-auto flex w-full max-w-[1000px] flex-col items-center px-4 pb-20 pt-10 text-center sm:px-8 sm:pt-16 lg:pt-24">
      <div className="relative flex h-[200px] w-[200px] items-center justify-center sm:h-[250px] sm:w-[250px]">
        <span aria-hidden className="absolute inset-0 rounded-full border border-dashed border-[#d0d3ee]" />
        <span aria-hidden className="absolute inset-[22px] rounded-full bg-[#eef0fc] sm:inset-[26px]" />
        <span className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full bg-gradient-to-br from-[#1d4fa8] to-[#030069] shadow-[0_18px_40px_-12px_rgba(3,0,105,0.5)] sm:h-[150px] sm:w-[150px]">
          <LuShieldCheck className="text-white" size={64} strokeWidth={1.6} />
        </span>
        <span className="absolute left-1/2 top-[8px] flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#fdb913] px-4 py-1.5 text-[13px] font-medium text-[#5b3d00] shadow sm:top-[10px] sm:text-[15px]">
          <LuClock size={15} /> Pending Review
        </span>
      </div>

      <h1 className="mt-6 text-[34px] font-bold leading-tight text-[#14162b] sm:text-[48px] lg:text-[56px]">
        Application Submitted
      </h1>
      <p className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-[#3f4257] sm:text-[19px]">
        Your request has been submitted successfully. Our team will review your application and contact you shortly.
      </p>

      <dl className="mt-10 grid w-full max-w-[920px] gap-4 sm:grid-cols-3 sm:gap-5">
        {details.map(({ Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center rounded-[14px] border border-[#d9dcec] bg-white px-4 py-6">
            <Icon className="text-[#030069]" size={26} />
            <dt className="mt-3 text-[14px] text-[#4a4d66]">{label}</dt>
            <dd className="mt-1 text-[18px] font-bold text-[#14162b]">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
        <Link href="/institution/dashboard" className={primaryButton}>
          Track Request <FiArrowRight />
        </Link>
        <Link href="/contact" className={`${outlineButton} !border-[#d5d9ec] !text-[#3a3d5c]`}>
          <LuHeadphones size={18} /> Contact Support
        </Link>
      </div>
    </main>
    <InstitutionFooter />
    </>
  );
};

export default SubmittedPage;
