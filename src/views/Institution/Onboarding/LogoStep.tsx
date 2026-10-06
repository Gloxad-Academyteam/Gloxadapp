"use client";

import { DragEvent, KeyboardEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiInfo } from "react-icons/fi";
import { LuUploadCloud } from "react-icons/lu";
import { toast } from "react-toastify";
import OnboardingFrame from "../components/OnboardingFrame";
import { useOnboarding } from "../context/OnboardingContext";
import { nextStepHref } from "../steps";
import { mutedButton, primaryButton } from "../styles";

const ACCEPTED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/gif"];
const MAX_DIMENSION = 800;
const MIN_DIMENSION = 512;
const MAX_BYTES = 2 * 1024 * 1024;

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const measure = (dataUrl: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("Could not read the image"));
    image.src = dataUrl;
  });

const LogoStep = () => {
  const router = useRouter();
  const { state, update } = useOnboarding();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError("");
    setNote("");

    if (!ACCEPTED_TYPES.includes(file.type)) return setError("Please choose an SVG, PNG, JPG or GIF file.");
    if (file.size > MAX_BYTES) return setError("The file is larger than 2MB. Please choose a smaller logo.");

    try {
      const dataUrl = await readAsDataUrl(file);
      if (file.type !== "image/svg+xml") {
        const { width, height } = await measure(dataUrl);
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          return setError(`Logos can be at most ${MAX_DIMENSION}×${MAX_DIMENSION}px. This one is ${width}×${height}px.`);
        }
        if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
          setNote(`This logo is ${width}×${height}px. ${MIN_DIMENSION}×${MIN_DIMENSION}px or larger looks sharper on certificates.`);
        }
      }
      update({ logo: { name: file.name, dataUrl } });
    } catch {
      setError("We couldn't read that file. Please try another image.");
    }
  };

  const openPicker = () => inputRef.current?.click();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const goNext = () => router.push(nextStepHref("logo"));

  const removeLogo = () => {
    update({ logo: null });
    setNote("");
    toast.info("Logo removed");
  };

  return (
    <OnboardingFrame
      step="logo"
      title="Institution Onboarding"
      subtitle="Welcome to Gloxad. Let's set up your institutional foundation to ensure academic excellence and administrative efficiency."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-10">
        <div className="flex flex-col gap-6">
          <section className="rounded-[16px] border border-[#e3e6f3] bg-white p-6 sm:p-8">
            <h2 className="text-[24px] font-bold text-[#030069]">Identity Matters</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#4a4d66]">
              Your logo will appear on all student certifications, administrative dashboards, and institutional reports.
            </p>
            <p className="mt-5 flex items-start gap-3 text-[16px] leading-snug text-[#7a5b00]">
              <FiInfo className="mt-0.5 shrink-0" size={22} />
              Recommended: PNG or SVG with transparent background.
            </p>
          </section>
          <section className="rounded-[16px] border border-[#dde0f6] bg-[#eef0fc] p-6 sm:p-8">
            <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#4a4d66]">Quick tips</h2>
            <ul className="mt-5 flex flex-col gap-4 text-[16px] text-[#1b1d33]">
              {["Min size: 512×512px", "Square aspect ratio preferred"].map((tip) => (
                <li key={tip} className="flex items-start gap-3">
                  <FiCheckCircle className="mt-0.5 shrink-0 text-[#030069]" size={22} /> {tip}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-[16px] border border-[#d9dcec] bg-white p-6 sm:p-10">
          <h2 className="text-[24px] font-bold text-[#14162b] sm:text-[28px]">Upload Institution Logo</h2>
          <p className="mt-1 text-[15px] text-[#4a4d66]">Drag and drop your file below or click to browse.</p>

          <div
            role="button"
            tabIndex={0}
            aria-label="Upload institution logo"
            onClick={openPicker}
            onKeyDown={handleKeyDown}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`mt-8 flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-[14px] border-2 border-dashed px-4 py-10 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#030069] sm:min-h-[320px] ${
              isDragging ? "border-[#030069] bg-[#eef0fc]" : "border-[#cfd2e6] bg-[#fafaff] hover:border-[#9da3d8]"
            }`}
          >
            {state.logo ? (
              <>
                <img
                  src={state.logo.dataUrl}
                  alt="Your institution logo"
                  className="max-h-[140px] max-w-[200px] rounded-[10px] bg-white object-contain p-2 shadow-sm sm:max-h-[170px]"
                />
                <p className="mt-4 max-w-full truncate text-[15px] font-medium text-[#14162b]">{state.logo.name}</p>
                <p className="mt-1 text-[13px] text-[#6a6d83]">Click or drop a file to replace it</p>
              </>
            ) : (
              <>
                <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#e8ebfc] text-[#030069]">
                  <LuUploadCloud size={36} />
                </span>
                <p className="mt-6 text-[17px] font-medium text-[#14162b]">Click to upload or drag and drop</p>
                <p className="mt-1.5 text-[14px] text-[#4a4d66]">SVG, PNG, JPG or GIF (max. 800×800px)</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".svg,.png,.jpg,.jpeg,.gif,image/svg+xml,image/png,image/jpeg,image/gif"
              className="hidden"
              onChange={(event) => {
                handleFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </div>

          {error && (
            <p role="alert" className="mt-4 text-[14px] text-[#d93025]">
              {error}
            </p>
          )}
          {note && !error && <p className="mt-4 text-[14px] text-[#7a5b00]">{note}</p>}

          <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goNext}
                className="px-1 py-2 text-[16px] font-medium text-[#3a3d5c] hover:text-[#030069]"
              >
                Skip for now
              </button>
              {state.logo && (
                <button type="button" onClick={removeLogo} className={`${mutedButton} !py-2 !text-[14px]`}>
                  Remove logo
                </button>
              )}
            </div>
            <button type="button" onClick={goNext} disabled={!state.logo} className={`${primaryButton} !px-10`}>
              Continue
            </button>
          </div>
        </section>
      </div>
    </OnboardingFrame>
  );
};

export default LogoStep;
