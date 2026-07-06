import type { Metadata } from "next";
import PhishingDetective from "@/modules/arcade/games/phishing-detective";

export const metadata: Metadata = {
  title: "Phishing Detective | Cyber Nexus Arcade",
  description:
    "Educational phishing detection game. Analyze emails, spot red flags, and learn to identify phishing attempts across 4 difficulty levels.",
};

export default function Page() {
  return <PhishingDetective />;
}
