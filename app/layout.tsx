import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cyber Nexus | Cybersecurity Professional Portfolio",
  description: "Award-winning cybersecurity professional specializing in penetration testing, incident response, and security architecture. Explore interactive projects, certifications, and cutting-edge security research.",
  keywords: ["cybersecurity", "penetration testing", "ethical hacking", "security engineer", "portfolio"],
  openGraph: {
    title: "Cyber Nexus | Cybersecurity Professional Portfolio",
    description: "Award-winning cybersecurity professional specializing in penetration testing and security architecture.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
