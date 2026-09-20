import { useState } from "react";
import { ReactQuillProps } from "react-quill";

const useRichText = () => {
  const [value, setValue] = useState<string>("");

  const handleChange: ReactQuillProps["onChange"] = (content) => {
    setValue(content);
  };

  return { value, handleChange };
};

export default useRichText;
