"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  label?: string;
  title: string;
  highlight?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({ label, title, highlight, description, action, className, align = "left" }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-10",
        align === "center" && "text-center",
        className
      )}
    >
      {label && (
        <div className="flex items-center gap-3 mb-2 justify-center">
          <span className="px-2 py-0.5 text-xs font-mono border border-cyan/20 text-cyan rounded bg-cyan/5 uppercase tracking-wider">
            {label}
          </span>
        </div>
      )}
      <div className={cn("flex items-start justify-between gap-4", align === "center" && "flex-col items-center")}>
        <div>
          <h2 className="text-3xl sm:text-4xl font-light text-soft-white">
            {title}{highlight && <span className="text-gradient font-medium"> {highlight}</span>}
          </h2>
          {description && <p className="text-soft-white/50 mt-2 max-w-lg text-sm">{description}</p>}
        </div>
        {action && <div className="shrink-0 mt-1">{action}</div>}
      </div>
    </motion.div>
  );
}
