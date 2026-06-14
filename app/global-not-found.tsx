import type { Metadata } from "next";
import { NotFoundMessage } from "@/components/not-found-message";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 | U.D. Santiso F.C.",
  description: "A páxina solicitada non existe.",
};

export default function GlobalNotFound() {
  return (
    <html lang="gl">
      <body>
        <main className="site-frame">
          <NotFoundMessage />
        </main>
      </body>
    </html>
  );
}
