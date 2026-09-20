import { TProps } from "./types_";

export const Avatar = ({ imageSrc, altText, isBig }: TProps) => {
  const getclassName = () => {
    let className =
      "w-[100px] h-[100px] top-[42px] left-[263px] gap-[0px] opacity-[0px] ";

    if (!isBig) {
      className =
        "w-[32px] h-[32px] top-[97px] left-[387px] gap-[0px] rounded-[full] opacity-[0px]";
    }
    return className;
  };

  return (
    <div className={`${getclassName()} relative`}>
      <img
        src={imageSrc}
        alt={altText}
        className="w-[100%] h-[100%] absolute top-[0px] left-[0px] object-fit object-center rounded-[300px]"
      />
    </div>
  );
};
