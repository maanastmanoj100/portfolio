import type { Metadata } from "next";
import CareerIntelligencePage from "@/modules/career-intelligence/career-page";

export const metadata: Metadata = {
  title: "Career Role Intelligence & Skill Gap Analyzer | Cyber Nexus",
  description:
    "Evidence-based career role alignment — compare portfolio evidence against 18 cybersecurity career paths with transparent skill gap analysis and learning roadmaps.",
  keywords: [
    "career intelligence",
    "skill gap analysis",
    "cybersecurity careers",
    "role alignment",
    "career planning",
  ],
  openGraph: {
    title: "Career Role Intelligence | Cyber Nexus",
    description:
      "Evidence-based career role alignment across 18 cybersecurity paths",
    type: "website",
  },
};

export default function Page() {
  return <CareerIntelligencePage />;
}
