import React, { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";
import axiosInstance from "../../../../utils/axiosInstance";

const LANGUAGES = [
  "English", "French", "Spanish", "German", "Chinese", "Hindi", "Italian", "Japanese"
];

const LEVELS = ["Beginners", "Intermediate", "Professional", "Advanced"];

const PRESET_DURATIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "14", "15", "16", "20", "24", "30"];
const COURSE_TYPES = ["regular", "free", "trimester"];

export default function BasicInformation({ data, updateData, onNext, isLoading, errors = {} }: any) {
  const [categories, setCategories] = useState<{name: string, slug: string}[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([
    "Web Development", "Mobile App Development", "Programming Languages", 
    "Game Development", "Database Design & Development", "Software Engineering", 
    "Software Testing & QA", "DevOps & Deployment"
  ]);

  useEffect(() => {
    axiosInstance.get("/categories")
      .then(res => setCategories(res.data || []))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  const categoryNames = categories.map(c => c.name);
  return (
    <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 shadow-sm">
      <h2 className="text-[20px] font-bold mb-6 text-[#202127]">Basic Information</h2>
      
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-[13px] font-semibold text-[#202127] mb-2">Title</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Your course title"
              value={data.title}
              onChange={(e) => updateData({ title: e.target.value })}
              maxLength={80}
              className={`w-full h-[48px] px-4 border ${errors.title ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-[8px] text-[14px] focus:outline-none focus:border-[#3e92cc] transition-colors`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#717480]">
              {data.title.length}/80
            </span>
          </div>
          {errors.title && <p className="text-red-500 text-[12px] mt-1">{errors.title}</p>}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-40">
          <div>
            <label className="block text-[13px] font-semibold text-[#202127] mb-2">Course Category</label>
            <CustomSelect
              value={data.category}
              onChange={(val) => updateData({ category: val })}
              options={categoryNames.length > 0 ? categoryNames : ["Loading..."]}
              hasSearch={true}
              searchPlaceholder="Course Category"
            />
            {errors.category && <p className="text-red-500 text-[12px] mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#202127] mb-2">Course Sub-category</label>
            <CustomSelect
              value={data.subCategory}
              onChange={(val) => updateData({ subCategory: val })}
              options={subCategories}
              hasSearch={true}
              searchPlaceholder="Course Sub-Category"
            />
            {errors.subCategory && <p className="text-red-500 text-[12px] mt-1">{errors.subCategory}</p>}
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-[13px] font-semibold text-[#202127] mb-2">Course Topic</label>
          <input
            type="text"
            placeholder="What is primarily taught in your course?"
            value={data.topic}
            onChange={(e) => updateData({ topic: e.target.value })}
            className={`w-full h-[48px] px-4 border ${errors.topic ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-[8px] text-[14px] focus:outline-none focus:border-[#3e92cc] transition-colors`}
          />
          {errors.topic && <p className="text-red-500 text-[12px] mt-1">{errors.topic}</p>}
        </div>

        {/* Pricing & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-35">
          <div>
            <label className="block text-[13px] font-semibold text-[#202127] mb-2">Course Type</label>
            <select
              value={data.courseType || "regular"}
              onChange={(e) => updateData({ courseType: e.target.value, price: e.target.value === "free" ? "" : data.price })}
              className="w-full h-[48px] px-4 border border-[#e2e8f0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3e92cc] transition-colors bg-white text-[#202127] capitalize"
            >
              {COURSE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#202127] mb-2">Price (NGN)</label>
            <input
              type="number"
              placeholder={data.courseType === "free" ? "Free course" : "Amount (e.g. 5000)"}
              value={data.courseType === "free" ? "" : data.price || ""}
              onChange={(e) => updateData({ price: e.target.value })}
              disabled={data.courseType === "free"}
              min="0"
              className={`w-full h-[48px] px-4 border ${errors.price ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-[8px] text-[14px] focus:outline-none focus:border-[#3e92cc] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
            />
            {errors.price && <p className="text-red-500 text-[12px] mt-1">{errors.price}</p>}
          </div>
        </div>

        {/* Language, Subtitle, Level, Duration */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-30 focus-within:z-50">
          <div>
            <label className="block text-[13px] font-semibold text-[#202127] mb-2">Course Language</label>
            <CustomSelect
              value={data.language}
              onChange={(val) => updateData({ language: val })}
              options={LANGUAGES}
              hasSearch={true}
              searchPlaceholder="Course Language"
            />
            {errors.language && <p className="text-red-500 text-[12px] mt-1">{errors.language}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#202127] mb-2">Subtitle Language</label>
            <CustomSelect
              value={data.subtitleLanguage}
              onChange={(val) => updateData({ subtitleLanguage: val })}
              options={LANGUAGES}
              hasSearch={true}
              searchPlaceholder="Subtitle Language"
            />
            {errors.subtitleLanguage && <p className="text-red-500 text-[12px] mt-1">{errors.subtitleLanguage}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#202127] mb-2">Course Level</label>
            <CustomSelect
              value={data.level}
              onChange={(val) => updateData({ level: val })}
              options={LEVELS}
              hasSearch={false}
            />
            {errors.level && <p className="text-red-500 text-[12px] mt-1">{errors.level}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#202127] mb-2">Durations</label>
            <div className={`flex items-center h-[48px] border ${errors.durationValue ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-[8px] focus-within:border-[#3e92cc] transition-colors relative z-20 bg-white`}>
              <div className="flex-1 h-full border-r border-[#e2e8f0]">
                <CustomSelect
                  value={data.durationValue}
                  onChange={(val) => updateData({ durationValue: val })}
                  options={PRESET_DURATIONS}
                  hasSearch={false}
                  placeholder="Course durations"
                  className="h-full"
                  triggerClassName="border-none h-full !rounded-none"
                  maxHeightClass="max-h-[160px]"
                />
              </div>
              <select
                value={data.durationUnit}
                onChange={(e) => updateData({ durationUnit: e.target.value })}
                className="w-[85px] h-full px-2 text-[13px] focus:outline-none bg-transparent text-[#202127] font-medium rounded-r-[8px] cursor-pointer"
              >
                <option value="Day">Day</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
              </select>
            </div>
            {errors.durationValue && <p className="text-red-500 text-[12px] mt-1">{errors.durationValue}</p>}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-12 flex items-center justify-between">
        <button className="px-8 py-3 rounded-[8px] border border-[#e2e8f0] text-[14px] font-bold text-[#202127] hover:bg-[#f6f8fa] transition-colors">
          Cancel
        </button>
        <button 
          onClick={onNext}
          disabled={isLoading}
          className="px-8 py-3 rounded-[8px] bg-[#07004d] text-[14px] font-bold text-white hover:bg-[#0a006e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save & Next"}
        </button>
      </div>
    </div>
  );
}
