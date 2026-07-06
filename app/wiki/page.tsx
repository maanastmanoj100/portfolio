import type { Metadata } from "next";
import WikiPage from "@/modules/wiki/wiki-page";

export const metadata: Metadata = {
  title: "Knowledge Wiki & Learning Encyclopedia | Cyber Nexus",
  description:
    "Explore cybersecurity concepts, technologies, methodologies, and learning resources connected directly to projects, labs, and practical experience.",
};

export default function Page() {
  return <WikiPage />;
}
