"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PiStack, PiClipboardText, PiPlayCircle, PiCheckCircle } from "react-icons/pi";
import { toast } from "react-toastify";
import BasicInformation from "./components/BasicInformation";
import AdvanceInformation from "./components/AdvanceInformation";
import CurriculumBuilder from "./components/CurriculumBuilder";
import PublishCourse from "./components/PublishCourse";
import { createDraftCourse, updateCourse, submitCourseForReview, getCourseDetails } from "@services/tutor/courses";
import useAuth from "@hooks/useAuth";

// Helper: Map backend modules database schema to frontend wizard structure
const mapBackendToFrontendModules = (backendModules: any[]) => {
  return (backendModules || []).map((m: any) => {
    // Reconstruct lectures array from lessons
    const lectures = (m.lessons || []).map((l: any) => {
      const content: Record<string, any> = {};
      
      if (l.videoUrl) {
        content.video = { videoUrl: l.videoUrl };
        content.videoUrl = l.videoUrl;
      }
      
      if (l.resources && l.resources.length > 0) {
        content.attach_file = { fileUrl: l.resources[0].fileUrl };
        content.fileUrl = l.resources[0].fileUrl;
      }
      
      if (l.description) {
        content.description = { description: l.description };
      }
      
      if (l.lectureNotes) {
        content.lecture_notes = { lectureNotes: l.lectureNotes };
      }
      
      return {
        id: l._id || `lec-${Math.random()}`,
        name: l.title || "Lecture",
        content: content,
      };
    });

    // If the module has a quiz, append it as a dummy lecture row
    if (m.quiz && m.quiz.questions && m.quiz.questions.length > 0) {
      lectures.push({
        id: m.quiz._id || `quiz-${Math.random()}`,
        name: m.quiz.title || "Module Quiz",
        content: {
          quiz: {
            timerMinutes: m.quiz.timeLimitMinutes || 15,
            questions: (m.quiz.questions || []).map((q: any) => ({
              question: q.questionText,
              options: q.options,
              correctAnswer: q.correctOptionIndex,
            }))
          }
        }
      });
    }

    return {
      id: m._id || `mod-${Math.random()}`,
      name: m.title || "Section",
      lectures: lectures,
    };
  });
};

// Helper: Map frontend wizard modules structure to backend database schema
const mapFrontendToBackendModules = (frontendModules: any[]) => {
  return (frontendModules || []).map((m: any) => {
    // 1. Separate regular lectures from quiz elements
    const lessons = (m.lectures || [])
      .filter((l: any) => !l.content?.quiz)
      .map((l: any) => {
        const content = l.content || {};
        const videoUrl = content.video?.videoUrl || content.videoUrl || "";
        
        const resources = [];
        if (content.attach_file?.fileUrl) {
          resources.push({
            title: "Attached Resource",
            fileUrl: content.attach_file.fileUrl
          });
        }
        
        return {
          title: l.name || "Lecture",
          duration: l.duration || "10 mins",
          videoUrl: videoUrl,
          resources: resources,
          description: content.description?.description || content.description || "",
          lectureNotes: content.lecture_notes?.lectureNotes || content.lectureNotes || "",
        };
      });

    // 2. Map quiz if exists in the lectures
    const quizLecture = (m.lectures || []).find((l: any) => l.content?.quiz);
    let quiz = null;
    if (quizLecture) {
      const qData = quizLecture.content.quiz;
      quiz = {
        title: quizLecture.name || "Module Quiz",
        description: "Section check Quiz",
        timeLimitMinutes: qData.timerMinutes || 15,
        questions: (qData.questions || []).map((q: any) => ({
          questionText: q.question,
          options: q.options,
          correctOptionIndex: q.correctAnswer,
        }))
      };
    }

    return {
      title: m.name || "Section",
      description: m.description || "",
      lessons: lessons,
      quiz: quiz,
    };
  });
};

const STEPS = [
  { id: 1, label: "Basic Information", icon: PiStack },
  { id: 2, label: "Advanced Information", icon: PiClipboardText },
  { id: 3, label: "Curriculum", icon: PiPlayCircle },
  { id: 4, label: "Publish Course", icon: PiCheckCircle },
];

export default function UploadCoursePage() {
  const { id: editCourseId } = useParams<{ id?: string }>()!;
  const router = useRouter();
  const { authenticatedUser } = useAuth();
  const isEditMode = !!editCourseId;

  const [currentStep, setCurrentStep] = useState(1);
  const [highestStepReached, setHighestStepReached] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(isEditMode);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    courseId: "",
    // Basic Info
    title: "",
    category: "",
    subCategory: "",
    topic: "",
    language: "",
    subtitleLanguage: "",
    level: "",
    durationValue: "",
    durationUnit: "Day",
    price: "",
    courseType: "regular",
    // Advance Info
    thumbnail: null,
    trailer: null,
    description: "",
    whatYouWillTeach: [""],
    targetAudience: [""],
    skills: [] as string[],
    // Curriculum
    modules: [] as any[],
    // Publish
    welcomeMessage: "",
    congratsMessage: "",
    instructors: [],
  });

  const updateFormData = (newData: any) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // ─── Edit Mode: pre-fill form from existing course ───────────────────────
  useEffect(() => {
    if (!isEditMode || !editCourseId) return;
    const prefill = async () => {
      try {
        setIsLoadingCourse(true);
        const { data } = await getCourseDetails(editCourseId);
        const c = data?.course || data;
        if (!c) return;
        setFormData({
          courseId: c._id,
          title: c.title || "",
          category: c.category?.name || c.category || "",
          subCategory: c.subCategory || "",
          topic: c.topic || "",
          language: c.language || "",
          subtitleLanguage: c.subtitleLanguage || "",
          level: c.level || "",
          durationValue: c.durationValue || "",
          durationUnit: c.durationUnit || "Day",
          price: c.price?.toString() || "",
          courseType: c.courseType || "regular",
          thumbnail: c.thumbnailUrl || null,
          trailer: c.trailerUrl || null,
          description: c.description || "",
          whatYouWillTeach: c.whatYouWillTeach?.length ? c.whatYouWillTeach : [""],
          targetAudience: c.targetAudience?.length ? c.targetAudience : [""],
          skills: c.skills || [],
          modules: mapBackendToFrontendModules(c.modules || []),
          welcomeMessage: c.welcomeMessage || "",
          congratsMessage: c.congratsMessage || "",
          instructors: c.instructors || [],
        });
        // Allow jumping to any step in edit mode
        setHighestStepReached(4);
      } catch (err) {
        toast.error("Failed to load course data. Please try again.");
        router.push("/dashboard/courses");
      } finally {
        setIsLoadingCourse(false);
      }
    };
    prefill();
  }, [editCourseId]);

  // ─── Dynamic step progress badge ─────────────────────────────────────────
  const stepFields: Record<number, string[]> = {
    1: ["title", "category", "subCategory", "topic", "language", "level", "durationValue", "price"],
    2: ["description", "thumbnail", "trailer", "skills"],
    3: [], // modules checked separately
    4: ["welcomeMessage", "congratsMessage"],
  };

  const getStepProgress = (stepId: number) => {
    if (stepId === 3) {
      return { filled: (formData.modules as any[]).length, total: 1 };
    }
    const fields = stepFields[stepId] || [];
    const filled = fields.filter((f) => {
      if (f === "skills") return (formData.skills as any[]).length > 0;
      return !!(formData as any)[f];
    }).length;
    return { filled, total: fields.length };
  };

  const nextStep = () => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, 4);
      setHighestStepReached((h) => Math.max(h, next));
      return next;
    });
  };
  
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleTabClick = (stepId: number) => {
    if (stepId > highestStepReached) {
      toast.warning("Please fill in the required inputs and click 'Save & Next' to proceed.");
      return;
    }
    setCurrentStep(stepId);
  };

  const handleBasicInfoNext = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Course title is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.subCategory) newErrors.subCategory = "Subcategory is required.";
    if (!formData.topic) newErrors.topic = "Topic is required.";
    if (!formData.language) newErrors.language = "Language is required.";
    if (!formData.level) newErrors.level = "Course Level is required.";
    if (!formData.durationValue) newErrors.durationValue = "Duration is required.";
    if (formData.courseType !== "free" && (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0)) {
      newErrors.price = "Valid price is required for paid courses.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    try {
      setIsSaving(true);
      const basicPayload = {
        title: formData.title,
        category: formData.category,
        subCategory: formData.subCategory,
        topic: formData.topic,
        language: formData.language,
        subtitleLanguage: formData.subtitleLanguage,
        level: formData.level,
        durationValue: formData.durationValue,
        durationUnit: formData.durationUnit,
        price: formData.courseType === "free" ? 0 : Number(formData.price),
        courseType: formData.courseType,
      };

      if (!formData.courseId) {
        // Create mode: create a new draft
        const res = await createDraftCourse(basicPayload);
        if (res.data?.course?._id) {
          updateFormData({ courseId: res.data.course._id });
        }
      } else {
        // Edit mode (or continuing after draft): just update
        await updateCourse(formData.courseId, basicPayload);
      }
      nextStep();
    } catch (error) {
      console.error("Failed to save draft", error);
      toast.error("Failed to save course draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdvanceInfoNext = async () => {
    if (!formData.courseId) {
      toast.error("Missing Course ID. Please go back to step 1.");
      return;
    }

    const newErrors: Record<string, string> = {};
    if (!formData.thumbnail) newErrors.thumbnail = "Thumbnail is required.";
    if (!formData.trailer) newErrors.trailer = "Trailer is required.";
    if (!formData.description || formData.description.trim() === "" || formData.description === "<p><br></p>") {
      newErrors.description = "Course description is required.";
    }

    const validTeach = formData.whatYouWillTeach.filter(v => v.trim() !== "");
    const validAudience = formData.targetAudience.filter(v => v.trim() !== "");
    if (validTeach.length === 0) newErrors.whatYouWillTeach = "At least one learning objective is required.";
    if (validAudience.length === 0) newErrors.targetAudience = "At least one target audience is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required advanced info fields.");
      return;
    }
    
    try {
      setIsSaving(true);
      await updateCourse(formData.courseId, {
        description: formData.description,
        whatYouWillTeach: validTeach,
        targetAudience: validAudience,
        thumbnailUrl: formData.thumbnail,
        trailerUrl: formData.trailer,
        skills: formData.skills,
      });
      nextStep();
    } catch (error) {
      console.error("Failed to save advance info", error);
      toast.error("Failed to save advance info.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCurriculumNext = async () => {
    if (!formData.courseId) {
      toast.error("Missing Course ID. Please go back to step 1.");
      return;
    }

    const newErrors: Record<string, string> = {};
    if (!formData.modules || formData.modules.length === 0) {
      newErrors.modules = "At least one curriculum module is required.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please add at least one module and lecture.");
      return;
    }
    
    try {
      setIsSaving(true);
      await updateCourse(formData.courseId, {
        modules: mapFrontendToBackendModules(formData.modules),
      });
      nextStep();
    } catch (error) {
      console.error("Failed to save curriculum", error);
      toast.error("Failed to save curriculum.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitCourse = async () => {
    if (!formData.courseId) {
      toast.error("Missing Course ID. Please go back to step 1.");
      return;
    }

    const newErrors: Record<string, string> = {};
    if (!formData.welcomeMessage || formData.welcomeMessage.trim() === "") {
      newErrors.welcomeMessage = "Welcome message is required.";
    }
    if (!formData.congratsMessage || formData.congratsMessage.trim() === "") {
      newErrors.congratsMessage = "Congratulations message is required.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required publish fields.");
      return;
    }
    
    try {
      setIsSaving(true);
      await updateCourse(formData.courseId, {
        welcomeMessage: formData.welcomeMessage,
        congratsMessage: formData.congratsMessage,
      });
      await submitCourseForReview(formData.courseId);
      toast.success("Course submitted for review successfully!");
      router.push("/dashboard/courses");
    } catch (error) {
      console.error("Failed to submit course", error);
      toast.error("Failed to submit course.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingCourse) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#fcfcfd] py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#07004d] border-t-transparent rounded-full animate-spin" />
          <p className="text-[14px] font-bold text-[#717480]">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (authenticatedUser?.role === "instructor" && authenticatedUser?.approvalStatus !== "approved") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#fcfcfd] py-24 px-4 text-center">
        <div className="w-16 h-16 bg-[#eaf2fd] rounded-full flex items-center justify-center mb-6">
          <PiClipboardText className="text-[#3e92cc] text-[32px]" />
        </div>
        <h2 className="text-[24px] font-bold text-[#202127] mb-2">Account Not Approved</h2>
        <p className="text-[14px] text-[#717480] max-w-[400px] mb-8">
          {authenticatedUser?.approvalStatus === "pending" 
            ? "Your account is currently pending approval. Please submit your credentials or wait for our team to review your submitted details before uploading courses."
            : "Your tutor account was rejected. Please contact support."}
        </p>
        {authenticatedUser?.approvalStatus === "pending" && (
          <button
            onClick={() => router.push("/dashboard/verification")}
            className="h-[48px] px-8 rounded-full bg-[#07004d] text-white text-[14px] font-bold transition hover:bg-[#181C7B]"
          >
            Go to Verification Page
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#fcfcfd]">
      {/* Top Wizard Stepper */}
      <div className="border-b border-[#e2e8f0] bg-white sticky top-0 z-10 hidden md:flex h-[60px]">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = highestStepReached > step.id;
          const { filled, total } = getStepProgress(step.id);

          return (
            <button
              key={step.id}
              onClick={() => handleTabClick(step.id)}
              className={`flex-1 flex items-center justify-center gap-3 transition-colors ${
                isActive ? "bg-[#4aa3df] text-white" : "text-[#717480] hover:bg-neutral-2"
              } border-r border-[#e2e8f0] last:border-0`}
            >
              <step.icon className={`text-[20px] ${isActive ? "text-white" : "text-[#717480]"}`} />
              <span className="font-semibold text-[14px]">{step.label}</span>
              {isCompleted && <PiCheckCircle className="text-[#4caf50] ml-2 text-[18px]" />}
              {isActive && total > 0 && (
                <span className={`ml-2 text-[11px] font-medium opacity-90 px-2 py-0.5 rounded-full ${
                  filled === total ? "bg-[#22c55e]/20 text-[#22c55e]" : "bg-white/20"
                }`}>
                  {filled}/{total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 md:p-8 xl:p-12 w-full max-w-[1200px] mx-auto text-[#202127]">
        {currentStep === 1 && (
          <BasicInformation data={formData} updateData={updateFormData} onNext={handleBasicInfoNext} isLoading={isSaving} errors={errors} />
        )}
        {currentStep === 2 && (
          <AdvanceInformation data={formData} updateData={updateFormData} onNext={handleAdvanceInfoNext} onPrev={prevStep} isLoading={isSaving} errors={errors} />
        )}
        {currentStep === 3 && (
          <CurriculumBuilder data={formData} updateData={updateFormData} onNext={handleCurriculumNext} onPrev={prevStep} isLoading={isSaving} errors={errors} />
        )}
        {currentStep === 4 && (
          <PublishCourse data={formData} updateData={updateFormData} onPrev={prevStep} onSubmit={handleSubmitCourse} isLoading={isSaving} errors={errors} />
        )}
      </div>
    </div>
  );
}
