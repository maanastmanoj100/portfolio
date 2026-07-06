import type { Metadata } from "next";
import ArcadePage from "@/modules/arcade/arcade-page";

export const metadata: Metadata = {
  title: "Cyber Nexus Arcade | Cyber Nexus OS",
  description:
    "Premium arcade with logic, puzzle, memory, cyber, AI, CTF, mini, and quick games. Integrated with Cyber Nexus OS window manager.",
};

export default function Page() {
  return <ArcadePage />;
}
