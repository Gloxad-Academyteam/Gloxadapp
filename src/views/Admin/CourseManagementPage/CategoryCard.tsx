import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";

interface SubCategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

interface CategoryCardProps {
  category: Category;
  onViewSubCategories: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onViewSubCategories, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[12px] flex flex-col overflow-hidden">
      {/* Top Section */}
      <div className="p-5 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-[8px] bg-[#f0f4ff] flex items-center justify-center text-[#3b82f6]">
            <MdOutlineCategory className="text-[20px]" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#181C7B]">{category.name}</h3>
            <p className="text-[13px] text-[#3b82f6] font-medium mt-1">
              {category.subCategories.length} Sub-categories
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3 text-[#A0AEC0]">
          <button onClick={() => onEdit(category)} className="hover:text-[#3b82f6] transition-colors">
            <FiEdit2 className="text-[16px]" />
          </button>
          <button onClick={() => onDelete(category)} className="hover:text-red-500 transition-colors">
            <FiTrash2 className="text-[16px]" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] w-full bg-[#f0f4f8]"></div>

      {/* Bottom Section */}
      <div className="p-4 bg-[#fafbfc] text-center">
        <p className="text-[13px] text-[#A0AEC0] mb-2">Category details collapsed</p>
        <button 
          onClick={() => onViewSubCategories(category)}
          className="text-[13px] font-bold text-[#717480] hover:text-[#3b82f6] underline underline-offset-2 transition-colors"
        >
          View Sub-categories
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
