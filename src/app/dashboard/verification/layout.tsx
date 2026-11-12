import TutorOnly from "@components/TutorOnly";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TutorOnly>{children}</TutorOnly>;
}
