import type { Metadata } from "next";
import { ProjectsPage } from "@/modules/projects/projects-page";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Security tooling, escape rooms and full-stack web apps — with source and live links for each.",
};

export default function Projects() {
  return <ProjectsPage />;
}
