import React from "react";
import { MdOutlineCategory } from "react-icons/md";
import CategoryImage from "@components/CategoryImage";
import { TCategory, getCategoryImage } from "@services/categories";

// Shows the category's uploaded image, or the default icon when it has none or it fails to load
const CategoryIcon: React.FC<{ category: Pick<TCategory, "imageUrl" | "icon"> }> = ({ category }) => (
  <div className="w-10 h-10 rounded-[8px] bg-[#f0f4ff] flex items-center justify-center text-[#3b82f6] overflow-hidden shrink-0">
    <CategoryImage
      src={getCategoryImage(category)}
      className="w-full h-full object-cover"
      fallback={<MdOutlineCategory className="text-[20px]" />}
    />
  </div>
);

export default CategoryIcon;
