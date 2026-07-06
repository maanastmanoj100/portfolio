import type { Metadata } from "next";
import { ResumePage } from "@/components/resume/resume-page";

export const metadata: Metadata = {
  title: "Resume | Cyber Nexus",
  description: "Professional experience and education in cybersecurity.",
};

export default function Resume() {
  return <ResumePage />;
}
