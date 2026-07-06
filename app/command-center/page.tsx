import type { Metadata } from "next";
import CommandCenterPage from "@/modules/command-center/command-center-page";

export const metadata: Metadata = {
  title: "Global Command Center (SOC + NOC + OSINT) | Cyber Nexus",
  description:
    "Real-time security operations center, network operations center, threat intelligence, OSINT dashboard, infrastructure monitoring, and AI incident analysis — the flagship command dashboard of Cyber Nexus.",
};

export default function Page() {
  return <CommandCenterPage />;
}
