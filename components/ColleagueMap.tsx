"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { AnimatedFox } from "@/components/home/AnimatedFox";
import { orderedTags, type ColleagueTag, type ColleagueTerritory } from "@/lib/colleagues";
import { DEN, MAP_H, MAP_W, placeColleagues, TERRITORIES, TERRITORY_ORDER, type ColleaguePin } from "@/lib/colleague-map";

const TAG_COLOR: Record<ColleagueTag, string> = {
  SNT: "#3b82f6",
  "Première": "#f97316",
  Terminale: "#a855f7",
  Outils: "#10b981",
  Bac: "#e11d48",
};

/* Couleurs du décor, en aplats comme les renards du site. */
const LEAF = "#7a9a3c";
const LEAF_DARK = "#5d7d2c";
const LEAF_LIGHT = "#9db552";
const EARTH = "#b07a4f";
const EARTH_DARK = "#8c5c38";
const HOLE = "#3a271a";
const INK = "#2a1a0e";

const domain = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Tree({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-4} y={-22} width={8} height={24} fill={EARTH_DARK} />
      <polygon points="0,-110 -34,-40 0,-48" fill={LEAF} />
      <polygon points="0,-110 34,-40 0,-48" fill={LEAF_DARK} />
      <polygon points="0,-78 -42,-16 0,-24" fill={LEAF} />
      <polygon points="0,-78 42,-16 0,-24" fill={LEAF_DARK} />
    </g>
  );
}

function RoundTree({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-4} y={-30} width={8} height={32} fill={EARTH_DARK} />
      <polygon points="0,-104 -36,-80 -40,-44 -12,-28 0,-30" fill="#e48a3a" />
      <polygon points="0,-104 36,-80 40,-44 12,-28 0,-30" fill="#c9662a" />
    </g>
  );
}

function Bush({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <polygon points="-40,0 -30,-26 -12,-34 -2,-14 -20,0" fill={LEAF_LIGHT} />
      <polygon points="-20,0 -6,-40 14,-30 22,0" fill={LEAF} />
      <polygon points="8,0 22,-28 40,-16 42,0" fill={LEAF_DARK} />
    </g>
  );
}

/** Un terrier : une butte de terre en deux facettes et son entrée. */
function Mound({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <>
      <polygon points={`${x - w / 2},${y} ${x - w * 0.32},${y - h * 0.78} ${x - w * 0.05},${y - h} ${x},${y}`} fill={EARTH} />
      <polygon points={`${x - w * 0.05},${y - h} ${x + w * 0.3},${y - h * 0.72} ${x + w / 2},${y} ${x},${y}`} fill={EARTH_DARK} />
      <path
        d={`M${x - w * 0.19},${y} Q${x - w * 0.19},${y - h * 0.62} ${x},${y - h * 0.62} Q${x + w * 0.19},${y - h * 0.62} ${x + w * 0.19},${y} Z`}
        fill={HOLE}
      />
    </>
  );
}

const FOREST: Array<[number, number]> = [
  [60, 140], [100, 260], [190, 110], [250, 230], [330, 120], [350, 260], [60, 360], [300, 330], [160, 330], [400, 190],
];
const PEAKS: Array<[number, number, number, number]> = [
  [640, 330, 210, 200], [780, 320, 240, 250], [920, 330, 190, 190], [700, 330, 150, 130],
];
const MEADOW_BUSHES: Array<[number, number]> = [[70, 520], [380, 470], [420, 590], [60, 610], [240, 500]];
const RIVER = "M560 0 C 520 120, 600 200, 540 300 S 470 470, 560 640";

/** Le décor ne dépend pas des collègues : il n'est dessiné qu'une fois. */
function Scenery() {
  return (
    <>
      <rect width={MAP_W} height={MAP_H} fill="#f3e6c8" />
      <path d="M0 400 C 120 380, 300 420, 470 400 L470 640 L0 640 Z" fill="#d4e09a" />
      <path d="M0 0 L470 0 L470 380 C 300 400, 120 370, 0 390 Z" fill="#c7d58b" opacity={0.55} />
      <path d="M600 0 L1000 0 L1000 360 L600 360 Z" fill="#e6dcef" opacity={0.7} />
      <path d="M600 400 L1000 400 L1000 640 L600 640 Z" fill="#ece5dc" opacity={0.8} />
      <path d={RIVER} stroke="#9cc7e8" strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d={RIVER} stroke="#c4def2" strokeWidth={8} fill="none" strokeDasharray="20 26" />
      {MEADOW_BUSHES.map(([x, y], k) => (
        <Bush key={`b${k}`} x={x} y={y} s={0.5 + (k % 2) * 0.2} />
      ))}
      {Array.from({ length: 22 }, (_, k) => (
        <circle key={`f${k}`} cx={60 + ((k * 53) % 380)} cy={430 + ((k * 37) % 190)} r={3} fill={k % 2 ? "#fff" : "#f7c948"} />
      ))}
      {FOREST.map(([x, y], k) =>
        k % 3 ? <RoundTree key={`t${k}`} x={x} y={y} s={0.62 + (k % 2) * 0.12} /> : <Tree key={`t${k}`} x={x} y={y} s={0.62} />,
      )}
      {PEAKS.map(([x, y, w, h], k) => (
        <g key={`m${k}`}>
          <polygon points={`${x - w / 2},${y} ${x},${y - h} ${x},${y}`} fill="#b9a6cf" />
          <polygon points={`${x},${y - h} ${x + w / 2},${y} ${x},${y}`} fill="#9a84b8" />
          <polygon
            points={`${x - w * 0.12},${y - h * 0.76} ${x},${y - h} ${x + w * 0.12},${y - h * 0.76} ${x + w * 0.04},${y - h * 0.7} ${x - w * 0.04},${y - h * 0.78}`}
            fill="#fff"
          />
        </g>
      ))}
      <polygon points="640,610 700,520 760,500 820,430 900,470 960,610" fill="#a9a29a" />
      <polygon points="820,430 900,470 960,610 860,610" fill="#8a837b" />
      <rect x={818} y={372} width={5} height={60} fill="#5b4a3a" />
      <polygon points="823,374 866,388 823,404" fill={TERRITORIES.Bac.color} />
    </>
  );
}

/** Place la fiche à côté du terrier, en dessous s'il est en haut de la carte, au-dessus sinon. */
function cardPlacement(pin: ColleaguePin) {
  const below = pin.y < 380;
  const shift = pin.x < 190 ? 12 : pin.x > MAP_W - 190 ? 88 : 50;
  return {
    below,
    shift,
    // Lu seulement sur grand écran (globals.css) : ailleurs, la fiche reste sous la carte.
    style: {
      "--card-x": `${(pin.x / MAP_W) * 100}%`,
      "--card-y": `${((below ? pin.y + 18 : pin.y - 64) / MAP_H) * 100}%`,
      "--card-shift": `-${shift}%`,
      "--card-lift": below ? "0%" : "-100%",
    },
  };
}

export default function ColleagueMap() {
  const pins = useMemo(() => placeColleagues(), []);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<ColleagueTerritory | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  // Sur téléphone, la carte défile de côté : elle s'ouvre centrée sur la tanière.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    // Sous la carte, sur téléphone et tablette, la fiche doit entrer dans l'écran.
    if (window.matchMedia("(max-width: 1023px)").matches) cardRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const open = (index: number) => setSelected((current) => (current === index ? null : index));
  const onPinKey = (event: KeyboardEvent, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open(index);
    }
  };

  const pin = selected === null ? null : pins[selected];
  const zone = pin ? TERRITORIES[pin.territory] : null;
  const placement = pin ? cardPlacement(pin) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-8">
      <div className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[#f3e6c8] shadow-[var(--shadow)]">
        <div ref={scrollRef} className="overflow-x-auto [scrollbar-width:thin]">
          <div className="relative min-w-[760px]">
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="block h-auto w-full select-none"
              role="group"
              aria-label="Carte du territoire : la tanière au centre et les terriers des collègues autour"
              onClick={(event) => {
                if (event.target === event.currentTarget) setSelected(null);
              }}
            >
              <Scenery />
              {pins.map((p) => (
                <path
                  key={`trail-${p.colleague.site}`}
                  d={`M${DEN.x} ${DEN.y} Q ${(DEN.x + p.x) / 2} ${(DEN.y + p.y) / 2 - 40} ${p.x} ${p.y}`}
                  stroke="#a87c52"
                  strokeWidth={3}
                  strokeDasharray="2 9"
                  strokeLinecap="round"
                  fill="none"
                  opacity={filter && filter !== p.territory ? 0.2 : 0.7}
                />
              ))}
              <ellipse cx={500} cy={300} rx={90} ry={60} fill="#fde7b0" opacity={0.7} />
              <Mound x={500} y={340} w={150} h={74} />
              <rect x={440} y={352} width={120} height={30} rx={15} fill="#ea580c" />
              <text x={500} y={372} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff">
                La tanière
              </text>
              {TERRITORY_ORDER.map((key) => {
                const t = TERRITORIES[key];
                const half = t.label.length * 4.6;
                return (
                  <g key={key} aria-hidden>
                    <rect x={t.labelX - half - 14} y={t.labelY - 20} width={half * 2 + 28} height={30} rx={15} fill="#fffcf8" opacity={0.92} />
                    <circle cx={t.labelX - half} cy={t.labelY - 5} r={5} fill={t.color} />
                    <text x={t.labelX + 8} y={t.labelY} textAnchor="middle" fontSize={15} fontWeight={700} fill="#3b2614">
                      {t.label}
                    </text>
                  </g>
                );
              })}
              {pins.map((p, index) => {
                const color = TERRITORIES[p.territory].color;
                const active = selected === index;
                const half = p.colleague.name.length * 3.6 + 12;
                return (
                  <g
                    key={p.colleague.site}
                    role="button"
                    tabIndex={0}
                    aria-label={`Terrier de ${p.colleague.name}`}
                    aria-expanded={active}
                    className="colleague-pin cursor-pointer outline-none"
                    data-active={active || undefined}
                    style={{ opacity: filter && filter !== p.territory ? 0.3 : 1 }}
                    onClick={() => open(index)}
                    onKeyDown={(event) => onPinKey(event, index)}
                  >
                    <ellipse className="colleague-pin-ring" cx={p.x} cy={p.y + 4} rx={44} ry={16} fill="none" stroke={color} strokeWidth={3} />
                    <Mound x={p.x} y={p.y + 6} w={62} h={32} />
                    <g className="colleague-pin-tag">
                      <rect
                        x={p.x - half}
                        y={p.y - 58}
                        width={half * 2}
                        height={26}
                        rx={13}
                        fill={active ? color : "#fffcf8"}
                        stroke={color}
                        strokeWidth={2}
                      />
                      <text x={p.x} y={p.y - 40} textAnchor="middle" fontSize={13} fontWeight={700} fill={active ? "#fff" : INK}>
                        {p.colleague.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
            <div className="absolute" style={{ left: "43%", top: "30.6%", width: "14%" }}>
              <AnimatedFox className="block h-auto w-full" />
            </div>
          </div>
        </div>

        {pin && zone && placement && (
          <article
            ref={cardRef}
            aria-live="polite"
            aria-label={`Terrier de ${pin.colleague.name}`}
            className="colleague-card relative m-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] lg:m-0"
            style={{ ...placement.style, "--pin": zone.color, "--tip": `${placement.shift}%` } as CSSProperties}
            data-below={placement.below || undefined}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: zone.color }}>
                <svg viewBox="0 0 62 34" width={22} height={12} aria-hidden>
                  <Mound x={31} y={34} w={62} h={32} />
                </svg>
                {zone.label}
              </span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="-m-1.5 rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                aria-label="Fermer la fiche"
              >
                <X size={16} />
              </button>
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--fg)]">{pin.colleague.name}</h2>
            <p className="mt-0.5 font-mono text-xs text-[var(--subtle)]">{domain(pin.colleague.site)}</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{pin.colleague.phrase}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Niveaux couverts">
              {orderedTags(pin.colleague.tags).map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--muted)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: TAG_COLOR[tag] }} aria-hidden />
                  {tag}
                </li>
              ))}
            </ul>
            <a
              href={pin.colleague.site}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-fg)] transition-opacity hover:opacity-90"
            >
              Entrer dans le terrier <ArrowUpRight size={16} aria-hidden />
            </a>
          </article>
        )}
      </div>

      {/* Les mêmes sites en liste, pour les lecteurs d'écran et les moteurs de recherche. */}
      <ul className="sr-only">
        {pins.map((p) => (
          <li key={`link-${p.colleague.site}`}>
            <a href={p.colleague.site}>
              {p.colleague.name} : {p.colleague.phrase}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {TERRITORY_ORDER.map((key) => {
          const t = TERRITORIES[key];
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(active ? null : key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[var(--surface)] text-[var(--fg)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
              style={active ? { borderColor: t.color } : undefined}
            >
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: t.color }} aria-hidden />
              {t.label}
            </button>
          );
        })}
        <p className="text-sm text-[var(--subtle)] sm:ml-auto">Toucher un terrier pour lire sa fiche.</p>
      </div>
    </div>
  );
}
