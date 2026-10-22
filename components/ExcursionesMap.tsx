"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type FC,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import { localePath } from "@/lib/locale-utils";
import { excursiones, type Excursion } from "@/data/excursiones";
import { mapPins, uniquePinPositions } from "@/data/map-pins";
import { excursionSeo } from "@/lib/seo";

/* ───────────────── Constants ───────────────── */

const WA_NUMBER = "5492901489265";

const BASE_ELEVATION = [0, 0.06, 0.1, 0.14, 0.2, 0.26, 0.38, 0.55, 0.8, 1];

const DIFFICULTY_FILTERS = [
  { key: "Todas", esLabel: "Todas" },
  { key: "Media", esLabel: "Media" },
  { key: "Media / Alta", esLabel: "Media / Alta" },
  { key: "Alta", esLabel: "Alta" },
] as const;

type DifficultyKey = (typeof DIFFICULTY_FILTERS)[number]["key"];

const FULL_VB = { x: 0, y: 0, w: 600, h: 440 };
// Max zoom 1.3 — shows 2-3 pins always (item 12)
const ZOOM_W = Math.round(600 / 1.3);   // ~462
const ZOOM_H = Math.round(440 / 1.3);   // ~338
const LERP_SPEED = 0.08;

/* ───────────────── Helpers ───────────────── */

function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) - h + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function elevationForSlug(slug: string): number[] {
  const seed = slugHash(slug);
  return BASE_ELEVATION.map((v, i) => {
    const jitter = ((seed * (i + 1)) % 17) / 170;
    return Math.min(1, Math.max(0, v + jitter - 0.05));
  });
}

function diffBadgeClasses(esDificultad: string): string {
  if (esDificultad === "Alta") return "bg-red-600 text-white";
  if (esDificultad === "Media / Alta") return "bg-yellow-500 text-black";
  return "bg-brand-orange text-white";
}

function pinForExcursion(slug: string) {
  return mapPins.find((p) => p.slug === slug);
}

function esDificultadForExcursion(exc: Excursion): string {
  return exc.dificultad.es;
}

function matchesFilter(esDif: string, filter: DifficultyKey): boolean {
  if (filter === "Todas") return true;
  return esDif === filter;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/* ───────── Organic topographic contours (C3) ─────────
   Contours are iso-lines of a smooth scalar height field (marching squares).
   Iso-lines of a scalar field can never cross each other — guaranteed by
   construction, not by inspection. The field is smoothly masked to zero along
   the Ruta 3 corridor, so no contour can reach the road. Per-peak anisotropic
   gaussians (distinct rotation/aspect per peak) + low-frequency harmonics give
   elongated lobes and irregular, non-concentric rings; iso-levels are equally
   spaced in height but never in radius (steep flanks → tight rings, gentle
   flanks → wide rings). */

const RUTA3_ANCHORS: [number, number][] = [
  [30, 310], [140, 302], [260, 300], [380, 295], [500, 292], [580, 300],
];

/** Smooth y(x) approximation of RUTA3_PATH (same anchor points). */
function ruta3Y(x: number): number {
  const a = RUTA3_ANCHORS;
  if (x <= a[0][0]) return a[0][1];
  for (let i = 1; i < a.length; i++) {
    if (x <= a[i][0]) {
      const t = (x - a[i - 1][0]) / (a[i][0] - a[i - 1][0]);
      const s = 0.5 - 0.5 * Math.cos(t * Math.PI);
      return a[i - 1][1] + (a[i][1] - a[i - 1][1]) * s;
    }
  }
  return a[a.length - 1][1];
}

const CONTOUR_PEAKS = [
  { x: 300, y: 150, a: 1.0, sx: 80, sy: 56, rot: 0.55 },
  { x: 455, y: 135, a: 0.88, sx: 58, sy: 40, rot: -0.7 },
  { x: 165, y: 228, a: 0.82, sx: 64, sy: 44, rot: 1.15 },
  { x: 517, y: 252, a: 0.62, sx: 42, sy: 32, rot: 0.25 },
];

function heightAt(x: number, y: number): number {
  let g = 0;
  for (const p of CONTOUR_PEAKS) {
    const dx = x - p.x;
    const dy = y - p.y;
    const c = Math.cos(p.rot);
    const s = Math.sin(p.rot);
    const u = (dx * c + dy * s) / p.sx;
    const v = (-dx * s + dy * c) / p.sy;
    g += p.a * Math.exp(-(u * u + v * v) / 2);
  }
  // Low-frequency harmonics, weighted so they only deform the peak flanks
  const nw = Math.min(1, g / 0.15);
  const noise =
    0.09 * Math.sin(x * 0.017 + y * 0.011 + 1.7) +
    0.07 * Math.sin(x * 0.009 - y * 0.021 + 4.2) +
    0.05 * Math.sin((x + y) * 0.026 + 2.4);
  // Ruta 3 corridor: field → 0 within 30px of the road (smoothstep)
  const d = Math.abs(y - ruta3Y(x));
  const m = Math.max(0, Math.min(1, (d - 30) / 26));
  const mask = m * m * (3 - 2 * m);
  return (g + noise * nw) * mask;
}

const CONTOUR_LEVELS = [0.22, 0.34, 0.46, 0.58, 0.7];

function buildContourPaths(): string[] {
  const STEP = 5;
  const COLS = 600 / STEP;
  const ROWS = 440 / STEP;
  // Precompute the height grid once (121 × 89 samples)
  const grid: number[] = new Array((COLS + 1) * (ROWS + 1));
  for (let i = 0; i <= ROWS; i++) {
    for (let j = 0; j <= COLS; j++) {
      grid[i * (COLS + 1) + j] = heightAt(j * STEP, i * STEP);
    }
  }
  const gv = (j: number, i: number) => grid[i * (COLS + 1) + j];

  type P = [number, number];
  type Edge = "T" | "R" | "B" | "L";
  const lerpEdge = (x1: number, y1: number, v1: number, x2: number, y2: number, v2: number, level: number): P => {
    const t = (level - v1) / (v2 - v1 || 1e-9);
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
  };

  function segmentsFor(level: number): { a: P; b: P; used: boolean }[] {
    const segs: { a: P; b: P; used: boolean }[] = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const x0 = j * STEP;
        const y0 = i * STEP;
        const vA = gv(j, i);
        const vB = gv(j + 1, i);
        const vC = gv(j + 1, i + 1);
        const vD = gv(j, i + 1);
        let idx = 0;
        if (vA > level) idx |= 8;
        if (vB > level) idx |= 4;
        if (vC > level) idx |= 2;
        if (vD > level) idx |= 1;
        if (idx === 0 || idx === 15) continue;
        const T = () => lerpEdge(x0, y0, vA, x0 + STEP, y0, vB, level);
        const R = () => lerpEdge(x0 + STEP, y0, vB, x0 + STEP, y0 + STEP, vC, level);
        const B = () => lerpEdge(x0 + STEP, y0 + STEP, vC, x0, y0 + STEP, vD, level);
        const L = () => lerpEdge(x0, y0 + STEP, vD, x0, y0, vA, level);
        const mk: Record<Edge, () => P> = { T, R, B, L };
        let pairs: [Edge, Edge][];
        switch (idx) {
          case 1: pairs = [["L", "B"]]; break;
          case 2: pairs = [["R", "B"]]; break;
          case 3: pairs = [["L", "R"]]; break;
          case 4: pairs = [["T", "R"]]; break;
          case 6: pairs = [["T", "B"]]; break;
          case 7: pairs = [["T", "L"]]; break;
          case 8: pairs = [["T", "L"]]; break;
          case 9: pairs = [["T", "B"]]; break;
          case 11: pairs = [["T", "R"]]; break;
          case 12: pairs = [["L", "R"]]; break;
          case 13: pairs = [["R", "B"]]; break;
          case 14: pairs = [["L", "B"]]; break;
          case 5: {
            const c = (vA + vB + vC + vD) / 4;
            pairs = c > level ? [["T", "R"], ["L", "B"]] : [["T", "L"], ["R", "B"]];
            break;
          }
          case 10: {
            const c = (vA + vB + vC + vD) / 4;
            pairs = c > level ? [["T", "L"], ["R", "B"]] : [["T", "R"], ["L", "B"]];
            break;
          }
          default: pairs = [];
        }
        for (const [e1, e2] of pairs) segs.push({ a: mk[e1](), b: mk[e2](), used: false });
      }
    }
    return segs;
  }

  const key = (p: P) => `${Math.round(p[0] * 50)}:${Math.round(p[1] * 50)}`;

  function join(segs: { a: P; b: P; used: boolean }[]): P[][] {
    const map = new Map<string, { a: P; b: P; used: boolean }[]>();
    const push = (k: string, s: { a: P; b: P; used: boolean }) => {
      const arr = map.get(k);
      if (arr) arr.push(s);
      else map.set(k, [s]);
    };
    for (const s of segs) {
      if (key(s.a) === key(s.b)) { s.used = true; continue; }
      push(key(s.a), s);
      push(key(s.b), s);
    }
    const lines: P[][] = [];
    for (const s0 of segs) {
      if (s0.used) continue;
      s0.used = true;
      const line: P[] = [s0.a, s0.b];
      for (const dir of [1, 0] as const) {
        for (;;) {
          const end = dir === 1 ? line[line.length - 1] : line[0];
          const cands = map.get(key(end));
          let next: { a: P; b: P; used: boolean } | null = null;
          if (cands) for (const s of cands) if (!s.used) { next = s; break; }
          if (!next) break;
          next.used = true;
          const nxt = key(next.a) === key(end) ? next.b : next.a;
          if (dir === 1) line.push(nxt);
          else line.unshift(nxt);
        }
      }
      if (line.length > 3) lines.push(line);
    }
    return lines;
  }

  function chaikin(pts: P[], closed: boolean, iterations = 2): P[] {
    let cur = pts;
    for (let it = 0; it < iterations; it++) {
      const out: P[] = [];
      if (!closed) out.push(cur[0]);
      const n = cur.length;
      const lim = closed ? n : n - 1;
      for (let i = 0; i < lim; i++) {
        const p = cur[i];
        const q = cur[(i + 1) % n];
        out.push([p[0] * 0.75 + q[0] * 0.25, p[1] * 0.75 + q[1] * 0.25]);
        out.push([p[0] * 0.25 + q[0] * 0.75, p[1] * 0.25 + q[1] * 0.75]);
      }
      if (!closed) out.push(cur[n - 1]);
      cur = out;
    }
    return cur;
  }

  const paths: string[] = [];
  for (const level of CONTOUR_LEVELS) {
    for (const raw of join(segmentsFor(level))) {
      const xs = raw.map((p) => p[0]);
      const ys = raw.map((p) => p[1]);
      const diag = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
      if (diag < 12) continue; // drop specks
      const closed = Math.hypot(raw[0][0] - raw[raw.length - 1][0], raw[0][1] - raw[raw.length - 1][1]) < 1.5;
      const pts = chaikin(raw, closed, 2);
      let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)}`;
      if (closed) d += " Z";
      paths.push(d);
    }
  }
  return paths;
}

const CONTOUR_PATHS = buildContourPaths();

/* ───────────────── Ruta 3 path (item 15) ───────────────── */

// Ruta 3 runs roughly east-west through the valley, not connecting pins
const RUTA3_PATH = "M30,310 Q80,305 140,302 Q200,298 260,300 Q320,304 380,295 Q440,288 500,292 Q540,296 580,300";

/* ───────────────── Mini Elevation SVG ───────────────── */

const MiniElevation: FC<{ slug: string }> = ({ slug }) => {
  const pts = elevationForSlug(slug);
  const w = 160;
  const h = 40;
  const pad = 2;
  const usableH = h - pad * 2;
  const step = w / (pts.length - 1);

  const coords = pts.map((v, i) => ({ x: i * step, y: pad + usableH * (1 - v) }));
  const line = coords.map((c, i) => (i === 0 ? `M${c.x},${c.y}` : `L${c.x},${c.y}`)).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8 mt-1" aria-hidden>
      <path d={area} fill="rgba(232,93,4,0.12)" />
      <path d={line} fill="none" stroke="#E85D04" strokeWidth="1.5" />
    </svg>
  );
};

/* ───────────────── SVG Map ───────────────── */

interface MapSvgProps {
  activeSlug: string | null;
  filter: DifficultyKey;
  viewBox: { x: number; y: number; w: number; h: number };
  onPinClick: (slug: string) => void;
  locale: Locale;
}

const MapSvg: FC<MapSvgProps> = ({ activeSlug, filter, viewBox, onPinClick, locale }) => {
  const labels = t[locale];

  // Compute zoom scale for font compensation (item 13)
  const zoomScale = FULL_VB.w / viewBox.w; // 1 at full, ~1.3 at max zoom

  const canalPath = useMemo(() => {
    const y0 = 380;
    let d = `M0,${y0}`;
    for (let x = 0; x <= 600; x += 30) {
      const dy = Math.sin(x * 0.02) * 8 + Math.cos(x * 0.035) * 5;
      d += ` L${x},${y0 + dy}`;
    }
    d += ` L600,440 L0,440 Z`;
    return d;
  }, []);

  const vb = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;

  return (
    <svg
      viewBox={vb}
      className="w-full h-full"
      role="img"
      aria-label="Mapa de excursiones en Ushuaia"
    >
      <rect x="0" y="0" width="600" height="440" fill="#FAFAF8" />

      {/* Organic contour lines (item 14) */}
      {CONTOUR_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#D9D9D9"
          strokeWidth="1"
          opacity="0.6"
        />
      ))}

      {/* Canal Beagle */}
      <path d={canalPath} fill="#CFE3EA" />

      {/* Ushuaia city dot */}
      <rect x="256" y="318" width="8" height="5" rx="1" fill="#6B7280" />
      <text x="268" y="330" fontSize="9" fill="#6B7280" fontFamily="Inter, sans-serif">
        Ushuaia
      </text>

      {/* Ruta 3 — fina, naranja al 50% (item 15) */}
      <path
        d={RUTA3_PATH}
        fill="none"
        stroke="#E85D04"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        opacity="0.5"
      />

      {/* Pins (item 16) */}
      {uniquePinPositions.map((pin) => {
        const isActive = activeSlug === pin.slug ||
          mapPins.some((p) => p.x === pin.x && p.y === pin.y && p.slug === activeSlug);
        const pinExc = excursiones.find((e) => e.slug === pin.slug);
        const esDif = pinExc ? esDificultadForExcursion(pinExc) : "";
        const hidden = filter !== "Todas" && !matchesFilter(esDif, filter);

        // Hide pins that don't match the filter
        if (hidden) return null;

        // Font size compensated for zoom (item 13): 13px real → divide by zoomScale
        const fontSize = 13 / zoomScale;
        // Pin label positioning: check if near right edge
        const labelOnLeft = pin.x > 480;

        return (
          <g
            key={`${pin.x}-${pin.y}`}
            className="cursor-pointer"
            onClick={() => onPinClick(pin.slug)}
          >
            {/* Halo for active — small, soft (item 16) */}
            {isActive && (
              <circle cx={pin.x} cy={pin.y} r="14" fill="rgba(232,93,4,0.15)" />
            )}
            {/* Pin: 10px diameter (r=5), active=filled, inactive=white+border (item 16) */}
            <circle
              cx={pin.x}
              cy={pin.y}
              r="5"
              fill={isActive ? "#E85D04" : "#FFFFFF"}
              stroke="#E85D04"
              strokeWidth="2"
            />
            {/* Label background + text — font-size compensated (item 13) */}
            {(() => {
              const lx = labelOnLeft ? pin.x - 10 : pin.x + 10;
              const ly = pin.y + fontSize * 0.35;
              const labelLen = pin.nombre[locale].length * fontSize * 0.55;
              const bgX = labelOnLeft ? lx - labelLen - 2 : lx - 2;
              const bgY = ly - fontSize + 1;
              return (
                <>
                  <rect
                    x={bgX}
                    y={bgY}
                    width={labelLen + 4}
                    height={fontSize + 4}
                    rx={2}
                    fill="rgba(255,255,255,0.8)"
                  />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={labelOnLeft ? "end" : "start"}
                    fontSize={fontSize}
                    fontFamily="Inter, sans-serif"
                    fill="#374151"
                    fontWeight="500"
                  >
                    {pin.nombre[locale]}
                  </text>
                </>
              );
            })()}
          </g>
        );
      })}

      {/* Footer texts */}
      <text x="12" y="432" fontSize={9 / zoomScale} fill="#9CA3AF" fontFamily="Inter, sans-serif">
        {labels.map_footer_left}
      </text>
      <text
        x="588"
        y="432"
        textAnchor="end"
        fontSize={9 / zoomScale}
        fill="#9CA3AF"
        fontFamily="Inter, sans-serif"
      >
        {labels.map_footer_right}
      </text>
    </svg>
  );
};

/* ───────────────── Excursion Card ───────────────── */

interface CardProps {
  exc: Excursion;
  locale: Locale;
  isActive: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
}

const ExcursionCard: FC<CardProps> = ({ exc, locale, isActive, cardRef }) => {
  const labels = t[locale];
  const seo = excursionSeo[exc.slug]?.[locale];
  const altText = seo?.alts?.[0] ?? exc.nombre[locale];
  const esDif = esDificultadForExcursion(exc);

  const waMsg = encodeURIComponent(
    `${labels.wa_reserva_pre} ${exc.nombre[locale]}. ${labels.wa_reserva_post}`
  );

  return (
    <div
      ref={cardRef}
      data-slug={exc.slug}
      className={`
        rounded-xl bg-white shadow-md border transition-all duration-300
        ${isActive ? "border-brand-orange" : "border-transparent"}
        flex flex-col
        min-[900px]:flex-row
        w-full
      `}
    >
      <div className="relative min-[900px]:w-[38%] aspect-[2.2/1] min-[900px]:aspect-auto overflow-hidden rounded-t-xl min-[900px]:rounded-l-xl min-[900px]:rounded-tr-none">
        <Image
          src={exc.imagenHero}
          alt={altText}
          fill
          sizes="(min-width:900px) 38vw, 82vw"
          className="object-cover"
        />
        <span
          className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold ${diffBadgeClasses(esDif)}`}
        >
          {exc.dificultad[locale]}
        </span>
      </div>

      <div className="flex-1 px-4 py-3 min-[900px]:p-5 flex flex-col gap-1 min-[900px]:gap-2">
        <h3 className="text-[18px] min-[900px]:text-lg font-semibold text-brand-text leading-tight">
          {exc.nombre[locale]}
        </h3>

        <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {exc.distancia[locale]}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {exc.duracion[locale]}
          </span>
        </div>

        <p className="text-sm text-brand-text-secondary leading-relaxed line-clamp-2 min-[900px]:line-clamp-3">
          {exc.descripcionCorta[locale]}
        </p>

        {/* Mini elevation graph — desktop only */}
        <div className="hidden min-[900px]:block">
          <MiniElevation slug={exc.slug} />
        </div>

        <div className="flex items-center gap-3 mt-auto pt-1">
          <Link
            href={localePath(locale, `/excursiones/${exc.slug}`)}
            className="h-[44px] flex items-center justify-center px-4 text-sm font-medium rounded-lg border border-brand-orange text-brand-orange hover:bg-brand-orange/5 transition-colors"
          >
            {labels.excursiones_ver_mas}
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-[44px] flex items-center justify-center px-4 text-sm font-bold rounded-lg bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors"
          >
            {labels.reservar}
          </a>
        </div>
      </div>
    </div>
  );
};

/* ───────────────── Main Component ───────────────── */

/** Compute a viewBox that fits all visible pins with padding */
function fitVisiblePins(filteredSlugs: string[]): { x: number; y: number; w: number; h: number } {
  const pins = mapPins.filter((p) => filteredSlugs.includes(p.slug));
  if (pins.length === 0) return { ...FULL_VB };
  const xs = pins.map((p) => p.x);
  const ys = pins.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = 80;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const spanW = Math.max(maxX - minX + pad * 2, ZOOM_W);
  const spanH = Math.max(maxY - minY + pad * 2, ZOOM_H);
  // Maintain aspect ratio of FULL_VB
  const aspect = FULL_VB.w / FULL_VB.h;
  let w = spanW;
  let h = spanW / aspect;
  if (h < spanH) {
    h = spanH;
    w = spanH * aspect;
  }
  w = Math.min(w, FULL_VB.w);
  h = Math.min(h, FULL_VB.h);
  return {
    x: clamp(cx - w / 2, 0, FULL_VB.w - w),
    y: clamp(cy - h / 2, 0, FULL_VB.h - h),
    w,
    h,
  };
}

const ExcursionesMap: FC<{ locale: Locale }> = ({ locale }) => {
  const { lang } = useLang();
  const effectiveLocale = locale || (lang as Locale);
  const labels = t[effectiveLocale];

  const [activeSlug, setActiveSlug] = useState<string | null>(excursiones[0]?.slug ?? null);
  const [filter, setFilter] = useState<DifficultyKey>("Todas");

  const filteredExcursions = useMemo(
    () => excursiones.filter((e) => matchesFilter(esDificultadForExcursion(e), filter)),
    [filter],
  );

  const currentVB = useRef({ ...FULL_VB });
  const targetVB = useRef({ ...FULL_VB });
  const rafId = useRef<number>(0);
  const [renderedVB, setRenderedVB] = useState({ ...FULL_VB });

  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingToCard = useRef(false);

  // When filter changes: reset active to first visible, scroll to start, refit map
  useEffect(() => {
    if (filteredExcursions.length > 0) {
      setActiveSlug(filteredExcursions[0].slug);
    }
    // Reset scroll container to start
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [filter, filteredExcursions]);

  useEffect(() => {
    if (!activeSlug || !filteredExcursions.some((e) => e.slug === activeSlug)) {
      // Fit all visible pins
      targetVB.current = fitVisiblePins(filteredExcursions.map((e) => e.slug));
      return;
    }
    const pin = pinForExcursion(activeSlug);
    if (!pin) {
      targetVB.current = fitVisiblePins(filteredExcursions.map((e) => e.slug));
      return;
    }
    targetVB.current = {
      x: clamp(pin.x - ZOOM_W / 2, 0, 600 - ZOOM_W),
      y: clamp(pin.y - ZOOM_H / 2, 0, 440 - ZOOM_H),
      w: ZOOM_W,
      h: ZOOM_H,
    };
  }, [activeSlug, filteredExcursions]);

  useEffect(() => {
    function tick() {
      const cur = currentVB.current;
      const tgt = targetVB.current;
      cur.x += (tgt.x - cur.x) * LERP_SPEED;
      cur.y += (tgt.y - cur.y) * LERP_SPEED;
      cur.w += (tgt.w - cur.w) * LERP_SPEED;
      cur.h += (tgt.h - cur.h) * LERP_SPEED;

      const dx = Math.abs(tgt.x - cur.x);
      const dy = Math.abs(tgt.y - cur.y);
      const dw = Math.abs(tgt.w - cur.w);
      const dh = Math.abs(tgt.h - cur.h);

      if (dx > 0.3 || dy > 0.3 || dw > 0.3 || dh > 0.3) {
        setRenderedVB({ x: cur.x, y: cur.y, w: cur.w, h: cur.h });
      }

      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  useEffect(() => {
    const observedCards = Array.from(cardRefs.current.values());
    if (observedCards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingToCard.current) return;
        let bestEntry: IntersectionObserverEntry | null = null;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestEntry = entry;
          }
        });
        if (bestEntry) {
          const slug = (bestEntry as IntersectionObserverEntry).target.getAttribute("data-slug");
          if (slug) setActiveSlug(slug);
        }
      },
      { threshold: [0.3, 0.5, 0.7], rootMargin: "-30% 0px -30% 0px" }
    );

    observedCards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filter]);

  const handlePinClick = useCallback((slug: string) => {
    setActiveSlug(slug);
    const el = cardRefs.current.get(slug);
    if (!el) return;
    isScrollingToCard.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    setTimeout(() => { isScrollingToCard.current = false; }, 800);
  }, []);

  const setCardRef = useCallback(
    (slug: string) => (el: HTMLDivElement | null) => {
      if (el) cardRefs.current.set(slug, el);
      else cardRefs.current.delete(slug);
    },
    []
  );

  const filterLabel = useCallback(
    (key: DifficultyKey): string => {
      if (key === "Todas") return labels.map_filter_todas;
      return key;
    },
    [labels]
  );

  return (
    <section id="excursiones" className="pt-16 min-[900px]:pt-24 pb-0 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-[2.75rem] md:leading-tight font-bold text-brand-text text-center">
        {labels.excursiones_titulo}
      </h2>
      <p className="text-center text-brand-text-secondary text-sm mb-8">
        {labels.map_subtitle}
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-6" role="group" aria-label="Filtrar por dificultad">
        {DIFFICULTY_FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={isActive}
              className={`
                rounded-full border text-sm font-medium px-4 py-1.5 transition-colors min-h-[44px]
                ${isActive
                  ? "bg-brand-orange border-brand-orange text-white"
                  : "bg-white border-gray-200 text-brand-text hover:border-gray-300"
                }
              `}
            >
              {filterLabel(f.key)}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 min-[900px]:grid-cols-[1.2fr_1fr] min-[900px]:items-start gap-6">
        <div
          className="map-sticky sticky z-20 overflow-hidden relative
            max-[899px]:mx-3 max-[899px]:max-h-[38vh] max-[899px]:rounded-[20px] max-[899px]:border max-[899px]:border-[#E4E4E4] max-[899px]:bg-white max-[899px]:shadow-[0_6px_16px_rgba(0,0,0,.08)]
            min-[900px]:rounded-xl min-[900px]:bg-[#FAFAF8] min-[900px]:border min-[900px]:border-gray-100"
        >
          {/* Mobile map title */}
          <span className="absolute top-2 left-3 z-10 text-xs font-medium text-[#111] min-[900px]:hidden">
            {effectiveLocale === "en" ? "Excursion map" : effectiveLocale === "pt" ? "Mapa de excursões" : "Mapa de excursiones"}
          </span>
          <MapSvg
            activeSlug={activeSlug}
            filter={filter}
            viewBox={renderedVB}
            onPinClick={handlePinClick}
            locale={effectiveLocale}
          />
        </div>

        <div
          ref={scrollContainerRef}
          className="flex min-[900px]:flex-col gap-4 overflow-x-auto min-[900px]:overflow-visible snap-x snap-mandatory min-[900px]:snap-none pb-4 min-[900px]:pb-0 scrollbar-hide"
        >
          {filteredExcursions.map((exc) => (
              <div
                key={exc.slug}
                className="shrink-0 snap-start w-[82vw] min-[900px]:w-full min-[900px]:min-h-[80svh] min-[900px]:flex min-[900px]:items-center min-[900px]:snap-align-none"
              >
                <ExcursionCard
                  exc={exc}
                  locale={effectiveLocale}
                  isActive={activeSlug === exc.slug}
                  cardRef={setCardRef(exc.slug)}
                />
              </div>
            ))}
          {/* Extra space so the last card can reach center viewport */}
          <div className="hidden min-[900px]:block min-[900px]:h-[30svh]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default ExcursionesMap;
