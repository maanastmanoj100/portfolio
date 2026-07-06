import type { Metadata } from "next";
import CompetencyMatrixPage from "@/modules/skill-engine/skill-page";

export const metadata: Metadata = {
  title: "Competency Matrix & Skill Engine | Cyber Nexus",
  description:
    "Evidence-based skill progression engine — 36 skills across 12 domains with verifiable project, certification, lab, CTF, and publication cross-references.",
  keywords: [
    "skills",
    "competency matrix",
    "skill progression",
    "cybersecurity skills",
    "evidence-based learning",
  ],
  openGraph: {
    title: "Competency Matrix | Cyber Nexus",
    description: "Evidence-based skill mapping across 12 security domains",
    type: "website",
  },
};

export default function Page() {
  return <CompetencyMatrixPage />;
}
