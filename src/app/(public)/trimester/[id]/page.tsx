import type { Metadata } from "next";
import TrimesterProgramPage from "@pages/TrimesterProgramPage";

export const metadata: Metadata = {
  title: "Trimester Program | Gloxad Academy",
  description: "Weeks, live class schedule, instructors and how to enrol in this Gloxad Academy trimester program.",
};

export default function Page() {
  return <TrimesterProgramPage />;
}
