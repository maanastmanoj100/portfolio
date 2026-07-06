import type { Metadata } from "next";
import CyberLabPage from "@/modules/cyber-lab/cyber-lab-page";

export const metadata: Metadata = {
  title: "Cyber Lab & Infrastructure | Cyber Nexus",
  description:
    "Explore the interactive cybersecurity laboratory — virtual machines, containers, network topology, security stack, logging pipeline, monitoring systems, and cloud infrastructure powering Cyber Nexus.",
  keywords: [
    "cybersecurity lab", "home lab", "infrastructure", "network topology",
    "virtual machines", "containers", "Docker", "SIEM", "Splunk",
    "Wazuh", "pfSense", "Active Directory", "Kubernetes", "AWS",
    "security stack", "SOC lab",
  ],
  openGraph: {
    title: "Cyber Lab & Home Infrastructure | Cyber Nexus",
    description:
      "Interactive cybersecurity laboratory with segmented networks, virtual machines, containers, and a full security monitoring stack.",
    type: "website",
  },
};

export default function Page() {
  return <CyberLabPage />;
}
