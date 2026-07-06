import type { Metadata } from "next";
import { CyberPersonaPage } from "@/modules/cyber-persona/cyber-persona-page";

export const metadata: Metadata = {
  title: "AI Digital Twin | Cyber Nexus",
  description: "Meet Cyber Persona — the AI-powered digital twin representing my cybersecurity journey, projects, skills, and certifications.",
};

export default function CyberPersona() {
  return <CyberPersonaPage />;
}
