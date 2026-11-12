import React from "react";
import { FiEdit2, FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";
import { TCategory } from "@services/categories";
import CategoryIcon from "./CategoryIcon";

interface CategoryCardProps {
  category: TCategory;
  onViewSubCategories: (category: TCategory) => void;
  onEdit: (category: TCategory) => void;
  onDelete: (category: TCategory) => void;
  onToggleActive?: (category: TCategory) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onViewSubCategories, onEdit, onDelete, onToggleActive }) => {
  return (
    <div className={`bg-white border border-[#e2e8f0] rounded-[12px] flex flex-col overflow-hidden ${category.isActive === false ? "opacity-70" : ""}`}>
      {/* Top Section */}
      <div className="p-5 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <CategoryIcon category={category} />
          <div>
            <h3 className="text-[16px] font-bold text-[#181C7B]">{category.name}</h3>
            <p className="text-[13px] text-[#3b82f6] font-medium mt-1">
              {category.subCategories.length} Sub-categories
            </p>
            {category.isActive === false && (
              <span className="mt-2 inline-flex rounded-full bg-[#fff3e0] px-2.5 py-0.5 text-[11px] font-semibold text-[#b45309]">Hidden from the public site</span>
            )}
            {!!category.pathways?.length && (
              <p className="mt-2 text-[12px] leading-[1.5] text-[#717480]">Pathways: {category.pathways.join(", ")}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 text-[#A0AEC0]">
          {onToggleActive && (
            <button
              onClick={() => onToggleActive(category)}
              title={category.isActive === false ? "Show on the public site" : "Hide from the public site"}
              aria-label={category.isActive === false ? "Show category" : "Hide category"}
              className="hover:text-[#3b82f6] transition-colors"
            >
              {category.isActive === false ? <FiEyeOff className="text-[16px]" /> : <FiEye className="text-[16px]" />}
            </button>
          )}
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
