import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch by email or GitHub.",
};

export default function Contact() {
  return <ContactPage />;
}
