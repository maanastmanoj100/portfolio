import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";

export const metadata: Metadata = {
  title: "Contact | Cyber Nexus",
  description: "Get in touch for security consulting opportunities.",
};

export default function Contact() {
  return <ContactPage />;
}
