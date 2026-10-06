import React, { useState } from "react";
import { FiX, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import { TCategory, TSubCategory } from "@services/categories";
import CategoryIcon from "./CategoryIcon";

interface SubCategoryModalProps {
  category: TCategory;
  isSaving: boolean;
  onClose: () => void;
  onEditCategory: (category: TCategory) => void;
  onDeleteCategory: (category: TCategory) => void;
  onSaveSubCategories: (subCategories: TSubCategory[]) => void;
}

const inputClassName =
  "w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-3 py-2 text-[14px] outline-none focus:border-[#3b82f6] transition-colors";

const splitTopics = (topics: string) =>
  topics
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const SubCategoryModal: React.FC<SubCategoryModalProps> = ({
  category,
  isSaving,
  onClose,
  onEditCategory,
  onDeleteCategory,
  onSaveSubCategories,
}) => {
  const subCategories = category.subCategories;
  // Index of the row being edited; subCategories.length means a new row
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftTopics, setDraftTopics] = useState("");

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setDraftName(subCategories[index]?.name ?? "");
    setDraftTopics(subCategories[index]?.topics.join(", ") ?? "");
  };

  const saveRow = () => {
    if (editingIndex === null || !draftName.trim()) return;
    const row = { name: draftName.trim(), topics: splitTopics(draftTopics) };
    const next =
      editingIndex === subCategories.length
        ? [...subCategories, row]
        : subCategories.map((sub, i) => (i === editingIndex ? { ...sub, ...row } : sub));
    onSaveSubCategories(next);
    setEditingIndex(null);
  };

  const deleteRow = (index: number) => {
    if (!window.confirm(`Remove "${subCategories[index].name}" from ${category.name}?`)) return;
    onSaveSubCategories(subCategories.filter((_, i) => i !== index));
  };

  const renderEditor = () => (
    <div className="flex flex-col gap-2 py-4">
      <input
        autoFocus
        type="text"
        placeholder="Sub-category name"
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        className={inputClassName}
      />
      <input
        type="text"
        placeholder="Topics, comma separated"
        value={draftTopics}
        onChange={(e) => setDraftTopics(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && saveRow()}
        className={inputClassName}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setEditingIndex(null)}
          className="px-3 py-1.5 text-[13px] font-medium text-[#717480] hover:text-[#202127]"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isSaving || !draftName.trim()}
          onClick={saveRow}
          className="flex items-center gap-1 px-3 py-1.5 rounded-[6px] bg-[#3b82f6] text-white text-[13px] font-bold disabled:opacity-60"
        >
          <FiCheck /> Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[16px] w-full max-w-[500px] shadow-2xl flex flex-col max-h-[80vh] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#f0f4f8] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CategoryIcon category={category} />
            <div>
              <h2 className="text-[18px] font-bold text-[#181C7B]">{category.name}</h2>
              <p className="text-[13px] text-[#3b82f6] font-medium">
                {subCategories.length} Sub-categories
              </p>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-[#A0AEC0] mr-2">
              <button onClick={() => onEditCategory(category)} className="hover:text-[#3b82f6] transition-colors">
                <FiEdit2 className="text-[16px]" />
              </button>
              <button onClick={() => onDeleteCategory(category)} className="hover:text-red-500 transition-colors">
                <FiTrash2 className="text-[16px]" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-[#A0AEC0] hover:text-[#202127] transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-[#f8fafc] border border-[#e2e8f0]"
            >
              <FiX className="text-[16px]" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          {subCategories.length === 0 && editingIndex === null && (
            <p className="text-[14px] text-[#A0AEC0] text-center py-4">No sub-categories yet.</p>
          )}
          {subCategories.map((sub, idx) => (
            <div
              key={sub._id ?? idx}
              className={idx !== subCategories.length - 1 ? "border-b border-[#f0f4f8]" : ""}
            >
              {editingIndex === idx ? (
                renderEditor()
              ) : (
                <div className="flex items-center justify-between py-4 gap-4">
                  <div className="min-w-0">
                    <span className="text-[14px] text-[#202127] font-medium">{sub.name}</span>
                    {sub.topics.length > 0 && (
                      <p className="text-[12px] text-[#A0AEC0] truncate">{sub.topics.join(", ")}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[#A0AEC0] shrink-0">
                    <button
                      disabled={isSaving}
                      onClick={() => startEditing(idx)}
                      className="hover:text-[#3b82f6] transition-colors"
                    >
                      <FiEdit2 className="text-[15px]" />
                    </button>
                    <button
                      disabled={isSaving}
                      onClick={() => deleteRow(idx)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 className="text-[15px]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {editingIndex === subCategories.length && renderEditor()}
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 bg-white">
          <button
            disabled={isSaving || editingIndex !== null}
            onClick={() => startEditing(subCategories.length)}
            className="w-full border-2 border-dashed border-[#cbd5e1] text-[#3b82f6] hover:bg-[#f8fafc] hover:border-[#3b82f6] font-bold text-[13px] uppercase tracking-wider py-3 rounded-[8px] transition-all disabled:opacity-60"
          >
            + Add Sub-category
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryModal;
