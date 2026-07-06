"use client";

import { type ReactNode, Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AppProvider } from "@/components/layout/providers";
import { Topbar } from "./topbar";
import { NavigationDock } from "./navigation-dock";
import { Footer } from "./footer";
import { HeroBackground } from "@/components/three/hero-background";
import { CommandPalette } from "@/components/features/command-palette";
import { SearchModal } from "@/components/features/search-modal";
import { AiAssistant } from "@/components/features/ai-assistant";
import { HackerTerminal } from "@/components/features/hacker-terminal";
import { RecruiterBanner } from "@/components/features/recruiter-banner";
import { MatrixRain } from "@/components/features/matrix-rain";
import { EasterEggs } from "@/components/features/easter-eggs";
import { ToastContainer } from "@/components/feedback/toast";
import { CursorGlow } from "@/components/ui/cursor-effects";
import { useMouseTracker } from "@/stores/mouse-store";
import { useUIStore } from "@/stores/ui-store";
import { pageEnter } from "@/lib/animation";

function ShellContent({ children }: { children: ReactNode }) {
  useMouseTracker();
  const pathname = usePathname();
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  return (
    <>
      <Topbar />
      <HeroBackground />
      <CursorGlow />
      <NavigationDock />
      <CommandPalette />
      <SearchModal />
      <AiAssistant />
      <HackerTerminal />
      <RecruiterBanner />
      <MatrixRain />
      <EasterEggs />
      <ToastContainer />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          variants={pageEnter}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-h-screen pt-14 pb-24 md:pb-28"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <Suspense fallback={null}>
        <ShellContent>{children}</ShellContent>
      </Suspense>
    </AppProvider>
  );
}
