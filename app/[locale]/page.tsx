import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getContent } from "@/lib/content";
import { readLocale } from "@/lib/locale";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const copy = getContent(locale);
  const teams =
    locale === "gl"
      ? [
          ["Senior", "O primeiro equipo do club"],
          ["Feminino", "Talento, identidade e futuro"],
          ["Veteranos", "Experiencia que segue competindo"],
        ]
      : [
          ["Senior", "El primer equipo del club"],
          ["Femenino", "Talento, identidad y futuro"],
          ["Veteranos", "Experiencia que sigue compitiendo"],
        ];

  return (
    <>
      <section className="hero">
        <div className="hero__texture" />
        <div className="shell hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">{copy.home.eyebrow}</p>
            <h1>
              <span>{copy.home.titleA}</span>
              <strong>{copy.home.titleB}</strong>
            </h1>
            <p className="hero__intro">{copy.home.intro}</p>
            <div className="hero__actions">
              <Link className="button" href={`/${locale}/partidos`}>
                {copy.common.matches}
              </Link>
              <Link className="text-link" href={`/${locale}/club`}>
                {copy.common.explore} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="hero__monogram" aria-hidden="true">
            <span>UD</span>
            <strong>S</strong>
            <small>1990 · Santiso</small>
          </div>
        </div>
        <div className="hero__ticker">
          <div>
            <span>Senior</span><i />
            <span>Feminino</span><i />
            <span>Veteranos</span><i />
            <span>U.D. Santiso F.C.</span><i />
            <span>Senior</span><i />
            <span>Feminino</span><i />
            <span>Veteranos</span>
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionHeading
          eyebrow={copy.home.seasonLabel}
          title={copy.home.seasonTitle}
          body={copy.home.seasonBody}
        />
        <div className="team-grid">
          {teams.map(([name, description], index) => (
            <Link
              className="team-card"
              href={`/${locale}/equipos#${name.toLowerCase()}`}
              key={name}
            >
              <span className="team-card__index">0{index + 1}</span>
              <div>
                <p>{description}</p>
                <h3>{name}</h3>
              </div>
              <span className="team-card__arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--light">
        <div className="shell split-feature">
          <div className="split-feature__visual">
            <span>90</span>
            <p>{locale === "gl" ? "partidos do Santiso" : "partidos del Santiso"}</p>
            <small>{copy.common.season}</small>
          </div>
          <SectionHeading
            eyebrow={copy.home.pulseLabel}
            title={copy.home.pulseTitle}
            body={copy.home.pulseBody}
          />
        </div>
      </section>

      <section className="section shell shop-callout">
        <div>
          <p className="eyebrow">{copy.nav.shop}</p>
          <h2>{copy.home.shopTitle}</h2>
          <p>{copy.home.shopBody}</p>
        </div>
        <Link className="button button--dark" href={`/${locale}/tenda`}>
          {copy.common.shop}
        </Link>
      </section>
    </>
  );
}
