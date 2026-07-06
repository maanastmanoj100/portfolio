import type { Metadata } from "next";
import AchievementPage from "@/modules/achievement/achievement-page";

export const metadata: Metadata = {
  title: "Achievements & Gamification | Cyber Nexus",
  description:
    "Track exploration progress, unlock badges, complete missions, and discover every milestone across the Cyber Nexus portfolio.",
};

export default function Page() {
  return <AchievementPage />;
}
