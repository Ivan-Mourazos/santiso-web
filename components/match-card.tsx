import { Crest } from "@/components/crest";
import { categoryLabel, formatMatchDate, formatMatchTime } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import type { PublicMatchCard } from "@/lib/public-data";

export function MatchCard({
  match,
  locale,
}: {
  match: PublicMatchCard;
  locale: Locale;
}) {
  const finished = match.estado === "finalizado";

  return (
    <article className="match-card">
      <header>
        <span>{categoryLabel(match.categoria, locale)}</span>
        <small>
          {locale === "gl" ? "Xornada" : "Jornada"} {match.jornada_numero}
        </small>
      </header>
      <div className="match-card__teams">
        <div className="match-team">
          <Crest src={match.local_escudo_url} name={match.local_nombre} />
          <strong>{match.local_nombre}</strong>
        </div>
        <div className="match-score">
          {finished ? (
            <strong>
              {match.goles_local} <span>·</span> {match.goles_visitante}
            </strong>
          ) : (
            <strong>{formatMatchTime(match.fecha)}</strong>
          )}
          <small>{formatMatchDate(match.fecha, locale)}</small>
        </div>
        <div className="match-team">
          <Crest src={match.visitante_escudo_url} name={match.visitante_nombre} />
          <strong>{match.visitante_nombre}</strong>
        </div>
      </div>
      <footer>
        <span>{match.competicion}</span>
        <small>{match.campo_nombre ?? (locale === "gl" ? "Campo pendente" : "Campo pendiente")}</small>
      </footer>
    </article>
  );
}
