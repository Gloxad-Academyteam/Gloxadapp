import Button from "@components/Button";
import RichText from ".";
import useRichText from "./hooks/useRichText";

const DemoRichText = () => {
  const { value, handleChange } = useRichText();
  const { value: value2, handleChange: handleChange2 } = useRichText();
  const { handleChange: handleChange3 } = useRichText();

  return (
    <div className="p-4 space-y-4">
      <h1 className="font-bold text-display-large">Demo Rich Text</h1>

      <h2 className="font-bold text-headline-medium">Small Rich Text</h2>
      <RichText value={value} handleChange={handleChange} />
      
      <Button onClick={() => console.log(value)} text="Log Value" />

      <h2 className="font-bold text-headline-medium">Preview</h2>
      <RichText value={value} isPreview />


      <h2 className="font-bold text-headline-medium">Large Rich Text</h2>
      <RichText value={value2} handleChange={handleChange2} isLarge />

      <h2 className="font-bold text-headline-medium">Disabled Rich Text</h2>
      <RichText value={value2} handleChange={handleChange3} isDisabled />
    </div>
  );
};

export default DemoRichText;
