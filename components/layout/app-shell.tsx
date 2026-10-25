"use client";

import { type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useUIStore } from "@/stores/ui-store";
import { useToolsStore } from "@/stores/tools-store";
import { AppProvider } from "@/components/layout/providers";
import { SiteHeader } from "./site-header";
import { Footer } from "./footer";
import { ToastContainer } from "@/components/feedback/toast";
import { EasterEggs } from "@/components/features/easter-eggs";

/**
 * Everything below is interactive UI that only matters once the visitor opens
 * it. Each module is code-split and mounted on demand so it never contributes
 * to the initial JavaScript payload or the first paint.
 */
const CommandPalette = dynamic(
  () => import("@/components/features/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);
const SearchModal = dynamic(
  () => import("@/components/features/search-modal").then((m) => m.SearchModal),
  { ssr: false },
);
const AiAssistant = dynamic(
  () => import("@/components/features/ai-assistant").then((m) => m.AiAssistant),
  { ssr: false },
);
const PortfolioTerminal = dynamic(
  () => import("@/components/features/portfolio-terminal").then((m) => m.PortfolioTerminal),
  { ssr: false },
);
const CveLookup = dynamic(
  () => import("@/components/features/cve-lookup").then((m) => m.CveLookup),
  { ssr: false },
);
const RecruiterBanner = dynamic(
  () => import("@/components/features/recruiter-banner").then((m) => m.RecruiterBanner),
  { ssr: false },
);
const Launchpad = dynamic(
  () => import("@/components/features/launchpad").then((m) => m.Launchpad),
  { ssr: false },
);
const MatrixRain = dynamic(
  () => import("@/components/features/matrix-rain").then((m) => m.MatrixRain),
  { ssr: false },
);

function ShellContent({ children }: { children: ReactNode }) {
  const commandPaletteOpen = useUIStore((s) => s.commandPaletteOpen);
  const searchOpen = useUIStore((s) => s.searchOpen);
  const aiAssistantOpen = useUIStore((s) => s.aiAssistantOpen);
  const hackerTerminalOpen = useUIStore((s) => s.hackerTerminalOpen);
  const cveOpen = useToolsStore((s) => s.cveOpen);
  const launchpadOpen = useUIStore((s) => s.launchpadOpen);
  const recruiterMode = useUIStore((s) => s.recruiterMode);
  const matrixMode = useUIStore((s) => s.matrixMode);

  return (
    <>
      <SiteHeader />
      {commandPaletteOpen && <CommandPalette />}
      {searchOpen && <SearchModal />}
      {aiAssistantOpen && <AiAssistant />}
      {hackerTerminalOpen && <PortfolioTerminal />}
      {cveOpen && <CveLookup />}
      {launchpadOpen && <Launchpad />}
      {recruiterMode && <RecruiterBanner />}
      {matrixMode && <MatrixRain />}
      <EasterEggs />
      <ToastContainer />

      <main className="min-h-[70vh]">{children}</main>

      <Footer />
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <ShellContent>{children}</ShellContent>
    </AppProvider>
  );
}
