"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FiX, FiCheckCircle } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";

export default function CourseQuizPage() {
  const { id: courseId, moduleId } = useParams<{ id: string; moduleId: string }>()!;
  const router = useRouter();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins default

  const { data: enrollment, isLoading: isEnrollmentLoading, isError: isEnrollmentError } = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get("/enrollments/my-courses");
      const match = res.data.find((e: any) => e.course?._id === courseId || e.course === courseId);
      if (!match) throw new Error("Not enrolled");
      return match;
    },
    enabled: !!courseId
  });

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course.quiz", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/courses/${courseId}`);
      return res.data;
    },
    enabled: !!courseId
  });

  // Start timer
  useEffect(() => {
    if (isCompleted || showSubmitModal) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, showSubmitModal]);

  useEffect(() => {
    if (isEnrollmentError) {
      router.push(`/courses/${courseId}`);
    }
  }, [isEnrollmentError, courseId, router]);

  const submitMutation = useMutation({
    mutationFn: async ({ score, passed }: { score: number; passed: boolean }) => {
      const res = await axiosInstance.post(`/learning/${courseId}/quiz/${moduleId}/submit`, {
        score,
        passed
      });
      return res.data;
    },
    onSuccess: () => {
      setIsCompleted(true);
    }
  });

  if (isEnrollmentError) {
    return null;
  }

  if (isLoading || isEnrollmentLoading || !courseData) {
    return <div className="p-20 text-center text-[#717480]">Loading quiz...</div>;
  }

  const quizModule = courseData.modules?.find((m: any) => m._id === moduleId);
  const quiz = quizModule?.quiz;

  // Mock questions if none exist in DB for testing UI
  const questions = quiz?.questions?.length > 0 ? quiz.questions : [
    { questionText: "What is the primary purpose of HTML?", options: ["Styling web pages", "Structuring content", "Adding interactivity", "Database management"], correctOptionIndex: 1 },
    { questionText: "Which tag is used to create a hyperlink?", options: ["<link>", "<a>", "<href>", "<nav>"], correctOptionIndex: 1 },
    { questionText: "Which attribute specifies the destination of a link?", options: ["src", "link", "href", "url"], correctOptionIndex: 2 }
  ];

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIdx];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (idx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIdx]: idx }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    setShowSubmitModal(false);
    
    let correct = 0;
    questions.forEach((q: any, i: number) => {
      if (selectedAnswers[i] === q.correctOptionIndex) correct++;
    });
    const percent = Math.round((correct / totalQuestions) * 100);
    const passed = percent >= (quiz?.passingScore || 80);

    submitMutation.mutate({ score: percent, passed });
  };

  if (isCompleted) {
    // Calculate Score
    let correct = 0;
    questions.forEach((q: any, i: number) => {
      if (selectedAnswers[i] === q.correctOptionIndex) correct++;
    });
    const percent = Math.round((correct / totalQuestions) * 100);
    const passed = percent >= (quiz?.passingScore || 80);

    return (
      <div className="w-full min-h-screen bg-[#f8fafc] text-[#202127] flex flex-col items-center justify-center p-6">
        <div className="bg-white max-w-[600px] w-full rounded-[24px] border border-[#dedee7] p-12 text-center shadow-sm">
          <h1 className="text-[32px] font-bold text-[#07006f] mb-2">Quiz Completed</h1>
          <p className="text-[16px] text-[#717480] mb-12">Here is your performance breakdown</p>

          <div className="relative w-[160px] h-[160px] mx-auto mb-6">
            {/* Circular Progress SVG */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#eef2ff" strokeWidth="10" />
              <circle cx="50" cy="50" r="45" fill="none" stroke={passed ? "#10b981" : "#ef4444"} strokeWidth="10" 
                strokeDasharray="283" strokeDashoffset={283 - (283 * percent) / 100} 
                strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[36px] font-bold text-[#202127]">{percent}%</span>
              <span className="text-[12px] text-[#717480]">Score</span>
            </div>
          </div>

          <h2 className={`text-[20px] font-bold mb-8 ${passed ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
            {passed ? "Congratulations! You passed the quiz." : "You did not pass. Please review and try again."}
          </h2>

          <div className="flex justify-center gap-12 mb-12 border-t border-b border-[#dedee7] py-6">
            <div className="text-center">
              <div className="text-[24px] font-bold text-[#10b981]">{correct}</div>
              <div className="text-[12px] font-bold text-[#717480] uppercase tracking-wider">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-[24px] font-bold text-[#ef4444]">{totalQuestions - correct}</div>
              <div className="text-[12px] font-bold text-[#717480] uppercase tracking-wider">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-[24px] font-bold text-[#f59e0b]">{totalQuestions - Object.keys(selectedAnswers).length}</div>
              <div className="text-[12px] font-bold text-[#717480] uppercase tracking-wider">Skipped</div>
            </div>
          </div>

          <button 
            onClick={() => router.push(`/learning/${courseId}`)}
            className="w-full h-[52px] bg-[#07006f] text-white rounded-[8px] font-bold text-[15px] hover:bg-[#0a0050] transition-colors"
          >
            Continue to next module
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-[#202127] flex flex-col">
      {/* Header */}
      <header className="h-[70px] bg-white border-b border-[#dedee7] flex items-center justify-between px-6 shrink-0">
        <button onClick={() => router.push(`/learning/${courseId}`)} className="flex items-center gap-2 text-[#4e515c] hover:text-[#202127] transition-colors font-bold text-[14px]">
          <FiX className="text-[20px]" /> Close
        </button>
        <div className="flex items-center gap-4 bg-[#f8fafc] px-4 py-2 rounded-[8px] border border-[#dedee7] font-bold text-[16px] text-[#07006f]">
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center py-12 px-6 relative">
        
        {/* Progress Bar */}
        <div className="w-full max-w-[800px] mb-12">
          <div className="flex justify-between items-end mb-2">
            <span className="font-bold text-[14px] text-[#202127]">Question {currentQuestionIdx + 1} of {totalQuestions}</span>
          </div>
          <div className="w-full h-[8px] bg-[#e2e8f0] rounded-full overflow-hidden">
            <div className="h-full bg-[#07006f] transition-all duration-300" style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}></div>
          </div>
        </div>

        {/* Question Area */}
        <div className="w-full max-w-[800px] bg-white rounded-[16px] border border-[#dedee7] p-8 md:p-12 shadow-sm mb-24">
          <h2 className="text-[24px] font-bold text-[#202127] mb-8 leading-tight">
            {currentQuestion.questionText}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((opt: string, idx: number) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === idx;
              return (
                <label 
                  key={idx} 
                  className={`flex items-center gap-4 p-5 rounded-[12px] border-2 cursor-pointer transition-all ${isSelected ? 'border-[#07006f] bg-[#f5f8ff]' : 'border-[#dedee7] hover:border-[#a0aab8]'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-[#07006f]' : 'border-[#a0aab8]'}`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-[#07006f]"></div>}
                  </div>
                  <span className={`text-[16px] ${isSelected ? 'font-bold text-[#07006f]' : 'text-[#4e515c]'}`}>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white border-t border-[#dedee7] flex items-center justify-center px-6">
          <div className="w-full max-w-[800px] flex items-center justify-between">
            <button 
              onClick={handlePrev}
              disabled={currentQuestionIdx === 0}
              className="px-8 h-[48px] bg-white border border-[#dedee7] text-[#202127] rounded-[8px] font-bold text-[14px] hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={handleNext}
              className="px-8 h-[48px] bg-[#07006f] text-white rounded-[8px] font-bold text-[14px] hover:bg-[#0a0050] transition-colors"
            >
              {currentQuestionIdx === totalQuestions - 1 ? "Submit Quiz" : "Next"}
            </button>
          </div>
        </div>

      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[480px] rounded-[24px] p-8 text-center shadow-xl">
            <div className="w-[80px] h-[80px] bg-[#eef2ff] text-[#07006f] rounded-full flex items-center justify-center text-[40px] mx-auto mb-6">
              <FiCheckCircle />
            </div>
            <h3 className="text-[24px] font-bold text-[#202127] mb-2">Submit Quiz?</h3>
            <p className="text-[14px] text-[#717480] mb-8 leading-relaxed">
              Are you sure you want to submit your quiz? You have answered {Object.keys(selectedAnswers).length} out of {totalQuestions} questions. You will not be able to change your answers after submitting.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 h-[52px] bg-white border border-[#dedee7] text-[#202127] rounded-[8px] font-bold text-[15px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleFinalSubmit}
                className="flex-1 h-[52px] bg-[#07006f] text-white rounded-[8px] font-bold text-[15px] hover:bg-[#0a0050] transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
