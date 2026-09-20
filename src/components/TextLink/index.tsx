import Link from "next/link";

type TProps = {
  disabled?: boolean;
  text: string;
  to?: string;
  className?: string;
};

const TextLink = ({ disabled, text, to, className }: TProps) => {
  const linkTo = to ? to : "#";

  if (disabled) {
    return (
      <p className="cursor-not-allowed opacity-60 text-primary-source">
        {text}
      </p>
    );
  }

  return (
    <Link href={linkTo} className={className || "text-primary-source hover:opacity-80"}>
      <p>{text}</p>
    </Link>
  );
};

export default TextLink;
