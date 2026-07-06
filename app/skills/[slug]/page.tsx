import { SkillDetailPage } from "@/modules/skills/skill-detail-page";

export default function SkillDetail({ params }: { params: Promise<{ slug: string }> }) {
  return <SkillDetailPage slugPromise={params} />;
}
