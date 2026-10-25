"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowRight,
  IconBrandGithub,
  IconCode,
  IconCopy,
  IconHome,
  IconMail,
  IconSearch,
  IconShieldExclamation,
  IconTerminal2,
  IconUser,
} from "@tabler/icons-react";
import { useUIStore } from "@/stores/ui-store";
import { useToolsStore } from "@/stores/tools-store";
import { useToastStore } from "@/stores/toast-store";
import { useDialog } from "@/hooks/use-dialog";
import { copyText } from "@/lib/clipboard";
import { normalizeSearchText } from "@/lib/portfolio/project-search";
import { profile } from "@/data/portfolio";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

interface PaletteCommand {
  id: string;
  label: string;
  hint?: string;
  keywords: string;
  icon: typeof IconHome;
  shortcut?: string;
  run: () => void | Promise<void>;
}

function openExternal(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return;
    window.open(parsed.toString(), "_blank", "noopener,noreferrer");
  } catch {
    // Invalid URL: do nothing rather than navigating somewhere unexpected.
  }
}

/**
 * Command palette (Ctrl+K / Cmd+K).
 *
 * Every action has a real destination or callback. The palette is only mounted
 * while open (see AppShell), so its bundle is not part of the initial page.
 */
export function CommandPalette() {
  const router = useRouter();
  const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen);
  const setSearchOpen = useUIStore((state) => state.setSearchOpen);
  const setHackerTerminalOpen = useUIStore((state) => state.setHackerTerminalOpen);
  const openCve = useToolsStore((state) => state.openCve);
  const addToast = useToastStore((state) => state.addToast);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setCommandPaletteOpen(false);
  }, [setCommandPaletteOpen]);

  const containerRef = useDialog({
    open: true,
    onClose: close,
    initialFocusRef: inputRef,
  });

  const commands = useMemo<PaletteCommand[]>(() => {
    const go = (href: string) => {
      close();
      router.push(href);
    };

    const list: PaletteCommand[] = [
      {
        id: "home",
        label: "Go to Home",
        hint: "/",
        keywords: "start index",
        icon: IconHome,
        run: () => go("/"),
      },
      {
        id: "projects",
        label: "View all projects",
        hint: "/projects",
        keywords: "work repositories search filter",
        icon: IconCode,
        run: () => go("/projects"),
      },
      {
        id: "cyber-intel",
        label: "Open Cyber Intelligence",
        hint: "/cyber-intel",
        keywords: "news archive advisories vulnerabilities feed",
        icon: IconShieldExclamation,
        run: () => go("/cyber-intel"),
      },
      {
        id: "about",
        label: "About",
        hint: "/about",
        keywords: "profile background skills timeline",
        icon: IconUser,
        run: () => go("/about"),
      },
      {
        id: "contact",
        label: "Get in touch",
        hint: "/contact",
        keywords: "email contact",
        icon: IconMail,
        run: () => go("/contact"),
      },
      {
        id: "search",
        label: "Search this site",
        hint: "Pages and projects",
        keywords: "find query",
        icon: IconSearch,
        shortcut: "Ctrl /",
        run: () => {
          close();
          setSearchOpen(true);
        },
      },
      {
        id: "terminal",
        label: "Open the terminal",
        hint: "Local interface",
        keywords: "shell console commands help projects skills",
        icon: IconTerminal2,
        run: () => {
          close();
          setHackerTerminalOpen(true);
        },
      },
      {
        id: "cve",
        label: "Look up a CVE",
        hint: "NIST NVD",
        keywords: "vulnerability security advisory cve nvd",
        icon: IconShieldExclamation,
        run: () => {
          close();
          openCve();
        },
      },
      {
        id: "github",
        label: "Open GitHub profile",
        hint: "github.com",
        keywords: "code source repositories",
        icon: IconBrandGithub,
        run: () => {
          close();
          openExternal(profile.github);
        },
      },
      {
        id: "email",
        label: "Send an email",
        hint: profile.email,
        keywords: "contact mail message",
        icon: IconMail,
        run: () => {
          close();
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: "copy-email",
        label: "Copy email address",
        hint: profile.email,
        keywords: "clipboard contact",
        icon: IconCopy,
        run: async () => {
          close();
          const result = await copyText(profile.email);
          addToast({
            type: result.ok ? "success" : "error",
            title: result.ok ? "Email copied" : "Could not copy the email",
            description: result.ok ? profile.email : "Clipboard access was blocked by the browser.",
          });
        },
      },
    ];

    if (profile.resumeUrl) {
      list.push({
        id: "resume",
        label: "Open résumé",
        hint: "PDF",
        keywords: "cv resume",
        icon: IconArrowRight,
        run: () => {
          close();
          openExternal(profile.resumeUrl);
        },
      });
    }

    return list;
  }, [addToast, close, openCve, router, setHackerTerminalOpen, setSearchOpen]);

  const filtered = useMemo(() => {
    const normalized = normalizeSearchText(query);
    if (!normalized) return commands;
    const terms = normalized.split(" ").filter(Boolean);
    return commands.filter((command) => {
      const haystack = normalizeSearchText(`${command.label} ${command.keywords}`);
      return terms.every((term) => haystack.includes(term));
    });
  }, [commands, query]);

  const active = filtered.length === 0 ? -1 : Math.min(activeIndex, filtered.length - 1);

  useEffect(() => {
    if (active < 0) return;
    document.getElementById(`command-option-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const execute = useCallback(
    (command: PaletteCommand) => {
      setQuery("");
      void command.run();
    },
    [],
  );

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (filtered.length === 0) return;
      setActiveIndex((index) => (Math.min(index, filtered.length - 1) + 1) % filtered.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (filtered.length === 0) return;
      setActiveIndex(
        (index) => (Math.min(index, filtered.length - 1) - 1 + filtered.length) % filtered.length,
      );
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(0, filtered.length - 1));
      return;
    }
    if (event.key === "Enter") {
      // A focused option button handles its own Enter through a click.
      if (event.target instanceof HTMLButtonElement) return;
      const command = filtered[active];
      if (command) {
        event.preventDefault();
        execute(command);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-palette-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
      >
        <h2 id="command-palette-title" className="sr-only">
          Command palette
        </h2>

        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <IconSearch size={16} className="shrink-0 text-foreground-tertiary" aria-hidden="true" />
          <label htmlFor="command-palette-input" className="sr-only">
            Search commands
          </label>
          <input
            ref={inputRef}
            id="command-palette-input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `command-option-${active}` : undefined}
            placeholder="Type a command or page…"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-tertiary"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div
          id="command-palette-list"
          role="listbox"
          aria-label="Commands"
          className="max-h-[min(60vh,22rem)] overflow-y-auto p-2"
        >
          {filtered.map((command, index) => {
            const Icon = command.icon;
            return (
              <button
                key={command.id}
                id={`command-option-${index}`}
                type="button"
                role="option"
                aria-selected={index === active}
                tabIndex={-1}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => execute(command)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  index === active
                    ? "bg-accent-soft text-accent"
                    : "text-foreground-secondary hover:bg-white/[0.04]",
                )}
              >
                <Icon size={16} className="shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{command.label}</span>
                {command.hint && (
                  <span className="hidden shrink-0 text-xs text-foreground-tertiary sm:inline">
                    {command.hint}
                  </span>
                )}
                {command.shortcut && <Kbd className="shrink-0">{command.shortcut}</Kbd>}
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div role="status" className="px-3 py-8 text-center">
              <p className="text-sm text-foreground-secondary">
                No commands match &ldquo;{query}&rdquo;.
              </p>
              <p className="mt-1 text-xs text-foreground-tertiary">
                Try &ldquo;projects&rdquo;, &ldquo;terminal&rdquo; or &ldquo;cve&rdquo;.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-xs text-foreground-tertiary">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            navigate
            <span aria-hidden="true">·</span>
            <Kbd>Enter</Kbd>
            select
            <span aria-hidden="true">·</span>
            <Kbd>Esc</Kbd>
            close
          </span>
          <span className="hidden sm:inline">Ctrl K / ⌘ K</span>
        </div>
      </div>
    </div>
  );
}
