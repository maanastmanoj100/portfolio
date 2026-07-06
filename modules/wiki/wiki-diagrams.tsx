"use client";

import { cn } from "@/lib/utils";

interface DiagramProps {
  className?: string;
}

export function OSIDiagram({ className }: DiagramProps) {
  const layers = [
    { num: 7, name: "Application", protocols: "HTTP, DNS, SMTP, FTP", color: "from-cyan-500/30 to-cyan-600/20", border: "border-cyan-500/40" },
    { num: 6, name: "Presentation", protocols: "TLS, SSL, JPEG, MIME", color: "from-blue-500/30 to-blue-600/20", border: "border-blue-500/40" },
    { num: 5, name: "Session", protocols: "NetBIOS, RPC, PPTP", color: "from-indigo-500/30 to-indigo-600/20", border: "border-indigo-500/40" },
    { num: 4, name: "Transport", protocols: "TCP, UDP", color: "from-purple-500/30 to-purple-600/20", border: "border-purple-500/40" },
    { num: 3, name: "Network", protocols: "IP, ICMP, OSPF", color: "from-pink-500/30 to-pink-600/20", border: "border-pink-500/40" },
    { num: 2, name: "Data Link", protocols: "Ethernet, ARP, MAC", color: "from-amber-500/30 to-amber-600/20", border: "border-amber-500/40" },
    { num: 1, name: "Physical", protocols: "Cables, Hubs, Radio", color: "from-green-500/30 to-green-600/20", border: "border-green-500/40" },
  ];
  return (
    <div className={cn("flex flex-col items-center gap-0.5 py-4", className)}>
      {layers.map((l) => (
        <div key={l.num} className={cn("w-full max-w-md rounded-lg border bg-gradient-to-r p-2.5", l.color, l.border)}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/80 w-6">L{l.num}</span>
            <span className="text-xs font-semibold text-white flex-1">{l.name}</span>
            <span className="text-xs text-white/60">{l.protocols}</span>
          </div>
        </div>
      ))}
      <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
        <span>← Upper layers (software/application)</span>
        <span>Lower layers (hardware/network) →</span>
      </div>
    </div>
  );
}

export function TCPHandshakeDiagram({ className }: DiagramProps) {
  return (
    <svg viewBox="0 0 400 200" className={cn("w-full max-w-md", className)}>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="rgba(0,180,216,0.6)" /></marker>
        <marker id="arrowhead2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="rgba(139,92,246,0.6)" /></marker>
      </defs>
      <rect x="20" y="20" width="100" height="40" rx="6" fill="rgba(0,180,216,0.1)" stroke="rgba(0,180,216,0.4)" />
      <text x="70" y="44" textAnchor="middle" fill="rgba(0,180,216,0.8)" fontSize="12">Client</text>
      <rect x="280" y="20" width="100" height="40" rx="6" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.4)" />
      <text x="330" y="44" textAnchor="middle" fill="rgba(139,92,246,0.8)" fontSize="12">Server</text>
      <line x1="120" y1="35" x2="280" y2="35" stroke="rgba(0,180,216,0.6)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
      <text x="200" y="28" textAnchor="middle" fill="rgba(0,180,216,0.6)" fontSize="10">SYN (Seq=X)</text>
      <line x1="280" y1="70" x2="120" y2="70" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" markerEnd="url(#arrowhead2)" />
      <text x="200" y="80" textAnchor="middle" fill="rgba(139,92,246,0.6)" fontSize="10">SYN-ACK (Seq=Y, Ack=X+1)</text>
      <line x1="120" y1="110" x2="280" y2="110" stroke="rgba(0,180,216,0.6)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
      <text x="200" y="120" textAnchor="middle" fill="rgba(0,180,216,0.6)" fontSize="10">ACK (Ack=Y+1)</text>
      <text x="200" y="140" textAnchor="middle" fill="rgba(0,180,216,0.8)" fontSize="11" fontWeight="bold">Connection Established</text>
      <line x1="120" y1="155" x2="280" y2="155" stroke="rgba(0,255,136,0.4)" strokeWidth="1" strokeDasharray="4,4" />
      <text x="200" y="168" textAnchor="middle" fill="rgba(0,255,136,0.5)" fontSize="9">Data transmission (bidirectional)</text>
    </svg>
  );
}

export function DNSResolutionDiagram({ className }: DiagramProps) {
  return (
    <svg viewBox="0 0 500 200" className={cn("w-full max-w-lg", className)}>
      <defs>
        <marker id="dns-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="rgba(0,180,216,0.5)" /></marker>
        <marker id="dns-arrow2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="rgba(139,92,246,0.5)" /></marker>
      </defs>
      <rect x="10" y="10" width="90" height="30" rx="5" fill="rgba(0,180,216,0.12)" stroke="rgba(0,180,216,0.4)" />
      <text x="55" y="29" textAnchor="middle" fill="rgba(0,180,216,0.8)" fontSize="9">Browser</text>
      <rect x="10" y="60" width="90" height="30" rx="5" fill="rgba(0,180,216,0.12)" stroke="rgba(0,180,216,0.4)" />
      <text x="55" y="79" textAnchor="middle" fill="rgba(0,180,216,0.8)" fontSize="9">Resolver</text>
      <rect x="140" y="60" width="90" height="30" rx="5" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.4)" />
      <text x="185" y="79" textAnchor="middle" fill="rgba(139,92,246,0.8)" fontSize="9">Root</text>
      <rect x="270" y="60" width="90" height="30" rx="5" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.4)" />
      <text x="315" y="79" textAnchor="middle" fill="rgba(139,92,246,0.8)" fontSize="9">TLD (.com)</text>
      <rect x="400" y="60" width="90" height="30" rx="5" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.4)" />
      <text x="445" y="79" textAnchor="middle" fill="rgba(139,92,246,0.8)" fontSize="9">Authoritative</text>
      <line x1="100" y1="25" x2="140" y2="70" stroke="rgba(0,180,216,0.4)" strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#dns-arrow)" />
      <text x="105" y="55" fill="rgba(0,180,216,0.4)" fontSize="7">1. example.com?</text>
      <line x1="140" y1="75" x2="270" y2="75" stroke="rgba(139,92,246,0.4)" strokeWidth="1" markerEnd="url(#dns-arrow2)" />
      <text x="205" y="90" textAnchor="middle" fill="rgba(139,92,246,0.4)" fontSize="7">2. .com NS?</text>
      <line x1="270" y1="75" x2="400" y2="75" stroke="rgba(139,92,246,0.4)" strokeWidth="1" markerEnd="url(#dns-arrow2)" />
      <text x="335" y="90" textAnchor="middle" fill="rgba(139,92,246,0.4)" fontSize="7">3. example.com NS?</text>
      <line x1="400" y1="75" x2="270" y2="75" stroke="rgba(0,180,216,0.4)" strokeWidth="1" markerEnd="url(#dns-arrow)" />
      <text x="335" y="100" textAnchor="middle" fill="rgba(0,180,216,0.4)" fontSize="7">4. 93.184.216.34</text>
      <line x1="270" y1="75" x2="140" y2="75" stroke="rgba(0,180,216,0.4)" strokeWidth="1" markerEnd="url(#dns-arrow)" />
      <text x="205" y="100" textAnchor="middle" fill="rgba(0,180,216,0.4)" fontSize="7">5. 93.184.216.34</text>
      <line x1="100" y1="80" x2="100" y2="85" stroke="rgba(0,180,216,0.4)" strokeWidth="1" />
      <text x="55" y="100" textAnchor="middle" fill="rgba(0,180,216,0.4)" fontSize="7">6. Returns IP</text>
      <line x1="55" y1="60" x2="55" y2="45" stroke="rgba(0,180,216,0.4)" strokeWidth="1" markerEnd="url(#dns-arrow)" />
      <text x="110" y="42" fill="rgba(0,180,216,0.4)" fontSize="7">7. 93.184.216.34</text>
    </svg>
  );
}

export function SIEMPipelineDiagram({ className }: DiagramProps) {
  const stages = [
    { label: "Log Sources", items: "Endpoints·Network·Apps·Cloud" },
    { label: "Forwarders", items: "UF·Winlogbeat·Syslog" },
    { label: "Collection", items: "Indexer·Broker·Logstash" },
    { label: "Parsing", items: "Normalize·Enrich·Tag" },
    { label: "Correlation", items: "Rules·ML·Threat Intel" },
    { label: "Visualization", items: "Dashboards·Alerts·Reports" },
  ];
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-1 py-4", className)}>
      {stages.map((s, i) => (
        <div key={i} className="flex items-center">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-3 py-2 text-center min-w-[100px]">
            <div className="text-xs font-semibold text-cyan-400">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.items}</div>
          </div>
          {i < stages.length - 1 && <div className="text-cyan-500/40 mx-1 text-xs">→</div>}
        </div>
      ))}
    </div>
  );
}

export function CyberKillChainDiagram({ className }: DiagramProps) {
  const phases = [
    { num: 1, label: "Recon", sub: "OSINT·Scanning" },
    { num: 2, label: "Weaponize", sub: "Exploit·Payload" },
    { num: 3, label: "Deliver", sub: "Phish·USB·Drive-by" },
    { num: 4, label: "Exploit", sub: "Vuln·Code Exec" },
    { num: 5, label: "Install", sub: "Backdoor·Persistence" },
    { num: 6, label: "C2", sub: "Beacon·Tunnel" },
    { num: 7, label: "Act", sub: "Exfil·Ransom·Destruct" },
  ];
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-1 py-4", className)}>
      {phases.map((p, i) => (
        <div key={i} className="flex items-center">
          <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 px-2 py-1.5 text-center min-w-[70px]">
            <div className="text-xs text-purple-400 font-bold">{p.num}</div>
            <div className="text-xs font-semibold text-white">{p.label}</div>
            <div className="text-xs text-muted-foreground">{p.sub}</div>
          </div>
          {i < phases.length - 1 && <div className="text-purple-500/30 mx-0.5">→</div>}
        </div>
      ))}
    </div>
  );
}

export function EncryptionDiagram({ className }: DiagramProps) {
  return (
    <svg viewBox="0 0 400 160" className={cn("w-full max-w-md", className)}>
      <defs>
        <marker id="enc-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="rgba(0,180,216,0.5)" /></marker>
        <marker id="enc-arrow2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="rgba(139,92,246,0.5)" /></marker>
      </defs>
      <rect x="10" y="30" width="80" height="40" rx="6" fill="rgba(0,180,216,0.12)" stroke="rgba(0,180,216,0.4)" />
      <text x="50" y="45" textAnchor="middle" fill="rgba(0,180,216,0.8)" fontSize="8">Plaintext</text>
      <text x="50" y="60" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">"Hello World"</text>
      <rect x="120" y="20" width="60" height="60" rx="6" fill="rgba(0,255,136,0.12)" stroke="rgba(0,255,136,0.4)" />
      <text x="150" y="40" textAnchor="middle" fill="rgba(0,255,136,0.8)" fontSize="8">Encrypt</text>
      <text x="150" y="55" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">AES-256</text>
      <text x="150" y="70" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6">+ Key</text>
      <rect x="220" y="30" width="80" height="40" rx="6" fill="rgba(255,0,100,0.12)" stroke="rgba(255,0,100,0.4)" />
      <text x="260" y="45" textAnchor="middle" fill="rgba(255,0,100,0.8)" fontSize="8">Ciphertext</text>
      <text x="260" y="60" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">"x3#fA..."</text>
      <rect x="330" y="20" width="60" height="60" rx="6" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.4)" />
      <text x="360" y="40" textAnchor="middle" fill="rgba(139,92,246,0.8)" fontSize="8">Decrypt</text>
      <text x="360" y="55" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">AES-256</text>
      <text x="360" y="70" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6">+ Key</text>
      <line x1="90" y1="50" x2="120" y2="50" stroke="rgba(0,180,216,0.5)" strokeWidth="1.5" markerEnd="url(#enc-arrow)" />
      <line x1="220" y1="50" x2="330" y2="50" stroke="rgba(255,0,100,0.4)" strokeWidth="1.5" markerEnd="url(#enc-arrow2)" />
      <text x="200" y="130" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9">Same key for both operations (symmetric encryption)</text>
    </svg>
  );
}

export const DIAGRAM_MAP: Record<string, React.FC<DiagramProps>> = {
  "osi-model": OSIDiagram,
  "tcp-handshake": TCPHandshakeDiagram,
  "dns-resolution": DNSResolutionDiagram,
  "siem-pipeline": SIEMPipelineDiagram,
  "cyber-kill-chain": CyberKillChainDiagram,
  "encryption": EncryptionDiagram,
};

export function WikiDiagram({ id, className }: { id: string; className?: string }) {
  const Diagram = DIAGRAM_MAP[id];
  if (!Diagram) return null;
  return (
    <div className="my-4 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
      <Diagram className={className} />
    </div>
  );
}
