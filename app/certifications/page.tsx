import type { Metadata } from "next";
import { CertificateVaultPage } from "@/modules/certifications/certificate-vault-page";

export const metadata: Metadata = {
  title: "Certifications | Cyber Nexus",
  description: "Industry-recognized cybersecurity certifications including OSCP, CEH, CISSP, and more.",
};

export default function Certifications() {
  return <CertificateVaultPage />;
}
