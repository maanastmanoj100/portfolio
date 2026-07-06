import type { Metadata } from "next";
import { AboutPage } from "@/modules/about/about-page";

export const metadata: Metadata = {
  title: "About | Cyber Nexus",
  description: "Learn about the cybersecurity professional behind Cyber Nexus.",
};

export default function About() {
  return <AboutPage />;
}
