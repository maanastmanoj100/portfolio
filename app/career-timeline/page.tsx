import type { Metadata } from "next";
import { CareerTimelinePage } from "@/modules/career-timeline/career-timeline-page";

export const metadata: Metadata = {
  title: "Career Timeline | Cyber Nexus",
  description: "Explore the complete cybersecurity journey — milestones, projects, certifications, and learning evolution.",
};

export default function CareerTimeline() {
  return <CareerTimelinePage />;
}
