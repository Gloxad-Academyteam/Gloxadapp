import { TProps } from "./types_";

export const RadioButton = ({ label, value, checked, onChange }: TProps) => {
  const handleRadioChange = () => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={`radio-${value}`}
        checked={checked}
        onChange={handleRadioChange}
        value={value}
      />

      {label && (
        <label htmlFor={`radio-${value}`} className="ml-2">
          {label}
        </label>
      )}
    </div>
  );
};

export default RadioButton;
