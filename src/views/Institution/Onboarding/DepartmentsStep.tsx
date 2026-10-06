"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiInfo, FiPlusCircle, FiSearch, FiTrash2 } from "react-icons/fi";
import { LuBadgeCheck } from "react-icons/lu";
import CategoryImage from "@components/CategoryImage";
import ActionBar from "../components/ActionBar";
import OnboardingFrame from "../components/OnboardingFrame";
import { newId, TDepartment, useOnboarding } from "../context/OnboardingContext";
import { institutionImages } from "../images";
import { nextStepHref, previousStepHref } from "../steps";
import { inputClass, labelClass } from "../styles";

const FACULTIES = [
  "Arts & Humanities",
  "Business & Management",
  "Engineering & Technology",
  "Health Sciences",
  "Law",
  "Natural Sciences",
  "Social Sciences",
  "Education",
];

const blankDepartment = (): TDepartment => ({ id: newId(), name: "", faculty: "", head: "", code: "", description: "" });

const hasContent = (department: TDepartment) =>
  [department.name, department.faculty, department.head, department.code, department.description].some((v) => v.trim());

const DepartmentsStep = () => {
  const router = useRouter();
  const { state, isReady, update } = useOnboarding();
  const [items, setItems] = useState<TDepartment[]>([]);
  const [missingName, setMissingName] = useState<string[]>([]);

  useEffect(() => {
    if (isReady) setItems(state.departments.length ? state.departments : [blankDepartment()]);
    // Seed the form once from the saved draft
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const change = (id: string, field: keyof TDepartment, value: string) => {
    setItems((list) => list.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    if (field === "name") setMissingName((ids) => ids.filter((x) => x !== id));
  };

  const add = () => setItems((list) => [...list, blankDepartment()]);

  const remove = (id: string) =>
    setItems((list) => {
      const next = list.filter((item) => item.id !== id);
      return next.length ? next : [blankDepartment()];
    });

  const save = () => {
    const filled = items.filter(hasContent);
    const unnamed = filled.filter((item) => !item.name.trim()).map((item) => item.id);
    if (unnamed.length) {
      setMissingName(unnamed);
      return;
    }
    update({ departments: filled.map((item) => ({ ...item, name: item.name.trim() })) });
    router.push(nextStepHref("departments"));
  };

  const staffNames = state.tutors.map((tutor) => tutor.name);

  return (
    <OnboardingFrame
      step="departments"
      title="Institution Onboarding"
      subtitle="Welcome to Gloxad. Let's set up your institutional foundation to ensure academic excellence and administrative efficiency."
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          {items.map((department, index) => {
            const nameError = missingName.includes(department.id);
            return (
              <section
                key={department.id}
                aria-label={`Department ${index + 1}`}
                className="relative rounded-[16px] border border-[#d9dcec] bg-white p-6 sm:p-8"
              >
                <span aria-hidden className="absolute -left-px top-9 h-10 w-1 rounded-r bg-[#5b5fd6]" />
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-[24px] font-bold text-[#14162b] sm:text-[28px]">Department #{index + 1}</h2>
                  <button
                    type="button"
                    onClick={() => remove(department.id)}
                    aria-label={`Remove department ${index + 1}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#4a4d66] transition-colors hover:bg-[#fdecea] hover:text-[#d93025]"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>

                <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`dept-name-${department.id}`} className={labelClass}>
                      Department Name
                    </label>
                    <input
                      id={`dept-name-${department.id}`}
                      value={department.name}
                      onChange={(event) => change(department.id, "name", event.target.value)}
                      placeholder="e.g. Computer Science"
                      aria-invalid={nameError}
                      className={`${inputClass} ${nameError ? "!border-[#d93025]" : ""}`}
                    />
                    {nameError && (
                      <p role="alert" className="mt-1.5 text-[13px] text-[#d93025]">
                        Give this department a name or remove it.
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`dept-faculty-${department.id}`} className={labelClass}>
                      Faculty/Category
                    </label>
                    <select
                      id={`dept-faculty-${department.id}`}
                      value={department.faculty}
                      onChange={(event) => change(department.id, "faculty", event.target.value)}
                      className={`${inputClass} ${department.faculty ? "" : "!text-[#a2a6bb]"}`}
                    >
                      <option value="">Select Faculty</option>
                      {FACULTIES.map((faculty) => (
                        <option key={faculty} value={faculty} className="text-[#1b1d33]">
                          {faculty}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`dept-head-${department.id}`} className={labelClass}>
                      Head of Department (Search)
                    </label>
                    <div className="relative">
                      <FiSearch aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6a6d83]" />
                      <input
                        id={`dept-head-${department.id}`}
                        value={department.head}
                        list="staff-members"
                        onChange={(event) => change(department.id, "head", event.target.value)}
                        placeholder="Search staff members..."
                        className={`${inputClass} !pl-11`}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`dept-code-${department.id}`} className={labelClass}>
                      Department Code
                    </label>
                    <input
                      id={`dept-code-${department.id}`}
                      value={department.code}
                      onChange={(event) => change(department.id, "code", event.target.value.toUpperCase())}
                      placeholder="e.g. CS-100"
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`dept-desc-${department.id}`} className={labelClass}>
                      Brief Description
                    </label>
                    <textarea
                      id={`dept-desc-${department.id}`}
                      value={department.description}
                      onChange={(event) => change(department.id, "description", event.target.value)}
                      placeholder="Define the academic goals and scope of this department..."
                      rows={4}
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                </div>
              </section>
            );
          })}

          <datalist id="staff-members">
            {staffNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>

          <button
            type="button"
            onClick={add}
            aria-label={`Add department ${items.length + 1}`}
            className="rounded-[16px] border border-dashed border-[#cfd2e6] p-6 text-left opacity-70 transition hover:opacity-100 sm:p-8"
          >
            <span className="text-[24px] font-bold text-[#6a6d83] sm:text-[28px]">Department #{items.length + 1}</span>
            <span aria-hidden className="mt-6 grid gap-5 sm:grid-cols-2">
              <span className="h-12 rounded-[10px] bg-[#f3f3f6]" />
              <span className="h-12 rounded-[10px] bg-[#f3f3f6]" />
              <span className="h-24 rounded-[10px] bg-[#f3f3f6] sm:col-span-2" />
            </span>
          </button>

          <button
            type="button"
            onClick={add}
            className="flex w-full items-center justify-center gap-3 rounded-[14px] border-2 border-dashed border-[#cfd2e6] px-4 py-5 text-[16px] font-medium text-[#3b3fa8] transition-colors hover:border-[#5b5fd6] hover:bg-[#f6f7ff]"
          >
            <FiPlusCircle size={22} /> Add Another Department
          </button>

          <div className="flex items-start gap-4 rounded-[16px] bg-[#d9e8f6] p-5 sm:p-6">
            <FiInfo className="mt-0.5 shrink-0 text-[#030069]" size={24} />
            <div>
              <p className="text-[16px] font-medium text-[#14162b]">Why define departments?</p>
              <p className="mt-1 text-[14px] leading-relaxed text-[#3f4257]">
                Departments act as the primary structural unit for course allocation, budget management, and student
                cohorts. You can always edit these or add sub-departments later in the Institutional Settings.
              </p>
            </div>
          </div>
        </div>

        <aside className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[16px] bg-[#e5e3ec] p-4">
            <div className="aspect-[4/3] overflow-hidden rounded-[10px] bg-[#c9cbe0]">
              <CategoryImage
                src={institutionImages.campus}
                className="h-full w-full object-cover"
                fallback={null}
              />
            </div>
            <p className="mt-4 px-2 pb-1 text-center text-[14px] leading-relaxed text-[#3f4257]">
              &ldquo;Architecture is the foundation of structure, just as departments are the foundation of your
              academy.&rdquo;
            </p>
          </div>
          <div className="rounded-[16px] border border-[#d6d4ee] bg-[#eceaf7] p-5">
            <p className="flex items-center gap-2 text-[16px] font-medium text-[#3b3fa8]">
              <LuBadgeCheck size={22} /> Pro Tip
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#3f4257]">
              Bulk import from CSV is available in the Institution Dashboard after setup.
            </p>
          </div>
        </aside>
      </div>

      <ActionBar
        backHref={previousStepHref("departments")}
        onSkip={() => router.push(nextStepHref("departments"))}
        onContinue={save}
      />
    </OnboardingFrame>
  );
};

export default DepartmentsStep;
