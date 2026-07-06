import { ProjectDetailPage } from "@/modules/projects/project-detail-page";

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  return <ProjectDetailPage slugPromise={params} />;
}
