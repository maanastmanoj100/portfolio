"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconShield, IconAlertTriangle, IconCheck, IconX,
  IconSearch, IconFlag, IconBolt, IconTrophy,
  IconRefresh, IconPlayerPlay, IconBrain,
  IconFlame, IconStar, IconLock, IconBug,
  IconUser, IconWorld, IconSkull, IconShieldCheck,
  IconArrowUp,
} from "@tabler/icons-react";

type Severity = "low" | "medium" | "high" | "critical";
type Action = "investigate" | "ignore" | "escalate" | "close";
type GamePhase = "menu" | "playing" | "gameover";

interface SocAlert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  source: string;
  timestamp: string;
  techniqueId: string;
  techniqueName: string;
  tactic: string;
  correctAction: Action;
  explanation: string;
  timeLimit: number;
}

interface CompletedAlert extends SocAlert {
  chosenAction: Action;
  correct: boolean;
  timeMs: number;
}

const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; label: string; points: number }> = {
  low:     { color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20", label: "Low", points: 50 },
  medium:  { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "Medium", points: 100 },
  high:    { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", label: "High", points: 150 },
  critical:{ color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Critical", points: 200 },
};

const CORRECT_ACTION_LABELS: Record<Action, string> = {
  investigate: "Investigate",
  ignore: "Ignore",
  escalate: "Escalate",
  close: "Close",
};

const ALERTS: SocAlert[] = [
  // Brute Force
  { id: "bf1", title: "SSH Brute Force Attempt", description: "1,247 failed SSH login attempts from 203.0.113.45 in 5 minutes targeting root account", severity: "high", source: "SSH Server", timestamp: "12:03:14", techniqueId: "T1110", techniqueName: "Brute Force", tactic: "Credential Access", correctAction: "escalate", explanation: "Multiple failed SSH logins indicate an active brute force attack. Escalate to block the source IP and investigate for compromised accounts.", timeLimit: 15 },
  { id: "bf2", title: "RDP Brute Force Spike", description: "Unusual spike in RDP authentication failures from internal workstation 10.0.1.50", severity: "medium", source: "Windows Event Log", timestamp: "12:15:22", techniqueId: "T1110", techniqueName: "Brute Force", tactic: "Credential Access", correctAction: "investigate", explanation: "Internal RDP brute force may indicate a compromised workstation or malware spreading laterally. Investigate the source host.", timeLimit: 18 },
  { id: "bf3", title: "Single Failed Login", description: "Single failed login attempt for user 'jsmith' from known office IP", severity: "low", source: "Auth Log", timestamp: "12:05:44", techniqueId: "T1110", techniqueName: "Brute Force", tactic: "Credential Access", correctAction: "ignore", explanation: "A single failed login from a known IP is likely a typo. No action needed unless patterns emerge.", timeLimit: 12 },
  // SQL Injection
  { id: "sq1", title: "SQL Injection Payload Detected", description: "Web application firewall blocked ' OR 1=1 -- in login parameter from 198.51.100.23", severity: "critical", source: "WAF", timestamp: "12:07:31", techniqueId: "T1190", techniqueName: "SQL Injection", tactic: "Initial Access", correctAction: "escalate", explanation: "SQL injection attempts target database extraction. Escalate immediately to review WAF rules and check for data exfiltration.", timeLimit: 12 },
  { id: "sq2", title: "Suspicious SQL Query", description: "Database query returning unusually large result set from application user", severity: "high", source: "Database Monitor", timestamp: "12:11:05", techniqueId: "T1190", techniqueName: "SQL Injection", tactic: "Initial Access", correctAction: "investigate", explanation: "Large result sets from a single query may indicate successful data extraction. Investigate the query and affected tables.", timeLimit: 15 },
  { id: "sq3", title: "SQL Error in Logs", description: "SQL syntax error in application logs — likely a failed injection attempt", severity: "low", source: "App Logs", timestamp: "12:09:18", techniqueId: "T1190", techniqueName: "SQL Injection", tactic: "Initial Access", correctAction: "close", explanation: "Failed SQL injection attempts blocked by WAF are routine. Close and monitor for repeated attempts from same source.", timeLimit: 12 },
  // Impossible Travel
  { id: "it1", title: "Impossible Travel Alert", description: "User 'alice@corp.com' logged in from New York and Tokyo within 15 minutes", severity: "high", source: "Identity Provider", timestamp: "12:04:52", techniqueId: "T1078", techniqueName: "Impossible Travel", tactic: "Credential Access", correctAction: "escalate", explanation: "Impossible geographic travel indicates stolen credentials. Escalate to force password reset and review active sessions.", timeLimit: 14 },
  { id: "it2", title: "VPN Login from New Region", description: "User 'bob@corp.com' connected via VPN from a region not in their travel history", severity: "medium", source: "VPN Gateway", timestamp: "12:13:09", techniqueId: "T1078", techniqueName: "Impossible Travel", tactic: "Credential Access", correctAction: "investigate", explanation: "A new region login may be legitimate travel or credential theft. Investigate by contacting the user and reviewing past patterns.", timeLimit: 18 },
  { id: "it3", title: "Known Travel Pattern", description: "User 'carol@corp.com' logged in from home city — matches usual pattern", severity: "low", source: "GeoIP Service", timestamp: "12:01:33", techniqueId: "T1078", techniqueName: "Impossible Travel", tactic: "Credential Access", correctAction: "close", explanation: "Logins matching established geolocation patterns are normal. Close as benign.", timeLimit: 10 },
  // Suspicious Login
  { id: "sl1", title: "Login from Tor Exit Node", description: "User 'dave@corp.com' authenticated from a known Tor exit node IP", severity: "high", source: "Auth0", timestamp: "12:06:27", techniqueId: "T1090", techniqueName: "Proxy", tactic: "Defense Evasion", correctAction: "investigate", explanation: "Tor access may indicate an adversary anonymizing their traffic. Investigate the user's activity and verify with them directly.", timeLimit: 15 },
  { id: "sl2", title: "After-Hours Login", description: "User 'eve@corp.com' logged in at 3:14 AM — outside normal working hours", severity: "medium", source: "AD Federation", timestamp: "12:10:44", techniqueId: "T1078", techniqueName: "Valid Accounts", tactic: "Defense Evasion", correctAction: "investigate", explanation: "After-hours logins can indicate compromise or legitimate off-hours work. Investigate recent activity and verify with the user.", timeLimit: 14 },
  { id: "sl3", title: "Failed MFA Challenge", description: "User 'frank@corp.com' failed MFA challenge twice then succeeded on third attempt", severity: "medium", source: "MFA Provider", timestamp: "12:08:55", techniqueId: "T1110", techniqueName: "Brute Force", tactic: "Credential Access", correctAction: "investigate", explanation: "Failed MFA followed by success could indicate token theft or user error. Investigate device and location details.", timeLimit: 16 },
  // Malware
  { id: "ma1", title: "Ransomware File Extension Detection", description: "Multiple .encrypted files detected on file share \\FS01\Shared — suspected ransomware", severity: "critical", source: "EDR", timestamp: "12:02:11", techniqueId: "T1486", techniqueName: "Data Encrypted for Impact", tactic: "Impact", correctAction: "escalate", explanation: "Ransomware file extensions indicate active encryption. Escalate for immediate containment — isolate the affected host and shares.", timeLimit: 10 },
  { id: "ma2", title: "Suspicious PowerShell Execution", description: "PowerShell running encoded command from Office process on workstation WKS-045", severity: "high", source: "Sysmon", timestamp: "12:12:38", techniqueId: "T1059", techniqueName: "Command and Scripting Interpreter", tactic: "Execution", correctAction: "investigate", explanation: "Encoded PowerShell from Office suggests macro-based malware. Investigate the workstation for persistence mechanisms.", timeLimit: 14 },
  { id: "ma3", title: "Antivirus Quarantine Alert", description: "AV quarantined suspicious file downloaded from marketing email campaign", severity: "medium", source: "Defender AV", timestamp: "12:04:19", techniqueId: "T1204", techniqueName: "User Execution", tactic: "Execution", correctAction: "close", explanation: "AV successfully quarantined the threat. Close and verify no other systems were affected by the same campaign.", timeLimit: 12 },
  // Privilege Escalation
  { id: "pe1", title: "LSASS Memory Access Detected", description: "Process 'mimikatz.exe' attempting to read LSASS memory on DC-01", severity: "critical", source: "EDR", timestamp: "12:01:05", techniqueId: "T1003", techniqueName: "LSASS Memory", tactic: "Credential Access", correctAction: "escalate", explanation: "LSASS memory access indicates credential dumping. Escalate for immediate incident response — the domain controller is compromised.", timeLimit: 10 },
  { id: "pe2", title: "Unauthorized Admin Group Addition", description: "Standard user added to Domain Admins group from unknown source", severity: "high", source: "AD Audit Log", timestamp: "12:14:22", techniqueId: "T1068", techniqueName: "Exploitation for Privilege Escalation", tactic: "Privilege Escalation", correctAction: "escalate", explanation: "Unauthorized privilege escalation to Domain Admins is a critical security event. Escalate and revert the change immediately.", timeLimit: 12 },
  { id: "pe3", title: "Service Installation Alert", description: "Unknown service 'SysUpdateSvc' installed on server WEB-03 by non-admin script", severity: "high", source: "Windows Event Log", timestamp: "12:09:41", techniqueId: "T1543", techniqueName: "Create or Modify System Process", tactic: "Persistence", correctAction: "investigate", explanation: "Unexpected service installation may indicate persistence. Investigate the service binary and installation source.", timeLimit: 15 },
  { id: "pe4", title: "UAC Bypass Attempt", description: "Event ID 1052 — UAC bypass technique detected on engineering workstation", severity: "medium", source: "Security Log", timestamp: "12:07:03", techniqueId: "T1548", techniqueName: "Abuse Elevation Control Mechanism", tactic: "Privilege Escalation", correctAction: "investigate", explanation: "UAC bypass attempts often precede privilege escalation. Investigate the workstation for related indicators.", timeLimit: 15 },
  { id: "pe5", title: "Scheduled Task Created", description: "Task 'GoogleUpdateTask' created by non-admin user on terminal server", severity: "medium", source: "Task Scheduler Log", timestamp: "12:11:59", techniqueId: "T1053", techniqueName: "Scheduled Task", tactic: "Persistence", correctAction: "investigate", explanation: "Scheduled tasks are a common persistence mechanism. Investigate the task action and creation context.", timeLimit: 14 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a;
}

const DIFFICULTY_CONFIG = {
  easy:   { label: "Easy",   color: "text-green-400", timeMul: 1.5, spawnInterval: 4000, maxAlerts: 12 },
  medium: { label: "Medium", color: "text-amber-400", timeMul: 1.0, spawnInterval: 3000, maxAlerts: 16 },
  hard:   { label: "Hard",   color: "text-red-400",   timeMul: 0.7, spawnInterval: 2200, maxAlerts: 20 },
};

export default function SocAlertRush() {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [alerts, setAlerts] = useState<SocAlert[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<CompletedAlert[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [showingResult, setShowingResult] = useState(false);
  const [lastResult, setLastResult] = useState<{ alert: SocAlert; action: Action; correct: boolean } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [alertStartTime, setAlertStartTime] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const current = alerts[currentIdx];
  const config = DIFFICULTY_CONFIG[difficulty];

  const startGame = useCallback((diff: "easy" | "medium" | "hard") => {
    const pool = shuffle(ALERTS).slice(0, DIFFICULTY_CONFIG[diff].maxAlerts);
    setDifficulty(diff);
    setAlerts(pool);
    setCurrentIdx(0);
    setCompleted([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setShowingResult(false);
    setLastResult(null);
    setTimeLeft(pool[0]?.timeLimit * DIFFICULTY_CONFIG[diff].timeMul || 15);
    setAlertStartTime(Date.now());
    setTotalCorrect(0);
    setPhase("playing");
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "playing" || !current || showingResult) return;
    const start = Date.now();
    const limit = current.timeLimit * config.timeMul * 1000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, Math.round((limit - elapsed) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        handleAction("ignore" as Action);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [phase, current?.id, showingResult, difficulty]);

  const handleAction = useCallback((action: Action) => {
    if (!current || showingResult) return;
    const timeMs = Date.now() - alertStartTime;
    const correct = action === current.correctAction;
    const pts = correct ? SEVERITY_CONFIG[current.severity].points * (1 + combo * 0.1) : -50;
    const newCombo = correct ? combo + 1 : 0;

    if (correct) {
      setScore(s => Math.max(0, Math.round(s + pts)));
      setCombo(newCombo);
      setMaxCombo(m => Math.max(m, newCombo));
      setTotalCorrect(t => t + 1);
    } else {
      setLives(l => {
        if (l - 1 <= 0) setTimeout(() => setPhase("gameover"), 300);
        return Math.max(0, l - 1);
      });
      setCombo(0);
    }

    setCompleted(prev => [...prev, { ...current, chosenAction: action, correct, timeMs }]);
    setLastResult({ alert: current, action, correct });
    setShowingResult(true);
    setAlertStartTime(Date.now());

    setTimeout(() => {
      setShowingResult(false);
      setLastResult(null);
      if (lives - (correct ? 0 : 1) <= 0) { setPhase("gameover"); return; }
      const next = currentIdx + 1;
      if (next >= alerts.length) { setPhase("gameover"); return; }
      setCurrentIdx(next);
    }, 3000);
  }, [current, showingResult, combo, alertStartTime, lives, currentIdx, alerts.length]);

  const accuracy = completed.length > 0 ? Math.round((totalCorrect / completed.length) * 100) : 0;

  // Achievements
  const achievements = useMemo(() => {
    if (completed.length === 0) return [];
    return [
      { label: "First Triage", unlocked: completed.length >= 1, icon: IconFlag },
      { label: "SOC Pro", unlocked: totalCorrect >= 10, icon: IconShield },
      { label: "Combo King", unlocked: maxCombo >= 5, icon: IconFlame },
      { label: "Perfect Round", unlocked: completed.length >= 6 && completed.every(a => a.correct), icon: IconStar },
      { label: "Speed Analyst", unlocked: completed.some(a => a.correct && a.timeMs < 5000), icon: IconBolt },
      { label: "Critical Thinker", unlocked: completed.filter(a => a.correct && a.severity === "critical").length >= 3, icon: IconBrain },
    ].filter(a => a.unlocked);
  }, [completed, totalCorrect, maxCombo]);

  const accuracyColor = accuracy >= 80 ? "text-green-400" : accuracy >= 50 ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
              <IconShield size={10} /> SOC Alert Rush
            </div>
            {phase === "playing" && (
              <span className={cn("text-xs font-mono px-2 py-0.5 rounded-full", config.color + " bg-white/5")}>
                {config.label}
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        {phase === "menu" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 mb-6">
              <IconShield size={48} className="text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">SOC Alert Rush</h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8">
              Alerts are flooding your SIEM. Investigate, escalate, or close each alert based on your SOC expertise.
              Every decision impacts your score. Can you handle the rush?
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
              {(["easy", "medium", "hard"] as const).map(d => (
                <button key={d} onClick={() => startGame(d)}
                  className={cn("p-4 rounded-xl border bg-white/5 hover:bg-white/10 transition-all text-center capitalize",
                    d === "easy" ? "border-green-500/20 text-green-400" :
                    d === "medium" ? "border-amber-500/20 text-amber-400" : "border-red-500/20 text-red-400")}>
                  <div className="text-lg font-bold">{d}</div>
                  <div className="text-xs text-muted-foreground mt-1">{DIFFICULTY_CONFIG[d].maxAlerts} alerts</div>
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>🔍 Investigate · 🚨 Escalate · ✅ Close · ⏭️ Ignore</p>
              <p>📊 MITRE ATT&CK mapped · ⏱️ Time-based scoring</p>
            </div>
          </motion.div>
        )}

        {/* Playing */}
        {phase === "playing" && (
          <>
            {/* HUD */}
            <GlassCard glow="none" className="p-3 mb-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-4">
                  <span>Score: <span className="text-cyan-400 font-bold">{score}</span></span>
                  <span>Combo: <span className="text-orange-400 font-bold">×{combo}</span></span>
                  <span>Alert: <span className="text-purple-400 font-bold">{currentIdx + 1}/{alerts.length}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    {Array.from({ length: lives }, (_, i) => <span key={i} className="w-2 h-2 rounded-full bg-green-400 inline-block" />)}
                  </span>
                  <span className={cn("font-bold", timeLeft <= 5 ? "text-red-400" : "text-muted-foreground")}>
                    ⏱ {timeLeft}s
                  </span>
                </div>
              </div>
              <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", timeLeft <= 5 ? "bg-red-500" : "bg-gradient-to-r from-cyan-500 to-purple-500")}
                  style={{ width: `${((currentIdx) / alerts.length) * 100}%` }} />
              </div>
            </GlassCard>

            {/* SIEM Dashboard Card */}
            <AnimatePresence mode="wait">
              {current && !showingResult && (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25 }}
                >
                  <GlassCard glow="none" className="p-6 overflow-hidden relative">
                    {/* Scanline overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
                      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)",
                    }} />

                    {/* Alert header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", SEVERITY_CONFIG[current.severity].bg)}>
                          {current.severity === "critical" ? <IconSkull size={20} className="text-red-400" /> :
                           current.severity === "high" ? <IconAlertTriangle size={20} className="text-orange-400" /> :
                           current.severity === "medium" ? <IconBug size={20} className="text-amber-400" /> :
                           <IconShield size={20} className="text-slate-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold">{current.title}</h2>
                            <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-mono", SEVERITY_CONFIG[current.severity].color, SEVERITY_CONFIG[current.severity].bg)}>
                              {current.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{current.description}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground font-mono whitespace-nowrap">
                        <div>{current.timestamp}</div>
                        <div>{current.source}</div>
                      </div>
                    </div>

                    {/* MITRE ATT&CK */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-400">
                        <IconFlag size={8} /> {current.techniqueId}
                      </div>
                      <span className="text-xs text-muted-foreground">{current.techniqueName}</span>
                      <span className="text-xs text-muted-foreground opacity-40">|</span>
                      <span className="text-xs text-muted-foreground">{current.tactic}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {(["investigate", "ignore", "escalate", "close"] as Action[]).map(action => {
                        const icons: Record<Action, typeof IconSearch> = {
                          investigate: IconSearch,
                          ignore: IconX,
                          escalate: IconArrowUp,
                          close: IconCheck,
                        };
                        const colors: Record<Action, string> = {
                          investigate: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20",
                          ignore: "bg-slate-500/10 border-slate-500/20 text-slate-400 hover:bg-slate-500/20",
                          escalate: "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20",
                          close: "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20",
                        };
                        const I = icons[action];
                        return (
                          <button key={action} onClick={() => handleAction(action)}
                            className={cn("p-2.5 rounded-xl border text-xs font-mono flex flex-col items-center gap-1 transition-all", colors[action])}>
                            <I size={14} />
                            {CORRECT_ACTION_LABELS[action]}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time bar */}
                    <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        key={current.id}
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: current.timeLimit * config.timeMul, ease: "linear" }}
                        className={cn("h-full rounded-full", timeLeft <= 5 ? "bg-red-500" : "bg-cyan-500")}
                      />
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result overlay */}
            <AnimatePresence>
              {showingResult && lastResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <GlassCard glow={lastResult.correct ? "green" : "none"} className={cn("p-5 border-2", lastResult.correct ? "border-green-500/30" : "border-red-500/30")}>
                    <div className="flex items-start gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", lastResult.correct ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                        {lastResult.correct ? <IconCheck size={18} /> : <IconX size={18} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm font-bold", lastResult.correct ? "text-green-400" : "text-red-400")}>
                            {lastResult.correct ? "Correct" : "Incorrect"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            You chose: {CORRECT_ACTION_LABELS[lastResult.action]}
                          </span>
                          {!lastResult.correct && (
                            <span className="text-xs text-cyan-400">
                              Correct: {CORRECT_ACTION_LABELS[lastResult.alert.correctAction]}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <IconBrain size={12} className="inline mr-1 text-cyan-400" />
                          {lastResult.alert.explanation}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-mono">
                          <span>{lastResult.alert.techniqueId} — {lastResult.alert.techniqueName}</span>
                          <span>·</span>
                          <span>{lastResult.alert.tactic}</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active alerts feed */}
            <div className="mt-4">
              <div className="text-xs font-mono text-muted-foreground mb-2">Alert Feed</div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {completed.slice(-5).reverse().map(a => (
                  <div key={a.id + a.timeMs} className={cn("flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono border",
                    a.correct ? "bg-green-500/[0.03] border-green-500/10" : "bg-red-500/[0.03] border-red-500/10")}>
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", a.correct ? "bg-green-400" : "bg-red-400")} />
                    <span className="truncate text-muted-foreground">{a.title}</span>
                    <span className={cn("shrink-0", SEVERITY_CONFIG[a.severity].color)}>{a.severity}</span>
                    <span className={cn("shrink-0", a.correct ? "text-green-400" : "text-red-400")}>
                      {CORRECT_ACTION_LABELS[a.chosenAction]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Game Over */}
        {phase === "gameover" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard glow="cyan" className="p-8 text-center mb-6">
              <IconTrophy size={40} className="mx-auto text-amber-400 mb-4" />
              <h2 className="text-2xl font-bold mb-1">Shift Complete</h2>
              <p className="text-sm text-muted-foreground mb-6">Your SOC shift summary</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-6">
                <div className="p-3 rounded-xl bg-white/5"><div className="text-lg font-bold text-cyan-400">{score}</div><div className="text-xs text-muted-foreground">Score</div></div>
                <div className="p-3 rounded-xl bg-white/5"><div className={cn("text-lg font-bold", accuracyColor)}>{accuracy}%</div><div className="text-xs text-muted-foreground">Accuracy</div></div>
                <div className="p-3 rounded-xl bg-white/5"><div className="text-lg font-bold text-orange-400">{maxCombo}</div><div className="text-xs text-muted-foreground">Best Combo</div></div>
                <div className="p-3 rounded-xl bg-white/5"><div className="text-lg font-bold text-purple-400">{totalCorrect}/{completed.length}</div><div className="text-xs text-muted-foreground">Correct</div></div>
              </div>

              {/* Achievements */}
              {achievements.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs text-muted-foreground mb-2">Achievements Unlocked</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {achievements.map((a, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400">
                        <a.icon size={10} /> {a.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alerts Review */}
              <div className="text-left mb-6 max-h-60 overflow-y-auto">
                <div className="text-xs font-mono text-muted-foreground mb-2">Alert Review</div>
                <div className="space-y-1">
                  {completed.map(a => (
                    <div key={a.id + a.timeMs} className={cn("flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono border",
                      a.correct ? "bg-green-500/[0.03] border-green-500/10" : "bg-red-500/[0.03] border-red-500/10")}>
                      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", a.correct ? "bg-green-400" : "bg-red-400")} />
                      <span className="text-muted-foreground truncate">{a.title}</span>
                      <span className={cn("shrink-0", SEVERITY_CONFIG[a.severity].color)}>{a.severity}</span>
                      <span className="shrink-0 text-cyan-400">{a.techniqueId}</span>
                      <span className={cn("shrink-0", a.correct ? "text-green-400" : "text-red-400")}>{CORRECT_ACTION_LABELS[a.chosenAction]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="primary" size="md" onClick={() => startGame(difficulty)}>
                  <IconRefresh size={14} className="mr-1.5" /> New Shift
                </Button>
                <Button variant="glass" size="md" onClick={() => setPhase("menu")}>
                  Change Difficulty
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
