import { ReactNode } from "react";

const Section = ({
  children,
  heading,
  isFull,
}: {
  children: ReactNode;
  heading: string;
  isFull?: boolean;
}) => {
  return (
    <section className="flex flex-col gap-[40px] items-center"
      style={isFull ? {
        justifyContent: "center",
        alignItems: "center",
      } : {}}>
      <h2 className="font-medium text-headline-large">{heading}</h2>

      <div>
        {children}
      </div>
    </section>
  );
};

export default Section;
