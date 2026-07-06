import type { Metadata } from "next";
import { AttackMapPage } from "@/modules/attack-map/attack-map-page";

export const metadata: Metadata = {
  title: "Threat Map | Cyber Nexus",
  description: "Interactive global cyber attack map with real-time threat intelligence and 3D visualization.",
};

export default function AttackMap() {
  return <AttackMapPage />;
}
