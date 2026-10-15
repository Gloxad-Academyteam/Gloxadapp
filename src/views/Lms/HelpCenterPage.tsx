"use client";

import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";
import { IconType } from "react-icons";
import {
  MdCheck,
  MdOutlineAccountBalanceWallet,
  MdOutlineCheck,
  MdOutlineCloudUpload,
  MdOutlineDesktopWindows,
  MdOutlineSchool,
  MdOutlineSend,
  MdOutlinePhone,
} from "react-icons/md";
import { LuX } from "react-icons/lu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { lmsApi, TApiInquiry, uploadAttachment } from "@services/lms";
import { toast } from "react-toastify";
import LmsShell, { soon } from "./components/LmsShell";
import { cardClass, inputClass, outlineButton, primaryButton } from "./components/ui";
import useDemoMode from "./useDemoMode";
import { INQUIRIES, INQUIRY_CATEGORIES, PRIORITY_HOTLINE, TInquiry, TInquiryCategory } from "./data";

const CATEGORY_ICON: Record<TInquiryCategory, IconType> = {
  academics: MdOutlineSchool,
  technical: MdOutlineDesktopWindows,
  billing: MdOutlineAccountBalanceWallet,
};

const ACCEPTED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "application/pdf"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 5;

type TErrors = { subject?: string; description?: string };

const formatSize = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const agoLabel = (iso: string) => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days < 14 ? `${days}d ago` : `${Math.round(days / 7)}w ago`;
};

const toInquiry = (item: TApiInquiry): TInquiry => ({
  id: item._id,
  status: item.status === "resolved" ? "resolved" : "pending",
  ago: agoLabel(item.createdAt),
  subject: item.subject,
  category: INQUIRY_CATEGORIES.find((entry) => entry.key === item.category)?.label ?? item.category,
});

const HelpCenterPage = () => {
  const demo = useDemoMode();
  const queryClient = useQueryClient();
  const inquiriesQuery = useQuery({ queryKey: ["lms", "inquiries"], queryFn: lmsApi.inquiries, enabled: demo === false });
  const [category, setCategory] = useState<TInquiryCategory>("academics");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<TErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Demo logins keep their inquiries in memory; real accounts use the inquiries API
  const [demoInquiries, setDemoInquiries] = useState<TInquiry[]>(INQUIRIES);
  const inquiries: TInquiry[] = demo ? demoInquiries : (inquiriesQuery.data ?? []).map(toInquiry);
  const fileInput = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | File[]) => {
    const accepted: File[] = [];
    for (const file of Array.from(incoming)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: only SVG, PNG, JPG or PDF files are allowed.`);
      } else if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name} is larger than 10MB.`);
      } else {
        accepted.push(file);
      }
    }
    setFiles((current) => {
      const next = [...current, ...accepted.filter((file) => !current.some((existing) => existing.name === file.name && existing.size === file.size))];
      if (next.length > MAX_FILES) toast.error(`You can attach up to ${MAX_FILES} files.`);
      return next.slice(0, MAX_FILES);
    });
  };

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const reset = () => {
    setCategory("academics");
    setSubject("");
    setDescription("");
    setFiles([]);
    setErrors({});
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: TErrors = {};
    if (subject.trim().length < 3) next.subject = "Enter a short summary of your issue.";
    if (description.trim().length < 10) next.description = "Please describe the issue in a little more detail.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setIsSubmitting(true);
    if (demo) {
      const categoryLabel = INQUIRY_CATEGORIES.find((entry) => entry.key === category)?.label ?? "";
      window.setTimeout(() => {
        setDemoInquiries((list) => [{ id: `local-${Date.now()}`, status: "pending", ago: "Just now", subject: subject.trim(), category: categoryLabel }, ...list]);
        toast.success("Inquiry submitted. We'll get back to you shortly.");
        reset();
        setIsSubmitting(false);
      }, 500);
      return;
    }
    createInquiry.mutate();
  };

  const createInquiry = useMutation({
    mutationFn: async () => {
      const attachments = await Promise.all(files.map(uploadAttachment));
      return lmsApi.createInquiry({ category, subject: subject.trim(), description: description.trim(), attachments });
    },
    onSuccess: () => {
      toast.success("Inquiry submitted. We'll get back to you shortly.");
      reset();
      queryClient.invalidateQueries({ queryKey: ["lms", "inquiries"] });
    },
    onError: (error) => {
      const data = (error as AxiosError<{ error?: string; fields?: TErrors }>).response?.data;
      if (data?.fields) setErrors({ subject: data.fields.subject, description: data.fields.description });
      toast.error(data?.error ?? "We couldn't send your inquiry. Please try again.");
    },
    onSettled: () => setIsSubmitting(false),
  });

  return (
    <LmsShell active="help" inquiryOnTop search="Search...">
      <div className="mx-auto grid max-w-[1180px] items-start gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <h1 className="text-[34px] font-bold leading-tight tracking-tight text-[#1a1a7a] sm:text-[48px]">Submit an Inquiry</h1>
          <p className="mt-2 text-[16px] text-[#4a4d66] sm:text-[18px]">We&apos;re here to help. Please provide details below.</p>

          <form onSubmit={submit} noValidate className={`${cardClass} mt-8 p-6 sm:p-9`}>
            <fieldset>
              <legend className="flex items-center gap-3 text-[20px] font-bold text-[#14162b]">
                <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#e3e6fb] text-[15px] text-[#1a1a7a]">1</span> Select Category
              </legend>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {INQUIRY_CATEGORIES.map(({ key, label, text }) => {
                  const Icon = CATEGORY_ICON[key];
                  const isActive = key === category;
                  return (
                    <label
                      key={key}
                      className={`relative flex cursor-pointer flex-col items-center rounded-[10px] border px-4 py-6 text-center transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#020060] ${
                        isActive ? "border-[#00658f] bg-[#eaf4fa] shadow-[0_0_0_1px_#00658f]" : "border-[#d6d4e6] bg-white hover:bg-[#f7f6fd]"
                      }`}
                    >
                      <input type="radio" name="category" value={key} checked={isActive} onChange={() => setCategory(key)} className="sr-only" />
                      {isActive && (
                        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#00658f] text-white">
                          <MdCheck size={16} aria-hidden />
                        </span>
                      )}
                      <Icon size={32} className="text-[#1a1a7a]" aria-hidden />
                      <span className="mt-3 text-[16px] font-medium text-[#14162b]">{label}</span>
                      <span className="mt-2 text-[13px] leading-snug text-[#4a4d66]">{text}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <hr className="my-8 border-[#e1dff0]" />

            <fieldset>
              <legend className="flex items-center gap-3 text-[20px] font-bold text-[#14162b]">
                <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#ecebf3] text-[15px] text-[#4a4d66]">2</span> Inquiry Details
              </legend>
              <div className="mt-5">
                <label htmlFor="inquiry-subject" className="text-[13px] font-medium text-[#14162b]">Subject</label>
                <input
                  id="inquiry-subject"
                  value={subject}
                  maxLength={120}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Brief summary of your issue"
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  className={`${inputClass} mt-2 ${errors.subject ? "!border-[#c62828]" : ""}`}
                />
                {errors.subject && <p id="subject-error" role="alert" className="mt-1.5 text-[12px] text-[#c62828]">{errors.subject}</p>}
              </div>
              <div className="mt-5">
                <label htmlFor="inquiry-description" className="text-[13px] font-medium text-[#14162b]">Description</label>
                <textarea
                  id="inquiry-description"
                  rows={6}
                  value={description}
                  maxLength={2000}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Please provide as much detail as possible..."
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  className={`${inputClass} mt-2 resize-y ${errors.description ? "!border-[#c62828]" : ""}`}
                />
                {errors.description && <p id="description-error" role="alert" className="mt-1.5 text-[12px] text-[#c62828]">{errors.description}</p>}
              </div>
            </fieldset>

            <hr className="my-8 border-[#e1dff0]" />

            <fieldset>
              <legend className="flex items-center gap-3 text-[20px] font-bold text-[#14162b]">
                <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#ecebf3] text-[15px] text-[#4a4d66]">3</span> Attachments (Optional)
              </legend>
              <input ref={fileInput} type="file" accept=".svg,.png,.jpg,.jpeg,.pdf" multiple onChange={onPick} className="sr-only" aria-label="Attach files" tabIndex={-1} />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={`mt-5 flex w-full flex-col items-center rounded-[10px] border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  isDragging ? "border-[#00658f] bg-[#eaf4fa]" : "border-[#c9c8dc] bg-white hover:bg-[#f7f6fd]"
                }`}
              >
                <MdOutlineCloudUpload size={36} className="text-[#4a4d66]" aria-hidden />
                <span className="mt-3 text-[15px] font-medium text-[#14162b]">Click to upload or drag and drop</span>
                <span className="mt-1 text-[13px] text-[#4a4d66]">SVG, PNG, JPG or PDF (max. 10MB)</span>
              </button>
              {files.length > 0 && (
                <ul className="mt-4 flex flex-col gap-2">
                  {files.map((file) => (
                    <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 rounded-[8px] border border-[#e1dff0] bg-[#f9f8ff] px-4 py-2.5 text-[13px]">
                      <span className="min-w-0 truncate text-[#14162b]">{file.name} <span className="text-[#6a6d83]">({formatSize(file.size)})</span></span>
                      <button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles((list) => list.filter((entry) => entry !== file))} className="shrink-0 rounded-full p-1 text-[#4a4d66] hover:bg-[#ecebf3]">
                        <LuX size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </fieldset>

            <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button type="button" onClick={reset} className={outlineButton}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className={primaryButton}>
                {isSubmitting ? "Submitting..." : <>Submit Inquiry <MdOutlineSend size={18} aria-hidden /></>}
              </button>
            </div>
          </form>
        </div>

        <aside className="flex flex-col gap-6 xl:mt-[4px]">
          <section aria-labelledby="recent-title" className={`${cardClass} p-6`}>
            <h2 id="recent-title" className="border-b border-[#e1dff0] pb-4 text-[22px] font-bold text-[#1a1a7a]">Recent Inquiries</h2>
            {!demo && inquiriesQuery.isLoading && <p className="mt-5 text-[14px] text-[#4a4d66]">Loading...</p>}
            {!demo && !inquiriesQuery.isLoading && inquiries.length === 0 && <p className="mt-5 text-[14px] text-[#4a4d66]">No inquiries yet. Anything you send shows up here.</p>}
            <ul className="mt-5 flex flex-col gap-4">
              {inquiries.slice(0, 3).map((item) => (
                <li key={item.id} className="rounded-[8px] border border-[#e1dff0] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] ${
                        item.status === "pending" ? "bg-[#e3f0f9] text-[#00658f]" : "bg-[#ecebf3] text-[#4a4d66]"
                      }`}
                    >
                      {item.status === "pending" ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#00658f]" /> : <MdOutlineCheck size={13} aria-hidden />}
                      {item.status}
                    </span>
                    <span className="text-[12px] text-[#6a6d83]">{item.ago}</span>
                  </div>
                  <p className="mt-3 text-[15px] font-medium text-[#14162b]">{item.subject}</p>
                  <p className="mt-1 text-[13px] text-[#4a4d66]">{item.category}</p>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => soon("The full inquiry history")} className="mt-5 w-full text-center text-[15px] font-medium text-[#1e5bd8] hover:underline">
              View all inquiries
            </button>
          </section>

          <section className="rounded-[12px] bg-gradient-to-br from-[#e3e6fb] to-[#d3d6f8] p-6">
            <h2 className="text-[22px] font-bold text-[#14162b]">Need immediate help?</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#1e3fbf]">For urgent technical issues during live classes, use our priority hotline.</p>
            <a href={`tel:${PRIORITY_HOTLINE.replace(/[^+\d]/g, "")}`} className="mt-5 flex items-center gap-3 text-[16px] font-medium text-[#14162b] hover:underline">
              <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white text-[#00658f]">
                <MdOutlinePhone size={22} aria-hidden />
              </span>
              {PRIORITY_HOTLINE}
            </a>
          </section>
        </aside>
      </div>
    </LmsShell>
  );
};

export default HelpCenterPage;
