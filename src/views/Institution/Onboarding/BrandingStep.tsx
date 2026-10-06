"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ActionBar from "../components/ActionBar";
import OnboardingFrame from "../components/OnboardingFrame";
import { makeRequestId, useOnboarding } from "../context/OnboardingContext";
import { previousStepHref } from "../steps";
import { inputClass, labelClass } from "../styles";

const SWATCHES = ["#030069", "#0b57d0", "#0e7c86", "#1e7e4b", "#b45309", "#b3261e"];

const BrandingStep = () => {
  const router = useRouter();
  const { state, isReady, update } = useOnboarding();
  const [displayName, setDisplayName] = useState("");
  const [color, setColor] = useState(SWATCHES[0]);
  const [tagline, setTagline] = useState("");

  useEffect(() => {
    if (!isReady) return;
    setDisplayName(state.branding.displayName);
    setColor(state.branding.color);
    setTagline(state.branding.tagline);
    // Seed the form once from the saved draft
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const finish = (shouldSave: boolean) => {
    update({
      ...(shouldSave && { branding: { displayName: displayName.trim(), color, tagline: tagline.trim() } }),
      requestId: state.requestId ?? makeRequestId(),
    });
    router.push("/institution/submitted");
  };

  const previewName = displayName.trim() || "Your Institution";

  return (
    <OnboardingFrame
      step="branding"
      title="Branding"
      subtitle="Choose how your institution appears to tutors and students."
    >
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <section className="rounded-[16px] border border-[#d9dcec] bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="brand-name" className={labelClass}>
                Display Name
              </label>
              <input
                id="brand-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="e.g. Gloxad University"
                maxLength={60}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="brand-tagline" className={labelClass}>
                Tagline <span className="font-normal text-[#6a6d83]">(optional)</span>
              </label>
              <input
                id="brand-tagline"
                value={tagline}
                onChange={(event) => setTagline(event.target.value)}
                placeholder="e.g. Institutional Portal"
                maxLength={80}
                className={inputClass}
              />
            </div>
            <div>
              <span id="brand-color-label" className={labelClass}>
                Brand Color
              </span>
              <div role="radiogroup" aria-labelledby="brand-color-label" className="flex flex-wrap items-center gap-3">
                {SWATCHES.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    role="radio"
                    aria-checked={color === swatch}
                    aria-label={swatch}
                    onClick={() => setColor(swatch)}
                    className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-105 ${
                      color === swatch ? "border-[#14162b] ring-2 ring-white ring-offset-2 ring-offset-[#14162b]" : "border-white shadow"
                    }`}
                    style={{ backgroundColor: swatch }}
                  />
                ))}
                <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#3f4257]">
                  <input
                    type="color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    aria-label="Custom brand color"
                    className="h-10 w-10 cursor-pointer rounded-full border border-[#d5d9ec] bg-white p-0.5"
                  />
                  Custom
                </label>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Preview" className="rounded-[16px] border border-[#d9dcec] bg-[#f6f5fb] p-6 sm:p-8">
          <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#6a6d83]">Preview</p>
          <div className="mt-4 overflow-hidden rounded-[14px] border border-[#d9dcec] bg-white">
            <div className="flex items-center gap-3 px-5 py-4" style={{ backgroundColor: color }}>
              {state.logo ? (
                <img src={state.logo.dataUrl} alt="" className="h-10 w-10 rounded-[8px] bg-white object-contain p-1" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-white/90 text-[16px] font-bold" style={{ color }}>
                  {previewName[0]?.toUpperCase()}
                </span>
              )}
              <div className="min-w-0 text-white">
                <p className="font-display truncate text-[18px] font-bold leading-tight">{previewName}</p>
                <p className="truncate text-[11px] uppercase tracking-[0.12em] text-white/75">{tagline.trim() || "Institutional Portal"}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-5">
              <span className="h-3 w-2/3 rounded-full bg-[#e8eaf5]" />
              <span className="h-3 w-1/2 rounded-full bg-[#e8eaf5]" />
              <span className="mt-2 inline-block w-fit rounded-[8px] px-4 py-2 text-[13px] font-bold text-white" style={{ backgroundColor: color }}>
                Primary action
              </span>
            </div>
          </div>
        </section>
      </div>

      <ActionBar
        backHref={previousStepHref("branding")}
        onSkip={() => finish(false)}
        onContinue={() => finish(true)}
        continueLabel="Save & Finish"
      />
    </OnboardingFrame>
  );
};

export default BrandingStep;
