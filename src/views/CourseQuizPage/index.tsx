"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiX, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { getMyEnrollment } from "@services/enrollments";

// The API does not set a time limit on quizzes, so the page gives every quiz the same one
const QUIZ_MINUTES = 15;

type TQuizResult = {
  score: number;
  passingScore: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  breakdown: { questionId: string; selectedOptionIndex: number | null; isCorrect: boolean }[];
};

const formatTime = (seconds: number) => {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

// The route segment is named [moduleId] for historical reasons; it now carries the quiz's id
export default function CourseQuizPage() {
  const { id: courseId, moduleId: quizId } = useParams<{ id: string; moduleId: string }>()!;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [result, setResult] = useState<TQuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUIZ_MINUTES * 60);
  const autoSubmitted = useRef(false);

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
      setShowSubmitModal(false);
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    },
    onError: (error: any) => {
      autoSubmitted.current = false;
      toast.error(error.response?.data?.error || "Could not submit the quiz. Please try again.");
    },
  });

  const submitQuiz = () => {
    const answers = questions
      .map((q, i) => ({ questionId: q._id, selectedOptionIndex: selectedAnswers[i] }))
      .filter((a) => typeof a.selectedOptionIndex === "number");
    submitMutation.mutate(answers);
  };

  // Count down while the learner is answering
  useEffect(() => {
    if (result || showSubmitModal || totalQuestions === 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [result, showSubmitModal, totalQuestions]);

  // Time is up: send whatever has been answered
  useEffect(() => {
    if (timeLeft > 0 || result || totalQuestions === 0 || autoSubmitted.current) return;
    autoSubmitted.current = true;
    submitQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

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

  const retake = () => {
    setResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setTimeLeft(QUIZ_MINUTES * 60);
    autoSubmitted.current = false;
  };

  if (result) {
    const incorrect = result.breakdown.filter((b) => b.selectedOptionIndex !== null && !b.isCorrect).length;
    const skipped = result.breakdown.filter((b) => b.selectedOptionIndex === null).length;

    return (
      <div className="w-full min-h-screen bg-[#f8fafc] text-[#202127] flex flex-col items-center justify-center p-6">
        <div className="bg-white max-w-[600px] w-full rounded-[24px] border border-[#dedee7] p-12 text-center shadow-sm">
          <h1 className="text-[32px] font-bold text-[#07006f] mb-2">Quiz Completed</h1>
          <p className="text-[16px] text-[#717480] mb-12">Here is your performance breakdown</p>

          <div className="relative w-[160px] h-[160px] mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#eef2ff" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={result.passed ? "#10b981" : "#ef4444"}
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * result.score) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[36px] font-bold text-[#202127]">{result.score}%</span>
              <span className="text-[12px] text-[#717480]">Score</span>
            </div>
          </div>

          <h2 className={`text-[20px] font-bold mb-2 ${result.passed ? "text-[#10b981]" : "text-[#ef4444]"}`}>
            {result.passed ? "Congratulations! You passed the quiz." : "You did not pass. Please review and try again."}
          </h2>
          <p className="text-[13px] text-[#717480] mb-8">The pass mark is {result.passingScore}%.</p>

          <div className="flex justify-center gap-12 mb-12 border-t border-b border-[#dedee7] py-6">
            <div className="text-center">
              <div className="text-[24px] font-bold text-[#10b981]">{result.correctAnswers}</div>
              <div className="text-[12px] font-bold text-[#717480] uppercase tracking-wider">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-[24px] font-bold text-[#ef4444]">{incorrect}</div>
              <div className="text-[12px] font-bold text-[#717480] uppercase tracking-wider">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-[24px] font-bold text-[#f59e0b]">{skipped}</div>
              <div className="text-[12px] font-bold text-[#717480] uppercase tracking-wider">Skipped</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {!result.passed && (
              <button
                type="button"
                onClick={retake}
                className="w-full h-[52px] bg-[#07006f] text-white rounded-[8px] font-bold text-[15px] hover:bg-[#0a0050] transition-colors"
              >
                Try again
              </button>
            )}
            <button
              type="button"
              onClick={() => router.push(`/learning/${courseId}`)}
              className={`w-full h-[52px] rounded-[8px] font-bold text-[15px] transition-colors ${
                result.passed ? "bg-[#07006f] text-white hover:bg-[#0a0050]" : "bg-white border border-[#dedee7] text-[#202127] hover:bg-gray-50"
              }`}
            >
              Back to course
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIdx];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-[#202127] flex flex-col">
      <header className="h-[70px] bg-white border-b border-[#dedee7] flex items-center justify-between px-6 shrink-0">
        <button
          type="button"
          onClick={() => router.push(`/learning/${courseId}`)}
          className="flex items-center gap-2 text-[#4e515c] hover:text-[#202127] transition-colors font-bold text-[14px]"
        >
          <FiX className="text-[20px]" /> Close
        </button>
        <div className="flex items-center gap-4 bg-[#f8fafc] px-4 py-2 rounded-[8px] border border-[#dedee7] font-bold text-[16px] text-[#07006f]">
          {formatTime(timeLeft)}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col items-center py-12 px-6 relative">
        <div className="w-full max-w-[800px] mb-12">
          <div className="flex justify-between items-end mb-2">
            <span className="font-bold text-[14px] text-[#202127]">
              {quiz.title ? `${quiz.title}: ` : ""}Question {currentQuestionIdx + 1} of {totalQuestions}
            </span>
          </div>
          <div className="w-full h-[8px] bg-[#e2e8f0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#07006f] transition-all duration-300"
              style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="w-full max-w-[800px] bg-white rounded-[16px] border border-[#dedee7] p-8 md:p-12 shadow-sm mb-24">
          <h2 className="text-[24px] font-bold text-[#202127] mb-8 leading-tight">{currentQuestion.questionText}</h2>

          <div className="space-y-4">
            {(currentQuestion.options || []).map((opt: string, idx: number) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === idx;
              return (
                <label
                  key={idx}
                  onClick={() => setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIdx]: idx }))}
                  className={`flex items-center gap-4 p-5 rounded-[12px] border-2 cursor-pointer transition-all ${
                    isSelected ? "border-[#07006f] bg-[#eef2ff]" : "border-[#dedee7] hover:border-[#b4bff5]"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? "border-[#07006f]" : "border-[#dedee7]"
                    }`}
                  >
                    {isSelected && <div className="w-3 h-3 rounded-full bg-[#07006f]"></div>}
                  </div>
                  <span className={`text-[16px] ${isSelected ? "font-bold text-[#07006f]" : "text-[#4e515c]"}`}>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white border-t border-[#dedee7] flex items-center justify-center px-6">
          <div className="w-full max-w-[800px] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-8 h-[48px] bg-white border border-[#dedee7] text-[#202127] rounded-[8px] font-bold text-[14px] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => (currentQuestionIdx < totalQuestions - 1 ? setCurrentQuestionIdx((prev) => prev + 1) : setShowSubmitModal(true))}
              className="px-8 h-[48px] bg-[#07006f] text-white rounded-[8px] font-bold text-[14px] hover:bg-[#0a0050] transition-colors"
            >
              {currentQuestionIdx === totalQuestions - 1 ? "Submit Quiz" : "Next"}
            </button>
          </div>
        </div>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[480px] rounded-[24px] p-8 text-center shadow-xl">
            <div className="w-[80px] h-[80px] bg-[#eef2ff] text-[#07006f] rounded-full flex items-center justify-center text-[40px] mx-auto mb-6">
              <FiCheckCircle />
            </div>
            <h3 className="text-[24px] font-bold text-[#202127] mb-2">Submit Quiz?</h3>
            <p className="text-[14px] text-[#717480] mb-8 leading-relaxed">
              You have answered {answeredCount} out of {totalQuestions} questions. Unanswered questions count as incorrect.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                disabled={submitMutation.isPending}
                className="flex-1 h-[52px] bg-white border border-[#dedee7] text-[#202127] rounded-[8px] font-bold text-[15px] hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitQuiz}
                disabled={submitMutation.isPending}
                className="flex-1 h-[52px] bg-[#07006f] text-white rounded-[8px] font-bold text-[15px] hover:bg-[#0a0050] transition-colors disabled:opacity-60"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
