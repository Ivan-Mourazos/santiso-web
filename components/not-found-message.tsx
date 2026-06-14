import Link from "next/link";

export function NotFoundMessage() {
  return (
    <section className="not-found shell">
      <span>404</span>
      <h1>
        <span lang="gl">Páxina non atopada.</span>
        <span lang="es">Página no encontrada.</span>
      </h1>
      <p>
        <span lang="gl">A páxina que buscas non existe ou cambiou de enderezo.</span>
        <span lang="es">La página que buscas no existe o cambió de dirección.</span>
      </p>
      <Link className="button" href="/gl">
        <span lang="gl">Volver ao inicio</span>
        <span aria-hidden="true"> / </span>
        <span lang="es">Volver al inicio</span>
      </Link>
    </section>
  );
}
