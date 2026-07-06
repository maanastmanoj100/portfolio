"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useUIStore } from "@/stores/ui-store";
import { PageTransition } from "@/components/layout/page-transition";
import { sidebarNav, severityColors } from "./dashboard-data";
import { OverviewMetrics, LiveAlertFeed, IncidentsPanel, EndpointsPanel } from "./dashboard-overview";
import { AlertTrendChart, DonutCharts, TopCountriesChart, AnalystActivityChart, ThreatTimeline, MitreMatrix, ThreatIntelPanel, NetworkTrafficPanel, AiThreatAssistant } from "./dashboard-charts";
import type { DashboardView } from "@/types";
import {
  IconRadar, IconBell, IconShieldCheck, IconGridDots, IconActivity, IconDeviceDesktop, IconBrain, IconClock,
  IconSearch, IconSettings, IconUser, IconX, IconMenu2, IconAlertTriangle,
} from "@tabler/icons-react";

const iconMap: Record<string, typeof IconRadar> = {
  radar: IconRadar, bell: IconBell, shield: IconShieldCheck, grid: IconGridDots,
  activity: IconActivity, monitor: IconDeviceDesktop, brain: IconBrain, clock: IconClock,
};

const viewDescriptions: Record<DashboardView, string> = {
  overview: "Real-time security operations center overview with key metrics and alerts",
  alerts: "Live alert feed with real-time threat detection events",
  incidents: "Active incident management and investigation tracking",
  mitre: "MITRE ATT&CK framework coverage and technique mapping",
  network: "Network traffic analysis and flow visualization",
  endpoints: "Endpoint security status and health monitoring",
  intel: "Threat intelligence feeds including CVEs, actors, and IOCs",
  timeline: "Chronological threat investigation timeline",
};

function TopCommandBar() {
  const activeView = useDashboardStore((s) => s.activeView);
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);
  const toggleSidebar = useDashboardStore((s) => s.toggleSidebar);
  const sidebarCollapsed = useDashboardStore((s) => s.sidebarCollapsed);
  const recruiterMode = useUIStore((s) => s.recruiterMode);
  const toggleRecruiter = useUIStore((s) => s.toggleRecruiterMode);
  const alerts = useDashboardStore((s) => s.alerts);
  const criticalAlerts = alerts.filter((a) => a.severity === "critical").length;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="glass-card rounded-none rounded-b-xl border-t-0 sticky top-14 z-20">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2.5 text-foreground-tertiary hover:text-foreground transition-colors">
            {sidebarCollapsed ? <IconMenu2 size={16} /> : <IconX size={16} />}
          </button>
          <div className="flex items-center gap-2">
            <IconRadar size={14} className="text-cyan" />
            <span className="text-xs font-mono text-foreground-secondary">Sentinel AI SOC</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">● LIVE</span>
          <span className="text-xs font-mono text-foreground-tertiary">{currentTime.toLocaleTimeString()}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 border border-border/40">
            <IconSearch size={12} className="text-foreground-tertiary" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alerts, incidents, IOCs..."
              className="w-44 bg-transparent text-xs text-foreground outline-none placeholder:text-foreground-tertiary/50"
            />
          </div>
          {criticalAlerts > 0 && (
            <div className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">
              <IconAlertTriangle size={11} />
              <span>{criticalAlerts} critical</span>
            </div>
          )}
          <button
            onClick={toggleRecruiter}
className={`text-xs font-mono px-2 py-2 rounded-lg border transition-colors ${
               recruiterMode ? "bg-cyan/10 border-cyan/30 text-cyan" : "bg-white/5 border-border/40 text-foreground-tertiary hover:text-foreground"
             }`}
          >
            {recruiterMode ? "Recruiter" : "Expert"}
          </button>
          <IconUser size={14} className="text-foreground-tertiary" />
          <IconSettings size={14} className="text-foreground-tertiary" />
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const activeView = useDashboardStore((s) => s.activeView);
  const setActiveView = useDashboardStore((s) => s.setActiveView);
  const collapsed = useDashboardStore((s) => s.sidebarCollapsed);
  const alerts = useDashboardStore((s) => s.alerts);
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const newCount = alerts.filter((a) => a.status === "new").length;

  return (
    <motion.nav
      animate={{ width: collapsed ? 56 : 176 }}
      className="hidden md:block shrink-0 overflow-hidden glass-card rounded-none border-l-0"
    >
      <div className="py-3 space-y-0.5">
        {sidebarNav.map((item) => {
          const Icon = iconMap[item.icon] || IconRadar;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as DashboardView)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all duration-200 ${
                isActive
                  ? "text-cyan bg-cyan/10 border-r-2 border-cyan"
                  : "text-foreground-tertiary hover:text-foreground hover:bg-white/[0.02] border-r-2 border-transparent"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={15} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="text-xs truncate flex-1">{item.label}</span>
                  {item.id === "alerts" && newCount > 0 && (
                    <span className="text-xs font-mono bg-red-500/20 text-red-400 px-1 py-0.5 rounded">{newCount}</span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}

function SimulatedBanner() {
  const show = useDashboardStore((s) => s.showSimulatedLabel);
  const setShow = useDashboardStore((s) => s.setShowSimulatedLabel);
  if (!show) return null;
  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-yellow-500/5 border border-yellow-500/15 mb-4">
      <div className="flex items-center gap-2 text-xs text-yellow-400/80">
        <IconAlertTriangle size={12} />
        <span>All data shown is simulated demo data for portfolio demonstration purposes unless connected to live telemetry.</span>
      </div>
      <button onClick={() => setShow(false)} className="text-yellow-400/40 hover:text-yellow-400/70 transition-colors">
        <IconX size={12} />
      </button>
    </div>
  );
}

function RecruiterPanel() {
  return (
    <div className="glass-card p-6 recruiter-highlight">
      <div className="max-w-2xl mx-auto text-center">
        <IconRadar size={24} className="text-cyan mx-auto mb-3" />
        <h2 className="text-lg font-medium text-foreground mb-2">Sentinel AI SOC Dashboard</h2>
        <p className="text-sm text-foreground-secondary mb-4 leading-relaxed">
          This interactive Security Operations Center (SOC) dashboard demonstrates full-stack engineering
          capabilities including real-time data visualization, state management, responsive design,
          and security domain expertise.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          {[
            { label: "Frontend", value: "Next.js, React, TypeScript, Tailwind CSS" },
            { label: "State", value: "Zustand, component composition" },
            { label: "Visualization", value: "SVG charts, animated counters, CSS gradients" },
            { label: "Security Domain", value: "SOC operations, MITRE ATT&CK, threat intel" },
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
  );
}

function OverviewView() {
  return (
    <div className="space-y-4">
      <OverviewMetrics />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><LiveAlertFeed /></div>
        <div className="space-y-4">
          <AiThreatAssistant />
          <NetworkTrafficPanel />
        </div>
      </div>
      <AlertTrendChart />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DonutCharts />
        <TopCountriesChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncidentsPanel />
        <ThreatTimeline />
      </div>
    </div>
  );
}

function AlertsView() {
  return <LiveAlertFeed />;
}

function IncidentsView() {
  return <IncidentsPanel />;
}

function MitreView() {
  return <MitreMatrix />;
}

function NetworkView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <NetworkTrafficPanel />
      <TopCountriesChart />
      <div className="lg:col-span-2"><AlertTrendChart /></div>
    </div>
  );
}

function EndpointsView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2"><EndpointsPanel /></div>
      <div>
        <AnalystActivityChart />
        <div className="mt-4"><AiThreatAssistant /></div>
      </div>
    </div>
  );
}

function IntelView() {
  return (
    <div className="space-y-4">
      <ThreatIntelPanel />
    </div>
  );
}

function TimelineView() {
  return <ThreatTimeline />;
}

const viewComponents: Record<DashboardView, () => ReactNode> = {
  overview: OverviewView,
  alerts: AlertsView,
  incidents: IncidentsView,
  mitre: MitreView,
  network: NetworkView,
  endpoints: EndpointsView,
  intel: IntelView,
  timeline: TimelineView,
};

function DashboardContent() {
  const activeView = useDashboardStore((s) => s.activeView);
  const recruiterMode = useUIStore((s) => s.recruiterMode);
  const Component = viewComponents[activeView];

  return (
    <div className="flex-1 min-w-0 px-4 sm:px-6 pb-20 pt-4">
      <SimulatedBanner />
      <div className="mb-4">
        <span className="text-xs text-cyan font-mono tracking-wider uppercase">.soc / {activeView}</span>
        <h2 className="text-xl sm:text-2xl font-light text-foreground mt-1 capitalize">
          {activeView === "mitre" ? "MITRE ATT&CK" : activeView === "intel" ? "Threat Intelligence" : activeView}
          <span className="text-xs font-mono text-foreground-tertiary ml-3 font-normal">{viewDescriptions[activeView]}</span>
        </h2>
      </div>
      {recruiterMode ? <RecruiterPanel /> : <Component />}
    </div>
  );
}

export function DashboardPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-14">
        <TopCommandBar />
        <div className="flex">
          <Sidebar />
          <DashboardContent />
        </div>
      </div>
    </PageTransition>
  );
}
