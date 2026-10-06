"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiCheckCircle, FiCreditCard, FiInfo, FiLock } from "react-icons/fi";
import { LuAppWindow, LuBadgeCheck, LuBuilding2, LuGraduationCap, LuHeadphones, LuKeyRound, LuShieldCheck, LuUserCheck, LuX, LuZap } from "react-icons/lu";
import { MdVerified } from "react-icons/md";
import { PiBank } from "react-icons/pi";
import CategoryImage from "@components/CategoryImage";
import OnboardingFrame from "../components/OnboardingFrame";
import { makeRequestId, TBilling, TPlan, useOnboarding } from "../context/OnboardingContext";
import { institutionImages } from "../images";
import { cardClass, inputClass, labelClass, outlineButton, primaryButton } from "../styles";

const ANNUAL_DISCOUNT = 0.2;

const PLANS: Record<
  TPlan,
  { name: string; tagline: string; price: number; seats: string; features: { Icon: typeof LuZap; text: string; strong?: boolean }[] }
> = {
  premium: {
    name: "Premium Growth",
    tagline: "For expanding institutions",
    price: 249,
    seats: "Up to 500",
    features: [
      { Icon: FiCheckCircle, text: "Up to 500 Students" },
      { Icon: FiCheckCircle, text: "10 Departments" },
      { Icon: FiCheckCircle, text: "Advanced Analytics" },
      { Icon: FiCheckCircle, text: "Email Support" },
    ],
  },
  enterprise: {
    name: "Enterprise Scalability",
    tagline: "Full-scale academic control",
    price: 599,
    seats: "Unlimited",
    features: [
      { Icon: LuZap, text: "Unlimited Students", strong: true },
      { Icon: LuUserCheck, text: "Dedicated Account Manager" },
      { Icon: LuKeyRound, text: "Custom SSO/SAML" },
      { Icon: LuHeadphones, text: "Priority 24/7 Support" },
      { Icon: LuAppWindow, text: "White-labeling" },
    ],
  },
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const passesLuhn = (digits: string) => {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let value = Number(digits[i]);
    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    double = !double;
  }
  return sum % 10 === 0;
};

type TCardErrors = Partial<Record<"holder" | "number" | "expiry" | "cvv", string>>;

const validateCard = (holder: string, number: string, expiry: string, cvv: string): TCardErrors => {
  const errors: TCardErrors = {};
  const digits = number.replace(/\s/g, "");
  if (!holder.trim()) errors.holder = "Enter the name on the card.";
  if (digits.length < 13 || digits.length > 19 || !passesLuhn(digits)) errors.number = "Enter a valid card number.";

  const [month, year] = expiry.split("/").map(Number);
  const now = new Date();
  const expired = !year || year + 2000 < now.getFullYear() || (year + 2000 === now.getFullYear() && month < now.getMonth() + 1);
  if (!/^\d{2}\/\d{2}$/.test(expiry) || month < 1 || month > 12 || expired) errors.expiry = "Enter a valid expiry date.";
  if (!/^\d{3,4}$/.test(cvv)) errors.cvv = "Enter the 3 or 4 digit code.";
  return errors;
};

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} role="alert" className="mt-1.5 text-[13px] text-[#d93025]">
      {message}
    </p>
  ) : null;

const SummaryRow = ({ label, value, accent }: { label: string; value: ReactNode; accent?: boolean }) => (
  <div className={`flex items-start justify-between gap-4 text-[16px] ${accent ? "text-[#b3261e]" : "text-[#3f4257]"}`}>
    <dt>{label}</dt>
    <dd className="shrink-0 text-right">{value}</dd>
  </div>
);

const SubscriptionStep = () => {
  const router = useRouter();
  const { state, update } = useOnboarding();
  const { plan, billing } = state;
  const selected = PLANS[plan];

  const [method, setMethod] = useState<"card" | "bank">("card");
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardErrors, setCardErrors] = useState<TCardErrors>({});
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const gross = billing === "annual" ? selected.price * 12 : selected.price;
  const discount = billing === "annual" ? gross * ANNUAL_DISCOUNT : 0;
  const total = gross - discount;

  useEffect(() => {
    if (!isReviewOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setIsReviewOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isReviewOpen]);

  const finalize = () => {
    if (method === "card") {
      const errors = validateCard(holder, number, expiry, cvv);
      setCardErrors(errors);
      if (Object.keys(errors).length) return;
    }
    // Card details stay in this component's state and are never saved or sent anywhere yet
    update({ requestId: state.requestId ?? makeRequestId() });
    router.push("/institution/submitted");
  };

  const formatNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 19)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const planCard = (key: TPlan) => {
    const item = PLANS[key];
    const isSelected = plan === key;
    const isRecommended = key === "enterprise";

    return (
      <div key={key} className="relative">
        {isRecommended && (
          <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#030069] px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
            Recommended
          </span>
        )}
        <button
          type="button"
          role="radio"
          aria-checked={isSelected}
          onClick={() => update({ plan: key })}
          className={`flex h-full w-full flex-col rounded-[16px] border bg-white p-6 text-left transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#030069] sm:p-8 ${
            isSelected
              ? "border-2 border-[#6f6fd0] shadow-[0_12px_30px_-14px_rgba(60,60,160,0.45)]"
              : "border-[#d9dcec] hover:border-[#b9bde0]"
          }`}
        >
          <span className="flex items-start justify-between gap-4">
            <span className="flex items-start gap-3">
              <span>
                <span className="font-display block text-[24px] font-bold leading-tight text-[#14162b] sm:text-[26px]">{item.name}</span>
                <span className="mt-1 block text-[13px] text-[#4a4d66]">{item.tagline}</span>
              </span>
              {isRecommended && <MdVerified className="mt-1 shrink-0 text-[#f5a623]" size={26} />}
            </span>
            <span
              aria-hidden
              className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                isSelected ? "bg-[#030069] text-white" : "border border-[#b9bde0] bg-white"
              }`}
            >
              {isSelected && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6.2 5 8.5 9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </span>

          <span className="mt-6 flex items-baseline gap-1">
            <span className="font-display text-[40px] font-bold leading-none text-[#14162b] sm:text-[44px]">${item.price}</span>
            <span className="text-[16px] text-[#4a4d66]">/month</span>
          </span>

          <ul className="mt-6 flex flex-col gap-3.5 text-[16px] text-[#3f4257]">
            {item.features.map(({ Icon, text, strong }) => (
              <li key={text} className={`flex items-center gap-3 ${strong ? "font-bold text-[#14162b]" : ""}`}>
                <Icon className="shrink-0 text-[#030069]" size={18} />
                {text}
              </li>
            ))}
          </ul>
        </button>
      </div>
    );
  };

  const reviewRows = [
    { label: "Logo", value: state.logo ? state.logo.name : "Not uploaded" },
    { label: "Departments", value: state.departments.length ? `${state.departments.length} (${state.departments.map((d) => d.name).join(", ")})` : "None added" },
    { label: "Tutors", value: `${state.tutors.length} added` },
    { label: "Students", value: `${state.students.length} added` },
    { label: "Plan", value: `${selected.name}, billed ${billing}` },
    { label: "Total due", value: money(total) },
  ];

  return (
    <OnboardingFrame step="subscription" title="Subscription" subtitle="Choose the plan that fits your institution.">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] xl:grid-cols-[minmax(0,1fr)_480px]">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col justify-between gap-5 rounded-[16px] border border-[#d9dcec] bg-[#f6f5fb] p-6 sm:flex-row sm:items-center sm:p-8 lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
            <div>
              <h2 className="text-[22px] font-bold text-[#14162b]">Billing Frequency</h2>
              <p className="mt-1 max-w-[280px] text-[16px] text-[#3f4257]">Choose the schedule that fits your academy&apos;s budget.</p>
            </div>
            <div role="radiogroup" aria-label="Billing frequency" className="grid shrink-0 grid-cols-2 rounded-[10px] bg-[#e3e4ec] p-1 sm:w-[270px]">
              {(["monthly", "annual"] as TBilling[]).map((option) => {
                const isSelected = billing === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => update({ billing: option })}
                    className={`rounded-[8px] px-4 py-3 text-center transition-colors ${
                      isSelected ? "bg-white shadow-sm" : "text-[#4a4d66] hover:text-[#030069]"
                    }`}
                  >
                    <span className={`block text-[16px] ${isSelected ? "font-bold text-[#030069]" : ""}`}>
                      {option === "monthly" ? "Monthly" : "Annual"}
                    </span>
                    {option === "annual" && (
                      <span className="block text-[11px] font-medium leading-tight text-[#a8431f]">(Save 20%)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <div role="radiogroup" aria-label="Plan" className="grid gap-8 pt-3 sm:grid-cols-2 sm:gap-6">
            {planCard("premium")}
            {planCard("enterprise")}
          </div>

          <section className="rounded-[16px] border border-[#d9dcec] bg-[#f6f5fb] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[22px] font-bold text-[#14162b]">Payment Method</h2>
              <div role="tablist" aria-label="Payment method" className="flex gap-2">
                {[
                  { key: "card", label: "Card", Icon: FiCreditCard },
                  { key: "bank", label: "Bank Transfer", Icon: PiBank },
                ].map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={method === key}
                    onClick={() => setMethod(key as "card" | "bank")}
                    className={`flex items-center gap-2 rounded-[8px] px-4 py-2.5 text-[16px] transition-colors ${
                      method === key ? "bg-[#e3e4f2] font-bold text-[#030069]" : "text-[#3f4257] hover:bg-[#eceef8]"
                    }`}
                  >
                    <Icon size={20} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {method === "card" ? (
              <div className="mt-6">
                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="card-holder" className={labelClass}>
                      Cardholder Name
                    </label>
                    <input
                      id="card-holder"
                      value={holder}
                      onChange={(event) => setHolder(event.target.value)}
                      placeholder="Dr. Julian Sterling"
                      autoComplete="cc-name"
                      aria-invalid={!!cardErrors.holder}
                      aria-describedby="card-holder-error"
                      className={`${inputClass} ${cardErrors.holder ? "!border-[#d93025]" : ""}`}
                    />
                    <FieldError id="card-holder-error" message={cardErrors.holder} />
                  </div>
                  <div>
                    <label htmlFor="card-number" className={labelClass}>
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        id="card-number"
                        inputMode="numeric"
                        value={number}
                        onChange={(event) => setNumber(formatNumber(event.target.value))}
                        placeholder="0000 0000 0000 0000"
                        autoComplete="cc-number"
                        aria-invalid={!!cardErrors.number}
                        aria-describedby="card-number-error"
                        className={`${inputClass} !pr-20 ${cardErrors.number ? "!border-[#d93025]" : ""}`}
                      />
                      <span aria-hidden className="absolute right-4 top-1/2 flex -translate-y-1/2 gap-1">
                        <span className="h-4 w-6 rounded-[3px] bg-[#cfd4ea]" />
                        <span className="h-4 w-6 rounded-[3px] bg-[#97a3c9]" />
                      </span>
                    </div>
                    <FieldError id="card-number-error" message={cardErrors.number} />
                  </div>
                  <div>
                    <label htmlFor="card-expiry" className={labelClass}>
                      Expiry Date
                    </label>
                    <input
                      id="card-expiry"
                      inputMode="numeric"
                      value={expiry}
                      onChange={(event) => setExpiry(formatExpiry(event.target.value))}
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      aria-invalid={!!cardErrors.expiry}
                      aria-describedby="card-expiry-error"
                      className={`${inputClass} ${cardErrors.expiry ? "!border-[#d93025]" : ""}`}
                    />
                    <FieldError id="card-expiry-error" message={cardErrors.expiry} />
                  </div>
                  <div>
                    <label htmlFor="card-cvv" className={labelClass}>
                      CVV / CVC
                    </label>
                    <div className="relative">
                      <input
                        id="card-cvv"
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={cvv}
                        onChange={(event) => setCvv(event.target.value.replace(/\D/g, ""))}
                        placeholder="***"
                        autoComplete="cc-csc"
                        aria-invalid={!!cardErrors.cvv}
                        aria-describedby="card-cvv-error"
                        className={`${inputClass} !pr-12 ${cardErrors.cvv ? "!border-[#d93025]" : ""}`}
                      />
                      <FiInfo
                        aria-label="The 3 or 4 digit security code on your card"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6a6d83]"
                        size={20}
                      />
                    </div>
                    <FieldError id="card-cvv-error" message={cardErrors.cvv} />
                  </div>
                </div>
                <p className="mt-6 flex items-start gap-2 text-[13px] text-[#4a4d66]">
                  <FiLock className="mt-0.5 shrink-0" size={15} />
                  Encrypted 256-bit SSL transaction. Gloxad Academy does not store full card numbers.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-[12px] border border-[#d9dcec] bg-white p-5 text-[15px] leading-relaxed text-[#3f4257]">
                <p className="font-medium text-[#14162b]">Pay by bank transfer</p>
                <p className="mt-2">
                  Our team will email the bank details and a payment reference once you finalize. Your workspace is
                  activated when the transfer clears.
                </p>
              </div>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
          <section className="rounded-[16px] border border-[#d9dcec] bg-[#e6e4ec] p-6 sm:p-8">
            <h2 className="text-[22px] font-bold text-[#14162b]">Order Summary</h2>
            <dl className="mt-8 flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <dt className="text-[17px] font-bold text-[#14162b]">{selected.name}</dt>
                  <p className="mt-1 text-[13px] text-[#4a4d66]">{billing === "annual" ? "Annual" : "Monthly"} Billing cycle</p>
                </div>
                <dd className="shrink-0 text-[17px] font-bold text-[#14162b]">{money(gross)}</dd>
              </div>
              <SummaryRow label="Institution Seats" value={selected.seats} />
              <SummaryRow label="Platform Access Fee" value="Included" />
              {billing === "annual" && (
                <SummaryRow label="Annual Discount (20%)" value={`-${money(discount)}`} accent />
              )}
            </dl>
            <div className="mt-6 border-t border-[#c9c8d6] pt-6">
              <div className="flex items-end justify-between gap-4">
                <span className="text-[18px] font-bold text-[#14162b]">Total Due</span>
                <span className="font-display text-[30px] font-bold leading-none text-[#030069] sm:text-[34px]" aria-live="polite">
                  {money(total)}
                </span>
              </div>
              <p className="mt-2 text-right text-[12px] text-[#4a4d66]">Taxes calculated at checkout</p>
            </div>

            <button type="button" onClick={finalize} className={`${primaryButton} mt-8 w-full !justify-between !rounded-[10px] !px-6 !py-5 !text-[16px] !font-bold`}>
              <span className="text-left leading-snug">Activate Workspace &amp; Finalize</span>
              <FiArrowRight size={22} className="shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => setIsReviewOpen(true)}
              className={`${outlineButton} mt-4 w-full !border-[#d0d0dc] !bg-[#eeedf3] !py-4 !text-[#3f4257]`}
            >
              Review Setup
            </button>

            <div className="mt-6 flex items-start gap-3 rounded-[12px] bg-white p-5">
              <LuShieldCheck className="mt-0.5 shrink-0 text-[#f5a623]" size={26} />
              <div>
                <p className="text-[14px] font-bold text-[#14162b]">30-Day Money Back Guarantee</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#4a4d66]">
                  Institutional setups are protected by our satisfaction guarantee. Complete refund if the platform
                  doesn&apos;t meet your academic needs.
                </p>
              </div>
            </div>
          </section>

          <figure className="relative aspect-[16/6] overflow-hidden rounded-[16px] bg-[#3f3fa0]">
            <CategoryImage src={institutionImages.glassBuilding} className="h-full w-full object-cover" fallback={null} />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#2a2894]/95 via-[#3d3bb0]/55 to-[#4a47c9]/30" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-5 text-[17px] font-bold leading-tight text-white">
              <LuGraduationCap size={26} className="shrink-0" />
              <span>
                Onboarding Academy
                <br />
                Excellence
              </span>
            </figcaption>
          </figure>
        </aside>
      </div>

      {isReviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0a2a]/50 p-4 backdrop-blur-sm"
          onClick={() => setIsReviewOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
            onClick={(event) => event.stopPropagation()}
            className={`${cardClass} max-h-[90vh] w-full max-w-[520px] overflow-y-auto p-6 sm:p-8`}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="review-title" className="text-[22px] font-bold text-[#14162b]">
                Review your setup
              </h2>
              <button
                type="button"
                autoFocus
                aria-label="Close"
                onClick={() => setIsReviewOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#4a4d66] hover:bg-[#f2f3ff]"
              >
                <LuX size={20} />
              </button>
            </div>
            <dl className="mt-5 divide-y divide-[#e3e6f3]">
              {reviewRows.map((row) => (
                <div key={row.label} className="flex justify-between gap-6 py-3 text-[15px]">
                  <dt className="text-[#4a4d66]">{row.label}</dt>
                  <dd className="text-right font-medium text-[#14162b]">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => router.push("/institution/onboarding/logo")} className={outlineButton}>
                <LuBuilding2 size={18} /> Edit from the start
              </button>
              <button type="button" onClick={() => setIsReviewOpen(false)} className={primaryButton}>
                <LuBadgeCheck size={18} /> Looks good
              </button>
            </div>
          </div>
        </div>
      )}
    </OnboardingFrame>
  );
};

export default SubscriptionStep;
