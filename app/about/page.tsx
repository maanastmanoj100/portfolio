import type { Metadata } from "next";
import { AboutPage } from "@/modules/about/about-page";

export const metadata: Metadata = {
  title: "About",
  description: "What I work on, the skills I use, and how the projects came together.",
};

export default function About() {
  return <AboutPage />;
}
