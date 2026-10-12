"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdCheck, MdClose, MdOutlineFlag, MdOutlineTimer } from "react-icons/md";
import { QUIZ } from "./data";

const TOTAL_SECONDS = QUIZ.minutes * 60;
const mmss = (total: number) => `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;

const QuizPage = () => {
  const router = useRouter();
  const questions = QUIZ.questions;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const [checked, setChecked] = useState<boolean[]>(() => questions.map(() => false));
  const [flagged, setFlagged] = useState<boolean[]>(() => questions.map(() => false));
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [finished, setFinished] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);

  useEffect(() => {
    if (finished) return;
    const id = window.setInterval(() => setRemaining((value) => value - 1), 1000);
    return () => window.clearInterval(id);
  }, [finished]);

  useEffect(() => {
    if (remaining <= 0 && !finished) setFinished(true);
  }, [remaining, finished]);

  const score = useMemo(() => picked.reduce<number>((total, choice, i) => total + (choice === questions[i].answer ? 1 : 0), 0), [picked, questions]);

  const question = questions[index];
  const isChecked = checked[index];
  const choice = picked[index];
  const percent = Math.round(((index + 1) / questions.length) * 100);
  const isLast = index === questions.length - 1;

  const select = (optionIndex: number) => {
    if (isChecked) return;
    setPicked((list) => list.map((value, i) => (i === index ? optionIndex : value)));
  };

  const primary = () => {
    if (!isChecked) return setChecked((list) => list.map((value, i) => (i === index ? true : value)));
    if (isLast) return setFinished(true);
    setIndex((value) => value + 1);
  };

  const retake = () => {
    setIndex(0);
    setPicked(questions.map(() => null));
    setChecked(questions.map(() => false));
    setFlagged(questions.map(() => false));
    setRemaining(TOTAL_SECONDS);
    setFinished(false);
  };

  const requestLeave = () => (finished ? router.push("/lms/curriculum") : setIsLeaveOpen(true));

  if (finished) {
    const passed = score / questions.length >= 0.7;
    const flaggedList = flagged.map((value, i) => (value ? i + 1 : null)).filter(Boolean);
    return (
      <div className="min-h-screen bg-[#f9f8ff] px-4 py-16" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        <div className="mx-auto max-w-[560px] rounded-[16px] border border-[#e1dff0] bg-white p-8 text-center shadow-[0_18px_50px_-30px_rgba(40,40,120,0.4)] sm:p-12">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#4a4d66]">{QUIZ.name} complete</p>
          <h1 className="mt-3 text-[32px] font-bold text-[#1a1a7a]">{passed ? "Well done!" : "Keep practising"}</h1>
          <p className="mt-6 text-[56px] font-bold leading-none text-[#14162b]">
            {score}
            <span className="text-[28px] text-[#4a4d66]">/{questions.length}</span>
          </p>
          <p className="mt-3 text-[15px] text-[#4a4d66]">{Math.round((score / questions.length) * 100)}% correct. The pass mark is 70%.</p>
          {flaggedList.length > 0 && <p className="mt-4 text-[13px] text-[#4a4d66]">Flagged for review: question{flaggedList.length > 1 ? "s" : ""} {flaggedList.join(", ")}.</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button type="button" onClick={retake} className="rounded-[4px] border border-[#c9c8dc] bg-white px-6 py-3 text-[14px] font-medium text-[#14162b] hover:bg-[#f3f2fb]">
              Retake Quiz
            </button>
            <Link href="/lms/curriculum" className="rounded-[4px] bg-[#1a1a7a] px-6 py-3 text-[14px] font-medium text-white hover:bg-[#10107a]">
              Back to Curriculum
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f8ff] text-[#14162b]" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#dedcec] bg-white px-4 py-3 sm:px-10">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <button type="button" aria-label="Leave quiz" onClick={requestLeave} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#2a2c42] hover:bg-[#f1effa]">
            <MdClose size={26} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-[16px] font-bold text-[#1a1a7a] sm:text-[20px]">{QUIZ.course}</h1>
            <p className="text-[12px] text-[#4a4d66] sm:text-[13px]">{QUIZ.name}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <div role="timer" aria-label="Time remaining" className={`flex items-center gap-2.5 rounded-[10px] border px-3 py-2 sm:px-4 ${remaining < 60 ? "border-[#f3c1c1] bg-[#fde8e8] text-[#c62828]" : "border-[#cfe3ef] bg-[#e8f3fa] text-[#00658f]"}`}>
            <MdOutlineTimer size={22} />
            <span className="font-mono text-[18px] font-bold tabular-nums sm:text-[22px]">{mmss(Math.max(0, remaining))}</span>
          </div>
          <div className="hidden w-[150px] sm:block">
            <p className="flex items-center justify-between text-[12px] text-[#14162b]">
              <span>
                Question {index + 1} of {questions.length}
              </span>
              <span className="font-bold text-[#1a1a7a]">{percent}%</span>
            </p>
            <div role="progressbar" aria-label="Quiz progress" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#e8e7f1]">
              <div className="h-full rounded-full bg-[#00658f] transition-[width]" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[920px] px-4 py-8 sm:py-14">
        <p className="mb-3 text-center text-[12px] text-[#4a4d66] sm:hidden">
          Question {index + 1} of {questions.length}
        </p>
        <section aria-live="polite" className="rounded-[10px] border border-[#e1dff0] bg-white p-6 shadow-[0_18px_50px_-30px_rgba(40,40,120,0.35)] sm:p-12">
          <span className="inline-block rounded-full bg-[#f1effa] px-4 py-1.5 text-[12px] font-bold text-[#1a1a7a]">Multiple Choice</span>
          <h2 className="mt-6 text-[22px] font-bold leading-[1.4] text-[#1a1a7a] sm:text-[28px]">{question.prompt}</h2>
          {question.hint && <p className="mt-4 text-[15px] leading-relaxed text-[#4a4d66] sm:text-[17px]">{question.hint}</p>}

          <div role="radiogroup" aria-label="Answer choices" className="mt-8 flex flex-col gap-4">
            {question.options.map((option, optionIndex) => {
              const isPicked = choice === optionIndex;
              const isAnswer = optionIndex === question.answer;
              let style = "border-[#dedcec] bg-white hover:bg-[#faf9ff]";
              let box = "border-[#c9c8dc] bg-white";
              if (isPicked && !isChecked) {
                style = "border-2 border-[#020060] bg-[#fbfbff] text-[#1a1a7a]";
                box = "border-[#020060] bg-[#020060] text-white";
              }
              if (isChecked && isAnswer) {
                style = "border-2 border-[#2e7d32] bg-[#f1faf2]";
                box = "border-[#2e7d32] bg-[#2e7d32] text-white";
              }
              if (isChecked && isPicked && !isAnswer) {
                style = "border-2 border-[#c62828] bg-[#fdf3f3]";
                box = "border-[#c62828] bg-[#c62828] text-white";
              }
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isPicked}
                  disabled={isChecked}
                  onClick={() => select(optionIndex)}
                  className={`flex items-center gap-5 rounded-[6px] border px-5 py-5 text-left text-[15px] leading-snug transition-colors disabled:cursor-default ${style}`}
                >
                  <span className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] border-2 ${box}`}>
                    {(isPicked || (isChecked && isAnswer)) && <MdCheck size={18} />}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {isChecked && (
            <p role="status" className={`mt-5 text-[14px] font-medium ${choice === question.answer ? "text-[#2e7d32]" : "text-[#c62828]"}`}>
              {choice === question.answer ? "Correct!" : "Not quite. The correct answer is highlighted in green."}
            </p>
          )}

          <div className="mt-10 flex flex-col gap-4 border-t border-[#e8e7f1] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              aria-pressed={flagged[index]}
              onClick={() => setFlagged((list) => list.map((value, i) => (i === index ? !value : value)))}
              className={`flex items-center gap-2 text-[14px] ${flagged[index] ? "font-bold text-[#c62828]" : "text-[#4a4d66] hover:text-[#1a1a7a]"}`}
            >
              <MdOutlineFlag size={22} /> {flagged[index] ? "Flagged for review" : "Flag for review"}
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => setIndex((value) => value - 1)}
                className="flex-1 rounded-[4px] border border-[#c9c8dc] bg-white px-6 py-3.5 text-[14px] text-[#14162b] transition-colors hover:bg-[#f3f2fb] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={choice === null}
                onClick={primary}
                className="flex-1 rounded-[4px] bg-[#1a1a7a] px-7 py-3.5 text-[14px] font-medium text-white shadow-[0_10px_20px_-10px_rgba(26,26,122,0.8)] transition-colors hover:bg-[#10107a] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                {!isChecked ? "Check Answer" : isLast ? "Finish Quiz" : "Next Question"}
              </button>
            </div>
          </div>
        </section>
      </main>

      {isLeaveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0a2a]/50 p-4 backdrop-blur-sm" onClick={() => setIsLeaveOpen(false)}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="leave-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-[420px] rounded-[14px] bg-white p-7 shadow-2xl">
            <h2 id="leave-title" className="text-[20px] font-bold text-[#1a1a7a]">Leave this quiz?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#4a4d66]">Your answers and remaining time will be lost.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" autoFocus onClick={() => setIsLeaveOpen(false)} className="rounded-[6px] px-4 py-2.5 text-[14px] font-medium text-[#14162b] hover:bg-[#f3f1fb]">Keep going</button>
              <button type="button" onClick={() => router.push("/lms/curriculum")} className="rounded-[6px] bg-[#c62828] px-4 py-2.5 text-[14px] font-medium text-white hover:bg-[#a81f1f]">Leave quiz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
