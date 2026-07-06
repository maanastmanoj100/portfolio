import type { Metadata } from "next";
import PacketDefender from "@/modules/arcade/games/packet-defender";

export const metadata: Metadata = {
  title: "Packet Defender | Cyber Nexus Arcade",
  description:
    "Real-time network packet filtering game. Allow legitimate traffic and block DDoS, malware, scanners, and spoofed packets across a live animated network.",
};

export default function Page() {
  return <PacketDefender />;
}
