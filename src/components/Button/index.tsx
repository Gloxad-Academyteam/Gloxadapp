import { TProps } from "./types_";
import { getPrimaryClassName } from "./getClassName";
import TemplateButton from "./TemplateButton";

const Button = (props: TProps) => {
  return <TemplateButton {...props} getClassName={getPrimaryClassName} />;
};

export default Button;
