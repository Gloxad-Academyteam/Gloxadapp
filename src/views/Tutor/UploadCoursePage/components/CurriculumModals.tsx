import React, { useState } from "react";
import { FaTimes, FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useS3Upload } from "@hooks/useS3Upload";

interface ModalWrapperProps {
  title: string;
  children: React.ReactNode;
  onSaveClick: () => void;
  onClose: () => void;
}

// Standalone ModalWrapper component defined outside CurriculumModals
// to prevent unmounting and losing focus on state updates (e.g. typing)
const ModalWrapper = ({ title, children, onSaveClick, onClose }: ModalWrapperProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-[16px] w-full max-w-[600px] overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
        <h3 className="text-[16px] font-bold text-[#202127]">{title}</h3>
        <button onClick={onClose} className="text-[#cbd5e1] hover:text-[#e11d48] transition-colors">
          <FaTimes className="text-[18px]" />
        </button>
      </div>
      <div className="p-6">{children}</div>
      <div className="bg-[#fcfcfd] border-t border-[#e2e8f0] px-6 py-4 flex items-center justify-end gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-[8px] border border-[#e2e8f0] text-[14px] font-bold text-[#202127] hover:bg-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSaveClick}
          className="px-6 py-2 rounded-[8px] bg-[#07004d] text-[14px] font-bold text-white hover:bg-[#0a006e] transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

interface ModalsProps {
  activeModal: string | null;
  onClose: () => void;
  // Option A: callback that receives the saved content data and writes it back to the parent's state
  onSave: (contentData: Record<string, any>) => void;
}

export default function CurriculumModals({ activeModal, onClose, onSave }: ModalsProps) {
  const [richTextContent, setRichTextContent] = useState("");
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [captionFileName, setCaptionFileName] = useState<string | null>(null);
  const [captionUrl, setCaptionUrl] = useState<string | null>(null);

  // Quiz state — lifted here so it persists through re-renders while the modal is open
  const [quizQuestions, setQuizQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [quizTimer, setQuizTimer] = useState(15);

  const { uploadFile, isUploading, uploadProgress } = useS3Upload();

  if (!activeModal) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, folder);
      setUploadedUrl(url);
      if (folder === "videos") setIsVideoUploaded(true);
    } catch {
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleCaptionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, "captions");
      setCaptionUrl(url);
      setCaptionFileName(file.name);
    } catch {
      alert("Failed to upload caption file. Please try again.");
    }
  };

  // ── 1. Video Modal ──────────────────────────────────────────────────────────
  if (activeModal === "Video") {
    return (
      <ModalWrapper
        title="Upload Video"
        onClose={onClose}
        onSaveClick={() => {
          if (!uploadedUrl) { alert("Please upload a video first."); return; }
          onSave({ videoUrl: uploadedUrl });
        }}
      >
        {!isVideoUploaded ? (
          <label
            className={`border-2 border-dashed border-[#cbd5e1] rounded-[12px] bg-[#fcfcfd] flex flex-col items-center justify-center py-12 text-center transition-colors hover:border-[#3e92cc] hover:bg-[#f0f7fb] cursor-pointer ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="w-[60px] h-[60px] rounded-full bg-[#f0f4f8] flex items-center justify-center text-[#3e92cc] mb-4">
              <FaCloudUploadAlt className="text-[30px]" />
            </div>
            <h4 className="text-[16px] font-bold text-[#202127] mb-2">
              {isUploading ? `Uploading... ${uploadProgress}%` : "Upload Video"}
            </h4>
            <p className="text-[13px] text-[#717480] max-w-[300px]">
              Drag and drop a file or <span className="text-[#3e92cc] font-semibold">browse</span> to upload
            </p>
            <p className="text-[11px] text-[#cbd5e1] mt-4">MP4, WebM or OGG (Max 2GB)</p>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, "videos")}
              disabled={isUploading}
            />
          </label>
        ) : (
          <div className="bg-[#1a1c23] rounded-[12px] overflow-hidden aspect-video relative flex items-center justify-center group">
            <video
              src={uploadedUrl!}
              controls
              className="absolute inset-0 w-full h-full object-contain bg-black"
            >
              Your browser does not support the video tag.
            </video>
            <button
              onClick={() => { setIsVideoUploaded(false); setUploadedUrl(null); }}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-[6px] text-[12px] font-medium backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
            >
              Replace
            </button>
          </div>
        )}
      </ModalWrapper>
    );
  }

  // ── 2. Attach File Modal ────────────────────────────────────────────────────
  if (activeModal === "Attach File") {
    return (
      <ModalWrapper
        title="Attach File"
        onClose={onClose}
        onSaveClick={() => {
          if (!uploadedUrl) { alert("Please upload a file first."); return; }
          onSave({ fileUrl: uploadedUrl });
        }}
      >
        {!uploadedUrl ? (
          <label
            className={`border-2 border-dashed border-[#cbd5e1] rounded-[12px] bg-[#fcfcfd] flex flex-col items-center justify-center py-10 text-center transition-colors hover:border-[#3e92cc] hover:bg-[#f0f7fb] cursor-pointer ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="w-[50px] h-[50px] rounded-full bg-[#f0f4f8] flex items-center justify-center text-[#3e92cc] mb-4">
              <FaFileAlt className="text-[24px]" />
            </div>
            <h4 className="text-[15px] font-bold text-[#202127] mb-2">
              {isUploading ? `Uploading... ${uploadProgress}%` : "Select File"}
            </h4>
            <p className="text-[13px] text-[#717480]">Browse your files to attach resources for this lecture</p>
            <p className="text-[11px] text-[#cbd5e1] mt-4">PDF, ZIP, DOCX, PPTX (Max 100MB)</p>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleFileUpload(e, "documents")}
              disabled={isUploading}
            />
          </label>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 bg-[#f0f4f8] rounded-[12px] border border-[#e2e8f0]">
            <FaFileAlt className="text-[40px] text-[#3e92cc] mb-4" />
            <p className="text-[#202127] font-bold">File Uploaded Successfully!</p>
            <button
              onClick={() => setUploadedUrl(null)}
              className="mt-4 text-[13px] text-[#e11d48] font-bold"
            >
              Remove File
            </button>
          </div>
        )}
      </ModalWrapper>
    );
  }

  // ── 3. Captions Modal ───────────────────────────────────────────────────────
  if (activeModal === "Captions") {
    return (
      <ModalWrapper
        title="Add Lecture Caption"
        onClose={onClose}
        onSaveClick={() => {
          if (!captionUrl) { alert("Please upload a caption file first."); return; }
          onSave({ captionUrl, captionFileName });
        }}
      >
        <p className="text-[13px] text-[#717480] mb-4">
          Upload a VTT or SRT file to add captions to this lecture video.
        </p>
        {/* Real file input */}
        <div className="border border-[#e2e8f0] rounded-[8px] flex items-center h-[48px] overflow-hidden focus-within:border-[#3e92cc] transition-colors">
          <label
            htmlFor="caption-upload"
            className="px-4 py-2 bg-[#fcfcfd] border-r border-[#e2e8f0] text-[13px] font-semibold text-[#717480] cursor-pointer hover:bg-[#f0f4f8] whitespace-nowrap"
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : "Choose File"}
          </label>
          <input
            id="caption-upload"
            type="file"
            accept=".srt,.vtt"
            className="hidden"
            onChange={handleCaptionUpload}
            disabled={isUploading}
          />
          <span className="flex-1 px-4 text-[13px] text-[#202127] bg-white outline-none truncate">
            {captionFileName || "No file chosen"}
          </span>
        </div>
        {captionUrl && (
          <p className="text-[12px] text-[#22c55e] font-bold mt-2">✓ Caption file uploaded successfully</p>
        )}
      </ModalWrapper>
    );
  }

  // ── 4. Description Modal ────────────────────────────────────────────────────
  if (activeModal === "Description") {
    return (
      <ModalWrapper
        title="Add Lecture Description"
        onClose={onClose}
        onSaveClick={() => {
          onSave({ description: richTextContent });
        }}
      >
        <p className="text-[13px] text-[#717480] mb-4">
          Provide a brief description of what students will learn in this lecture.
        </p>
        <div className="border border-[#e2e8f0] rounded-[8px] overflow-hidden">
          <ReactQuill
            theme="snow"
            value={richTextContent}
            onChange={setRichTextContent}
            placeholder="Enter lecture description..."
            className="h-[150px]"
          />
        </div>
      </ModalWrapper>
    );
  }

  // ── 5. Lecture Notes Modal ──────────────────────────────────────────────────
  if (activeModal === "Lecture Notes") {
    return (
      <ModalWrapper
        title="Add Lecture Notes"
        onClose={onClose}
        onSaveClick={() => {
          onSave({ lectureNotes: richTextContent });
        }}
      >
        <p className="text-[13px] text-[#717480] mb-4">
          Add comprehensive notes, links, or text-based resources for this lecture.
        </p>
        <div className="border border-[#e2e8f0] rounded-[8px] overflow-hidden">
          <ReactQuill
            theme="snow"
            value={richTextContent}
            onChange={setRichTextContent}
            placeholder="Type your lecture notes here..."
            className="h-[200px]"
          />
        </div>
      </ModalWrapper>
    );
  }

  // ── 6. Quiz Modal ───────────────────────────────────────────────────────────
  if (activeModal === "Quiz") {
    return (
      <ModalWrapper
        title="Create Quiz"
        onClose={onClose}
        onSaveClick={() => {
          const validQuestions = quizQuestions.filter((q) => q.question.trim() !== "");
          if (validQuestions.length === 0) { alert("Please add at least one question."); return; }
          onSave({ questions: validQuestions, timerMinutes: quizTimer });
        }}
      >
        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[13px] text-[#717480] mb-4">
            Build a multiple-choice quiz to test student knowledge.
          </p>
          <div className="mb-6 flex items-center justify-between bg-[#f8fafc] p-4 rounded-[8px] border border-[#e2e8f0]">
            <label className="text-[14px] font-bold text-[#202127]">Quiz Timer (minutes)</label>
            <input
              type="number"
              value={quizTimer}
              onChange={(e) => setQuizTimer(Number(e.target.value))}
              min={1}
              className="w-[80px] h-10 border border-[#cbd5e1] rounded-[6px] px-3 text-[14px] outline-none focus:border-[#3e92cc]"
            />
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, qIdx) => (
              <div key={qIdx} className="bg-white p-5 rounded-[12px] border border-[#e2e8f0] shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-[14px] text-[#07004d]">Question {qIdx + 1}</span>
                  {quizQuestions.length > 1 && (
                    <button
                      onClick={() => setQuizQuestions((prev) => prev.filter((_, i) => i !== qIdx))}
                      className="text-[#e11d48] text-[12px] font-bold hover:bg-[#ffe4e6] px-2 py-1 rounded-[4px] transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => {
                    const newQ = [...quizQuestions];
                    newQ[qIdx] = { ...newQ[qIdx], question: e.target.value };
                    setQuizQuestions(newQ);
                  }}
                  placeholder="Enter your question here..."
                  className="w-full h-11 border border-[#cbd5e1] rounded-[6px] px-4 text-[14px] outline-none focus:border-[#3e92cc] mb-4"
                />
                <div className="space-y-3">
                  <p className="text-[12px] font-bold text-[#717480] uppercase tracking-wider">
                    Options & Correct Answer
                  </p>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correctAnswer === optIdx}
                        onChange={() => {
                          const newQ = [...quizQuestions];
                          newQ[qIdx] = { ...newQ[qIdx], correctAnswer: optIdx };
                          setQuizQuestions(newQ);
                        }}
                        className="w-5 h-5 cursor-pointer accent-[#22c55e]"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newQ = [...quizQuestions];
                          const newOptions = [...newQ[qIdx].options];
                          newOptions[optIdx] = e.target.value;
                          newQ[qIdx] = { ...newQ[qIdx], options: newOptions };
                          setQuizQuestions(newQ);
                        }}
                        placeholder={`Option ${optIdx + 1}`}
                        className={`flex-1 h-10 border ${
                          q.correctAnswer === optIdx
                            ? "border-[#22c55e] bg-[#f0fdf4]"
                            : "border-[#e2e8f0]"
                        } rounded-[6px] px-3 text-[13px] outline-none focus:border-[#3e92cc] transition-colors`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              setQuizQuestions([...quizQuestions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }])
            }
            className="w-full mt-6 py-4 border-2 border-dashed border-[#cbd5e1] rounded-[12px] text-[14px] font-bold text-[#4e515c] hover:bg-[#f0f7fb] hover:border-[#3e92cc] hover:text-[#3e92cc] transition-colors"
          >
            + Add Another Question
          </button>
        </div>
      </ModalWrapper>
    );
  }

  return null;
}
