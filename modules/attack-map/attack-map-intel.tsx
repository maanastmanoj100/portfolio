"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { THREAT_ACTORS, getCountryByCode, COUNTRIES } from "./attack-map-data";
import type { ThreatActor } from "./attack-map-data";
import { IconSearch, IconShieldExclamation, IconX } from "@tabler/icons-react";

function ActorCard({ actor, selected, onClick }: { actor: ThreatActor; selected: boolean; onClick: () => void }) {
  const typeColors: Record<string, string> = {
    apt: "text-red-400 bg-red-500/10 border-red-500/20",
    cybercrime: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    hacktivist: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        selected
          ? "border-cyan/30 bg-cyan/5"
          : "border-border/30 hover:border-border/60 bg-white/[0.015] hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${typeColors[actor.type]}`}>{actor.type.toUpperCase()}</span>
        {actor.type === "apt" && <span className="text-xs font-mono text-cyan bg-cyan/10 px-1 py-0.5 rounded">Advanced Persistent Threat</span>}
      </div>
      <div className="text-xs text-foreground font-medium mb-1">{actor.name}</div>
      <div className="text-xs text-foreground-secondary leading-relaxed mb-2">{actor.description}</div>
      <div className="flex flex-wrap gap-1 mb-2">
        {actor.knownTechniques.slice(0, 3).map((t) => (
          <span key={t} className="text-xs font-mono text-foreground-tertiary bg-white/5 px-1 py-0.5 rounded">{t}</span>
        ))}
        {actor.knownTechniques.length > 3 && (
          <span className="text-xs font-mono text-foreground-tertiary">+{actor.knownTechniques.length - 3}</span>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-foreground-tertiary">
        <span>🎯 {actor.targetIndustries.slice(0, 2).join(", ")}{actor.targetIndustries.length > 2 ? "..." : ""}</span>
        <span>· {actor.campaigns.length} campaigns</span>
      </div>
    </button>
  );
}

function ActorDetail({ actor, onClose }: { actor: ThreatActor; onClose: () => void }) {
  const typeColors: Record<string, string> = {
    apt: "text-red-400 bg-red-500/10 border-red-500/20",
    cybercrime: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    hacktivist: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 relative"
    >
      <button onClick={onClose} className="absolute top-3 right-3 text-foreground-tertiary hover:text-foreground">
        <IconX size={14} />
      </button>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${typeColors[actor.type]}`}>{actor.type.toUpperCase()}</span>
        <span className="text-xs text-cyan font-mono">{actor.id}</span>
      </div>
      <h3 className="text-base text-foreground font-medium mb-1">{actor.name}</h3>
      <p className="text-xs text-foreground-secondary leading-relaxed mb-4">{actor.description}</p>

      <div className="space-y-3">
        <div>
          <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider">Motivation</span>
          <p className="text-xs text-foreground-secondary mt-0.5">{actor.motivation}</p>
        </div>
        <div>
          <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider">Known Techniques</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {actor.knownTechniques.map((t) => (
              <span key={t} className="text-xs font-mono text-cyan bg-cyan/10 px-1.5 py-0.5 rounded">{t}</span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider">Target Industries</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {actor.targetIndustries.map((ind) => (
              <span key={ind} className="text-xs font-mono text-foreground-secondary bg-white/5 px-1.5 py-0.5 rounded">{ind}</span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider">Campaigns</span>
          <ul className="mt-1 space-y-0.5">
            {actor.campaigns.map((c) => (
              <li key={c} className="text-xs text-foreground-secondary flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyan" />{c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider">Associated Malware</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {actor.malware.map((m) => (
              <span key={m} className="text-xs font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">{m}</span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider">MITRE ATT&CK</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {actor.mitreIds.map((m) => (
              <span key={m} className="text-xs font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ThreatActorsPanel() {
  const [selectedActor, setSelectedActor] = useState<ThreatActor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(
    () => THREAT_ACTORS.filter((a) => !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  );

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase">Threat Actors</span>
        <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1 border border-border/40">
          <IconSearch size={10} className="text-foreground-tertiary" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actors..."
            className="w-28 bg-transparent text-xs text-foreground outline-none placeholder:text-foreground-tertiary/50"
          />
        </div>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
        {filtered.length === 0 ? (
          <div className="text-xs text-foreground-tertiary text-center py-4">No matching threat actors</div>
        ) : (
          filtered.map((a) => (
            <ActorCard key={a.id} actor={a} selected={selectedActor?.id === a.id} onClick={() => setSelectedActor(selectedActor?.id === a.id ? null : a)} />
          ))
        )}
      </div>
      {selectedActor && (
        <div className="mt-3">
          <ActorDetail actor={selectedActor} onClose={() => setSelectedActor(null)} />
        </div>
      )}
    </div>
  );
}

export function CountryInfoPanel({ selectedCountry }: { selectedCountry: string | null }) {
  const country = selectedCountry ? getCountryByCode(selectedCountry) : null;
  if (!country) {
    const topThreats = [...COUNTRIES].sort((a, b) => b.threatScore - a.threatScore).slice(0, 5);
    return (
      <div className="glass-card p-4">
        <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Country Threat Overview</span>
        <p className="text-xs text-foreground-tertiary mb-3">Click a country on the globe or select from below:</p>
        <div className="space-y-1.5">
          {topThreats.map((c) => (
            <div key={c.code} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.015] border border-border/30">
              <span className="text-sm">{c.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-foreground font-medium">{c.name}</div>
                <div className="text-xs text-foreground-tertiary">Threat Score: {c.threatScore}%</div>
              </div>
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                c.threatScore > 70 ? "text-red-400 bg-red-500/10" : c.threatScore > 50 ? "text-orange-400 bg-orange-500/10" : "text-blue-400 bg-blue-500/10"
              }`}>
                {c.threatScore}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const countryAttacks = country.recentAttacks;
  const threatLevel = country.threatScore > 70 ? "Critical" : country.threatScore > 50 ? "High" : country.threatScore > 30 ? "Medium" : "Low";
  const threatColor = country.threatScore > 70 ? "#ef4444" : country.threatScore > 50 ? "#f97316" : country.threatScore > 30 ? "#eab308" : "#3b82f6";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Country Detail</span>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{country.flag}</span>
        <div>
          <div className="text-sm text-foreground font-medium">{country.name}</div>
          <div className="text-xs font-mono text-foreground-tertiary">{country.code}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: "Threat Score", value: `${country.threatScore}%`, color: threatColor },
          { label: "Active Attacks", value: country.activeAttacks.toString(), color: "#f97316" },
          { label: "Recent Attacks", value: country.recentAttacks.toLocaleString(), color: "#3b82f6" },
          { label: "Monitored Assets", value: country.assets.toLocaleString(), color: "#06b6d4" },
        ].map((m) => (
          <div key={m.label} className="p-2 rounded-lg bg-white/[0.015] border border-border/30">
            <div className="text-xs text-foreground-tertiary font-mono">{m.label}</div>
            <div className="text-xs font-mono mt-0.5" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.015] border border-border/30">
        <span className="text-xs text-foreground-tertiary">Threat Level</span>
        <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: `${threatColor}15`, color: threatColor, border: `1px solid ${threatColor}30` }}>{threatLevel}</span>
      </div>
    </motion.div>
  );
}

export function AttackFilterBar({
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  typeFilter,
  onTypeChange,
  uniqueTypes,
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  severityFilter: string;
  onSeverityChange: (s: string) => void;
  typeFilter: string;
  onTypeChange: (t: string) => void;
  uniqueTypes: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 border border-border/40 flex-1 min-w-[140px] max-w-[200px]">
        <IconSearch size={11} className="text-foreground-tertiary shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events..."
          className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-foreground-tertiary/50"
        />
      </div>
      <select
        value={severityFilter}
        onChange={(e) => onSeverityChange(e.target.value)}
        className="text-xs bg-white/5 border border-border/40 rounded-lg px-2 py-1.5 text-foreground-tertiary outline-none font-mono"
      >
        <option value="all">All Severity</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        className="text-xs bg-white/5 border border-border/40 rounded-lg px-2 py-1.5 text-foreground-tertiary outline-none font-mono"
      >
        <option value="all">All Types</option>
        {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  );
}
