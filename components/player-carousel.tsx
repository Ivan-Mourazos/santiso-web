"use client";

import { useEffect, useRef, useState } from "react";
import { Crest } from "@/components/crest";
import type { PublicPlayer } from "@/lib/public-data";

const CLAMP = 3; // items rendered on each side (beyond = hidden at edge pos)

export function PlayerCarousel({
  players,
  locale,
}: {
  players: PublicPlayer[];
  locale: string;
}) {
  const gl = locale === "gl";
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = players.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setActive((a) => Math.max(0, a - 1));
      if (e.key === "ArrowRight") setActive((a) => Math.min(count - 1, a + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  return (
    <div
      className={`player-fan${entered ? " player-fan--entered" : ""}`}
      ref={ref}
    >
      <div className="player-fan__track">
        {players.map((player, i) => {
          const rawPos = i - active;
          const pos = Math.max(-CLAMP, Math.min(CLAMP, rawPos));
          const displayName = player.apodo?.trim() || player.nombre;
          const isCenter = rawPos === 0;
          const isClickable = Math.abs(rawPos) <= 2 && !isCenter;

          return (
            <div
              key={player.id}
              className="player-fan__item"
              data-pos={pos}
              aria-hidden={Math.abs(rawPos) > 2}
              style={{ "--i": i } as React.CSSProperties}
              onClick={isClickable ? () => setActive(i) : undefined}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : -1}
              onKeyDown={
                isClickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") setActive(i);
                    }
                  : undefined
              }
            >
              <div className="player-fan__content">
                <div className="player-fan__photo">
                  <Crest src={player.foto_url} name={displayName} size={300} />
                  {player.dorsal != null ? (
                    <span className="player-fan__dorsal">{player.dorsal}</span>
                  ) : null}
                </div>
                <div className="player-fan__info">
                  <p className="player-fan__pos">
                    {player.posicion ?? (gl ? "Xogador" : "Jugador")}
                  </p>
                  <h3 className="player-fan__name">{displayName}</h3>
                  {player.capitan ? (
                    <span className="player-fan__captain">
                      {gl ? "Capitán" : "Capitán"}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 ? (
        <div className="player-fan__controls">
          <button
            type="button"
            className="player-fan__btn"
            onClick={() => setActive((a) => Math.max(0, a - 1))}
            disabled={active === 0}
            aria-label={gl ? "Xogador anterior" : "Jugador anterior"}
          >
            ‹
          </button>
          <span className="player-fan__counter" aria-live="polite">
            {active + 1} / {count}
          </span>
          <button
            type="button"
            className="player-fan__btn"
            onClick={() => setActive((a) => Math.min(count - 1, a + 1))}
            disabled={active === count - 1}
            aria-label={gl ? "Xogador seguinte" : "Jugador siguiente"}
          >
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}
