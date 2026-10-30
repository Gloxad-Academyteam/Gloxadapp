"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiChevronLeft, FiChevronRight, FiMenu } from "react-icons/fi";
import { FaCheckCircle, FaRegCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { getMyEnrollment } from "@services/enrollments";

type TQuizResult = {
  score: number;
  passingScore: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  breakdown: { questionId: string; selectedOptionIndex: number | null; isCorrect: boolean; correctOptionIndex?: number }[];
};

// The route segment is named [moduleId] for historical reasons; it now carries the quiz's id
export default function CourseQuizPage() {
  const { id: courseId, moduleId: quizId } = useParams<{ id: string; moduleId: string }>()!;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showMenu, setShowMenu] = useState(true);
  const [result, setResult] = useState<TQuizResult | null>(null);

  const { isLoading: isEnrollmentLoading, isError: isEnrollmentError } = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      const match = await getMyEnrollment(courseId);
      if (!match) throw new Error("Not enrolled");
      return match;
    },
    enabled: !!courseId,
  });

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course.quiz", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/courses/${courseId}`);
      // GET /courses/:slugOrId answers { course, isEnrolled }
      return res.data?.course ?? res.data;
    },
    enabled: !!courseId,
  });

  const quiz = (courseData?.modules || [])
    .flatMap((mod: any) => mod.quizzes || [])
    .find((q: any) => String(q._id) === String(quizId));
  const questions: any[] = quiz?.questions || [];
  const totalQuestions = questions.length;

  // The API scores the quiz: the page only sends which option was picked for each question
  const submitMutation = useMutation({
    mutationFn: async (answers: { questionId: string; selectedOptionIndex: number }[]) => {
      const res = await axiosInstance.post(`/learning/${courseId}/quiz/${quizId}/submit`, { answers });
      return res.data.result as TQuizResult;
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Could not submit the quiz. Please try again.");
    },
  });

  const submitQuiz = () => {
    const answers = questions
      .map((q, i) => ({ questionId: q._id, selectedOptionIndex: selectedAnswers[i] }))
      .filter((a) => typeof a.selectedOptionIndex === "number");
    submitMutation.mutate(answers);
  };

  useEffect(() => {
    if (isEnrollmentError) router.push(`/courses/${courseId}`);
  }, [isEnrollmentError, courseId, router]);

  if (isEnrollmentError) return null;

  if (isLoading || isEnrollmentLoading || !courseData) {
    return <div className="p-20 text-center text-[#717480]">Loading quiz...</div>;
  }

  if (!quiz || totalQuestions === 0) {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-[24px] font-bold text-[#202127] mb-2">{quiz ? "This quiz has no questions yet" : "Quiz not found"}</h1>
        <p className="text-[14px] text-[#717480] mb-8">Go back to the course to continue with your lessons.</p>
        <button
          type="button"
          onClick={() => router.push(`/learning/${courseId}`)}
          className="px-8 h-[48px] bg-[#07006f] text-white rounded-[8px] font-bold text-[14px] hover:bg-[#0a0050] transition-colors"
        >
          Back to course
        </button>
      </div>
    );
  }

  const allAnswered = questions.every((_, i) => typeof selectedAnswers[i] === "number");
  const modules: any[] = courseData.modules || [];
  const moduleIndex = modules.findIndex((m: any) => (m.quizzes || []).some((q: any) => String(q._id) === String(quizId)));
  const moduleName = (mod: any) => String(mod?.title || "").replace(/^Module \d+:\s*/, "");

  const retake = () => {
    setResult(null);
    setSelectedAnswers({});
  };

  return (
    <div className="w-full bg-white text-[#201633]">
      <div className="flex min-h-[calc(100vh-140px)] flex-col lg:flex-row">
        {/* Left: course menu */}
        <aside className={`order-2 w-full shrink-0 border-t border-[#e5e7ef] lg:order-1 lg:border-r lg:border-t-0 ${showMenu ? "lg:w-[320px]" : "lg:w-[64px]"}`}>
          <button type="button" onClick={() => setShowMenu((v) => !v)} className="flex w-full items-center gap-3 px-5 py-5 text-left text-[13px] font-semibold text-[#07004d]">
            <FiMenu className="text-[16px]" />
            {showMenu && "Hide Menu"}
          </button>
          {showMenu && (
            <nav className="px-5 pb-8">
              {modules.map((mod: any, idx: number) => (
                <div key={mod._id} className="mb-5">
                  <h3 className="mb-3 text-[14px] font-bold leading-snug text-[#07004d]">Module {idx + 1}: {moduleName(mod)}</h3>
                  <ul className="space-y-3">
                    {(mod.lessons || []).map((lesson: any) => (
                      <li key={lesson._id}>
                        <button type="button" onClick={() => router.push(`/learning/${courseId}`)} className="flex w-full items-start gap-2.5 text-left text-[13px] leading-snug text-[#201633] hover:text-[#07004d]">
                          <FaCheckCircle className="mt-[2px] shrink-0 text-[15px] text-[#22a559]" />
                          <span>{lesson.title}</span>
                        </button>
                      </li>
                    ))}
                    {(mod.quizzes || []).map((q: any) => (
                      <li key={q._id} className={`flex items-start gap-2.5 text-[13px] leading-snug ${String(q._id) === String(quizId) ? "font-semibold text-[#07004d]" : "text-[#201633]"}`}>
                        <FaRegCircle className="mt-[2px] shrink-0 text-[15px] text-[#6b6e7a]" />
                        <span>{q.title || "Quiz"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </aside>

        {/* Right: the quiz, or its results */}
        <section className="order-1 min-w-0 flex-1 bg-[radial-gradient(ellipse_at_bottom_right,#e8f0ff_0%,transparent_55%)] px-5 py-5 sm:px-8 lg:order-2">
          <div className="mx-auto max-w-[760px]">
            <div className="mb-6 flex items-center justify-between gap-3 text-[12px] text-[#4e515c]">
              <p className="min-w-0 truncate">
                <span className="text-[#201633]">{courseData.title}</span>
                <span className="mx-2 text-[#a0a3ae]">/</span>
                <span className="text-[#07004d]">Module {Math.max(moduleIndex + 1, 1)}</span>
                <span className="mx-2 text-[#a0a3ae]">›</span>
                <span>{result ? "Quiz Results" : quiz.title || "Quiz"}</span>
              </p>
              <div className="flex shrink-0 items-center gap-4 font-semibold text-[#07004d]">
                <button type="button" onClick={() => router.push(`/learning/${courseId}`)} className="flex items-center gap-1">
                  <FiChevronLeft /> Previous
                </button>
                <button type="button" onClick={() => router.push(`/learning/${courseId}`)} className="flex items-center gap-1">
                  Next <FiChevronRight />
                </button>
              </div>
            </div>

            {!result ? (
              <>
                <p className="mb-1 text-[13px] leading-[1.7]">
                  Instructions: Please provide an answer for all questions. Each question is one point. Click on the Submit button to register your answers. After submitting your answers, the correct answer to each question will be displayed.
                </p>
                <p className="mb-6 text-[13px] font-semibold">All quiz questions count towards your score. You should answer all questions.</p>

                <div className="space-y-6">
                  {questions.map((q: any, qi: number) => (
                    <fieldset key={q._id || qi}>
                      <legend className="mb-2 text-[13px] font-medium">{qi + 1}. {q.questionText}</legend>
                      <div className="space-y-1.5">
                        {(q.options || []).map((opt: string, oi: number) => {
                          const picked = selectedAnswers[qi] === oi;
                          return (
                            <label key={oi} className="flex cursor-pointer items-center gap-2.5 text-[13px]">
                              <span className={`flex h-[14px] w-[14px] items-center justify-center rounded-full border ${picked ? "border-[#07004d]" : "border-[#6b6e7a]"}`}>
                                {picked && <span className="h-[8px] w-[8px] rounded-full bg-[#07004d]" />}
                              </span>
                              <input type="radio" className="sr-only" name={`q-${qi}`} checked={picked} onChange={() => setSelectedAnswers((prev) => ({ ...prev, [qi]: oi }))} />
                              {opt}
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={submitQuiz}
                  disabled={!allAnswered || submitMutation.isPending}
                  className="mt-8 h-[44px] w-full rounded-[6px] bg-[#07004d] text-[13px] font-semibold text-white transition hover:bg-[#111456] disabled:cursor-not-allowed disabled:bg-[#c9c9e0]"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit"}
                </button>
              </>
            ) : (
              <>
                <h2 className="text-[16px] font-bold text-[#07004d]">Quiz Results</h2>
                <p className="mt-1 mb-6 text-[12px] text-[#4e515c]">
                  You correctly answered {result.correctAnswers} of {result.totalQuestions} questions.
                </p>

                <div className="space-y-5">
                  {questions.map((q: any, qi: number) => {
                    const row = result.breakdown.find((b) => String(b.questionId) === String(q._id));
                    const picked = row?.selectedOptionIndex;
                    const correctText = typeof row?.correctOptionIndex === "number" ? q.options?.[row.correctOptionIndex] : undefined;
                    return (
                      <dl key={q._id || qi} className="grid grid-cols-[110px_1fr] gap-y-2 text-[12px]">
                        <dt className="font-semibold">Question {qi + 1}</dt>
                        <dd>{q.questionText}</dd>
                        <dt className="font-semibold">Your answer</dt>
                        <dd>{typeof picked === "number" ? q.options?.[picked] : "Not answered"}</dd>
                        <dt className="font-semibold">Result</dt>
                        <dd className="flex items-center gap-1.5">
                          {row?.isCorrect ? (
                            <>Correct <FaCheckCircle className="text-[#22a559]" /></>
                          ) : (
                            <>Wrong <FaTimesCircle className="text-[#e5484d]" /></>
                          )}
                        </dd>
                        {!row?.isCorrect && correctText && (
                          <>
                            <dt className="font-semibold">Correct answer</dt>
                            <dd>{correctText}</dd>
                          </>
                        )}
                      </dl>
                    );
                  })}
                </div>

                <div className="mx-auto mt-10 flex max-w-[300px] flex-col items-center text-center">
                  <div className="relative h-[190px] w-[190px]">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e7ef" strokeWidth="9" />
                      <circle
                        cx="50" cy="50" r="44" fill="none"
                        stroke={result.passed ? "#1f7a1f" : "#e5484d"}
                        strokeWidth="9" strokeDasharray="276.5"
                        strokeDashoffset={276.5 - (276.5 * result.score) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                      <span className="text-[28px] font-bold">{result.score}%</span>
                      <span className="mt-1 text-[8px] leading-snug text-[#4e515c]">
                        {result.passed
                          ? "Congratulations! You scored well. Keep up the great work and push to achieve more excellence."
                          : "Don't be discouraged. Revisit the lessons, then retake the quiz when you're ready."}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mx-auto mt-8 flex max-w-[420px] gap-4">
                  <button type="button" onClick={() => router.push(`/learning/${courseId}`)} className="h-[40px] flex-1 rounded-[6px] bg-[#07004d] text-[12px] font-semibold text-white hover:bg-[#111456]">
                    {result.passed ? "Next Module" : "Back to Course"}
                  </button>
                  <button type="button" onClick={retake} className="h-[40px] flex-1 rounded-[6px] border border-[#07004d] bg-white text-[12px] font-semibold text-[#07004d] hover:bg-[#eef2ff]">
                    Retake Quiz
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
