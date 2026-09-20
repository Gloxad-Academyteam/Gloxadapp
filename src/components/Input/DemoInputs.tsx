import { FaEnvelope, FaUser } from "react-icons/fa";
import Input from ".";
import PasswordInput from "./PasswordInput";
import { useState } from "react";
import Textarea from "./Textarea";
import Select from "./Select";
import LocalPinInput from "@components/LocalPinInput"

const SELECT_OPTIONS = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
];

const DemoInputs = () => {
  const [value, setValue] = useState("hey");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="flex flex-col p-4 pb-16 space-y-4">
      <LocalPinInput length={4} onComplete={
        (value) => console.log(value)
      } />
      <LocalPinInput length={6} initialValue="123456" onComplete={(value) => {
        console.log(value)
        console.log("Completed")
        console.log("Verified")
      }}/>

      <Input value="" placeholder="Enter your email" />
      <Input value={value} onChange={handleChange} LeftIcon={FaEnvelope} />
      <Input
        value={value}
        onChange={handleChange}
        RightIcon={FaEnvelope}
        label="Email"
      />
      <Input
        value={value}
        onChange={handleChange}
        LeftIcon={FaEnvelope}
        RightIcon={FaEnvelope}
        label="Email"
      />
      <Input value={value} onChange={handleChange} disabled />
      <Input
        value={value}
        onChange={handleChange}
        disabled
        LeftIcon={FaEnvelope}
      />
      <Input value={value} onChange={handleChange} error="This is an error" />
      <Input
        value={value}
        onChange={handleChange}
        error="This is an error"
        RightIcon={FaEnvelope}
        showErrorIcon={false}
      />
      <Input
        value={value}
        onChange={handleChange}
        error="This is an error"
        showErrorIcon
      />
      <Input
        value={value}
        onChange={handleChange}
        error="This is an error"
        showErrorIcon
        RightIcon={FaEnvelope}
        label="Email"
      />
      <Input
        value={value}
        onChange={handleChange}
        error="This is an error"
        showErrorIcon
        renderRightIcon={() => <FaUser />}
      />

      <PasswordInput value={value} onChange={handleChange} />
      {/* Note: The PasswordInput component shows the toggle button on the right side no matter what */}
      <PasswordInput
        value={value}
        onChange={handleChange}
        error="This is an error"
        label="Password"
      />
      <PasswordInput
        value={value}
        onChange={handleChange}
        error="This is an error"
        showErrorIcon
      />
      <PasswordInput
        value=""
        placeholder="Enter your password"
        onChange={handleChange}
        RightIcon={FaEnvelope}
      />

      <Textarea value={value} onChange={handleTextareaChange} />
      <Textarea value="" placeholder="Enter your description" />
      <Textarea
        value={value}
        onChange={handleTextareaChange}
        label="Description"
      />
      <Textarea value={value} onChange={handleTextareaChange} disabled />

      <Select
        value={value}
        onChange={handleSelectChange}
        options={SELECT_OPTIONS}
      />
      <Select
        value={value}
        onChange={handleSelectChange}
        options={SELECT_OPTIONS}
        LeftIcon={FaEnvelope}
        label="Select"
      />
      <Select
        value={value}
        onChange={handleSelectChange}
        options={SELECT_OPTIONS}
        RightIcon={FaEnvelope}
      />
      <Select
        value={value}
        onChange={handleSelectChange}
        options={SELECT_OPTIONS}
        disabled
        label="Select"
      />
      <Select
        value={value}
        onChange={handleSelectChange}
        options={SELECT_OPTIONS}
        error="This is an error"
      />
      <Select
        value={value}
        onChange={handleSelectChange}
        options={SELECT_OPTIONS}
        showErrorIcon={false}
      />
      <Select
        value={value}
        onChange={handleSelectChange}
        options={SELECT_OPTIONS}
        RightIcon={FaEnvelope}
      />
    </div>
  );
};

export default DemoInputs;
