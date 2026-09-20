import { FaRegCircleCheck } from "react-icons/fa6";

type TProps = {
  heading: string;
  body: string;
  renderBottom?: () => JSX.Element;
};

const SuccessModalContent = ({ heading, body, renderBottom }: TProps) => {
  return (
    <div className="p-[40px] w-[601px] rounded-[8px] p-6 border border-neutral-4 bg-primary-1 flex flex-col items-center justify-center gap-[60px]">
      <div className="flex flex-col items-center justify-center gap-[16px]">
        <span className="text-primary-source">
          <FaRegCircleCheck size="40px" />
        </span>
        <h2 className="font-medium text-headline-medium">{heading}</h2>

        <p>{body}</p>
      </div>

      {renderBottom && renderBottom()}
    </div>
  );
};

export default SuccessModalContent;
FaRegCircleCheck;
