import type { Metadata, Viewport } from "next";
import { DM_Sans, Roboto } from "next/font/google";
import Providers from "@components/Providers";
import ServiceWorkerRegister from "@components/ServiceWorkerRegister";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
  display: "swap",
});

const title = "Gloxad Academy | Premium Online Learning & Tutoring";
const description =
  "Join Gloxad Academy to learn from industry experts or build your influence as a tutor. Create, publish, and profit from your courses on a premium platform.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gloxadacademy.com"),
  title,
  description,
  keywords: [
    "Gloxad",
    "Gloxad Academy",
    "online courses",
    "tutoring",
    "online learning",
    "teach online",
    "elearning platform",
  ],
  alternates: { canonical: "/" },
  icons: { icon: "/gloxadlogo.png", apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Gloxad", statusBarStyle: "default" },
  openGraph: {
    type: "website",
    url: "https://www.gloxadacademy.com/",
    title,
    description,
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#07004d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${roboto.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <ServiceWorkerRegister />
        <div id="modal" />
      </body>
    </html>
  );
}
