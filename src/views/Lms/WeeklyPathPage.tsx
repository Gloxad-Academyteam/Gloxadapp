"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import axiosInstance from "@utils/axiosInstance";
import { lmsApi, TApiWeek } from "@services/lms";
import useDemoMode from "./useDemoMode";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  MdOutlineAssignmentTurnedIn,
  MdOutlineBook,
  MdOutlineCheckCircle,
  MdOutlineRadioButtonUnchecked,
  MdOutlineCalendarMonth,
  MdOutlineFlag,
  MdOutlineLightbulb,
  MdOutlineLock,
  MdOutlinePeopleAlt,
  MdOutlinePlayCircle,
  MdOutlineQuiz,
  MdOutlineTimer,
  MdOutlineVideocam,
} from "react-icons/md";
import { LuCode } from "react-icons/lu";
import LmsShell, { soon } from "./components/LmsShell";
import { cardClass } from "./components/ui";
import { OFFICE_HOURS, PATH_PROGRAM, PATH_WEEKS, TDayItem, TPathDay, TPathWeek } from "./data";

const ITEM_ICON: Record<TDayItem["kind"], IconType> = {
  video: MdOutlinePlayCircle,
  reading: MdOutlineBook,
  code: LuCode,
  check: MdOutlineQuiz,
  live: MdOutlineVideocam,
  problems: MdOutlineAssignmentTurnedIn,
  review: MdOutlinePeopleAlt,
  submission: MdOutlineAssignmentTurnedIn,
};

const LESSON_HREF = "/lms/curriculum/lesson";

type TToggle = (itemId: string, done: boolean) => void;

const DayCard = ({ day, onToggle }: { day: TPathDay; onToggle?: TToggle }) => {
  const isToday = day.status === "today";
  const isLocked = day.status === "locked" || !day.title;
  const isUpcoming = day.status === "upcoming";

  if (isLocked && !day.title) {
    // Weekend / not-yet-scheduled slot
    return (
      <li className="flex min-h-[120px] items-start justify-end rounded-[10px] border border-[#e1dff0] bg-[#f3f2fa] p-4 text-[#b0b2c6] xl:min-h-[300px]" aria-label={`${day.day}: nothing scheduled`}>
        <MdOutlineLock size={22} aria-hidden />
      </li>
    );
  }

  return (
    <li
      className={`relative flex flex-col rounded-[10px] border p-5 ${
        isToday
          ? "z-10 border-2 border-[#00658f] bg-white shadow-[0_20px_40px_-20px_rgba(0,101,143,0.55)] xl:-my-3"
          : isUpcoming || isLocked
            ? "border-[#e1dff0] bg-[#fbfbfe] opacity-80"
            : "border-[#e1dff0] bg-white"
      }`}
    >
      {isToday && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00658f] px-4 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white">Today</span>
      )}
      <div className="flex items-start justify-between gap-2">
        <p className={`text-[14px] font-medium ${isToday ? "font-bold text-[#14162b]" : "text-[#4a4d66]"}`}>{day.day}</p>
        {isLocked && <MdOutlineLock size={18} className="shrink-0 text-[#b0b2c6]" aria-label="Locked" />}
      </div>

      <p className={`mt-4 text-[12px] ${isToday ? "font-bold text-[#00658f]" : "text-[#6a6d83]"}`}>{day.module}</p>
      <h3 className={`mt-1 break-words text-[16px] font-bold leading-snug xl:text-[15px] ${isToday ? "text-[#14162b]" : isUpcoming || isLocked ? "text-[#8d8fa6]" : "text-[#2a2c42]"}`}>
        {day.status === "done" ? (
          <Link href={LESSON_HREF} className="hover:text-[#1a1a7a] hover:underline">{day.title}</Link>
        ) : (
          day.title
        )}
      </h3>

      {isToday && typeof day.progress === "number" && (
        <>
          <div role="progressbar" aria-label="Today's progress" aria-valuenow={day.progress} aria-valuemin={0} aria-valuemax={100} className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e8e7f3]">
            <div className="h-full rounded-full bg-[#00658f]" style={{ width: `${day.progress}%` }} />
          </div>
          <p className="mt-1.5 text-[11px] text-[#4a4d66]">{day.progress}% Completed</p>
        </>
      )}

      {day.items && (
        <ul className="mt-4 flex flex-col gap-2.5">
          {day.items.map((item) => {
            const Icon = ITEM_ICON[item.kind];
            const content = (
              <>
                <Icon size={18} className={`shrink-0 ${isToday ? "text-[#00658f]" : "text-[#6a6d83]"}`} aria-hidden /> {item.label}
              </>
            );
            const className = `flex items-center gap-2.5 text-[13px] ${isToday ? "font-medium text-[#14162b]" : "text-[#4a4d66]"}`;
            const itemHref = item.kind === "code" ? (item.labSlug ? `/lms/code?lab=${item.labSlug}` : "/lms/code") : item.kind === "live" ? "/lms/live" : null;
            const canToggle = Boolean(item.id && onToggle && !isLocked && !isUpcoming && item.kind !== "live" && !(item.kind === "code" && item.labSlug));
            return (
              <li key={item.id ?? item.label} className="flex items-center gap-2">
                {canToggle ? (
                  <button type="button" role="checkbox" aria-checked={Boolean(item.done)} onClick={() => onToggle?.(item.id as string, !item.done)} className={`${className} w-full text-left hover:text-[#00658f]`}>
                    {item.done ? <MdOutlineCheckCircle size={18} className="shrink-0 text-[#1a8f5a]" aria-hidden /> : <MdOutlineRadioButtonUnchecked size={18} className="shrink-0 text-[#6a6d83]" aria-hidden />}
                    <span className={item.done ? "line-through opacity-70" : ""}>{item.label}</span>
                  </button>
                ) : itemHref && !isLocked ? (
                  <Link href={itemHref} className={`${className} hover:text-[#00658f] hover:underline`}>{content}{item.done && <MdOutlineCheckCircle size={16} className="ml-auto text-[#1a8f5a]" aria-label="Done" />}</Link>
                ) : (
                  <span className={className}>{content}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {isToday && (
        <Link href={LESSON_HREF} className="mt-auto inline-flex w-full items-center justify-center rounded-[6px] bg-[#00658f] px-4 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#00577c]" style={{ marginTop: "1.5rem" }}>
          Continue
        </Link>
      )}
    </li>
  );
};

type TViewProps = {
  program: { trimester: string; course: string };
  tabs: number[];
  selected: number;
  onSelect: (week: number) => void;
  week?: TPathWeek;
  message?: { title: string; text?: string };
  onToggle?: TToggle;
  officeHours?: boolean;
};

const WeeklyPathView = ({ program, tabs, selected, onSelect, week, message, onToggle, officeHours }: TViewProps) => {
  return (
    <LmsShell active="curriculum" topTab="trimesters" search="Search curriculum...">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex flex-wrap items-center gap-2 text-[13px] text-[#2a2c42]">
              <span className="rounded-[4px] bg-[#d6ebf8] px-2.5 py-1 text-[12px] font-bold tracking-[0.06em] text-[#1a1a7a]">{program.trimester}</span>
              <span>&bull; {program.course}</span>
            </p>
            <h1 className="mt-3 text-[34px] font-bold leading-tight tracking-tight text-[#14162b] sm:text-[48px]">Weekly Learning Path</h1>
          </div>
          <div role="tablist" aria-label="Week" className="inline-flex w-fit rounded-[8px] border border-[#d6d4e6] bg-[#f3f2fa] p-1">
            {tabs.map((weekNumber) => {
              const isActive = weekNumber === selected;
              return (
                <button
                  key={weekNumber}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelect(weekNumber)}
                  className={`rounded-[6px] px-4 py-2 text-[14px] transition-colors sm:px-5 ${isActive ? "bg-white font-bold text-[#1a1a7a] shadow-sm" : "text-[#4a4d66] hover:text-[#1a1a7a]"}`}
                >
                  Week {weekNumber}
                </button>
              );
            })}
          </div>
        </div>

        {!week ? (
          <div className="mt-16 text-center">
            <h2 className="text-[20px] font-bold text-[#14162b]">{message?.title ?? "Loading..."}</h2>
            {message?.text && <p className="mt-2 text-[14px] text-[#4a4d66]">{message.text}</p>}
          </div>
        ) : (
        <>
        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section aria-labelledby="objective-title" className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#04045e] to-[#0a0a7a] p-7 text-white shadow-[0_24px_50px_-26px_rgba(2,0,96,0.9)] sm:p-9">
            <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[#c9cbf5]">
              <MdOutlineFlag size={18} aria-hidden /> Primary Objective
            </p>
            <h2 id="objective-title" className="mt-4 text-[26px] font-bold leading-snug sm:text-[30px]">{week.objective.title}</h2>
            <p className="mt-4 max-w-[640px] text-[15px] leading-relaxed text-[#cfd1fa] sm:text-[16px]">{week.objective.text}</p>
            <div className="mt-8 flex items-center gap-4">
              <div role="progressbar" aria-label={`Week ${week.week} progress`} aria-valuenow={week.objective.progress} aria-valuemin={0} aria-valuemax={100} className="h-2 flex-1 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-[#6cc1ff]" style={{ width: `${week.objective.progress}%` }} />
              </div>
              <span className="shrink-0 text-[14px] text-[#cfd1fa]">{week.objective.progress}% Complete</span>
            </div>
          </section>

          <div className="flex flex-col gap-5">
            <section className={`${cardClass} flex items-center gap-4 p-6`}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#d6ebf8] text-[#1a1a7a]">
                <MdOutlineTimer size={26} aria-hidden />
              </span>
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#4a4d66]">Estimated Time</p>
                <p className="mt-0.5 text-[22px] font-bold text-[#14162b]">{week.estimatedHours} Hours</p>
              </div>
            </section>
            <section className={`${cardClass} p-6`}>
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#4a4d66]">Key Concepts</p>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {week.concepts.map((concept) => (
                  <li key={concept} className="rounded-full border border-[#d6d4e6] bg-[#f3f2fa] px-4 py-1.5 text-[13px] font-medium text-[#2a2c42]">{concept}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <section aria-labelledby="schedule-title" className="mt-12">
          <h2 id="schedule-title" className="flex items-center gap-3 text-[22px] font-bold text-[#14162b]">
            <MdOutlineCalendarMonth size={26} className="text-[#00658f]" aria-hidden /> Daily Schedule
          </h2>
          <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 xl:gap-0 xl:overflow-visible xl:rounded-[12px] xl:border xl:border-[#e1dff0] xl:bg-white xl:p-0 [&>li]:xl:rounded-none [&>li]:xl:border-0 [&>li]:xl:border-r [&>li]:xl:border-[#e1dff0] [&>li:last-child]:xl:border-r-0 [&>li.z-10]:xl:rounded-[10px] [&>li.z-10]:xl:border-2">
            {week.days.map((day) => (
              <DayCard key={day.day} day={day} onToggle={onToggle} />
            ))}
          </ol>
        </section>

        </>
        )}

        {officeHours && (
        <section className="mt-12 flex flex-col items-start gap-5 rounded-[12px] border border-[#cfd2f5] bg-[#e3e6fb] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#1a1a7a]">
              <MdOutlineLightbulb size={28} aria-hidden />
            </span>
            <div>
              <h2 className="text-[20px] font-bold text-[#14162b]">{OFFICE_HOURS.title}</h2>
              <p className="mt-1 text-[15px] text-[#2a2c42]">{OFFICE_HOURS.text}</p>
            </div>
          </div>
          <button type="button" onClick={() => soon("Office hours booking")} className="shrink-0 rounded-[6px] border-2 border-[#1a1a7a] bg-white px-6 py-3 text-[14px] font-bold text-[#1a1a7a] transition-colors hover:bg-[#eceefd]">
            Book Slot
          </button>
        </section>
        )}
      </div>
    </LmsShell>
  );
};

const DemoWeeklyPath = () => {
  const [selected, setSelected] = useState(2);
  const week = PATH_WEEKS.find((entry) => entry.week === selected) ?? PATH_WEEKS[0];
  return <WeeklyPathView program={PATH_PROGRAM} tabs={PATH_WEEKS.map((entry) => entry.week)} selected={selected} onSelect={setSelected} week={week} officeHours />;
};

const toPathWeek = (week: TApiWeek): TPathWeek => ({
  week: week.weekNumber,
  objective: { title: week.objective.title, text: week.objective.text, progress: week.progress },
  estimatedHours: week.estimatedHours,
  concepts: week.concepts,
  days: week.days.map((day) => ({
    day: day.day,
    status: day.status,
    module: day.module,
    title: day.title,
    progress: day.status === "today" ? day.progress : undefined,
    items: day.items?.map((item) => ({ kind: item.kind, label: item.label, id: item._id, done: item.done, labSlug: item.labSlug })),
  })),
});

const LiveWeeklyPath = () => {
  const queryClient = useQueryClient();
  const [picked, setPicked] = useState<number | null>(null);
  const meQuery = useQuery({ queryKey: ["lms", "me"], queryFn: lmsApi.me });
  const cohort = meQuery.data?.cohorts.find((entry) => entry._id === meQuery.data?.activeCohortId) ?? meQuery.data?.cohorts[0];
  const cohortId = cohort?._id;

  const curriculumQuery = useQuery({ queryKey: ["lms", "curriculum", cohortId], queryFn: () => lmsApi.curriculum(cohortId), enabled: Boolean(cohortId) });
  const selected = picked ?? curriculumQuery.data?.currentWeek ?? 1;
  const weekQuery = useQuery({ queryKey: ["lms", "week", cohortId, selected], queryFn: () => lmsApi.week(selected, cohortId), enabled: Boolean(cohortId) && Boolean(curriculumQuery.data) });

  const toggle = useMutation({
    mutationFn: ({ itemId, done }: { itemId: string; done: boolean }) => axiosInstance.post("/lms/progress", { itemId, completed: done, cohortId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lms", "week", cohortId] });
      queryClient.invalidateQueries({ queryKey: ["lms", "curriculum", cohortId] });
    },
    onError: (error) => toast.error((error as AxiosError<{ error?: string }>).response?.data?.error ?? "Could not update your progress."),
  });

  const program = {
    trimester: (cohort?.trimester.name ?? "Trimester").toUpperCase(),
    course: cohort?.trimester.programName ?? "",
  };
  const tabs = curriculumQuery.data?.weeks.map((entry) => entry.weekNumber) ?? [];

  let message: TViewProps["message"];
  if (meQuery.isLoading || curriculumQuery.isLoading || weekQuery.isLoading) message = { title: "Loading your learning path..." };
  else if (meQuery.isError || curriculumQuery.isError || weekQuery.isError) message = { title: "We couldn't load your learning path", text: "Check your connection and refresh the page." };
  else if (!cohortId) message = { title: "You're not in a trimester cohort yet", text: "Once you're added to a cohort, your weekly path shows up here." };
  else if (tabs.length === 0) message = { title: "No weeks published yet", text: "Your instructor hasn't published the plan for this trimester." };

  return (
    <WeeklyPathView
      program={program}
      tabs={tabs}
      selected={selected}
      onSelect={setPicked}
      week={weekQuery.data ? toPathWeek(weekQuery.data.week) : undefined}
      message={message}
      onToggle={cohort?.role === "student" ? (itemId, done) => toggle.mutate({ itemId, done }) : undefined}
    />
  );
};

const WeeklyPathPage = () => {
  const demo = useDemoMode();
  if (demo === null) return null;
  return demo ? <DemoWeeklyPath /> : <LiveWeeklyPath />;
};

export default WeeklyPathPage;
