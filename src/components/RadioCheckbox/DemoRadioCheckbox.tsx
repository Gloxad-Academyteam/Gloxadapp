import RadioButton from "@components/RadioCheckbox/RadioButton";
import { useState } from "react";
import Checkbox from "./CheckBox";

type CheckboxState = {
  [key: string]: boolean;
};

function RadioCheckboxDemo()  {
  const [checkboxState, setCheckboxState] = useState<CheckboxState>({
    option1: false,
    option3: false,
  });
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleCheckboxChange = (value: string) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [value]: !prevState[value], // Toggle the state based on the value
    }));
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <div className="flex flex-col p-4 space-y-4">
      <Checkbox
        label="option1"
        value="option1"
        checked={checkboxState["option1"]}
        onChange={handleCheckboxChange}
      />
      <Checkbox
        label="option3"
        value="option3"
        checked={checkboxState["option3"]}
        onChange={handleCheckboxChange}
      />

      <RadioButton
        label="Option 1"
        value="option1"
        checked={selectedOption === "option1"}
        onChange={handleOptionChange}
      />
      <RadioButton
        label="Option 2"
        value="option2"
        checked={selectedOption === "option2"}
        onChange={handleOptionChange}
      />
      <RadioButton
        label="Option 3"
        value="option3"
        checked={selectedOption === "option3"}
        onChange={handleOptionChange}
      />
    </div>
  );
}

export default RadioCheckboxDemo;
