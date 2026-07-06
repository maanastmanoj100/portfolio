import type { Metadata } from "next";
import { ProjectsPage } from "@/modules/projects/projects-page";

export const metadata: Metadata = {
  title: "Project Command Center | Cyber Nexus",
  description: "Explore production-ready cybersecurity projects — penetration testing labs, AI security research, SOC engineering, vulnerability research, and full-stack development work.",
  openGraph: {
    title: "Project Command Center | Cyber Nexus",
    description: "Production-ready cybersecurity projects spanning AI, network defense, vulnerability research, and SOC engineering.",
    type: "website",
  },
};

export default function Projects() {
  return <ProjectsPage />;
}
