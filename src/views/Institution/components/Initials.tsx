const palette = ["#e0e3fb", "#fde9b8", "#d3ecf7", "#f6d5e3", "#d9f0dc"];

const initialsOf = (name: string) =>
  name
    .replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

// Initials avatar for people the admin adds (no photo is stored for them)
const Initials = ({ name, size = 48 }: { name: string; size?: number }) => {
  const color = palette[(name.charCodeAt(0) || 0) % palette.length];
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-[#030069]"
      style={{ width: size, height: size, backgroundColor: color }}
    >
      {initialsOf(name) || "?"}
    </span>
  );
};

export default Initials;
