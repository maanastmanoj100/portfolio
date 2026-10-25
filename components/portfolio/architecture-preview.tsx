"use client";

import { useCallback, useRef, useState } from "react";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconArrowUpRight,
  IconSitemap,
  IconX,
} from "@tabler/icons-react";
import { useDialog } from "@/hooks/use-dialog";
import type { ProjectArchitecture } from "@/data/portfolio";
import { cn } from "@/lib/utils";

interface ArchitecturePreviewProps {
  projectName: string;
  architecture: ProjectArchitecture;
  repoUrl: string;
}

/**
 * Architecture preview.
 *
 * There are no generated images here: each entry in `data/portfolio.ts` was
 * written from the repository's own README or ARCHITECTURE.md, and `basis`
 * names that document. The dialog renders the stages as text and lists the
 * documented data flow in order, so the diagram has a complete text
 * alternative and stays readable on small screens.
 */
export function ArchitecturePreview({
  projectName,
  architecture,
  repoUrl,
}: ArchitecturePreviewProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const containerRef = useDialog({
    open,
    onClose: close,
    initialFocusRef: closeButtonRef,
  });

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setExpanded(false);
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-border-hover hover:bg-white/5"
      >
        <IconSitemap size={15} aria-hidden="true" />
        View architecture
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />
          <div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="architecture-title"
            aria-describedby="architecture-basis"
            tabIndex={-1}
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl",
              expanded ? "max-w-6xl" : "max-w-3xl",
            )}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <IconSitemap size={15} className="text-accent" aria-hidden="true" />
              <h2 id="architecture-title" className="min-w-0 truncate text-sm font-medium text-foreground">
                Architecture — {projectName}
              </h2>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  aria-pressed={expanded}
                  className="hidden h-8 items-center gap-1.5 rounded-md px-2 text-xs text-foreground-secondary transition-colors hover:bg-white/[0.04] hover:text-foreground sm:flex"
                >
                  {expanded ? (
                    <IconArrowsMinimize size={14} aria-hidden="true" />
                  ) : (
                    <IconArrowsMaximize size={14} aria-hidden="true" />
                  )}
                  {expanded ? "Collapse" : "Larger view"}
                </button>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={close}
                  aria-label="Close architecture preview"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-secondary transition-colors hover:bg-white/[0.04] hover:text-foreground"
                >
                  <IconX size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              className={cn(
                "overflow-y-auto px-4 py-4 sm:px-5",
                expanded ? "max-h-[calc(90vh-8rem)]" : "max-h-[min(78vh,40rem)]",
              )}
            >
              <p
                id="architecture-basis"
                className="rounded-md border border-border bg-white/[0.02] px-3 py-2 text-xs leading-relaxed text-foreground-tertiary"
              >
                Based on: {architecture.basis}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
                {architecture.summary}
              </p>

              <section aria-labelledby="architecture-stages" className="mt-5">
                <h3
                  id="architecture-stages"
                  className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary"
                >
                  Stages
                </h3>
                <ol className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {architecture.stages.map((stage, index) => (
                    <li
                      key={stage.label}
                      className="rounded-lg border border-border bg-white/[0.02] p-3"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[10px] text-foreground-tertiary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h4 className="font-mono text-xs font-medium text-foreground">
                          {stage.label}
                        </h4>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {stage.items.map((item) => (
                          <li
                            key={item}
                            className={cn(
                              "leading-relaxed text-foreground-secondary",
                              expanded ? "text-sm" : "text-xs",
                            )}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
                <p className="mt-2 text-[11px] text-foreground-tertiary">
                  Stages describe layers or modules named in the source document; they are not
                  necessarily a request sequence.
                </p>
              </section>

              <section aria-labelledby="architecture-flow" className="mt-5">
                <h3
                  id="architecture-flow"
                  className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary"
                >
                  Documented data flow
                </h3>
                <ol className="mt-2 space-y-1.5">
                  {architecture.dataFlow.map((step, index) => (
                    <li
                      key={step}
                      className={cn(
                        "flex gap-2.5 leading-relaxed text-foreground-secondary",
                        expanded ? "text-sm" : "text-xs",
                      )}
                    >
                      <span className="mt-0.5 shrink-0 font-mono text-[10px] text-foreground-tertiary">
                        {index + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {architecture.notes && architecture.notes.length > 0 && (
                <section aria-labelledby="architecture-notes" className="mt-5">
                  <h3
                    id="architecture-notes"
                    className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary"
                  >
                    Notes from the documentation
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {architecture.notes.map((note) => (
                      <li
                        key={note}
                        className="flex gap-2.5 text-xs leading-relaxed text-foreground-secondary"
                      >
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground-tertiary"
                          aria-hidden="true"
                        />
                        {note}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-[11px] text-foreground-tertiary">
              <span>Summary of the repository documentation, not a generated diagram.</span>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-foreground-secondary transition-colors hover:text-foreground"
              >
                Read the source
                <IconArrowUpRight size={12} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
