import { Metadata } from "next";
import CyberOsPage from "@/modules/cyber-os/cyber-os-page";

export const metadata: Metadata = {
  title: "Cyber Nexus OS | Desktop Environment",
  description:
    "An immersive desktop operating environment transforming Cyber Nexus into a complete cybersecurity engineering platform with windows, apps, terminal, and AI copilot.",
};

export default function Page() {
  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-[9999] bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-md px-4 py-2 text-center">
        <p className="text-xs text-amber-400 font-mono">
          Cyber Nexus OS is optimized for desktop — some features may not display correctly on mobile.
        </p>
      </div>
      <CyberOsPage />
    </>
  );
}
