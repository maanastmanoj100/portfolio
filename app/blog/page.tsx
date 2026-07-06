import type { Metadata } from "next";
import { BlogPage } from "@/modules/blog/blog-page";

export const metadata: Metadata = {
  title: "Blog | Cyber Nexus",
  description: "Cybersecurity research, tutorials, and industry analysis.",
};

export default function Blog() {
  return <BlogPage />;
}
