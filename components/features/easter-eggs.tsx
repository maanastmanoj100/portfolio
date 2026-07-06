"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <AnimatePresence>
      {showKonami && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🛡️</div>
            <div className="text-2xl font-bold text-gradient mb-2">EASTER EGG UNLOCKED!</div>
            <div className="text-sm text-soft-white/50">Matrix Mode Toggled. Type &apos;matrix&apos; anytime to toggle.</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
