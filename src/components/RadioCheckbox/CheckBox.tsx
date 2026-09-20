import { TProps } from "./types_";

const Checkbox = ({ label, value, checked, onChange }: TProps) => {
  const handleCheckboxChange = () => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={`checkbox-${value}`}
        checked={checked}
        onChange={handleCheckboxChange}
        value={value}
      />
      {label && (
        <label htmlFor={`checkbox-${value}`} className="ml-2">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
