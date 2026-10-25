import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { profile } from "@/data/portfolio";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0e0a",
};

// The service worker must never run in development: caching an in-progress
// build is a classic cause of stale pages and chunk-load errors.
const enableServiceWorker = process.env.NODE_ENV === "production";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.metaDescription,
  keywords: ["cybersecurity", "full-stack developer", "Next.js", "TypeScript", "Python", "portfolio"],
  authors: [{ name: profile.name, url: profile.github }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: profile.name,
  },
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.metaDescription,
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
        {enableServiceWorker && (
          <Script
            id="sw-register"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if ("serviceWorker" in navigator) {
                  window.addEventListener("load", () => {
                    navigator.serviceWorker.register("/sw.js").then((reg) => {
                      // Pick up new deployments without a full reload loop.
                      reg.addEventListener("updatefound", () => {
                        const next = reg.installing;
                        if (next) next.addEventListener("statechange", () => {
                          if (next.state === "installed" && navigator.serviceWorker.controller) {
                            next.postMessage("SKIP_WAITING");
                          }
                        });
                      });
                    }).catch(() => {});
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
