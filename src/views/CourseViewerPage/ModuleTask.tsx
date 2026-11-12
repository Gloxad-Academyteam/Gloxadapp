"use client";

import { BlockSkeleton, CardGridSkeleton, DetailSkeleton, ListSkeleton, Skeleton, TableRowsSkeleton } from "@components/Skeleton";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { getModuleTask, submitModuleTask } from "@services/enrollments";

type TProps = {
  courseId: string;
  moduleId: string;
  moduleNumber: number;
  // Set once the module is finished, so the learner can carry on
  nextModuleNumber: number | null;
  onContinue: () => void;
};

const countWords = (text: string) => (text.match(/\S+/g) || []).length;

const when = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// The written task after a module quiz: instructions, a box for the answer, and the learner's earlier attempts
const ModuleTask = ({ courseId, moduleId, moduleNumber, nextModuleNumber, onContinue }: TProps) => {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [link, setLink] = useState("");

  const task = useQuery({ queryKey: ["module-task", courseId, moduleId], queryFn: () => getModuleTask(courseId, moduleId) });

  // Start from the latest answer so the learner can improve it
  const latest = task.data?.submissions[0];
  useEffect(() => {
    if (latest) {
      setText(latest.text);
      setLink(latest.link || "");
    } else {
      setText("");
      setLink("");
    }
  }, [latest?._id, moduleId]);

  const submit = useMutation({
    mutationFn: () => submitModuleTask(courseId, moduleId, { text, link: link.trim() }),
    onSuccess: (result) => {
      toast.success(result.message === "Task already submitted" ? "Your task is already submitted" : "Task submitted");
      queryClient.invalidateQueries({ queryKey: ["module-task", courseId, moduleId] });
      queryClient.invalidateQueries({ queryKey: ["module-gates", courseId] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    },
    onError: (error: any) => toast.error(error.response?.data?.error || "Could not submit the task. Please try again."),
  });

  if (task.isLoading) return <div className="space-y-3 py-6"><Skeleton className="h-5 w-1/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></div>;
  if (task.isError || !task.data) {
    return (
      <div role="alert" className="rounded-2xl border border-[#f3c9c9] bg-[#fff6f6] p-6 text-[13px] text-[#201633]">
        We could not load this task.{" "}
        <button type="button" onClick={() => task.refetch()} className="font-semibold text-[#07004d] underline">Try again</button>
      </div>
    );
  }

  const { task: info, gate, submissions } = task.data;
  const words = countWords(text);
  const enough = words >= info.minWords;
  const unchanged = !!latest && latest.text === text.trim() && (latest.link || "") === link.trim();
  const open = gate.task?.available !== false;

  return (
    <div className="rounded-2xl border border-[#e5e7ef] bg-white p-5 shadow-[0_8px_30px_rgba(7,0,77,0.06)] sm:p-8">
      <p className="text-[12px] font-bold uppercase tracking-wider text-[#2563eb]">Module {moduleNumber} task</p>
      <h2 className="mt-1 text-[20px] font-bold text-[#201633]">{info.title}</h2>
      <p className="mt-4 whitespace-pre-line text-[13px] leading-[1.75] text-[#4e515c]">{info.instructions}</p>

      {!open ? (
        <p className="mt-6 rounded-xl bg-[#f4f5fa] p-4 text-[13px] text-[#4e515c]">Pass the module quiz to open this task.</p>
      ) : (
        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            submit.mutate();
          }}
        >
          <label htmlFor="task-answer" className="text-[13px] font-semibold text-[#201633]">Your answer</label>
          <textarea
            id="task-answer"
            rows={9}
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={6000}
            className="mt-2 w-full rounded-xl border border-[#d7d9e4] bg-white p-3 text-[13px] leading-[1.6] outline-none focus:border-[#07004d]"
            placeholder="Write your answer here"
          />
          <p className={`mt-1 text-[12px] ${enough ? "text-[#15803d]" : "text-[#717480]"}`}>
            {words} of {info.minWords} words{enough ? " - ready to submit" : ""}
          </p>

          <label htmlFor="task-link" className="mt-4 block text-[13px] font-semibold text-[#201633]">Link to your work (optional)</label>
          <input
            id="task-link"
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://"
            className="mt-2 h-[42px] w-full rounded-xl border border-[#d7d9e4] bg-white px-3 text-[13px] outline-none focus:border-[#07004d]"
          />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!enough || unchanged || submit.isPending}
              className="h-[44px] rounded-full bg-[#07004d] px-8 text-[14px] font-semibold text-white transition hover:bg-[#111456] disabled:cursor-not-allowed disabled:bg-[#c9c9e0]"
            >
              {submit.isPending ? "Submitting..." : latest ? "Submit improved answer" : "Submit task"}
            </button>
            {latest && (
              <span className="inline-flex items-center gap-1.5 text-[12px] text-[#15803d]">
                <FiCheckCircle /> Submitted on {when(latest.submittedAt)} (attempt {latest.attempt})
              </span>
            )}
          </div>
        </form>
      )}

      {gate.complete && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#e6f6ec] p-4">
          <p className="text-[13px] font-semibold text-[#15803d]">Module {moduleNumber} complete</p>
          <button type="button" onClick={onContinue} className="h-[40px] rounded-full bg-[#07004d] px-6 text-[13px] font-semibold text-white hover:bg-[#111456]">
            {nextModuleNumber ? `Continue to Module ${nextModuleNumber}` : "Finish course"}
          </button>
        </div>
      )}

      {submissions.length > 1 && (
        <p className="mt-4 text-[12px] text-[#717480]">You have submitted this task {submissions.length} times. Your latest answer is the one that counts.</p>
      )}
    </div>
  );
};

export default ModuleTask;
