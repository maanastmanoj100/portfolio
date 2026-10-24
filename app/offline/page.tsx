"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { IconWifiOff } from "@tabler/icons-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard glow="cyan" className="max-w-md w-full p-8 text-center">
        <IconWifiOff size={48} className="text-cyan mx-auto mb-4" />
        <h1 className="text-xl font-medium text-foreground mb-2">You&apos;re Offline</h1>
        <p className="text-sm text-foreground-secondary mb-4">
          Some features may be unavailable. Cached pages are still accessible.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-mono bg-cyan/10 border border-cyan/20 text-cyan hover:bg-cyan/15 transition-colors"
        >
          Return Home
        </a>
      </GlassCard>
    </div>
  );
}
