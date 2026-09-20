import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaRegEdit, FaRegTrashAlt, FaBars } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import CurriculumModals from "./CurriculumModals";

interface ActiveModal {
  type: "Video" | "Attach File" | "Captions" | "Description" | "Lecture Notes" | "Quiz";
  modId: string;
  lecId: string;
}

export default function CurriculumBuilder({ data, updateData, onNext, onPrev, isLoading, errors = {} }: any) {
  // Use ONLY real data — no fake placeholder fallback
  const modules: any[] = data.modules || [];

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleName, setEditingModuleName] = useState("");
  const [editingLecture, setEditingLecture] = useState<{ modId: string; lecId: string } | null>(null);
  const [editingLectureName, setEditingLectureName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Module handlers ──────────────────────────────────────────────────────
  const handleAddSection = () => {
    const newModule = {
      id: `mod-${Date.now()}`,
      name: "New Section",
      lectures: [],
    };
    updateData({ modules: [...modules, newModule] });
  };

  const handleDeleteModule = (modId: string) => {
    if (!window.confirm("Delete this section and all its lectures?")) return;
    updateData({ modules: modules.filter((m: any) => m.id !== modId) });
  };

  const handleStartEditModule = (mod: any) => {
    setEditingModuleId(mod.id);
    setEditingModuleName(mod.name);
  };

  const handleSaveModuleName = (modId: string) => {
    const updated = modules.map((m: any) =>
      m.id === modId ? { ...m, name: editingModuleName } : m
    );
    updateData({ modules: updated });
    setEditingModuleId(null);
    setEditingModuleName("");
  };

  // ─── Lecture handlers ─────────────────────────────────────────────────────
  const handleAddLecture = (modId: string) => {
    const newLecture = {
      id: `lec-${Date.now()}`,
      name: "New Lecture",
      content: {},
    };
    const updated = modules.map((m: any) =>
      m.id === modId ? { ...m, lectures: [...m.lectures, newLecture] } : m
    );
    updateData({ modules: updated });
  };

  const handleDeleteLecture = (modId: string, lecId: string) => {
    if (!window.confirm("Delete this lecture?")) return;
    const updated = modules.map((m: any) =>
      m.id === modId
        ? { ...m, lectures: m.lectures.filter((l: any) => l.id !== lecId) }
        : m
    );
    updateData({ modules: updated });
  };

  const handleStartEditLecture = (modId: string, lec: any) => {
    setEditingLecture({ modId, lecId: lec.id });
    setEditingLectureName(lec.name);
  };

  const handleSaveLectureName = () => {
    if (!editingLecture) return;
    const updated = modules.map((m: any) =>
      m.id === editingLecture.modId
        ? {
            ...m,
            lectures: m.lectures.map((l: any) =>
              l.id === editingLecture.lecId ? { ...l, name: editingLectureName } : l
            ),
          }
        : m
    );
    updateData({ modules: updated });
    setEditingLecture(null);
    setEditingLectureName("");
  };

  // ─── Modal handlers (Option A — callback pattern) ─────────────────────────
  const openModal = (type: ActiveModal["type"], modId: string, lecId: string) => {
    setActiveModal({ type, modId, lecId });
    setActiveDropdown(null);
  };

  // Called by CurriculumModals when Save is clicked — writes back into formData
  const handleModalSave = (contentData: Record<string, any>) => {
    if (!activeModal) return;
    const { modId, lecId, type } = activeModal;
    const contentKey = type.toLowerCase().replace(/ /g, "_"); // e.g. "lecture_notes"
    const updated = modules.map((m: any) =>
      m.id === modId
        ? {
            ...m,
            lectures: m.lectures.map((l: any) =>
              l.id === lecId
                ? { ...l, content: { ...(l.content || {}), [contentKey]: contentData } }
                : l
            ),
          }
        : m
    );
    updateData({ modules: updated });
    setActiveModal(null);
  };

  // ─── Drag and Drop ────────────────────────────────────────────────────────
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newModules = Array.from(modules);

    if (type === "MODULE") {
      const [movedModule] = newModules.splice(source.index, 1);
      newModules.splice(destination.index, 0, movedModule);
      updateData({ modules: newModules });
      return;
    }

    if (type === "LECTURE") {
      const sourceModuleIdx = newModules.findIndex((m: any) => m.id.toString() === source.droppableId);
      const destModuleIdx = newModules.findIndex((m: any) => m.id.toString() === destination.droppableId);
      if (sourceModuleIdx === -1 || destModuleIdx === -1) return;

      const sourceLectures = Array.from((newModules[sourceModuleIdx] as any).lectures);
      const destLectures =
        sourceModuleIdx === destModuleIdx
          ? sourceLectures
          : Array.from((newModules[destModuleIdx] as any).lectures);

      const [movedLecture] = sourceLectures.splice(source.index, 1);
      destLectures.splice(destination.index, 0, movedLecture);

      (newModules[sourceModuleIdx] as any).lectures = sourceLectures;
      if (sourceModuleIdx !== destModuleIdx) {
        (newModules[destModuleIdx] as any).lectures = destLectures;
      }

      updateData({ modules: newModules });
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <h2 className="text-[20px] font-bold mb-6 text-[#202127]">Course Curriculum</h2>
      {errors.modules && <p className="text-red-500 text-[13px] font-bold mb-4">{errors.modules}</p>}

      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 shadow-sm mb-6">
        {modules.length === 0 ? (
          // ── Empty State ────────────────────────────────────────────────────
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f0f4f8] flex items-center justify-center mb-4">
              <FaPlus className="text-[#cbd5e1] text-[24px]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#202127] mb-2">No sections yet</h3>
            <p className="text-[13px] text-[#717480] max-w-[300px]">
              Click "Add Section" below to create your first curriculum section.
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="board" type="MODULE">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {modules.map((mod: any, mIdx: number) => (
                    <Draggable key={mod.id.toString()} draggableId={mod.id.toString()} index={mIdx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`mb-8 last:mb-0 bg-white rounded-[12px] transition-shadow ${
                            snapshot.isDragging ? "shadow-xl ring-2 ring-[#3e92cc]" : ""
                          }`}
                        >
                          {/* Module Header */}
                          <div className="flex items-center justify-between mb-4 bg-[#fcfcfd] p-4 rounded-[8px] border border-[#e2e8f0]">
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                {...provided.dragHandleProps}
                                className="p-2 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded"
                              >
                                <FaBars className="text-[#cbd5e1]" />
                              </div>

                              {editingModuleId === mod.id ? (
                                <input
                                  autoFocus
                                  value={editingModuleName}
                                  onChange={(e) => setEditingModuleName(e.target.value)}
                                  onBlur={() => handleSaveModuleName(mod.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveModuleName(mod.id);
                                    if (e.key === "Escape") setEditingModuleId(null);
                                  }}
                                  className="flex-1 border border-[#3e92cc] rounded-[6px] px-3 py-1 text-[14px] font-bold text-[#202127] outline-none"
                                />
                              ) : (
                                <h3 className="text-[14px] font-bold text-[#202127]">
                                  Module {String(mIdx + 1).padStart(2, "0")}:{" "}
                                  <span className="font-normal text-[#717480] ml-2">{mod.name}</span>
                                </h3>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-[#cbd5e1]">
                              <button
                                title="Add lecture"
                                onClick={() => handleAddLecture(mod.id)}
                                className="hover:text-[#07004d] transition-colors"
                              >
                                <FaPlus />
                              </button>
                              <button
                                title="Edit section name"
                                onClick={() => handleStartEditModule(mod)}
                                className="hover:text-[#07004d] transition-colors"
                              >
                                <FaRegEdit />
                              </button>
                              <button
                                title="Delete section"
                                onClick={() => handleDeleteModule(mod.id)}
                                className="hover:text-[#e11d48] transition-colors"
                              >
                                <FaRegTrashAlt />
                              </button>
                            </div>
                          </div>

                          {/* Lectures List */}
                          <Droppable droppableId={mod.id.toString()} type="LECTURE">
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-3 pl-8 min-h-[50px]"
                              >
                                {mod.lectures.length === 0 && (
                                  <p className="text-[12px] text-[#cbd5e1] italic py-2">
                                    No lectures yet — click <FaPlus className="inline" /> above to add one.
                                  </p>
                                )}
                                {mod.lectures.map((lec: any, lIdx: number) => (
                                  <Draggable
                                    key={lec.id.toString()}
                                    draggableId={lec.id.toString()}
                                    index={lIdx}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`flex items-center justify-between bg-white p-4 rounded-[8px] border border-[#e2e8f0] ${
                                          snapshot.isDragging ? "shadow-lg ring-1 ring-[#3e92cc]" : ""
                                        }`}
                                      >
                                        <div className="flex items-center gap-3 flex-1">
                                          <div
                                            {...provided.dragHandleProps}
                                            className="p-2 cursor-grab active:cursor-grabbing hover:bg-gray-50 rounded"
                                          >
                                            <FaBars className="text-[#cbd5e1]" />
                                          </div>
                                          <div className="flex flex-col flex-1">
                                            {editingLecture?.lecId === lec.id && editingLecture?.modId === mod.id ? (
                                              <input
                                                autoFocus
                                                value={editingLectureName}
                                                onChange={(e) => setEditingLectureName(e.target.value)}
                                                onBlur={handleSaveLectureName}
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter") handleSaveLectureName();
                                                  if (e.key === "Escape") setEditingLecture(null);
                                                }}
                                                className="border border-[#3e92cc] rounded-[6px] px-3 py-1 text-[13px] outline-none max-w-[200px]"
                                              />
                                            ) : (
                                              <span className="text-[14px] font-semibold text-[#202127]">{lec.name}</span>
                                            )}

                                            {/* Show description/notes snippet */}
                                            {(() => {
                                              const desc = lec.content?.description?.description || lec.content?.description || "";
                                              const notes = lec.content?.lecture_notes?.lectureNotes || lec.content?.lectureNotes || "";
                                              const cleanText = (desc || notes).replace(/<[^>]*>/g, ""); // strip HTML tags
                                              if (cleanText) {
                                                return (
                                                  <p className="text-[11px] text-[#94a3b8] italic mt-0.5 max-w-[250px] sm:max-w-[400px] truncate">
                                                    {cleanText}
                                                  </p>
                                                );
                                              }
                                              return null;
                                            })()}

                                            {/* Content badges */}
                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                              {(lec.content?.video?.videoUrl || lec.content?.videoUrl) && (
                                                <span className="text-[9px] bg-[#e0f2fe] text-[#0284c7] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                  🎥 Video
                                                </span>
                                              )}
                                              {(lec.content?.attach_file?.fileUrl || lec.content?.fileUrl) && (
                                                <span className="text-[9px] bg-[#fef3c7] text-[#d97706] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                  📁 Attachment
                                                </span>
                                              )}
                                              {(lec.content?.captions?.captionUrl || lec.content?.captionUrl) && (
                                                <span className="text-[9px] bg-[#f3e8ff] text-[#7e22ce] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                  💬 Captions
                                                </span>
                                              )}
                                              {(lec.content?.lecture_notes?.lectureNotes || lec.content?.lectureNotes) && (
                                                <span className="text-[9px] bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                  📝 Notes
                                                </span>
                                              )}
                                              {(lec.content?.quiz || lec.content?.questions) && (
                                                <span className="text-[9px] bg-[#dcfce7] text-[#16a34a] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                  🧠 Quiz
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                          {/* Contents dropdown */}
                                          <div className="relative" ref={dropdownRef}>
                                            <button
                                              onClick={() =>
                                                setActiveDropdown(
                                                  activeDropdown === `m${mod.id}-l${lec.id}`
                                                    ? null
                                                    : `m${mod.id}-l${lec.id}`
                                                )
                                              }
                                              className="flex items-center gap-2 bg-[#3e92cc] text-white px-4 py-2 rounded-[6px] text-[12px] font-bold hover:bg-[#2b7bb5] transition-colors"
                                            >
                                              Contents <IoIosArrowDown />
                                            </button>

                                            {activeDropdown === `m${mod.id}-l${lec.id}` && (
                                              <div className="absolute right-0 top-full mt-2 w-[180px] bg-white border border-[#e2e8f0] rounded-[8px] shadow-lg z-10 py-2">
                                                {(
                                                  [
                                                    "Video",
                                                    "Attach File",
                                                    "Captions",
                                                    "Description",
                                                    "Lecture Notes",
                                                    "Quiz",
                                                  ] as const
                                                ).map((type) => (
                                                  <button
                                                    key={type}
                                                    onClick={() => openModal(type, mod.id, lec.id)}
                                                    className="w-full text-left px-4 py-2 text-[13px] text-[#717480] hover:bg-[#f6f8fa] hover:text-[#3e92cc]"
                                                  >
                                                    {type}
                                                  </button>
                                                ))}
                                              </div>
                                            )}
                                          </div>

                                          <button
                                            title="Rename lecture"
                                            onClick={() => handleStartEditLecture(mod.id, lec)}
                                            className="text-[#cbd5e1] hover:text-[#07004d] transition-colors"
                                          >
                                            <FaRegEdit />
                                          </button>
                                          <button
                                            title="Delete lecture"
                                            onClick={() => handleDeleteLecture(mod.id, lec.id)}
                                            className="text-[#cbd5e1] hover:text-[#e11d48] transition-colors"
                                          >
                                            <FaRegTrashAlt />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Add Section CTA — now wired */}
      <button
        onClick={handleAddSection}
        className="w-full py-4 bg-[#07004d] text-white rounded-[8px] font-bold text-[14px] hover:bg-[#0a006e] transition-colors"
      >
        + Add Section
      </button>

      <div className="mt-12 flex items-center justify-between">
        <button
          onClick={onPrev}
          className="px-8 py-3 rounded-[8px] border border-[#e2e8f0] text-[14px] font-bold text-[#202127] hover:bg-[#f6f8fa] transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={isLoading}
          className="px-8 py-3 rounded-[8px] bg-[#07004d] text-[14px] font-bold text-white hover:bg-[#0a006e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save & Next"}
        </button>
      </div>

      {/* Pass onSave callback — Option A pattern */}
      {activeModal && (
        <CurriculumModals
          activeModal={activeModal.type}
          onClose={() => setActiveModal(null)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
