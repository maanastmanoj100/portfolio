"use client";

import { useState, useMemo, useCallback, type ReactNode } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { useUIStore } from "@/stores/ui-store";
import { AttackMapGlobe } from "./attack-map-globe";
import { ThreatActorsPanel, CountryInfoPanel, AttackFilterBar } from "./attack-map-intel";
import { AttackTimeline, LiveEventFeed } from "./attack-map-timeline";
import { ThreatDistributionChart, TopThreatCountries, AttackTrendChart, QuickStats } from "./attack-map-charts";
import { ATTACK_EVENTS } from "./attack-map-data";
import type { AttackEvent } from "./attack-map-data";
import {
  IconRadar, IconGlobe, IconUsers, IconTimeline, IconChartBar, IconAlertTriangle, IconX, IconMenu2,
} from "@tabler/icons-react";

type AttackView = "overview" | "actors" | "timeline" | "analytics";

const viewDescriptions: Record<AttackView, string> = {
  overview: "Global cyber threat visualization with real-time attack events",
  actors: "Advanced persistent threat actor profiles and intelligence",
  timeline: "Chronological attack timeline with playback and live events",
  analytics: "Threat distribution, trends, and country-level statistics",
};

const sidebarItems: { id: AttackView; label: string; icon: typeof IconRadar }[] = [
  { id: "overview", label: "Overview", icon: IconGlobe },
  { id: "actors", label: "Threat Actors", icon: IconUsers },
  { id: "timeline", label: "Timeline", icon: IconTimeline },
  { id: "analytics", label: "Analytics", icon: IconChartBar },
];

function Sidebar({
  activeView,
  onViewChange,
  collapsed,
  onToggle,
}: {
  activeView: AttackView;
  onViewChange: (v: AttackView) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.nav
      animate={{ width: collapsed ? 48 : 152 }}
      className="shrink-0 glass-card rounded-none border-l-0"
    >
      <div className="py-3 space-y-0.5">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all duration-200 touch-action-manipulation ${
                isActive
                  ? "text-cyan bg-cyan/10 border-r-2 border-cyan"
                  : "text-foreground-tertiary hover:text-foreground hover:bg-white/[0.02] border-r-2 border-transparent"
              }`}
              style={{ minHeight: 44 }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={15} className="shrink-0" />
              {!collapsed && <span className="text-xs truncate flex-1">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}

function OverviewView({
  selectedCountry,
  hoveredCountry,
  onCountryClick,
  onCountryHover,
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  typeFilter,
  onTypeChange,
}: {
  selectedCountry: string | null;
  hoveredCountry: string | null;
  onCountryClick: (code: string) => void;
  onCountryHover: (code: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  severityFilter: string;
  onSeverityChange: (s: string) => void;
  typeFilter: string;
  onTypeChange: (t: string) => void;
}) {
  const uniqueTypes = useMemo(() => [...new Set(ATTACK_EVENTS.map((e) => e.type))], []);

  const filteredAttacks = useMemo(() => {
    return ATTACK_EVENTS.filter((e) => {
      if (searchQuery && !e.description.toLowerCase().includes(searchQuery.toLowerCase()) && !e.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (severityFilter !== "all" && e.severity !== severityFilter) return false;
      if (typeFilter !== "all" && e.type !== typeFilter) return false;
      return true;
    });
  }, [searchQuery, severityFilter, typeFilter]);

  return (
    <div className="space-y-4">
      <QuickStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase">Global Attack Map</span>
              <span className="text-xs text-foreground-tertiary font-mono">{filteredAttacks.length} active events</span>
            </div>
            <div className="h-[350px] sm:h-[450px] rounded-lg overflow-hidden">
              <AttackMapGlobe
                selectedCountry={selectedCountry}
                hoveredCountry={hoveredCountry}
                onCountryClick={onCountryClick}
                onCountryHover={onCountryHover}
                activeAttacks={filteredAttacks}
                autoRotate={!selectedCountry}
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <CountryInfoPanel selectedCountry={selectedCountry} />
          <LiveEventFeed />
        </div>
      </div>
      <AttackFilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        severityFilter={severityFilter}
        onSeverityChange={onSeverityChange}
        typeFilter={typeFilter}
        onTypeChange={onTypeChange}
        uniqueTypes={uniqueTypes}
      />
    </div>
  );
}

function ActorView() {
  return <ThreatActorsPanel />;
}

function TimelineView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AttackTimeline />
      <LiveEventFeed />
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ThreatDistributionChart />
        <TopThreatCountries />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AttackTrendChart />
        <div className="glass-card p-4">
          <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Geographic Threat Distribution</span>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {[...ATTACK_EVENTS].sort((a, b) => b.severity.localeCompare(a.severity)).slice(0, 24).map((e, i) => (
              <div key={`${e.id}-${i}`} className="p-1.5 rounded-md bg-white/[0.015] border border-border/20 text-center">
                <div className="text-xs">{e.sourceCode}→{e.destCode}</div>
                <div className={`text-xs font-mono ${
                  e.severity === "critical" ? "text-red-400" :
                  e.severity === "high" ? "text-orange-400" : "text-foreground-tertiary"
                }`}>{e.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const viewComponents: Record<AttackView, (props: any) => ReactNode> = {
  overview: (props) => <OverviewView {...props} />,
  actors: () => <ActorView />,
  timeline: () => <TimelineView />,
  analytics: () => <AnalyticsView />,
};

export function AttackMapPage() {
  const [activeView, setActiveView] = useState<AttackView>("overview");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const recruiterMode = useUIStore((s) => s.recruiterMode);

  const handleCountryClick = useCallback((code: string) => {
    setSelectedCountry((prev) => (prev === code ? null : code));
  }, []);

  const handleCountryHover = useCallback((code: string | null) => {
    setHoveredCountry(code);
  }, []);

  const Component = viewComponents[activeView];

  return (
    <PageTransition>
      <div className="min-h-screen pt-14 overflow-x-hidden">
        <div className="glass-card rounded-none rounded-b-xl border-t-0 sticky top-14 z-20">
            <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-3 text-foreground-tertiary hover:text-foreground transition-colors touch-action-manipulation shrink-0" style={{ minWidth: 44, minHeight: 44 }}>
                {sidebarCollapsed ? <IconMenu2 size={16} /> : <IconX size={16} />}
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <IconRadar size={14} className="text-cyan shrink-0" />
                <span className="text-xs font-mono text-foreground-secondary truncate">Attack Map</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">● LIVE</span>
            </div>
            <button
              onClick={() => useUIStore.getState().toggleRecruiterMode()}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors touch-action-manipulation ${
                recruiterMode ? "bg-cyan/10 border-cyan/30 text-cyan" : "bg-white/5 border-border/40 text-foreground-tertiary hover:text-foreground"
              }`}
              style={{ minHeight: 44 }}
            >
              {recruiterMode ? "Recruiter" : "Expert"}
            </button>
          </div>
        </div>

        <div className="flex">
          <Sidebar
            activeView={activeView}
            onViewChange={(v) => { setActiveView(v); setSelectedCountry(null); }}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <div className="flex-1 min-w-0 px-4 sm:px-6 pb-20 pt-4">
            {recruiterMode ? (
              <div className="glass-card p-6">
                <div className="max-w-2xl mx-auto text-center">
                  <IconGlobe size={24} className="text-cyan mx-auto mb-3" />
                  <h2 className="text-lg font-medium text-foreground mb-2">Global Cyber Attack Map</h2>
                  <p className="text-sm text-foreground-secondary mb-4 leading-relaxed">
                    This interactive global threat map demonstrates real-time 3D visualization, geospatial attack tracking,
                    threat actor profiling, and security analytics — built with Next.js, Three.js, and TypeScript.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                    {[
                      { label: "3D Rendering", value: "Three.js, react-three-fiber, drei" },
                      { label: "Animations", value: "Particle systems, animated arcs, trails" },
                      { label: "Data Layer", value: "20 countries, 16 attack events, 6 threat actors" },
                      { label: "Security Domain", value: "Geospatial threat intel, MITRE ATT&CK" },
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-lg bg-white/5 border border-border/40">
                        <div className="text-xs text-cyan font-mono uppercase tracking-wider mb-1">{item.label}</div>
                        <div className="text-xs text-foreground-secondary">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-foreground-tertiary mt-4 italic">
                    Switch to Expert mode in the command bar for full technical detail.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <span className="text-xs text-cyan font-mono tracking-wider uppercase">.threat-map / {activeView}</span>
                  <h2 className="text-xl sm:text-2xl font-light text-foreground mt-1 capitalize">
                    {activeView === "analytics" ? "Analytics & Statistics" : activeView}
                    <span className="text-xs font-mono text-foreground-tertiary ml-3 font-normal">{viewDescriptions[activeView]}</span>
                  </h2>
                </div>
                {Component({
                  selectedCountry,
                  hoveredCountry,
                  onCountryClick: handleCountryClick,
                  onCountryHover: handleCountryHover,
                  searchQuery,
                  onSearchChange: setSearchQuery,
                  severityFilter,
                  onSeverityChange: setSeverityFilter,
                  typeFilter,
                  onTypeChange: setTypeFilter,
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
