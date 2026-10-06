// Shared class names for the Institution screens (colors come from the Figma designs)
export const NAVY = "#030069";

export const inputClass =
  "w-full rounded-[10px] border border-[#d5d9ec] bg-white px-4 py-3 text-[15px] text-[#1b1d33] placeholder:text-[#a2a6bb] outline-none transition focus:border-[#030069] focus:ring-2 focus:ring-[#030069]/15 disabled:bg-[#f4f5fb] disabled:text-[#9a9db3]";

export const labelClass = "mb-2 block text-[14px] font-medium text-[#3a3d5c]";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-[15px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#030069] disabled:cursor-not-allowed disabled:opacity-50";

export const primaryButton = `${buttonBase} bg-[#030069] text-white shadow-[0_6px_16px_rgba(3,0,105,0.22)] hover:bg-[#0b0a8c] disabled:shadow-none`;

export const outlineButton = `${buttonBase} border border-[#030069] bg-white text-[#030069] hover:bg-[#f2f3ff]`;

export const mutedButton = `${buttonBase} border border-[#d5d9ec] bg-[#f6f7fc] text-[#3a3d5c] hover:bg-[#eceefa]`;

export const cardClass = "rounded-[16px] border border-[#d9dcec] bg-white";
