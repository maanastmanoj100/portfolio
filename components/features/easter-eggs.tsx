"use client";

import { useEffect, useCallback, useState } from "react";

/**
 * Keyboard easter eggs.
 *
 * This used to render through framer-motion, which meant ~38 KB gzip of
 * animation library was fetched on every route before anything interactive
 * happened — for an overlay most visitors never see. The entrance is a single
 * CSS keyframe now; the global `prefers-reduced-motion` rule collapses it to an
 * instant appearance, and the 3s timer still removes the node.
 */

const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const matrixCode = ["m", "a", "t", "r", "i", "x"];

export function EasterEggs() {
  const [showKonami, setShowKonami] = useState(false);
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [matrixProgress, setMatrixProgress] = useState(0);

  const handleKonami = useCallback(() => {
    setShowKonami(true);
    document.documentElement.classList.toggle("matrix-mode");
    setTimeout(() => setShowKonami(false), 3000);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiProgress]) {
        const next = konamiProgress + 1;
        if (next === konamiCode.length) {
          handleKonami();
          setKonamiProgress(0);
        } else {
          setKonamiProgress(next);
        }
      } else {
        setKonamiProgress(0);
      }

      if (e.key === matrixCode[matrixProgress]) {
        const next = matrixProgress + 1;
        if (next === matrixCode.length) {
          document.documentElement.classList.toggle("matrix-mode");
          setMatrixProgress(0);
        } else {
          setMatrixProgress(next);
        }
      } else {
        setMatrixProgress(0);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [konamiProgress, matrixProgress, handleKonami]);

  if (!showKonami) return null;

  return (
    <div
      className="animate-easter-pop pointer-events-none fixed inset-0 z-[200] flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="mb-4 text-6xl" aria-hidden="true">
          🛡️
        </div>
        <div className="text-gradient mb-2 text-2xl font-bold">EASTER EGG UNLOCKED!</div>
        <div className="text-sm text-foreground-secondary">
          Matrix Mode Toggled. Type &apos;matrix&apos; anytime to toggle.
        </div>
      </div>
    </div>
  );
}
