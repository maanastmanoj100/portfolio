import type { Metadata } from "next";
import CyberEscapeRoom from "@/modules/arcade/games/cyber-escape-room";

export const metadata: Metadata = {
  title: "Cyber Escape Room | Cyber Nexus Arcade",
  description:
    "Solve seven cybersecurity puzzles across network, terminal, cipher, logic, binary, hash, and final chambers. Escape with AI guidance and hints.",
};

export default function Page() {
  return <CyberEscapeRoom />;
}
