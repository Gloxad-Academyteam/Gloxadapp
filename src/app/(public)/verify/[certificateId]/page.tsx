import type { Metadata } from "next";
import VerifyCertificatePage from "@pages/VerifyCertificatePage";

export const metadata: Metadata = {
  title: "Verify a certificate | Gloxad Academy",
  description: "Check that a Gloxad Academy certificate is genuine.",
};

export default function Page() {
  return <VerifyCertificatePage />;
}
