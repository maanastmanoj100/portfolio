"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
      style={{
        background: springX,
        backgroundImage: springY,
      }}
      // Use a div with absolute positioned radial gradient instead
    >
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          left: springX,
          top: springY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle at center, rgba(0,180,216,0.03) 0%, transparent 60%)",
        }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          left: springX,
          top: springY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle at center, rgba(139,92,246,0.02) 0%, transparent 50%)",
        }}
      />
    </motion.div>
  );
}
