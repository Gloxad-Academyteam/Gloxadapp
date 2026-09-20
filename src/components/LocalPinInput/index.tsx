import { useEffect } from "react";
import PinInput from "react-pin-input";

type TProps = {
  length: number;
  initialValue?: string;
  onComplete: (value: string) => void;
};

const LocalPinInput = ({ length, onComplete, initialValue }: TProps) => {
  useEffect(() => {
    if (initialValue?.length === length) {
      onComplete(initialValue);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PinInput
      length={length}
      initialValue={initialValue}
      type="numeric"
      inputMode="number"
      style={{ display: "flex", justifyContent: "center", flexWrap: "nowrap" }}
      inputStyle={{
        borderColor: "#e5e7eb",
        borderWidth: "1px",
        width: "44px",
        height: "48px",
        margin: "0 5px",
        borderRadius: "10px",
        fontSize: "16px",
        color: "#202127",
        outline: "none",
      }}
      inputFocusStyle={{ borderColor: "#07004d", boxShadow: "0 0 0 3px rgba(7,0,77,0.1)" }}
      onComplete={(value) => onComplete(value)}
      autoSelect={true}
      regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
    />
  );
};

export default LocalPinInput;
