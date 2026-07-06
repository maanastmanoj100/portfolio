import type { Metadata } from "next";
import { InterviewSimulatorPage } from "@/modules/interview-simulator/interview-simulator-page";

export const metadata: Metadata = {
  title: "AI Interview Simulator | Cyber Nexus",
  description: "Practice realistic cybersecurity interviews with AI-powered questioning, feedback, and portfolio-based evaluation.",
};

export default function InterviewSimulator() {
  return <InterviewSimulatorPage />;
}
