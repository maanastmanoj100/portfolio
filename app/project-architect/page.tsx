import { Metadata } from "next";
import ProjectArchitectPage from "@/modules/project-architect/project-architect-page";

export const metadata: Metadata = {
  title: "AI Project Architect | Cyber Nexus",
  description:
    "Generate, design, and plan cybersecurity projects using AI-assisted architecture, documentation, and implementation guidance.",
};

export default function Page() {
  return <ProjectArchitectPage />;
}
