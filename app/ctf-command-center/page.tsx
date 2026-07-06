import type { Metadata } from "next";
import CTFCommandCenterPage from "@/modules/ctf-command-center/ctf-command-center-page";

export const metadata: Metadata = {
  title: "CTF & Cyber Range | Cyber Nexus",
  description:
    "Explore practical cybersecurity exercises, ethical hacking labs, capture-the-flag challenges, and documented learning experiences across TryHackMe, Hack The Box, PortSwigger, PicoCTF, OverTheWire, and personal labs.",
  keywords: [
    "CTF", "Capture The Flag", "cyber range", "TryHackMe", "Hack The Box",
    "ethical hacking", "penetration testing labs", "cybersecurity challenges",
    "PortSwigger", "PicoCTF", "OverTheWire", "security training",
  ],
  openGraph: {
    title: "CTF & Cyber Range Command Center | Cyber Nexus",
    description:
      "Hands-on cybersecurity practice across multiple platforms with documented methodologies and defensive insights.",
    type: "website",
  },
};

export default function Page() {
  return <CTFCommandCenterPage />;
}
