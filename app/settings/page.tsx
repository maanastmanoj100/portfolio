import type { Metadata } from "next";
import { SettingsPage } from "@/modules/settings/settings-page";

export const metadata: Metadata = {
  title: "Settings | Cyber Nexus",
  description: "Configure your Cyber Nexus experience.",
};

export default function Settings() {
  return <SettingsPage />;
}
