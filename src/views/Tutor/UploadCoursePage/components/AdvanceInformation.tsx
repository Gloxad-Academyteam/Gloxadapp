import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaImage, FaPlayCircle, FaUpload, FaPlus } from "react-icons/fa";
import { useS3Upload } from "@hooks/useS3Upload";

export default function AdvanceInformation({ data, updateData, onNext, onPrev, isLoading, errors = {} }: any) {
  const thumbnailUpload = useS3Upload();
  const trailerUpload = useS3Upload();
  const [skillInput, setSkillInput] = useState("");

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = skillInput.trim().replace(/,$/, "");
      if (val && !(data.skills || []).includes(val)) {
        updateData({ skills: [...(data.skills || []), val] });
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    updateData({ skills: (data.skills || []).filter((s: string) => s !== skillToRemove) });
  };
  
  // Handlers for dynamic lists
  const handleAddWhatYouWillTeach = () => {
    updateData({ whatYouWillTeach: [...data.whatYouWillTeach, ""] });
  };

  const handleUpdateWhatYouWillTeach = (index: number, value: string) => {
    const newList = [...data.whatYouWillTeach];
    newList[index] = value;
    updateData({ whatYouWillTeach: newList });
  };

  const handleAddTargetAudience = () => {
    updateData({ targetAudience: [...data.targetAudience, ""] });
  };

  const handleUpdateTargetAudience = (index: number, value: string) => {
    const newList = [...data.targetAudience];
    newList[index] = value;
    updateData({ targetAudience: newList });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "thumbnail" | "trailer") => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (type === "thumbnail") {
        const url = await thumbnailUpload.uploadFile(file, "courses");
        updateData({ thumbnail: url });
      } else {
        const url = await trailerUpload.uploadFile(file, "courses");
        updateData({ trailer: url });
      }
    } catch (err) {
      alert(`Failed to upload ${type}`);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-[20px] font-bold mb-6 text-[#202127]">Advanced Information</h2>
      
      <div className="bg-white rounded-[20px] border border-[#e2e8f0] p-6 shadow-sm">
        
        {/* Media Uploads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Thumbnail */}
          <div>
            <h3 className="text-[14px] font-bold text-[#202127] mb-2">Course Thumbnail</h3>
            <div className="flex gap-4">
              <div className="w-[180px] h-[140px] bg-[#f0f4f8] border border-[#e2e8f0] rounded-[8px] flex items-center justify-center shrink-0 overflow-hidden">
                 {data.thumbnail ? (
                   <img src={data.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                 ) : (
                   <FaImage className="text-[40px] text-[#cbd5e1]" />
                 )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[12px] text-[#717480] leading-relaxed mb-3">
                  Upload your course Thumbnail here. <strong className="text-[#202127]">Important guidelines</strong>: 1200x800 pixels or 12:8 Ratio. Supported format: <strong className="text-[#202127]">.jpg, .jpeg, or .png</strong>
                </p>
                <label className={`flex items-center justify-center gap-2 bg-[#3e92cc] text-white px-4 py-2 rounded-[8px] text-[13px] font-bold w-max transition-colors cursor-pointer ${thumbnailUpload.isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2b7bb5]'}`}>
                  {thumbnailUpload.isUploading ? `Uploading (${thumbnailUpload.uploadProgress}%)...` : "Upload Image"} <FaUpload />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "thumbnail")} disabled={thumbnailUpload.isUploading || trailerUpload.isUploading} />
                </label>
                {errors.thumbnail && <p className="text-red-500 text-[12px] mt-2">{errors.thumbnail}</p>}
              </div>
            </div>
          </div>

          {/* Trailer */}
          <div>
            <h3 className="text-[14px] font-bold text-[#202127] mb-2">Course Trailer</h3>
            <div className="flex gap-4">
              <div className="w-[180px] h-[140px] bg-[#f0f4f8] border border-[#e2e8f0] rounded-[8px] flex items-center justify-center shrink-0 relative overflow-hidden">
                 {data.trailer ? (
                   <video src={data.trailer} className="w-full h-full object-cover" controls />
                 ) : (
                   <FaPlayCircle className="text-[40px] text-[#cbd5e1]" />
                 )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[12px] text-[#717480] leading-relaxed mb-3">
                  Students who watch a well-made promo video are 5X more likely to enroll in your course. We've seen that statistic go up to 10X for exceptionally awesome videos.
                </p>
                <label className={`flex items-center justify-center gap-2 bg-[#3e92cc] text-white px-4 py-2 rounded-[8px] text-[13px] font-bold w-max transition-colors cursor-pointer ${trailerUpload.isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2b7bb5]'}`}>
                  {trailerUpload.isUploading ? `Uploading (${trailerUpload.uploadProgress}%)...` : "Upload Video"} <FaUpload />
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, "trailer")} disabled={thumbnailUpload.isUploading || trailerUpload.isUploading} />
                </label>
                {errors.trailer && <p className="text-red-500 text-[12px] mt-2">{errors.trailer}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-[14px] font-bold text-[#202127] mb-2">Course Descriptions</h3>
          <div className={`border ${errors.description ? 'border-red-500' : 'border-[#e2e8f0]'} rounded-[8px] overflow-hidden`}>
            <ReactQuill 
              theme="snow" 
              value={data.description} 
              onChange={(val) => updateData({ description: val })}
              placeholder="Enter you course descriptions"
              className="h-[150px]"
            />
          </div>
          {errors.description && <p className="text-red-500 text-[12px] mt-2">{errors.description}</p>}
        </div>

        {/* What you will teach */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[14px] font-bold text-[#202127]">What you will teach in this course</h3>
            <button onClick={handleAddWhatYouWillTeach} className="text-[#07004d] text-[13px] font-bold flex items-center gap-2">
              <FaPlus className="text-[10px]" /> Add new
            </button>
          </div>
          <div className="space-y-3">
            {data.whatYouWillTeach.map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-[12px] text-[#717480] font-medium w-4">{String(idx + 1).padStart(2, '0')}</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateWhatYouWillTeach(idx, e.target.value)}
                    placeholder="What you will teach in this course..."
                    maxLength={120}
                    className="w-full h-[48px] px-4 border border-[#e2e8f0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3e92cc] transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#717480]">
                    {item.length}/120
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[14px] font-bold text-[#202127]">Target Audience</h3>
            <button onClick={handleAddTargetAudience} className="text-[#07004d] text-[13px] font-bold flex items-center gap-2">
              <FaPlus className="text-[10px]" /> Add new
            </button>
          </div>
          <div className="space-y-3">
            {data.targetAudience.map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-[12px] text-[#717480] font-medium w-4">{String(idx + 1).padStart(2, '0')}</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateTargetAudience(idx, e.target.value)}
                    placeholder="Who this course is for..."
                    maxLength={120}
                    className="w-full h-[48px] px-4 border border-[#e2e8f0] rounded-[8px] text-[14px] focus:outline-none focus:border-[#3e92cc] transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#717480]">
                    {item.length}/120
                  </span>
                </div>
              </div>
            ))}
          </div>
          {errors.targetAudience && <p className="text-red-500 text-[12px] mt-2">{errors.targetAudience}</p>}
        </div>

        {/* Skills you will gain (comma-separated tags) */}
        <div className="mt-8 border-t border-[#e2e8f0] pt-8">
          <h3 className="text-[14px] font-bold text-[#202127] mb-2">Skills Students Will Gain</h3>
          <p className="text-[12px] text-[#717480] mb-3">
            Add tags for key tools, concepts, or skills taught (e.g. Photoshop, SEO, Python). Press <strong className="text-[#202127]">Enter</strong> or <strong className="text-[#202127]">comma (,)</strong> to add a tag.
          </p>
          <div className="flex flex-wrap gap-2 p-2 border border-[#e2e8f0] rounded-[8px] min-h-[48px] bg-white items-center focus-within:border-[#3e92cc] transition-colors">
            {(data.skills || []).map((skill: string, index: number) => (
              <span key={index} className="flex items-center gap-1.5 bg-[#f0f4f8] text-[#3e92cc] px-3 py-1 rounded-[6px] text-[13px] font-bold">
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-[#a0aec0] hover:text-[#e11d48] font-bold text-[14px]">
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDownSkill}
              placeholder={(data.skills || []).length === 0 ? "Type a skill and press Enter..." : ""}
              className="flex-1 h-8 px-2 text-[13px] text-[#202127] bg-transparent outline-none border-none min-w-[120px]"
            />
          </div>
        </div>

      </div>

      {/* Buttons */}
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
    </div>
  );
}
