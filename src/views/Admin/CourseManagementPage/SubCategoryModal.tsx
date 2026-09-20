import React from "react";
import { FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";
import { Category } from "./CategoryCard";

interface SubCategoryModalProps {
  category: Category;
  onClose: () => void;
}

const SubCategoryModal: React.FC<SubCategoryModalProps> = ({ category, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/50 backdrop-blur-sm">
      <div className="bg-white rounded-[16px] w-full max-w-[500px] shadow-2xl flex flex-col max-h-[80vh] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#f0f4f8] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[8px] bg-[#f0f4ff] flex items-center justify-center text-[#3b82f6]">
              <MdOutlineCategory className="text-[20px]" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#181C7B]">{category.name}</h2>
              <p className="text-[13px] text-[#3b82f6] font-medium">
                {category.subCategories.length} Sub-categories
              </p>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-[#A0AEC0] mr-2">
              <button className="hover:text-[#3b82f6] transition-colors">
                <FiEdit2 className="text-[16px]" />
              </button>
              <button className="hover:text-red-500 transition-colors">
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
          {category.subCategories.map((sub, idx) => (
            <div 
              key={sub.id} 
              className={`flex items-center justify-between py-4 ${idx !== category.subCategories.length - 1 ? 'border-b border-[#f0f4f8]' : ''}`}
            >
              <span className="text-[14px] text-[#202127] font-medium">{sub.name}</span>
              <div className="flex items-center gap-3 text-[#A0AEC0]">
                <button className="hover:text-[#3b82f6] transition-colors">
                  <FiEdit2 className="text-[15px]" />
                </button>
                <button className="hover:text-red-500 transition-colors">
                  <FiTrash2 className="text-[15px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 bg-white">
          <button className="w-full border-2 border-dashed border-[#cbd5e1] text-[#3b82f6] hover:bg-[#f8fafc] hover:border-[#3b82f6] font-bold text-[13px] uppercase tracking-wider py-3 rounded-[8px] transition-all">
            + Add Sub-category
          </button>
        </div>

      </div>
    </div>
  );
};

export default SubCategoryModal;
