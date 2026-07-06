"use client";

import { useEffect, useState, useCallback } from "react";
import { PersonalHero } from "@/components/home/personal-hero";
import { Hero } from "@/components/home/hero";
import { SOCDashboard } from "@/components/home/soc-dashboard";
import { ThreatFeed } from "@/components/home/threat-feed";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { ThreatGlobeSection } from "@/components/home/threat-globe-section";
import { RecruiterDashboard } from "@/modules/recruiter/recruiter-dashboard";
import { SiteLoader } from "@/components/home/site-loader";
import { useUIStore } from "@/stores/ui-store";
import { IconChevronDown } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const LOADER_SEEN_KEY = "cnx-loader-seen";

export default function HomePage() {
  const recruiterMode = useUIStore((s) => s.recruiterMode);
  const [showFullPage, setShowFullPage] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(LOADER_SEEN_KEY);
    if (seen) {
      setShowLoader(false);
      setContentReady(true);
    }
  }, []);

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem(LOADER_SEEN_KEY, "1");
    setShowLoader(false);
    setTimeout(() => setContentReady(true), 100);
  }, []);

  if (recruiterMode) {
    return <RecruiterDashboard />;
  }

  return (
    <>
      <AnimatePresence>
        {showLoader && <SiteLoader onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      {contentReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <PersonalHero />

          {!showFullPage && (
            <div className="flex justify-center pb-12">
              <motion.button
                onClick={() => setShowFullPage(true)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full",
                  "bg-white/5 border border-white/10 text-xs text-muted-foreground font-mono",
                  "hover:bg-white/10 hover:text-foreground hover:border-white/20 transition-all"
                )}
              >
                View Full Dashboard
                <IconChevronDown size={14} />
              </motion.button>
            </div>
          )}

          {showFullPage && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Hero />
              <SOCDashboard />
              <ThreatGlobeSection />
              <ThreatFeed />
              <FeaturedProjects />
            </motion.div>
          )}
        </motion.div>
      )}
    </>
  );
}
