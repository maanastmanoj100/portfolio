import type { Metadata } from "next";
import SocAlertRush from "@/modules/arcade/games/soc-alert-rush";

export const metadata: Metadata = {
  title: "SOC Alert Rush | Cyber Nexus Arcade",
  description:
    "Triage security alerts as a SOC analyst. Investigate, escalate, ignore, or close alerts with MITRE ATT&CK mapping, scoring combos, and educational explanations.",
};

export default function Page() {
  return <SocAlertRush />;
}
