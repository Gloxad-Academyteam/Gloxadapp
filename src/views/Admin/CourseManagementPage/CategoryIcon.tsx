import React from "react";
import { MdOutlineCategory } from "react-icons/md";
import { isImageIcon } from "@services/categories";

// Shows the category's uploaded image, or the default icon when it only has an icon name
const CategoryIcon: React.FC<{ icon?: string }> = ({ icon }) => (
  <div className="w-10 h-10 rounded-[8px] bg-[#f0f4ff] flex items-center justify-center text-[#3b82f6] overflow-hidden shrink-0">
    {isImageIcon(icon) ? (
      <img src={icon} alt="" className="w-full h-full object-cover" />
    ) : (
      <MdOutlineCategory className="text-[20px]" />
    )}
  </div>
);

export default CategoryIcon;
