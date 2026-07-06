import type { Metadata } from "next";
import { DashboardPage } from "@/modules/dashboard/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard | Cyber Nexus",
  description: "Live SOC dashboard with real-time threat intelligence and security metrics.",
};

export default function Dashboard() {
  return <DashboardPage />;
}
