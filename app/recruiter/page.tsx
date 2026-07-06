import type { Metadata } from "next";
import RecruiterExperiencePage from "@/modules/recruiter/recruiter-page";

export const metadata: Metadata = {
  title: "Recruiter Experience Platform | Cyber Nexus",
  description:
    "Dedicated workspace for recruiters, hiring managers, and technical interviewers — with smart entry, evidence explorer, project showcase, system design gallery, interview question bank, and AI assistant.",
};

export default function Page() {
  return <RecruiterExperiencePage />;
}
