import type { Metadata } from "next";
import { CareerAnalyticsPage } from "@/modules/career-analytics/career-analytics-page";

export const metadata: Metadata = {
  title: "Career Analytics | Cyber Nexus",
  description: "Technical growth, learning journey, and engineering activity visualized through interactive analytics and timelines.",
};

export default function CareerAnalytics() {
  return <CareerAnalyticsPage />;
}
