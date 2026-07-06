"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconLock, IconX, IconEye, IconEyeOff, IconRefresh,
  IconChartBar, IconAlertTriangle, IconKey, IconBolt,
  IconCategory, IconNetwork, IconServer, IconCpu, IconWorld,
  IconBulb,
} from "@tabler/icons-react";

function charPoolSize(pwd: string): number {
  let pool = 0;
  if (/[a-z]/.test(pwd)) pool += 26;
  if (/[A-Z]/.test(pwd)) pool += 26;
  if (/\d/.test(pwd)) pool += 10;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd)) pool += 32;
  return pool || 1;
}

function entropy(pwd: string): number {
  if (!pwd) return 0;
  return Math.round(Math.log2(charPoolSize(pwd)) * pwd.length * 10) / 10;
}

function strengthLabel(bits: number): string {
  if (bits < 20) return "Very Weak";
  if (bits < 36) return "Weak";
  if (bits < 60) return "Reasonable";
  if (bits < 128) return "Strong";
  return "Very Strong";
}

function strengthColor(bits: number): string {
  if (bits < 20) return "text-red-400";
  if (bits < 36) return "text-orange-400";
  if (bits < 60) return "text-amber-400";
  if (bits < 128) return "text-green-400";
  return "text-cyan-400";
}

function strengthBg(bits: number): string {
  if (bits < 20) return "bg-red-500";
  if (bits < 36) return "bg-orange-500";
  if (bits < 60) return "bg-amber-500";
  if (bits < 128) return "bg-green-500";
  return "bg-cyan-500";
}

function crackTime(bits: number): { online: string; offline: string; gpu: string; botnet: string } {
  const guesses = Math.pow(2, bits);
  const fmt = (n: number): string => {
    if (n < 60) return `${Math.round(n)}s`;
    if (n < 3600) return `${Math.round(n / 60)}m`;
    if (n < 86400) return `${Math.round(n / 3600)}h`;
    if (n < 31536000) return `${Math.round(n / 86400)}d`;
    if (n < 1e12) return `${Math.round(n / 31536000)}y`;
    return "centuries";
  };
  return {
    online: guesses === Infinity ? "∞" : fmt(guesses / 1000),
    offline: guesses === Infinity ? "∞" : fmt(guesses / 1e9),
    gpu: guesses === Infinity ? "∞" : fmt(guesses / 1e11),
    botnet: guesses === Infinity ? "∞" : fmt(guesses / 1e13),
  };
}

const COMMON_PASSWORDS = new Set([
  "password", "123456", "12345678", "qwerty", "abc123", "monkey",
  "letmein", "dragon", "111111", "baseball", "iloveyou", "trustno1",
  "sunshine", "master", "welcome", "shadow", "ashley", "football",
  "jesus", "michael", "ninja", "mustang", "password1", "admin",
  "passw0rd", "p@ssword", "p@ssw0rd", "qwerty123", "qwertyuiop",
  "asdfghjkl", "zxcvbnm", "123456789", "1234567890", "password123",
  "admin123", "root", "toor", "test", "guest", "temp",
]);

function isCommonPassword(pwd: string): string[] {
  const matches: string[] = [];
  const lower = pwd.toLowerCase();
  if (COMMON_PASSWORDS.has(lower)) matches.push("Common password list match");
  const keyboardRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  for (const row of keyboardRows) {
    for (let i = 0; i <= row.length - 3; i++) {
      const seq = row.slice(i, i + 3);
      if (lower.includes(seq)) { matches.push(`Keyboard pattern: "${seq}"`); break; }
    }
  }
  for (let i = 0; i <= lower.length - 3; i++) {
    const sub = lower.slice(i, i + 3);
    if (/^([a-z])\1{2,}$/.test(sub)) { matches.push(`Repeated letter: "${sub}"`); break; }
  }
  for (let i = 0; i <= lower.length - 3; i++) {
    const sub = lower.slice(i, i + 3);
    if (/^(\d)\1{2,}$/.test(sub)) { matches.push(`Repeated digit: "${sub}"`); break; }
  }
  const seqs = ["012", "123", "234", "345", "456", "567", "678", "789", "890", "abc", "bcd", "cde", "def", "efg", "fgh", "ghi", "hij", "ijk", "jkl", "klm", "lmn", "mno", "nop", "opq", "pqr", "qrs", "rst", "stu", "tuv", "uvw", "vwx", "wxy", "xyz"];
  for (const seq of seqs) {
    if (lower.includes(seq)) { matches.push(`Sequential: "${seq}"`); break; }
  }
  return matches;
}

function charDiversity(pwd: string): { label: string; count: number; active: boolean }[] {
  const lower = (pwd.match(/[a-z]/g) || []).length;
  const upper = (pwd.match(/[A-Z]/g) || []).length;
  const digits = (pwd.match(/\d/g) || []).length;
  const special = (pwd.match(/[^a-zA-Z0-9]/g) || []).length;
  return [
    { label: "Lowercase", count: lower, active: lower > 0 },
    { label: "Uppercase", count: upper, active: upper > 0 },
    { label: "Digits", count: digits, active: digits > 0 },
    { label: "Special", count: special, active: special > 0 },
  ];
}

function generatePassphrase(): string {
  const words = ["correct", "horse", "battery", "staple", "trout", "cloud", "river", "forest", "flame", "stone",
    "solar", "ocean", "silver", "copper", "thunder", "winter", "summer", "autumn", "spring", "bridge",
    "castle", "dragon", "eagle", "falcon", "garden", "harbor", "island", "jungle", "knight", "lighthouse",
    "meadow", "noble", "oracle", "palace", "quartz", "raven", "shield", "temple", "umbrella", "valley",
    "wizard", "anchor", "blossom", "crystal", "dagger", "ember", "frost", "goblet", "horizon", "ivory"];
  const selected: string[] = [];
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * words.length);
    selected.push(words[idx]);
  }
  const num = Math.floor(Math.random() * 999);
  return selected.join("-") + num;
}

function generateRandomPassword(length: number = 16): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const all = upper + lower + digits + special;
  let pwd = "";
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += special[Math.floor(Math.random() * special.length)];
  for (let i = 4; i < length; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  return pwd.split("").sort(() => Math.random() - 0.5).join("");
}

interface CrackerProps {
  onClose?: () => void;
  reducedMotion?: boolean;
}

type ViewState = "input" | "analyzing" | "result";

export default function PasswordCracker({ onClose, reducedMotion = false }: CrackerProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("input");
  const [analyzing, setAnalyzing] = useState(false);

  const flags = useMemo(() => {
    if (!password) return null;
    return {
      entropy: entropy(password),
      pool: charPoolSize(password),
      label: strengthLabel(entropy(password)),
      color: strengthColor(entropy(password)),
      diversity: charDiversity(password),
      common: isCommonPassword(password),
      times: crackTime(entropy(password)),
      length: password.length,
    };
  }, [password]);

  const meterPercent = useMemo(() => {
    if (!flags) return 0;
    return Math.min(100, (flags.entropy / 128) * 100);
  }, [flags]);

  const suggestions = useMemo(() => {
    if (!flags) return [];
    const tips: string[] = [];
    if (flags.length < 12) tips.push(`Increase length to 12+ characters (currently ${flags.length})`);
    if (!flags.diversity.some(d => d.active && d.label === "Uppercase")) tips.push("Add uppercase letters");
    if (!flags.diversity.some(d => d.active && d.label === "Digits")) tips.push("Add digits");
    if (!flags.diversity.some(d => d.active && d.label === "Special")) tips.push("Add special characters");
    if (flags.common.length > 0) tips.push("Avoid common words, keyboard patterns, and sequences");
    if (flags.entropy < 60) tips.push("Use a passphrase of 4+ random words for memorizable strength");
    return tips;
  }, [flags]);

  const handleAnalyze = useCallback(() => {
    if (!password) return;
    setAnalyzing(true);
    setViewState("analyzing");
    const delay = reducedMotion ? 50 : 800;
    setTimeout(() => {
      setAnalyzing(false);
      setViewState("result");
    }, delay);
  }, [password, reducedMotion]);

  const handleReset = useCallback(() => {
    setPassword("");
    setViewState("input");
  }, []);

  useEffect(() => {
    if (viewState === "input" && password) {
      const timer = setTimeout(() => {
        handleAnalyze();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [password, viewState, handleAnalyze]);

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs mb-2">
              <IconLock size={12} /> Password Cracker Simulator
            </div>
            <h1 className="text-xl font-bold">Educational Password Analysis</h1>
            <p className="text-sm text-muted-foreground">Learn how password strength works — no passwords are stored or transmitted</p>
          </div>
          <div className="flex items-center gap-2">
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <IconX size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Input Section */}
        <GlassCard glow="none" className={cn("p-6 mb-6 transition-all duration-500", viewState === "result" && "opacity-60")}>
          <div className="space-y-4">
            <div>
              <label htmlFor="pwd-input" className="block text-xs font-mono text-muted-foreground mb-1.5">
                Enter a password to analyze
              </label>
              <div className="relative">
                <input
                  id="pwd-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (viewState !== "input") setViewState("input"); }}
                  placeholder="Type a password..."
                  className="w-full px-4 py-3 pr-20 rounded-xl bg-white/5 border border-white/10 text-sm font-mono focus:outline-none focus:border-cyan-500/40 transition-all placeholder:text-muted-foreground/40"
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="pwd-hint"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                  <button
                    onClick={() => { setPassword(generateRandomPassword()); setViewState("input"); }}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-cyan-400 transition-all"
                    aria-label="Generate random password"
                    title="Generate random password"
                    tabIndex={-1}
                  >
                    <IconRefresh size={16} />
                  </button>
                </div>
              </div>
              <p id="pwd-hint" className="text-xs text-muted-foreground/50 mt-1">
                Your password stays local — never sent anywhere
              </p>
            </div>

            {password && viewState === "input" && (
              <div className="flex justify-center">
                <Button variant="primary" size="sm" onClick={handleAnalyze}>
                  <IconLock size={14} className="mr-1.5" /> Analyze Strength
                </Button>
              </div>
            )}

            {/* Quick stats while typing */}
            {password && viewState === "input" && flags && (
              <div className="flex items-center gap-4 flex-wrap text-xs font-mono text-muted-foreground">
                <span>Length: <span className="text-foreground">{flags.length}</span></span>
                <span>Entropy: <span className={flags.color}>{flags.entropy} bits</span></span>
                <span>Strength: <span className={flags.color}>{flags.label}</span></span>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Analysis / Results */}
        <AnimatePresence mode="wait">
          {viewState === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
            >
              <GlassCard glow="cyan" className="p-12 text-center">
                <motion.div
                  animate={reducedMotion ? {} : { rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="inline-block"
                >
                  <IconLock size={40} className="text-cyan-400 mx-auto mb-4" />
                </motion.div>
                <p className="text-sm font-mono text-muted-foreground">Analyzing password strength...</p>
              </GlassCard>
            </motion.div>
          )}

          {viewState === "result" && flags && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: reducedMotion ? 0 : 0.4 }}
              className="space-y-6"
            >
              {/* Strength Overview */}
              <GlassCard glow={flags.entropy >= 60 ? "cyan" : flags.entropy >= 36 ? "amber" : "none"} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold mb-1">Password Strength</h2>
                    <p className="text-xs font-mono text-muted-foreground">{password.replace(/./g, "•")}</p>
                  </div>
                  <div className={cn("text-right", flags.color)}>
                    <div className="text-2xl font-bold">{flags.label}</div>
                    <div className="text-xs font-mono">{flags.entropy} bits entropy</div>
                  </div>
                </div>

                {/* Strength Meter */}
                <div className="h-3 rounded-full bg-white/5 overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${meterPercent}%` }}
                    transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }}
                    className={cn("h-full rounded-full transition-colors", strengthBg(flags.entropy))}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-muted-foreground">
                  <span>0 bits</span>
                  <span>28</span>
                  <span>36</span>
                  <span>60</span>
                  <span>128+ bits</span>
                </div>

                {/* Animated Visual */}
                <div className="mt-6 flex justify-center">
                  {flags.entropy < 36 ? (
                    <GlassBreakEffect key={password} reducedMotion={reducedMotion} />
                  ) : (
                    <GlowingVault key={password} level={flags.entropy >= 128 ? "very-strong" : flags.entropy >= 60 ? "strong" : "moderate"} reducedMotion={reducedMotion} />
                  )}
                </div>
              </GlassCard>

              {/* Character Diversity */}
              <GlassCard glow="none" className="p-6">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <IconCategory size={14} className="text-cyan-400" /> Character Diversity
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {flags.diversity.map((d) => (
                    <div key={d.label} className={cn("p-3 rounded-xl border transition-all", d.active ? "border-white/10 bg-white/5" : "border-white/5 bg-white/[0.02] opacity-40")}>
                      <div className={cn("text-lg font-bold", d.active ? "text-foreground" : "text-muted-foreground")}>{d.count}</div>
                      <div className="text-xs font-mono text-muted-foreground">{d.label}</div>
                      {d.active && <div className="text-xs text-green-400 mt-0.5">✓</div>}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Time Estimates */}
              <GlassCard glow="none" className="p-6">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <IconChartBar size={14} className="text-amber-400" /> Estimated Crack Time
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "Online (slow hash)", key: "online" as const, rate: "1,000/s", icon: <IconNetwork size={14} /> },
                    { label: "Offline (fast hash)", key: "offline" as const, rate: "1B/s", icon: <IconServer size={14} /> },
                    { label: "GPU Cracking", key: "gpu" as const, rate: "100B/s", icon: <IconCpu size={14} /> },
                    { label: "Botnet", key: "botnet" as const, rate: "10T/s", icon: <IconWorld size={14} /> },
                  ].map((item) => (
                    <div key={item.key} className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        {item.icon}
                        <span>{item.rate}</span>
                      </div>
                      <div className={cn("text-base font-bold font-mono", flags.times[item.key] === "∞" || flags.times[item.key].includes("centuries") ? "text-green-400" : flags.times[item.key].includes("s") && parseInt(flags.times[item.key]) < 60 ? "text-red-400" : "text-amber-400")}>
                        {flags.times[item.key]}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Warnings & Flags */}
              {flags.common.length > 0 && (
                <GlassCard glow="none" className="p-6 border-red-500/20">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-red-400">
                    <IconAlertTriangle size={14} /> Pattern Detection
                  </h3>
                  <ul className="space-y-1.5">
                    {flags.common.map((w, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-red-400/80">
                        <IconX size={10} className="shrink-0" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <GlassCard glow="none" className="p-6">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <IconBulb size={14} className="text-amber-400" /> How to Improve
                  </h3>
                  <ul className="space-y-1.5">
                    {suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-green-400 mt-0.5">→</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )}

              {/* Recommended Passphrase */}
              <GlassCard glow="cyan" className="p-6">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <IconKey size={14} className="text-cyan-400" /> Recommended Passphrase
                </h3>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-cyan-400 break-all mb-3">
                  {generatePassphrase()}
                </div>
                <p className="text-xs text-muted-foreground">
                  A passphrase of 4+ random words is memorable yet strong. Add numbers or symbols for extra security.
                </p>
              </GlassCard>

              {/* Actions */}
              <div className="flex items-center gap-3 justify-center">
                <Button variant="primary" size="md" onClick={handleReset}>
                  <IconRefresh size={14} className="mr-1.5" /> Try Another
                </Button>
                <Button variant="glass" size="md" onClick={() => {
                  setPassword(generateRandomPassword());
                  setViewState("input");
                  setTimeout(() => handleAnalyze(), 100);
                }}>
                  <IconBolt size={14} className="mr-1.5" /> Test Random
                </Button>
                <Button variant="ghost" size="md" onClick={() => setPassword(generatePassphrase())}>
                  <IconKey size={14} className="mr-1.5" /> Use Passphrase
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!password && viewState === "input" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <IconLock size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to analyze</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Type a password above to see its entropy, crack time estimates, and personalized improvement tips.
              All analysis happens locally in your browser.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button variant="glass" size="sm" onClick={() => { setPassword("password123"); setViewState("input"); }}>
                Test &quot;password123&quot;
              </Button>
              <Button variant="glass" size="sm" onClick={() => { const p = generateRandomPassword(); setPassword(p); setViewState("input"); }}>
                Generate Random
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function GlassBreakEffect({ reducedMotion }: { reducedMotion: boolean }) {
  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 30) + Math.random() * 20,
      distance: 40 + Math.random() * 80,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 0.2,
    })), []);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center" role="img" aria-label="Weak password glass break effect">
      <motion.div
        initial={reducedMotion ? {} : { scale: 1, opacity: 1 }}
        animate={reducedMotion ? {} : { scale: [1, 1.1, 0], opacity: [1, 0.8, 0] }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <IconLock size={48} className="text-red-400" />
      </motion.div>
      {!reducedMotion && particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle * Math.PI / 180) * p.distance,
            y: Math.sin(p.angle * Math.PI / 180) * p.distance,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.5, delay: p.delay, ease: "easeOut" }}
          className="absolute w-1.5 h-1.5 rounded-full bg-red-400/60"
          style={{ width: p.size, height: p.size }}
        />
      ))}
      {!reducedMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-xl"
        />
      )}
    </div>
  );
}

function GlowingVault({ level, reducedMotion }: { level: "moderate" | "strong" | "very-strong"; reducedMotion: boolean }) {
  const colors = {
    moderate: { lock: "text-amber-400", glow: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/30" },
    strong: { lock: "text-green-400", glow: "from-green-500/20 to-cyan-500/20", border: "border-green-500/30" },
    "very-strong": { lock: "text-cyan-400", glow: "from-cyan-500/20 to-purple-500/20", border: "border-cyan-500/30" },
  };
  const c = colors[level];

  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    })), []);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center" role="img" aria-label={`${level} password vault effect`}>
      {!reducedMotion && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className={cn("absolute inset-2 rounded-full bg-gradient-to-br blur-2xl", c.glow)}
        />
      )}
      {!reducedMotion && particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/40"
          style={{ width: p.size * 2, height: p.size * 2, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
      <motion.div
        animate={reducedMotion ? {} : { y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className={cn("p-4 rounded-2xl border backdrop-blur-sm bg-white/5", c.border)}
      >
        <IconLock size={40} className={c.lock} />
      </motion.div>
    </div>
  );
}

