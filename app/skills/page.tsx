import type { Metadata } from "next";
import { SkillsGalaxyPage } from "@/modules/skills/skills-galaxy-page";

export const metadata: Metadata = {
  title: "Skills Galaxy | Cyber Nexus",
  description: "Explore an interactive 3D galaxy of technical expertise spanning cybersecurity, programming, cloud, AI, and more.",
};

export default function Skills() {
  return <SkillsGalaxyPage />;
}
