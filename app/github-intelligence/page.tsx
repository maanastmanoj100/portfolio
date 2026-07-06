import type { Metadata } from "next";
import { GitHubIntelligencePage } from "@/modules/github-intelligence/github-intelligence-page";

export const metadata: Metadata = {
  title: "GitHub Intelligence | Cyber Nexus",
  description: "Explore repositories, development history, technologies, commits, and engineering activity across all portfolio projects.",
};

export default function GitHubIntelligence() {
  return <GitHubIntelligencePage />;
}
