import ReactQuill, { ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'link', 'image'
];

type TProps = {
  value: string;
  handleChange?: ReactQuillProps["onChange"];
  isLarge?: boolean;
  isDisabled?: boolean;
  isPreview?: boolean;
};

const RichText = ({
  value,
  handleChange,
  isLarge,
  isDisabled,
  isPreview,
}: TProps) => {
  const getClassName = () => {
    let className = "w-full";
    if (isLarge) className += " ql-large ";
    if (isDisabled) className += " ql-disabled ";
    return className;
  };

  const getPreviewClassName = () => {
    let className = "w-full p-2 overflow-y-auto border rounded border-neutral-4 h-96";
    if (isLarge) className += " text-lg h-[600px]";
    return className;
  }

  return isPreview ? (
    <div
      className={getPreviewClassName()}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  ) : (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      className={getClassName()}
      modules={modules}
      formats={formats}
      readOnly={isDisabled}
    />
  );
};

export default RichText;
