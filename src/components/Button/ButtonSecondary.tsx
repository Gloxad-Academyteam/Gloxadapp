import TemplateButton from "./TemplateButton";
import { getSecondaryClassName } from "./getClassName";
import { TProps } from "./types_";

const ButtonSecondary = (props: TProps) => {
  return <TemplateButton {...props} getClassName={getSecondaryClassName} />;
};

export default ButtonSecondary;
