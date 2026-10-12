"use client";

import { DragEvent, useRef, useState } from "react";
import { MdOutlineCalendarToday, MdOutlineCheckCircle, MdOutlineCloudUpload, MdOutlineLink, MdOutlineSchedule, MdOutlineSend } from "react-icons/md";
import { LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import LmsShell from "./components/LmsShell";
import { inputClass } from "./components/ui";
import { ASSIGNMENTS, TAssignment, TAssignmentStatus } from "./data";

type TFilter = "all" | "upcoming" | "past";
const MAX_BYTES = 50 * 1024 * 1024;
const GITHUB_URL = /^https:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/i;

const StatusLabel = ({ status }: { status: TAssignmentStatus }) => {
  if (status === "graded")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#dcebf6] px-2.5 py-1 text-[11px] font-medium text-[#0b5f8a]">
        <MdOutlineCheckCircle size={14} /> Graded
      </span>
    );
  if (status === "pending_review" || status === "submitted")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#e6ecf3] px-2.5 py-1 text-[11px] font-medium text-[#3a4a5c]">
        <MdOutlineSchedule size={14} /> Pending Review
      </span>
    );
  return <span className="text-[12px] font-medium text-[#14162b]">Not started</span>;
};

const AssignmentsPage = () => {
  const [filter, setFilter] = useState<TFilter>("all");
  const [items, setItems] = useState<TAssignment[]>(ASSIGNMENTS);
  const [selectedId, setSelectedId] = useState(ASSIGNMENTS[0].id);
  const [tab, setTab] = useState<"instructions" | "rubric">("instructions");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const visible = items.filter((item) => (filter === "all" ? true : filter === "past" ? item.past : !item.past));
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const canSubmit = selected.status === "not_started";

  const choose = (id: string) => {
    setSelectedId(id);
    setFile(null);
    setLink("");
    setError("");
    setTab("instructions");
  };

  const takeFile = (picked?: File) => {
    if (!picked) return;
    if (picked.size > MAX_BYTES) return setError("That file is larger than 50MB.");
    setError("");
    setFile(picked);
  };

  const submit = () => {
    if (!file && !link.trim()) return setError("Upload a file or paste your GitHub repository link.");
    if (!file && !GITHUB_URL.test(link.trim())) return setError("Enter a valid GitHub repository link, e.g. https://github.com/you/project.");
    setError("");
    setItems((list) => list.map((item) => (item.id === selected.id ? { ...item, status: "submitted", progress: 100 } : item)));
    setFile(null);
    setLink("");
    toast.success(`"${selected.title}" submitted for review.`);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    takeFile(event.dataTransfer.files?.[0]);
  };

  return (
    <LmsShell active="assignments" topTab={null} search="Search...">
      <div className="mx-auto max-w-[1280px]">
        <h1 className="text-[34px] font-bold leading-tight tracking-tight text-[#1a1a7a] sm:text-[44px]">Assignments Hub</h1>
        <p className="mt-2 text-[15px] text-[#4a4d66] sm:text-[17px]">Manage your submissions, track deadlines, and review feedback.</p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <div>
            <div role="tablist" aria-label="Filter assignments" className="flex gap-3">
              {(["all", "upcoming", "past"] as TFilter[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={filter === key}
                  onClick={() => setFilter(key)}
                  className={`rounded-full border px-5 py-2 text-[14px] font-medium capitalize transition-colors ${
                    filter === key ? "border-[#020060] bg-[#020060] text-white" : "border-[#d6d4e6] bg-[#efedf8] text-[#2a2c42] hover:bg-[#e6e3f5]"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <ul className="mt-5 flex flex-col gap-4">
              {visible.map((item) => {
                const isSelected = item.id === selected.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => choose(item.id)}
                      aria-pressed={isSelected}
                      className={`w-full rounded-[14px] bg-white p-5 text-left transition-shadow hover:shadow-md ${
                        isSelected ? "border-2 border-[#00658f]" : "border border-[#dedcec]"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className={`rounded-[4px] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${item.urgent ? "bg-[#dcebf6] text-[#0b5f8a]" : "bg-[#e9e8ee] text-[#4a4d66]"}`}>
                          {item.module}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[11px] font-medium ${
                            item.urgent ? "bg-[#fde8e8] text-[#c62828]" : "bg-[#eceaf2] text-[#4a4d66]"
                          }`}
                        >
                          {item.urgent ? <MdOutlineSchedule size={14} /> : <MdOutlineCalendarToday size={13} />} {item.due}
                        </span>
                      </span>
                      <span className="mt-3 block text-[19px] font-medium text-[#14162b]">{item.title}</span>
                      {item.urgent && <span className="mt-1.5 block text-[14px] leading-snug text-[#4a4d66]">{item.summary}</span>}
                      <span className="mt-4 flex items-center gap-4">
                        <span className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#e8e7f1]">
                          <span className="block h-full rounded-full bg-[#00658f]" style={{ width: `${item.progress}%` }} />
                        </span>
                        <StatusLabel status={item.status} />
                      </span>
                    </button>
                  </li>
                );
              })}
              {!visible.length && <li className="rounded-[14px] border border-dashed border-[#d6d4e6] p-8 text-center text-[14px] text-[#4a4d66]">No assignments in this view.</li>}
            </ul>
          </div>

          <section aria-labelledby="assignment-title" className="overflow-hidden rounded-[24px] border border-[#dedcec] bg-white shadow-[0_18px_50px_-30px_rgba(40,40,120,0.35)]">
            <div className="bg-[#f1effa] p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <span className="rounded-[4px] bg-[#dcebf6] px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-[#0b5f8a]">{selected.dueBadge}</span>
                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#4a4d66]">Due Date</p>
                  <p className={`mt-1 text-[16px] font-medium ${selected.past ? "text-[#4a4d66]" : "text-[#c62828]"}`}>{selected.dueDate}</p>
                </div>
              </div>
              <h2 id="assignment-title" className="mt-3 text-[26px] font-bold leading-tight text-[#1a1a7a] sm:text-[30px]">
                {selected.title}
              </h2>
              <p className="mt-4 max-w-[520px] text-[15px] leading-[1.7] text-[#2a2c42]">{selected.description}</p>
            </div>

            <div className="border-t border-[#dedcec] p-6 sm:p-8">
              <div role="tablist" aria-label="Assignment details" className="flex gap-8 border-b border-[#dedcec]">
                {(["instructions", "rubric"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={tab === key}
                    onClick={() => setTab(key)}
                    className={`-mb-px border-b-2 pb-3 text-[14px] capitalize transition-colors ${
                      tab === key ? "border-[#1a1a7a] font-bold text-[#1a1a7a]" : "border-transparent text-[#4a4d66] hover:text-[#1a1a7a]"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {tab === "rubric" ? (
                <ul className="mt-6 divide-y divide-[#e8e7f1] rounded-[10px] border border-[#dedcec]">
                  {selected.rubric.map(({ criterion, points }) => (
                    <li key={criterion} className="flex items-center justify-between gap-4 px-4 py-3.5 text-[14px]">
                      <span className="text-[#14162b]">{criterion}</span>
                      <span className="shrink-0 font-bold text-[#1a1a7a]">{points} pts</span>
                    </li>
                  ))}
                </ul>
              ) : canSubmit ? (
                <div>
                  <h3 className="mt-7 text-[22px] font-bold text-[#14162b]">Submit Your Work</h3>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Upload your work"
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && (event.preventDefault(), inputRef.current?.click())}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className={`mt-5 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-[18px] border-2 border-dashed px-4 py-8 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#020060] ${
                      isDragging ? "border-[#00658f] bg-[#eef6fb]" : "border-[#c9c8dc] bg-[#fbfbff] hover:border-[#9a98c4]"
                    }`}
                  >
                    {file ? (
                      <span className="flex items-center gap-3 rounded-[10px] bg-[#eef0fd] px-4 py-3 text-[14px] text-[#14162b]">
                        <MdOutlineCloudUpload size={22} className="text-[#1a1a7a]" /> {file.name}
                        <button
                          type="button"
                          aria-label="Remove file"
                          onClick={(event) => {
                            event.stopPropagation();
                            setFile(null);
                          }}
                          className="rounded-full p-1 text-[#4a4d66] hover:bg-white"
                        >
                          <LuX size={16} />
                        </button>
                      </span>
                    ) : (
                      <>
                        <span className="flex h-[76px] w-[76px] items-center justify-center rounded-[14px] bg-[#e9e8ee] text-[#2a2c42]">
                          <MdOutlineCloudUpload size={36} />
                        </span>
                        <p className="mt-5 text-[16px] text-[#14162b]">
                          <span className="font-medium text-[#00658f]">Click to upload</span> or drag and drop
                        </p>
                        <p className="mt-1.5 text-[12px] text-[#4a4d66]">ZIP, PDF, or Source Files (Max 50MB)</p>
                      </>
                    )}
                    <input ref={inputRef} type="file" className="hidden" onChange={(event) => { takeFile(event.target.files?.[0]); event.target.value = ""; }} />
                  </div>

                  <div className="my-6 flex items-center gap-4 text-[12px] font-medium text-[#4a4d66]">
                    <span className="h-px flex-1 bg-[#dedcec]" /> OR <span className="h-px flex-1 bg-[#dedcec]" />
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <MdOutlineLink size={22} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4a4d66]" />
                      <input
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                        placeholder="Paste GitHub repository link..."
                        aria-label="GitHub repository link"
                        className={`${inputClass} !pl-12`}
                      />
                    </div>
                    <button type="button" onClick={submit} className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#020060] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#10107a]">
                      Submit <MdOutlineSend size={16} />
                    </button>
                  </div>
                  {error && (
                    <p role="alert" className="mt-3 text-[13px] text-[#c62828]">
                      {error}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-7 rounded-[12px] bg-[#f3f1fb] p-6">
                  <p className="flex items-center gap-2 text-[16px] font-bold text-[#1a1a7a]">
                    <MdOutlineCheckCircle size={22} /> {selected.status === "graded" ? "Graded" : "Submitted"}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#2a2c42]">
                    {selected.status === "graded"
                      ? "Your work has been graded. Feedback from your instructor is available in the grading report."
                      : "Your submission is waiting for instructor review. You'll be notified when it has been graded."}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </LmsShell>
  );
};

export default AssignmentsPage;
