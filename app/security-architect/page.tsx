import { Metadata } from "next";
import SecurityArchitectPage from "@/modules/security-architect/security-architect-page";

export const metadata: Metadata = {
  title: "Security Architecture Explorer | Cyber Nexus",
  description:
    "Explore secure system architectures, analyse trust boundaries, model threats, and understand how security controls mitigate risks across Cyber Nexus projects.",
};

export default function Page() {
  return <SecurityArchitectPage />;
}
