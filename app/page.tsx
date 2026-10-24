"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PersonalHero } from "@/components/home/personal-hero";
import { useUIStore } from "@/stores/ui-store";
import { IconChevronDown } from "@tabler/icons-react";

/**
 * Below-the-fold dashboard sections are code-split and only fetched after the
 * visitor asks for them. This keeps the initial homepage bundle small and lets
 * the hero render (and paint) immediately — no artificial loading screen.
 */
function SectionFallback({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16" aria-hidden="true">
      <div className="h-3 w-28 rounded bg-white/5 animate-pulse" />
      <div className="mt-3 h-8 w-64 max-w-full rounded bg-white/5 animate-pulse" />
      <p className="mt-4 text-xs font-mono text-foreground-tertiary">{label}</p>
    </div>
  );
}

const RecruiterDashboard = dynamic(
  () => import("@/modules/recruiter/recruiter-dashboard").then((m) => m.RecruiterDashboard),
  { ssr: false, loading: () => <SectionFallback label="Loading recruiter view…" /> },
);

const Hero = dynamic(() => import("@/components/home/hero").then((m) => m.Hero), {
  ssr: false,
  loading: () => <SectionFallback label="Loading overview…" />,
});

const SOCDashboard = dynamic(
  () => import("@/components/home/soc-dashboard").then((m) => m.SOCDashboard),
  { ssr: false, loading: () => <SectionFallback label="Loading SOC metrics…" /> },
);

const ThreatGlobeSection = dynamic(
  () => import("@/components/home/threat-globe-section").then((m) => m.ThreatGlobeSection),
  { ssr: false, loading: () => <SectionFallback label="Loading threat map…" /> },
);

const ThreatFeed = dynamic(
  () => import("@/components/home/threat-feed").then((m) => m.ThreatFeed),
  { ssr: false, loading: () => <SectionFallback label="Loading threat feed…" /> },
);

const FeaturedProjects = dynamic(
  () => import("@/components/home/featured-projects").then((m) => m.FeaturedProjects),
  { ssr: false, loading: () => <SectionFallback label="Loading projects…" /> },
);

export default function HomePage() {
  const recruiterMode = useUIStore((s) => s.recruiterMode);
  const [showFullPage, setShowFullPage] = useState(false);

  if (recruiterMode) {
    return <RecruiterDashboard />;
  }

  return (
    <>
      <PersonalHero />

      {!showFullPage ? (
        <div className="flex justify-center pb-16">
          <button
            onClick={() => setShowFullPage(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-foreground-secondary font-mono hover:bg-white/10 hover:text-foreground hover:border-white/20 transition-colors"
          >
            View Full Dashboard
            <IconChevronDown size={14} />
          </button>
        </div>
      ) : (
        <div className="animate-slide-up">
          <Hero />
          <SOCDashboard />
          <ThreatGlobeSection />
          <ThreatFeed />
          <FeaturedProjects />
        </div>
      )}
    </>
  );
}
