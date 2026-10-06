"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiDownload, FiPlus, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { LuFileUp, LuLightbulb, LuShieldCheck, LuUserPlus } from "react-icons/lu";
import { toast } from "react-toastify";
import CategoryImage from "@components/CategoryImage";
import ActionBar from "../components/ActionBar";
import Initials from "../components/Initials";
import OnboardingFrame from "../components/OnboardingFrame";
import { newId, TPerson, useOnboarding } from "../context/OnboardingContext";
import { institutionImages } from "../images";
import { nextStepHref, previousStepHref } from "../steps";
import { inputClass, labelClass, outlineButton, primaryButton } from "../styles";

type TKind = "tutor" | "student";

const CONFIG = {
  tutor: {
    step: "tutors",
    stateKey: "tutors",
    title: "Add Tutors",
    subtitle: "Invite your faculty members to the platform. You can add them individually or import a batch via spreadsheet.",
    namePlaceholder: "Dr. Sarah Jenkins",
    bulkText: "Import your faculty list from a CSV or Excel file for faster onboarding.",
    plural: "tutors",
  },
  student: {
    step: "students",
    stateKey: "students",
    title: "Add Students",
    subtitle: "Choose how you'd like to populate your student registry.",
    namePlaceholder: "Sarah Jenkins",
    bulkText: "Import your students list from a CSV or Excel file for faster onboarding.",
    plural: "students",
  },
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Minimal CSV reader: handles quoted cells, doubled quotes and CRLF
const parseCsv = (text: string) => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') inQuotes = false;
      else cell += char;
    } else if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
};

const PeopleStep = ({ kind }: { kind: TKind }) => {
  const config = CONFIG[kind];
  const router = useRouter();
  const { state, update } = useOnboarding();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const people: TPerson[] = state[config.stateKey];
  const departmentNames = state.departments.map((department) => department.name);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [autoInvite, setAutoInvite] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const save = (next: TPerson[]) => update({ [config.stateKey]: next });

  const isDuplicate = (value: string, list: TPerson[]) =>
    list.some((person) => person.email.toLowerCase() === value.toLowerCase());

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Enter a full name.";
    if (!EMAIL_PATTERN.test(email.trim())) next.email = "Enter a valid email address.";
    else if (isDuplicate(email.trim(), people)) next.email = "This email is already on the list.";
    setErrors(next);
    if (Object.keys(next).length) return;

    save([
      {
        id: newId(),
        name: name.trim(),
        email: email.trim(),
        departments: selectedDepartments,
        designation: kind === "tutor" ? designation.trim() : undefined,
        autoInvite,
      },
      ...people,
    ]);
    setName("");
    setEmail("");
    setDesignation("");
    setSelectedDepartments([]);
  };

  const handleRemove = (id: string) => save(people.filter((person) => person.id !== id));

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!/\.csv$/i.test(file.name)) {
      toast.error("Only CSV files are supported for now. Save your spreadsheet as CSV and upload it again.");
      return;
    }

    const rows = parseCsv(await file.text());
    const [header = [], ...body] = rows;
    const column = (...names: string[]) =>
      header.findIndex((cell) => names.includes(cell.trim().toLowerCase().replace(/\s+/g, "")));
    const nameIndex = column("name", "fullname");
    const emailIndex = column("email", "professionalemail");
    const departmentIndex = column("department", "departments", "departmentassignment");
    const designationIndex = column("designation", "title");

    if (nameIndex < 0 || emailIndex < 0) {
      toast.error("The CSV needs 'name' and 'email' columns. Download the template to see the format.");
      return;
    }

    const imported: TPerson[] = [];
    let skipped = 0;
    body.forEach((cells) => {
      const personName = cells[nameIndex]?.trim();
      const personEmail = cells[emailIndex]?.trim();
      if (!personName || !personEmail || !EMAIL_PATTERN.test(personEmail) || isDuplicate(personEmail, [...people, ...imported])) {
        skipped += 1;
        return;
      }
      imported.push({
        id: newId(),
        name: personName,
        email: personEmail,
        departments: (departmentIndex >= 0 ? cells[departmentIndex] ?? "" : "")
          .split(";")
          .map((value) => value.trim())
          .filter(Boolean),
        designation: kind === "tutor" && designationIndex >= 0 ? cells[designationIndex]?.trim() : undefined,
        autoInvite,
      });
    });

    if (imported.length) save([...imported, ...people]);
    const summary = `Imported ${imported.length} ${imported.length === 1 ? "person" : "people"}${
      skipped ? `, skipped ${skipped} invalid or duplicate row${skipped === 1 ? "" : "s"}` : ""
    }.`;
    imported.length ? toast.success(summary) : toast.error(`Nothing imported. ${summary}`);
  };

  const downloadTemplate = () => {
    const csv =
      kind === "tutor"
        ? "name,email,department,designation\nSarah Jenkins,s.jenkins@academy.edu,Computer Science,Senior Professor\n"
        : "name,email,department\nSarah Jenkins,s.jenkins@academy.edu,Computer Science\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `gloxad-${config.plural}-template.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const subtitleFor = (person: TPerson) =>
    [person.departments.join(", "), person.designation].filter(Boolean).join(" • ") || "No department assigned";

  return (
    <OnboardingFrame step={config.step} title={config.title} subtitle={config.subtitle}>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,500px)]">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleAdd} noValidate className="rounded-[16px] border border-[#d9dcec] bg-white p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#e0e3f4] text-[#3b3fa8]">
                <LuUserPlus size={24} />
              </span>
              <h2 className="text-[26px] font-bold text-[#14162b] sm:text-[30px]">Manual Entry</h2>
            </div>

            <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <div>
                <label htmlFor="person-name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="person-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={config.namePlaceholder}
                  autoComplete="off"
                  aria-invalid={!!errors.name}
                  className={`${inputClass} ${errors.name ? "!border-[#d93025]" : ""}`}
                />
                {errors.name && (
                  <p role="alert" className="mt-1.5 text-[13px] text-[#d93025]">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="person-email" className={labelClass}>
                  Professional Email
                </label>
                <input
                  id="person-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="s.jenkins@academy.edu"
                  autoComplete="off"
                  aria-invalid={!!errors.email}
                  className={`${inputClass} ${errors.email ? "!border-[#d93025]" : ""}`}
                />
                {errors.email && (
                  <p role="alert" className="mt-1.5 text-[13px] text-[#d93025]">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="person-departments" className={labelClass}>
                  Department Assignment
                </label>
                <select
                  id="person-departments"
                  multiple
                  size={4}
                  disabled={!departmentNames.length}
                  value={selectedDepartments}
                  onChange={(event) =>
                    setSelectedDepartments(Array.from(event.target.selectedOptions, (option) => option.value))
                  }
                  className={`${inputClass} !h-[150px]`}
                >
                  {departmentNames.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-[12px] text-[#6a6d83]">
                  {departmentNames.length
                    ? "Hold Ctrl/Cmd to select multiple"
                    : "Add departments in the previous step to assign them here."}
                </p>
              </div>
              <div className="flex flex-col gap-5">
                {kind === "tutor" && (
                  <div>
                    <label htmlFor="person-designation" className={labelClass}>
                      Designation
                    </label>
                    <input
                      id="person-designation"
                      value={designation}
                      onChange={(event) => setDesignation(event.target.value)}
                      placeholder="Senior Professor"
                      className={inputClass}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 rounded-[12px] border border-[#e3e6f3] bg-[#fafaff] p-4">
                  <div>
                    <p id="auto-invite-label" className="text-[16px] font-medium text-[#14162b]">
                      Auto-Invite
                    </p>
                    <p className="text-[13px] text-[#4a4d66]">Send invitation email immediately</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoInvite}
                    aria-labelledby="auto-invite-label"
                    onClick={() => setAutoInvite((value) => !value)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${autoInvite ? "bg-[#030069]" : "bg-[#c5c8dc]"}`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${autoInvite ? "left-6" : "left-1"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-[#e3e6f3] pt-6">
              <button type="submit" className={`${primaryButton} !bg-[#575c8a] !shadow-none hover:!bg-[#44497a] w-full sm:w-auto`}>
                <FiPlus size={18} /> Add to List
              </button>
            </div>
          </form>

          <section aria-label="Recently added" className="overflow-hidden rounded-[16px] border border-[#d9dcec] bg-white">
            <header className="flex items-center justify-between bg-[#eceef8] px-6 py-4">
              <h2 className="text-[18px] font-bold text-[#14162b]">Recently Added ({people.length})</h2>
              <span className="text-[12px] font-bold uppercase tracking-wide text-[#030069]">Draft</span>
            </header>
            {people.length ? (
              <ul className="divide-y divide-[#e3e6f3]">
                {people.map((person) => (
                  <li key={person.id} className="flex items-center gap-4 px-6 py-4">
                    <Initials name={person.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[16px] font-bold text-[#14162b]">{person.name}</p>
                      <p className="truncate text-[13px] text-[#4a4d66]">{subtitleFor(person)}</p>
                    </div>
                    <span
                      className={`hidden shrink-0 rounded-[6px] px-3 py-1 text-[12px] font-medium sm:inline ${
                        person.autoInvite ? "bg-[#e4e1f5] text-[#8f8bb8]" : "bg-[#eef0f6] text-[#8a8da3]"
                      }`}
                    >
                      {person.autoInvite ? "Email Pending" : "Not invited"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(person.id)}
                      aria-label={`Remove ${person.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#4a4d66] transition-colors hover:bg-[#fdecea] hover:text-[#d93025]"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-6 py-10 text-center text-[14px] text-[#6a6d83]">
                No {config.plural} added yet. Use the form above or upload a CSV file.
              </p>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <section className="rounded-[16px] border-2 border-dashed border-[#c3c8e4] bg-[#eaf1fa] p-6 text-center sm:p-8">
            <span className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#d6e4f3] text-[#030069]">
              <LuFileUp size={34} />
            </span>
            <h2 className="mt-5 text-[26px] font-bold text-[#14162b]">Bulk Upload</h2>
            <p className="mx-auto mt-2 max-w-[340px] text-[16px] leading-relaxed text-[#3f4257]">{config.bulkText}</p>
            <button type="button" onClick={() => fileInputRef.current?.click()} className={`${primaryButton} mt-6 w-full !py-3.5`}>
              <FiUploadCloud size={20} /> Select Files to Upload
            </button>
            <button type="button" onClick={downloadTemplate} className={`${outlineButton} mt-3 w-full !border-[#d0d9ea] !bg-[#f3f7fc] !py-3 !text-[#030069]`}>
              <FiDownload size={18} /> Download CSV Template
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,text/csv"
              className="hidden"
              onChange={(event) => {
                handleFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </section>

          {kind === "tutor" ? (
            <>
              <section className="rounded-[16px] bg-[#e8e7ee] p-6 sm:p-8">
                <h2 className="text-[18px] font-bold text-[#14162b]">Setup Tips</h2>
                <ul className="mt-5 flex flex-col gap-5 text-[14px] leading-relaxed text-[#3f4257]">
                  <li className="flex items-start gap-3">
                    <LuLightbulb className="mt-0.5 shrink-0 text-[#030069]" size={20} />
                    Assigning tutors to departments early ensures they see relevant course templates immediately upon login.
                  </li>
                  <li className="flex items-start gap-3">
                    <LuShieldCheck className="mt-0.5 shrink-0 text-[#030069]" size={20} />
                    Use professional institution emails to maintain a secure and verified faculty directory.
                  </li>
                </ul>
              </section>
              <figure className="relative aspect-[16/8] overflow-hidden rounded-[16px] bg-[#2b2c6e]">
                <CategoryImage src={institutionImages.cafe} className="h-full w-full object-cover" fallback={null} />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1a1670]/90 via-[#2a2894]/45 to-[#2a2894]/30" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-[16px] text-white">
                  &ldquo;Building the foundation of modern education together.&rdquo;
                </figcaption>
              </figure>
            </>
          ) : (
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-[#5d8f95]">
                <CategoryImage src={institutionImages.students} className="h-full w-full object-cover" fallback={null} />
                <div aria-hidden className="absolute inset-0 bg-[#3b7f87]/45 mix-blend-multiply" />
              </div>
              <figcaption className="mt-4 text-center text-[13px] leading-relaxed text-[#4a4d66]">
                Tip: You can always add more students after your initial setup via the Administration Dashboard.
              </figcaption>
            </figure>
          )}
        </aside>
      </div>

      <ActionBar
        backHref={previousStepHref(config.step)}
        onSkip={() => router.push(nextStepHref(config.step))}
        onContinue={() => router.push(nextStepHref(config.step))}
      />
    </OnboardingFrame>
  );
};

export default PeopleStep;
