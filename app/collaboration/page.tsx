import type { Metadata } from "next";
import CollaborationPage from "@/modules/collaboration/collaboration-page";

export const metadata: Metadata = {
  title: "Collaboration Hub & Open Source Ecosystem | Cyber Nexus",
  description:
    "Open-source cybersecurity projects, community engagement, mentorship resources, governance frameworks, and recognition — the collaborative ecosystem behind Cyber Nexus.",
};

export default function Page() {
  return <CollaborationPage />;
}
