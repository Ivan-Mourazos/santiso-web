import type { Metadata } from "next";
import Link from "next/link";
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
          <section className="not-found shell">
            <span>404</span>
            <h1>Páxina non atopada.</h1>
            <p>La página que buscas no existe o cambió de dirección.</p>
            <Link className="button" href="/gl">
              Volver ao inicio
            </Link>
          </section>
        </main>
      </body>
    </html>
  );
}
