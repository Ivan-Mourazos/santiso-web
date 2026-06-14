import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found shell">
      <span>404</span>
      <h1>Páxina non atopada.</h1>
      <p>La página que buscas no existe o cambió de dirección.</p>
      <Link className="button" href="/gl">
        Volver ao inicio
      </Link>
    </section>
  );
}
