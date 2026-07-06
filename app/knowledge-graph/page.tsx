import type { Metadata } from "next";
import KnowledgeGraphPage from "@/modules/knowledge-graph/knowledge-graph-page";

export const metadata: Metadata = {
  title: "Knowledge Graph | Cyber Nexus",
  description:
    "Explore the interconnected ecosystem of projects, skills, certifications, research, and cybersecurity knowledge through an interactive knowledge graph.",
  keywords: [
    "knowledge graph", "skill mapping", "relationship network", "cybersecurity ecosystem",
    "project connections", "technology graph", "learning paths", "portfolio intelligence",
  ],
  openGraph: {
    title: "Knowledge Graph | Cyber Nexus",
    description:
      "Interactive knowledge graph connecting every entity in the Cyber Nexus portfolio into a navigable relationship network.",
    type: "website",
  },
};

export default function Page() {
  return <KnowledgeGraphPage />;
}
