import type { Metadata } from "next";
import {
  getProject,
  ProjectDetailPage,
} from "@/modules/projects/project-detail-page";
import { featuredProjects, otherProjects, profile } from "@/data/portfolio";

export function generateStaticParams() {
  return [...featuredProjects, ...otherProjects].map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.name,
    description: project.tagline,
    authors: [{ name: profile.name, url: profile.github }],
  };
}

export default function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ProjectDetailPage params={params} />;
}
