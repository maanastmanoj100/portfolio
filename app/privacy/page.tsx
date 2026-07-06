import type { Metadata } from "next";
import { PrivacyPage } from "@/modules/privacy/privacy-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Cyber Nexus",
  description: "Privacy policy for Cyber Nexus portfolio.",
};

export default function Privacy() {
  return <PrivacyPage />;
}
