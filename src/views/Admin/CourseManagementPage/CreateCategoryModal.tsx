import React, { useState } from "react";
import { FiX } from "react-icons/fi";

interface CreateCategoryModalProps {
  onClose: () => void;
  onCreate: (name: string, subCategory: string) => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ onClose, onCreate }) => {
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onCreate(categoryName, subCategoryName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/50 backdrop-blur-sm">
      <div className="bg-white rounded-[16px] w-full max-w-[500px] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A0AEC0] hover:text-[#202127] transition-colors"
        >
          <FiX className="text-[24px]" />
        </button>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-[20px] font-bold text-[#181C7B] mb-2">Create Category</h2>
          <p className="text-[#717480] text-[14px] mb-8">
            Group courses by academic departments or professional skills.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-[11px] font-bold text-[#202127] uppercase tracking-wider mb-2">
                Category Name
              </label>
              <input 
                type="text"
                placeholder="e.g. Advanced Mathematics"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-4 py-3 text-[14px] outline-none focus:border-[#3b82f6] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#202127] uppercase tracking-wider mb-2">
                Sub Category
              </label>
              <input 
                type="text"
                placeholder="advanced-math"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-4 py-3 text-[14px] outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-[14px] py-3 rounded-[8px] transition-colors mt-2"
            >
              Generate Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
