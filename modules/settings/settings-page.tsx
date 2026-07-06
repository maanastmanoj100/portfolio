"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/theme-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { IconMoon, IconSun, IconRefresh, IconEye, IconVolume, IconTerminal2 } from "@tabler/icons-react";

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm text-soft-white">{label}</div>
        <div className="text-xs text-soft-white/40">{description}</div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        "relative w-10 h-6 rounded-full transition-colors",
        value ? "bg-cyan/30" : "bg-white/10"
      )}
    >
      <div className={cn(
        "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all",
        value ? "left-[18px]" : "left-0.5"
      )} />
    </button>
  );
}

export function SettingsPage() {
  const theme = useThemeStore();
  const settings = useSettingsStore();
  const ui = useUIStore();

  const modes: { value: typeof theme.mode; label: string; icon: typeof IconMoon }[] = [
    { value: "dark", label: "Dark", icon: IconMoon },
    { value: "cyber", label: "Cyber", icon: IconSun },
    { value: "matrix", label: "Matrix", icon: IconRefresh },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <span className="text-xs text-cyan font-mono tracking-wider uppercase">.settings</span>
            <h1 className="text-4xl sm:text-5xl font-light text-soft-white mt-2">
              Application <span className="text-gradient font-medium">Settings</span>
            </h1>
          </motion.div>

          <div className="space-y-6">
            <GlassCard className="p-6" glow="cyan" intensity="low">
              <div className="flex items-center gap-2 mb-4">
                <IconMoon size={16} className="text-cyan" />
                <h2 className="text-sm font-semibold text-soft-white">Theme</h2>
              </div>
              <div className="flex gap-2 mb-4">
                {modes.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.value}
                      onClick={() => theme.setMode(m.value)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all",
                        theme.mode === m.value
                          ? "bg-cyan/10 border-cyan/30 text-cyan"
                          : "border-white/10 text-soft-white/50 hover:border-white/20"
                      )}
                    >
                      <Icon size={14} />
                      {m.label}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-1">
                <SettingRow label="Accent Color" description="Primary accent for UI elements">
                  <div className="flex gap-1.5">
                    {(["cyan", "purple", "blue", "green"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => theme.setAccentColor(c)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-all",
                          theme.accentColor === c ? "border-soft-white scale-110" : "border-transparent",
                          c === "cyan" && "bg-cyan",
                          c === "purple" && "bg-purple-500",
                          c === "blue" && "bg-blue-500",
                          c === "green" && "bg-green-500"
                        )}
                      />
                    ))}
                  </div>
                </SettingRow>
                <SettingRow label="Reduced Motion" description="Minimize animations">
                  <Toggle value={theme.reducedMotion} onChange={theme.setReducedMotion} />
                </SettingRow>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="purple" intensity="low">
              <div className="flex items-center gap-2 mb-4">
                <IconEye size={16} className="text-purple" />
                <h2 className="text-sm font-semibold text-soft-white">Display</h2>
              </div>
              <div className="space-y-1">
                <SettingRow label="Compact Mode" description="Reduce spacing and padding">
                  <Toggle value={settings.compactMode} onChange={settings.setCompactMode} />
                </SettingRow>
                <SettingRow label="Show Analytics" description="Display usage analytics">
                  <Toggle value={settings.showAnalytics} onChange={settings.setShowAnalytics} />
                </SettingRow>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="blue" intensity="low">
              <div className="flex items-center gap-2 mb-4">
                <IconTerminal2 size={16} className="text-blue" />
                <h2 className="text-sm font-semibold text-soft-white">Terminal</h2>
              </div>
              <div className="space-y-1">
                <SettingRow label="Font Size" description="Terminal text size">
                  <div className="flex gap-1">
                    {(["sm", "md", "lg"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => settings.setTerminalFontSize(s)}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs border transition-all",
                          settings.terminalFontSize === s
                            ? "bg-blue-500/10 border-blue-500/30 text-blue"
                            : "border-white/10 text-soft-white/50"
                        )}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </SettingRow>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="green" intensity="low">
              <div className="flex items-center gap-2 mb-4">
                <IconVolume size={16} className="text-green" />
                <h2 className="text-sm font-semibold text-soft-white">Other</h2>
              </div>
              <div className="space-y-1">
                <SettingRow label="Sound Effects" description="Play sounds on interactions">
                  <Toggle value={settings.soundEnabled} onChange={settings.setSoundEnabled} />
                </SettingRow>
                <SettingRow label="Auto-rotate Threats" description="Automatically cycle threat feed">
                  <Toggle value={settings.autoRotateThreats} onChange={settings.setAutoRotateThreats} />
                </SettingRow>
              </div>
            </GlassCard>

            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => settings.resetSettings()}>
                <IconRefresh size={14} />
                Reset All Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
