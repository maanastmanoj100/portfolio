import type { Variants, Transition } from "framer-motion";

export const easings = {
  smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  anticipate: [0.36, 0.07, 0.19, 0.97] as [number, number, number, number],
  decelerate: [0, 0.55, 0.45, 1] as [number, number, number, number],
  accelerate: [0.55, 0, 1, 0.45] as [number, number, number, number],
  linear: [0, 0, 1, 1] as [number, number, number, number],
};

export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
  slower: 0.7,
  slowest: 1.0,
  page: 0.6,
};

export const spring = {
  stiff: { type: "spring" as const, stiffness: 300, damping: 25, mass: 0.5 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 18, mass: 0.8 },
  smooth: { type: "spring" as const, stiffness: 200, damping: 20, mass: 0.5 },
  gentle: { type: "spring" as const, stiffness: 120, damping: 18, mass: 0.5 },
  responsive: { type: "spring" as const, stiffness: 350, damping: 28, mass: 0.3 },
};

export const stagger = {
  fast: { staggerChildren: 0.04 },
  normal: { staggerChildren: 0.07 },
  slow: { staggerChildren: 0.1 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.normal, ease: easings.smooth } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.slow, ease: easings.smooth } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.normal, ease: easings.smooth } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: durations.slow, ease: easings.smooth } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: durations.slow, ease: easings.smooth } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: durations.slow, ease: easings.smooth } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.normal, ease: easings.smooth } },
};

export const cardHover = {
  rest: { y: 0, boxShadow: "0 4px 24px rgba(0,0,0,0.4)" },
  hover: {
    y: -4,
    boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
    transition: { duration: durations.fast, ease: easings.smooth },
  },
};

export const buttonTap = {
  rest: { scale: 1 },
  tap: { scale: 0.97, transition: { duration: durations.instant, ease: easings.linear } },
};

export const listItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

export const pageEnter: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)", scale: 0.98 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: durations.page, ease: easings.smooth },
  },
  exit: {
    opacity: 0,
    filter: "blur(4px)",
    scale: 0.98,
    transition: { duration: durations.slow, ease: easings.accelerate },
  },
};

export const glassFloat: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: durations.slow, ease: easings.spring } },
};

export const dockMagnify: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.3,
};

export const notificationSlide: Variants = {
  hidden: { opacity: 0, x: 60, scale: 0.95, filter: "blur(2px)" },
  visible: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)", transition: { duration: durations.normal, ease: easings.smooth } },
  exit: { opacity: 0, x: 60, scale: 0.95, filter: "blur(2px)", transition: { duration: durations.fast, ease: easings.accelerate } },
};

export const modalExpand: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(4px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: durations.slow, ease: easings.smooth } },
  exit: { opacity: 0, scale: 0.92, filter: "blur(4px)", transition: { duration: durations.fast, ease: easings.accelerate } },
};

export const shimmerVariants: Variants = {
  hidden: { backgroundPosition: "-200% center" },
  visible: { backgroundPosition: "200% center", transition: { duration: 1.5, repeat: Infinity, ease: "linear" } },
};
