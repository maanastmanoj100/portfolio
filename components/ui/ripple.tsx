"use client";

import { useRef, useState, type ReactNode } from "react";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

interface RippleProps {
  children: ReactNode;
  className?: string;
  color?: string;
  disabled?: boolean;
}

export function Ripple({ children, className, color = "rgba(255,255,255,0.12)", disabled }: RippleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`} onClick={handleClick}>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: ripple.x - 4,
            top: ripple.y - 4,
            width: 8,
            height: 8,
            background: color,
            animation: "ripple 0.6s ease-out forwards",
          }}
        />
      ))}
      {children}
    </div>
  );
}
