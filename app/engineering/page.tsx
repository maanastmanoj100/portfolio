import type { Metadata } from "next";
import EngineeringPage from "@/modules/platform-engineering/engineering-page";

export const metadata: Metadata = {
  title: "Enterprise Engineering Platform | Cyber Nexus",
  description:
    "Production-grade software engineering practices: monorepo architecture, Liquid Glass design system, module isolation, CI/CD readiness, accessibility (WCAG AA), performance budgets, security engineering, and comprehensive documentation.",
};

export default function Page() {
  return <EngineeringPage />;
}
