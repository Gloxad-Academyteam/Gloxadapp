import React, { useRef, useState } from "react";
import { FiX, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";
import { toast } from "react-toastify";
import { useS3Upload } from "@hooks/useS3Upload";
import CategoryImage from "@components/CategoryImage";
import { TCategory, TCategoryPayload, getCategoryImage, isImageIcon } from "@services/categories";

interface CategoryFormModalProps {
  // Editing when set, creating otherwise
  category?: TCategory | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (payload: TCategoryPayload) => void;
}

type TSubCategoryRow = { name: string; topics: string };

const inputClassName =
  "w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-4 py-3 text-[14px] outline-none focus:border-[#3b82f6] transition-colors";
const labelClassName = "block text-[11px] font-bold text-[#202127] uppercase tracking-wider mb-2";

const splitTopics = (topics: string) =>
  topics
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ category, isSaving, onClose, onSubmit }) => {
  const isEditing = !!category;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, uploadProgress } = useS3Upload();

  const [name, setName] = useState(category?.name ?? "");
  const [order, setOrder] = useState(String(category?.order ?? 0));
  // An image URL that older categories kept in icon moves to imageUrl when saved
  const icon = isImageIcon(category?.icon) ? "" : category?.icon ?? "";
  const [imageUrl, setImageUrl] = useState(getCategoryImage(category) ?? "");
  const [subCategories, setSubCategories] = useState<TSubCategoryRow[]>(
    category?.subCategories.map((s) => ({ name: s.name, topics: s.topics.join(", ") })) ?? []
  );

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 2 * 1024 * 1024) return toast.error("Image size should be under 2MB");

    try {
      setImageUrl(await uploadFile(file, "resources"));
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to upload image");
    }
  };

  const updateRow = (index: number, field: keyof TSubCategoryRow, value: string) => {
    setSubCategories((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      icon,
      imageUrl,
      order: Number(order) || 0,
      subCategories: subCategories
        .filter((row) => row.name.trim())
        .map((row) => ({ name: row.name.trim(), topics: splitTopics(row.topics) })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[16px] w-full max-w-[560px] max-h-[90vh] shadow-2xl overflow-hidden relative flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A0AEC0] hover:text-[#202127] transition-colors"
        >
          <FiX className="text-[24px]" />
        </button>

        <div className="p-8 overflow-y-auto">
          <h2 className="text-[20px] font-bold text-[#181C7B] mb-2">
            {isEditing ? "Edit Category" : "Create Category"}
          </h2>
          <p className="text-[#717480] text-[14px] mb-8">
            Group courses by academic departments or professional skills.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Image */}
            <div>
              <label className={labelClassName}>Category Image</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[10px] bg-[#f0f4ff] border border-[#e2e8f0] flex items-center justify-center overflow-hidden shrink-0 text-[#3b82f6]">
                  <CategoryImage
                    src={imageUrl}
                    className="w-full h-full object-cover"
                    fallback={<MdOutlineCategory className="text-[28px]" />}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-[8px] border border-[#e2e8f0] text-[13px] font-bold text-[#202127] hover:bg-[#f8fafc] disabled:opacity-60"
                    >
                      <FiUploadCloud />
                      {isUploading ? `Uploading ${uploadProgress}%` : imageUrl ? "Replace" : "Upload"}
                    </button>
                    {imageUrl && !isUploading && (
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="text-[13px] font-medium text-[#A0AEC0] hover:text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[12px] text-[#A0AEC0]">PNG, JPG or SVG, under 2MB</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            </div>

            <div className="grid grid-cols-[1fr_100px] gap-4">
              <div>
                <label className={labelClassName}>Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Mathematics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className={labelClassName}>Order</label>
                <input
                  type="number"
                  min={0}
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>

            {/* Sub-categories */}
            <div>
              <label className={labelClassName}>Sub Categories</label>
              <div className="flex flex-col gap-3">
                {subCategories.map((row, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Name, e.g. Algebra"
                        value={row.name}
                        onChange={(e) => updateRow(index, "name", e.target.value)}
                        className={inputClassName}
                      />
                      <input
                        type="text"
                        placeholder="Topics, comma separated"
                        value={row.topics}
                        onChange={(e) => updateRow(index, "topics", e.target.value)}
                        className={inputClassName}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubCategories((rows) => rows.filter((_, i) => i !== index))}
                      className="mt-3 text-[#A0AEC0] hover:text-red-500"
                      aria-label="Remove sub-category"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setSubCategories((rows) => [...rows, { name: "", topics: "" }])}
                  className="w-full border-2 border-dashed border-[#cbd5e1] text-[#3b82f6] hover:bg-[#f8fafc] hover:border-[#3b82f6] font-bold text-[13px] uppercase tracking-wider py-3 rounded-[8px] transition-all"
                >
                  + Add Sub-category
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-[14px] py-3 rounded-[8px] transition-colors mt-2 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Generate Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryFormModal;
