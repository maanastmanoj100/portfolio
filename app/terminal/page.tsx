import type { Metadata } from "next";
import { TerminalPage } from "@/modules/terminal/terminal-page";

export const metadata: Metadata = {
  title: "Terminal | Cyber Nexus",
  description: "Interactive security terminal with command-line interface.",
};

export default function Terminal() {
  return <TerminalPage />;
}
