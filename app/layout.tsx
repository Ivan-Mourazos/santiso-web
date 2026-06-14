import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.shortName} | Sitio oficial`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description:
    "Sitio oficial da U.D. Santiso F.C. Partidos, clasificación, equipos, novas e tenda.",
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "gl_ES",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="gl">
      <body>{children}</body>
    </html>
  );
}
