"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconShield, IconNetwork, IconServer, IconFlag,
  IconBolt, IconSnowflake, IconLock,
  IconAlertTriangle, IconCheck, IconX, IconTrophy,
  IconRefresh, IconPlayerPlay, IconArrowRight,
  IconFlame, IconBrain, IconStar,
} from "@tabler/icons-react";

type PacketType = "HTTP" | "HTTPS" | "DNS" | "SSH" | "ICMP" | "SMTP" | "DDoS" | "Malware" | "Scanner" | "Spoofed";
type Difficulty = "normal" | "hard" | "expert";
type PowerUp = "slowmo" | "firewall" | "freeze";
type GamePhase = "menu" | "playing" | "boss" | "round" | "gameover";

interface Packet {
  id: string;
  type: PacketType;
  malicious: boolean;
  x: number;
  y: number;
  progress: number;
  speed: number;
  status: "incoming" | "judging" | "allowed" | "blocked" | "missed";
  srcIp: string;
  dstIp: string;
  info: string;
}

interface PowerUpState {
  type: PowerUp;
  active: boolean;
  duration: number;
  remaining: number;
}

interface BossWave {
  packets: Packet[];
  spawned: number;
}

const PACKET_TYPES: Record<PacketType, { color: string; malicious: boolean; icon: string; desc: string }> = {
  HTTP:    { color: "text-blue-400",  malicious: false, icon: "🌐", desc: "Web traffic" },
  HTTPS:   { color: "text-green-400", malicious: false, icon: "🔒", desc: "Encrypted web" },
  DNS:     { color: "text-purple-400",malicious: false, icon: "📡", desc: "Name resolution" },
  SSH:     { color: "text-cyan-400",  malicious: false, icon: "💻", desc: "Secure shell" },
  ICMP:    { color: "text-amber-400", malicious: false, icon: "📶", desc: "Network ping" },
  SMTP:    { color: "text-pink-400",  malicious: false, icon: "📧", desc: "Email traffic" },
  DDoS:    { color: "text-red-500",   malicious: true,  icon: "💥", desc: "Flood attack" },
  Malware: { color: "text-green-800", malicious: true,  icon: "🦠", desc: "Malicious payload" },
  Scanner: { color: "text-orange-400",malicious: true,  icon: "🔍", desc: "Port scan" },
  Spoofed: { color: "text-yellow-400",malicious: true,  icon: "🎭", desc: "Spoofed source" },
};

const GOOD_TYPES: PacketType[] = ["HTTP", "HTTPS", "DNS", "SSH", "ICMP", "SMTP"];
const BAD_TYPES: PacketType[] = ["DDoS", "Malware", "Scanner", "Spoofed"];

const NODE_POSITIONS = [
  { id: "internet", label: "Internet", x: 8, y: 50 },
  { id: "gateway", label: "Gateway", x: 28, y: 50 },
  { id: "firewall", label: "Firewall", x: 50, y: 50 },
  { id: "internal", label: "Internal", x: 72, y: 50 },
  { id: "server", label: "Server", x: 92, y: 50 },
];

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4],
];

const BENIGN_IPS = ["10.0.1.25", "192.168.1.100", "172.16.0.50", "10.0.0.1", "8.8.8.8", "1.1.1.1"];
const MALICIOUS_IPS = ["45.33.32.156", "185.220.101.42", "91.121.87.34", "23.129.64.210", "5.188.62.18"];

function randIp(malicious: boolean): string {
  const pool = malicious ? MALICIOUS_IPS : BENIGN_IPS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function generatePacket(progress: number, speed: number, forceMalicious?: boolean): Packet {
  const malicious = forceMalicious !== undefined ? forceMalicious : Math.random() < 0.4;
  const typePool = malicious ? BAD_TYPES : GOOD_TYPES;
  const type = typePool[Math.floor(Math.random() * typePool.length)];
  const info = malicious
    ? ["Suspicious payload detected", "Known bad signature", "Anomalous traffic pattern", "Blacklisted source", "Zero-day exploit attempt"][Math.floor(Math.random() * 5)]
    : ["Normal traffic", "Routine request", "Expected behavior", "Whitelisted source", "Standard protocol"][Math.floor(Math.random() * 5)];
  return {
    id: `pkt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type, malicious, progress, speed,
    status: "incoming", x: NODE_POSITIONS[0].x, y: NODE_POSITIONS[0].y,
    srcIp: randIp(malicious),
    dstIp: randIp(false),
    info,
  };
}

const JUDGE_PROGRESS = 52;
const ALLOW_DEST_X = 72;
const BLOCK_DEST_X = 50;

const POWERUP_DURATION = { slowmo: 8000, firewall: 12000, freeze: 5000 };

const EDGE_EXPLANATIONS: Record<string, string> = {
  HTTP: "HTTP is unencrypted web traffic. While common, it should be monitored as data is sent in plaintext.",
  HTTPS: "HTTPS is encrypted web traffic using TLS. This is safe and should be allowed.",
  DNS: "DNS resolves domain names to IP addresses. Legitimate DNS traffic is essential for network operation.",
  SSH: "SSH provides encrypted remote access. While normally safe, monitor for unusual outbound SSH tunnels.",
  ICMP: "ICMP is used for network diagnostics (ping). Small amounts are normal, but floods indicate DDoS.",
  SMTP: "SMTP handles email delivery. Monitor for unusual volumes which may indicate spam relay.",
  DDoS: "DDoS attacks flood the network with traffic to overwhelm resources. Block immediately.",
  Malware: "Malware packets contain malicious payloads. Block and alert security team.",
  Scanner: "Port scanners probe for open ports and services. Block and investigate source.",
  Spoofed: "Spoofed packets have forged source IPs. This is a common evasion technique — block.",
};

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

export default function PacketDefender() {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [packets, setPackets] = useState<Packet[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [spawnInterval, setSpawnInterval] = useState(2000);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [powerUp, setPowerUp] = useState<PowerUpState | null>(null);
  const [judgingId, setJudgingId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{ correct: boolean; type: PacketType; explanation: string } | null>(null);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [bossWave, setBossWave] = useState<BossWave | null>(null);
  const [gameStats, setGameStats] = useState({ rounds: 0, bossWaves: 0, totalScore: 0 });
  const [alienPackets, setAlienPackets] = useState(0);
  const [blockedPackets, setBlockedPackets] = useState(0);

  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const effectTimerRef = useRef<number>(0);

  const baseSpeed = useMemo(() => {
    const speeds = { normal: 8, hard: 12, expert: 18 };
    return speeds[difficulty];
  }, [difficulty]);

  const spawnRate = useMemo(() => {
    const base = { normal: 2200, hard: 1600, expert: 1000 };
    return Math.max(600, base[difficulty] - level * 100);
  }, [difficulty, level]);

  const spawnBossWave = useCallback(() => {
    const count = 5 + level;
    const pkts: Packet[] = [];
    for (let i = 0; i < count; i++) {
      const pkt = generatePacket(-5 - i * 8, baseSpeed * 1.2, true);
      pkt.status = "incoming";
      pkts.push(pkt);
    }
    setBossWave({ packets: pkts, spawned: 0 });
    setPhase("boss");
  }, [baseSpeed, level]);

  const tick = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const dt = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;
    const clamped = Math.min(dt, 0.05);

    setPackets(prev => {
      const frozen = powerUp?.type === "freeze" && powerUp.active;
      const slowMo = powerUp?.type === "slowmo" && powerUp.active;
      const speedMul = frozen ? 0 : slowMo ? 0.4 : 1;

      const updated: Packet[] = prev
        .map((p): Packet => {
          if (p.status === "allowed") {
            return { ...p, x: p.x + 60 * clamped * speedMul, progress: p.progress + 30 * clamped * speedMul };
          }
          if (p.status === "blocked") return p;
          if (p.status === "missed") {
            return { ...p, x: p.x + 40 * clamped * speedMul, y: p.y + 20 * clamped * speedMul };
          }
          if (p.status === "judging") return p;

          const nx = p.x + p.speed * clamped * speedMul;
          const np = p.progress + p.speed * clamped * speedMul;
          if (np >= JUDGE_PROGRESS && p.status === "incoming") {
            return { ...p, x: nx, progress: np, status: "judging" as const };
          }
          if (np > 100) return { ...p, status: "missed" as const, x: nx, progress: np };
          return { ...p, x: nx, progress: np };
        })
        .filter(p => p.x < 110 && (p.status !== "missed" || p.y < 100));

      return updated;
    });

    animRef.current = requestAnimationFrame(tick);
  }, [powerUp]);

  useEffect(() => {
    if (phase === "playing" || phase === "boss") {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(animRef.current);
    }
  }, [phase, tick]);

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      const malicious = Math.random() < (0.3 + level * 0.03);
      setPackets(prev => [...prev, generatePacket(0, baseSpeed, malicious ? true : undefined)]);
      spawnTimerRef.current = 0;
    }, spawnRate);
    return () => clearInterval(interval);
  }, [phase, spawnRate, baseSpeed, level]);

  useEffect(() => {
    if (phase !== "playing") return;
    const check = setInterval(() => {
      setPackets(prev => {
        const missing = prev.filter(p => p.status === "incoming" && p.progress > 85);
        if (missing.length > 0) {
          setLives(l => {
            const n = l - missing.length;
            if (n <= 0) {
              setPhase("gameover");
              setGameStats(s => ({ ...s, totalScore: score }));
            }
            return Math.max(0, n);
          });
          setCombo(0);
        }
        return prev.map(p => p.progress > 85 && p.status === "incoming" ? { ...p, status: "missed" as const } : p);
      });
    }, 1000);
    return () => clearInterval(check);
  }, [phase, score]);

  useEffect(() => {
    if (powerUp?.active) {
      const timer = setTimeout(() => {
        setPowerUp(prev => prev ? { ...prev, active: false, remaining: 0 } : null);
      }, powerUp.remaining);
      return () => clearTimeout(timer);
    }
  }, [powerUp]);

  const judge = useCallback((allow: boolean) => {
    const judging = packets.find(p => p.status === "judging");
    if (!judging) return;

    const correct = allow ? !judging.malicious : judging.malicious;
    const points = correct ? (10 + combo * 2) * (judging.malicious ? 2 : 1) : -5;
    const newCombo = correct ? combo + 1 : 0;

    if (correct) {
      setScore(s => s + points);
      setCombo(newCombo);
      setMaxCombo(m => Math.max(m, newCombo));
      setTotalCorrect(t => t + 1);
      if (judging.malicious) setBlockedPackets(b => b + 1);
      else setAlienPackets(a => a + 1);
      if (newCombo % 5 === 0 && powerUp === null) {
        const types: PowerUp[] = ["slowmo", "firewall", "freeze"];
        const pick = types[Math.floor(Math.random() * types.length)];
        setPowerUp({ type: pick, active: true, duration: POWERUP_DURATION[pick], remaining: POWERUP_DURATION[pick] });
      }
      if (totalCorrect > 0 && totalCorrect % 10 === 0) {
        setLevel(l => l + 1);
      }
      if (totalCorrect > 0 && (totalCorrect + 1) % 15 === 0) {
        spawnBossWave();
      }
    } else {
      setLives(l => {
        if (l - 1 <= 0) setTimeout(() => setPhase("gameover"), 500);
        return Math.max(0, l - 1);
      });
      setCombo(0);
    }

    setPackets(prev => prev.map(p =>
      p.id === judging.id
        ? { ...p, status: (allow ? "allowed" : "blocked") as "allowed" | "blocked", x: allow ? ALLOW_DEST_X : BLOCK_DEST_X }
        : p
    ));
    setJudgingId(null);
    setLastResult({
      correct,
      type: judging.type,
      explanation: EDGE_EXPLANATIONS[judging.type] || "No additional info available.",
    });
    setShowRoundResult(true);
    setTimeout(() => setShowRoundResult(false), 3500);
  }, [packets, combo, powerUp, totalCorrect, spawnBossWave]);

  useEffect(() => {
    const j = packets.find(p => p.status === "judging");
    setJudgingId(j?.id || null);
  }, [packets]);

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setPhase("playing");
    setPackets([]);
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    setMaxCombo(0);
    setTotalCorrect(0);
    setSpawnInterval(2000);
    setPowerUp(null);
    setJudgingId(null);
    setLastResult(null);
    setShowRoundResult(false);
    setBossWave(null);
    setGameStats({ rounds: 0, bossWaves: 0, totalScore: 0 });
    setAlienPackets(0);
    setBlockedPackets(0);
    // spawn initial packets
    const initial: Packet[] = [];
    for (let i = 0; i < 3; i++) {
      initial.push(generatePacket(-10 - i * 15, diff === "normal" ? 8 : diff === "hard" ? 12 : 18));
    }
    setPackets(initial);
  }, []);

  const activatePowerUp = useCallback((type: PowerUp) => {
    if (powerUp?.active) return;
    setPowerUp({ type, active: true, duration: POWERUP_DURATION[type], remaining: POWERUP_DURATION[type] });
  }, [powerUp]);

  const judgingPacket = packets.find(p => p.status === "judging");
  const accuracy = totalCorrect > 0 ? Math.round((totalCorrect / (totalCorrect + alienPackets + blockedPackets)) * 100) : 0;

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
              <IconShield size={10} /> Packet Defender
            </div>
          </div>
        </div>

        {/* Menu */}
        {phase === "menu" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 mb-6">
              <IconNetwork size={48} className="text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Packet Defender</h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8">
              Packets are moving across your network. Allow legitimate traffic and block malicious packets
              to keep the network secure. Speed increases each level.
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
              {(["normal", "hard", "expert"] as Difficulty[]).map(d => (
                <button key={d} onClick={() => startGame(d)}
                  className={cn("p-4 rounded-xl border bg-white/5 hover:bg-white/10 transition-all text-center",
                    d === "normal" ? "border-green-500/20 text-green-400" :
                    d === "hard" ? "border-amber-500/20 text-amber-400" :
                    "border-red-500/20 text-red-400")}>
                  <div className="text-lg font-bold capitalize">{d}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {d === "normal" ? "Relaxed" : d === "hard" ? "Fast" : "Extreme"}
                  </div>
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>🛡️ Allow green · Block red · Boss waves every 15 rounds</p>
              <p>⚡ Speed increases per level · Power-ups every 5 correct</p>
            </div>
          </motion.div>
        )}

        {/* HUD */}
        {(phase === "playing" || phase === "boss") && (
          <>
            <GlassCard glow="none" className="p-2.5 mb-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span>Score: <span className="text-cyan-400 font-bold">{score}</span></span>
                  <span>Level: <span className="text-purple-400 font-bold">{level}</span></span>
                  <span>Combo: <span className="text-orange-400 font-bold">×{combo}</span></span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: lives }, (_, i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    ))}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {phase === "boss" && <span className="text-red-400 font-bold animate-pulse">⚠ BOSS WAVE</span>}
                  <span className="text-muted-foreground">Allowed: {alienPackets} Blocked: {blockedPackets}</span>
                </div>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                  style={{ width: `${Math.min(100, (totalCorrect % 15) / 15 * 100)}%` }} />
              </div>
            </GlassCard>

            {/* Network Topology */}
            <div className="relative w-full aspect-[3/1] bg-black/40 rounded-2xl border border-white/5 overflow-hidden mb-0">
              {/* Grid background */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }} />

              {/* Edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {EDGES.map(([s, t], i) => (
                  <line key={i}
                    x1={`${NODE_POSITIONS[s].x}%`} y1={`${NODE_POSITIONS[s].y}%`}
                    x2={`${NODE_POSITIONS[t].x}%`} y2={`${NODE_POSITIONS[t].y}%`}
                    className="stroke-white/10" strokeWidth="0.3" />
                ))}
              </svg>

              {/* Packets */}
              <AnimatePresence>
                {packets.filter(p => p.status !== "blocked" && p.x < 100).map(pkt => {
                  const info = PACKET_TYPES[pkt.type];
                  const isJudging = pkt.status === "judging";
                  return (
                    <motion.div
                      key={pkt.id}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, isJudging ? 1 : 0.8, 0],
                        scale: isJudging ? [1, 1.15, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "absolute px-1.5 py-0.5 rounded-md text-xs font-mono flex items-center gap-1 transition-all z-10",
                        pkt.status === "allowed" ? "bg-green-500/20 border border-green-500/40" :
                        pkt.status === "missed" ? "bg-red-500/20 border border-red-500/40 opacity-50" :
                        isJudging ? "bg-cyan-500/20 border border-cyan-400/60 shadow-lg shadow-cyan-500/20 scale-110 z-20" :
                        "bg-white/10 border border-white/20"
                      )}
                      style={{
                        left: `${clamp(pkt.x, 2, 95)}%`,
                        top: `${clamp(pkt.y || NODE_POSITIONS[1].y + (pkt.progress > 30 ? 0 : -3), 10, 90)}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span>{info.icon}</span>
                      <span className={info.color}>{pkt.type}</span>
                      {isJudging && <span className="text-cyan-300 animate-pulse">●</span>}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Nodes */}
              {NODE_POSITIONS.map((node, i) => (
                <div key={node.id}
                  className={cn(
                    "absolute px-2 py-1 rounded-lg text-xs font-mono border transition-all",
                    node.id === "firewall"
                      ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10"
                      : "bg-white/10 border-white/20 text-muted-foreground"
                  )}
                  style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}>
                  <div className="flex items-center gap-1">
                    {node.id === "firewall" ? <IconShield size={8} /> :
                     node.id === "internet" ? <IconNetwork size={8} /> :
                     node.id === "server" ? <IconServer size={8} /> :
                     <span>⬡</span>}
                    {node.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Judging Panel */}
            {judgingPacket && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-2"
              >
                <GlassCard glow="cyan" className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{PACKET_TYPES[judgingPacket.type].icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm font-bold font-mono", PACKET_TYPES[judgingPacket.type].color)}>
                            {judgingPacket.type}
                          </span>
                          {judgingPacket.malicious && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                              SUSPICIOUS
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {judgingPacket.srcIp} → {judgingPacket.dstIp}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      <div>{PACKET_TYPES[judgingPacket.type].desc}</div>
                      <div className="text-xs opacity-60 mt-0.5">{judgingPacket.info}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-center">
                    <button onClick={() => judge(true)}
                      className="px-6 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 transition-all text-sm font-semibold flex items-center gap-2">
                      <IconCheck size={16} /> Allow
                    </button>
                    <button onClick={() => judge(false)}
                      className="px-6 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all text-sm font-semibold flex items-center gap-2">
                      <IconX size={16} /> Block
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Power-ups */}
            <div className="flex items-center gap-2 mt-2">
              {(["slowmo", "firewall", "freeze"] as PowerUp[]).map(pt => {
                const isActive = powerUp?.type === pt && powerUp?.active;
                const icons: Record<PowerUp, { icon: typeof IconBolt; label: string }> = {
                  slowmo: { icon: IconBolt, label: "Slow Motion" },
                  firewall: { icon: IconShield, label: "Firewall Boost" },
                  freeze: { icon: IconSnowflake, label: "Packet Freeze" },
                };
                const I = icons[pt].icon;
                return (
                  <button key={pt} onClick={() => activatePowerUp(pt)} disabled={isActive}
                    className={cn("flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all",
                      isActive ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" :
                      "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 disabled:opacity-30")}>
                    <I size={10} /> {icons[pt].label}
                  </button>
                );
              })}
            </div>

            {/* Round result toast */}
            <AnimatePresence>
              {showRoundResult && lastResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn("fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border text-xs max-w-md",
                    lastResult.correct ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400")}
                >
                  <div className="flex items-center gap-2">
                    {lastResult.correct ? <IconCheck size={14} /> : <IconX size={14} />}
                    <span className="font-semibold">{lastResult.correct ? "Correct" : "Incorrect"}</span>
                    <span className="text-muted-foreground">— {lastResult.type}: {lastResult.explanation}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Game Over */}
        {phase === "gameover" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard glow="cyan" className="p-8 text-center">
              <IconTrophy size={40} className="mx-auto text-amber-400 mb-4" />
              <h2 className="text-2xl font-bold mb-1">Network Breach!</h2>
              <p className="text-sm text-muted-foreground mb-6">Your firewall was overwhelmed</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-6">
                <div className="p-3 rounded-xl bg-white/5"><div className="text-lg font-bold text-cyan-400">{score}</div><div className="text-xs text-muted-foreground">Score</div></div>
                <div className="p-3 rounded-xl bg-white/5"><div className="text-lg font-bold text-purple-400">{level}</div><div className="text-xs text-muted-foreground">Level</div></div>
                <div className="p-3 rounded-xl bg-white/5"><div className="text-lg font-bold text-orange-400">{maxCombo}</div><div className="text-xs text-muted-foreground">Best Combo</div></div>
                <div className="p-3 rounded-xl bg-white/5"><div className="text-lg font-bold text-green-400">{blockedPackets}</div><div className="text-xs text-muted-foreground">Blocked</div></div>
              </div>
              <div className="flex justify-center gap-3">
                <Button variant="primary" size="md" onClick={() => startGame(difficulty)}>
                  <IconRefresh size={14} className="mr-1.5" /> Retry
                </Button>
                <Button variant="glass" size="md" onClick={() => setPhase("menu")}>
                  Menu
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
