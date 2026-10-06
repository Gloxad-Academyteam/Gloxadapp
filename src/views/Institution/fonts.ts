import { Inter, Manrope } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

// Exposes --font-inter (body) and --font-manrope (headings) to the institution and partner-admin sections
export const institutionFontClass = `${inter.variable} ${manrope.variable}`;
