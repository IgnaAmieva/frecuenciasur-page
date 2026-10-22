"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { Locale } from "@/lib/i18n";
import { getElevation } from "@/data/elevation";
import { excursionSeo } from "@/lib/seo";
import { t } from "@/lib/translations";
import { useLang } from "@/context/LangContext";

/* ───────────── SVG layout constants ───────────── */
const P = { w: 640, h: 220, l: 30, r: 14, t: 40, b: 26 };
const X = (km: number, totalKm: number) =>
  P.l + (km / totalKm) * (P.w - P.l - P.r);
const Y = (alt: number) => P.h - P.b - alt * (P.h - P.t - P.b);

/* ───────────── helpers ───────────── */
function lerp(pts: { km: number; alt: number }[], km: number): number {
  if (km <= pts[0].km) return pts[0].alt;
  if (km >= pts[pts.length - 1].km) return pts[pts.length - 1].alt;
  for (let i = 0; i < pts.length - 1; i++) {
    if (km >= pts[i].km && km <= pts[i + 1].km) {
      const f = (km - pts[i].km) / (pts[i + 1].km - pts[i].km);
      return pts[i].alt + f * (pts[i + 1].alt - pts[i].alt);
    }
  }
  return pts[pts.length - 1].alt;
}

/* ───────────── Props ───────────── */
interface Props {
  slug: string;
  locale: Locale;
}

/* ───────────── SVG chart (shared between mobile & desktop) ───────────── */
function ElevationSvg({
  slug,
  points,
  totalKm,
  hitos,
  currentKm,
  activeHitoIdx,
  locale,
  compact,
}: {
  slug: string;
  points: { km: number; alt: number }[];
  totalKm: number;
  hitos: { km: number; label: Record<string, string> }[];
  currentKm: number;
  activeHitoIdx: number;
  locale: Locale;
  compact?: boolean;
}) {
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${X(p.km, totalKm).toFixed(1)},${Y(p.alt).toFixed(1)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L${X(points[points.length - 1].km, totalKm).toFixed(1)},${(P.h - P.b).toFixed(1)}` +
    ` L${X(points[0].km, totalKm).toFixed(1)},${(P.h - P.b).toFixed(1)} Z`;

  const clipX = X(currentKm, totalKm);
  const hikerAlt = lerp(points, currentKm);
  const hikerX = X(currentKm, totalKm);
  const hikerY = Y(hikerAlt);

  const kmMarks: number[] = [];
  for (let k = 0; k <= totalKm; k++) kmMarks.push(k);

  return (
    <svg
      viewBox={`0 0 ${P.w} ${P.h}`}
      className={compact ? "h-[56px] w-full" : "h-[120px] w-full min-[900px]:h-auto"}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id={`walked-${slug}${compact ? "-c" : ""}`}>
          <rect x={0} y={0} width={clipX} height={P.h} />
        </clipPath>
        <clipPath id={`unwalked-${slug}${compact ? "-c" : ""}`}>
          <rect x={clipX} y={0} width={P.w - clipX} height={P.h} />
        </clipPath>
      </defs>

      {!compact && kmMarks.map((k) => (
        <g key={`grid-${k}`}>
          <line
            x1={X(k, totalKm)} y1={P.t - 4}
            x2={X(k, totalKm)} y2={P.h - P.b}
            stroke="#e0e0e0" strokeWidth={0.5}
          />
          <text x={X(k, totalKm)} y={P.h - P.b + 16} textAnchor="middle" fontSize={10} fill="#999">
            {k}
          </text>
        </g>
      ))}

      <path d={areaD} fill="#F4F4F2" clipPath={`url(#unwalked-${slug}${compact ? "-c" : ""})`} />
      <path d={areaD} fill="rgba(232,93,4,.16)" clipPath={`url(#walked-${slug}${compact ? "-c" : ""})`} />

      <path d={pathD} fill="none" stroke="#C9C9C9" strokeWidth={2} strokeDasharray="6 4" clipPath={`url(#unwalked-${slug}${compact ? "-c" : ""})`} />
      <path d={pathD} fill="none" stroke="#E85D04" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#walked-${slug}${compact ? "-c" : ""})`} />

      {hitos.map((h, i) => {
        const hx = X(h.km, totalKm);
        const hy = Y(lerp(points, h.km));
        const active = i <= activeHitoIdx;
        return (
          <g key={`hito-${i}`}>
            <circle cx={hx} cy={hy} r={compact ? 3.5 : 5} fill={active ? "#E85D04" : "#C9C9C9"} stroke="white" strokeWidth={1.5} />
            {!compact && (
              <text x={hx} y={hy - 10} textAnchor="middle" fontSize={9} fontWeight={active ? 600 : 400} fill={active ? "#1a1a1a" : "#999"}>
                {h.label[locale]}
              </text>
            )}
          </g>
        );
      })}

      <circle cx={hikerX} cy={hikerY} r={compact ? 10 : 14} fill="rgba(232,93,4,.2)" />
      <circle cx={hikerX} cy={hikerY} r={compact ? 6 : 8} fill="#E85D04" stroke="white" strokeWidth={2} />
    </svg>
  );
}

export default function ElevationProfile({ slug, locale }: Props) {
  const { lang } = useLang();
  const tr = t[locale];
  const data = getElevation(slug);
  const seo = excursionSeo[slug]?.[locale];

  const containerRef = useRef<HTMLDivElement>(null);
  const tramosRef = useRef<HTMLDivElement>(null);
  const tramoElsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const [progress, setProgress] = useState(0);
  const [activeTramo, setActiveTramo] = useState(0);

  // Distribute description paragraphs across hitos (tramos) evenly.
  // No tramo should be left without content.
  const tramoTexts = useMemo(() => {
    if (!data || !seo) return [];
    const paragraphs = seo.description;
    const nHitos = data.hitos.length;
    if (nHitos === 0) return [];
    if (paragraphs.length === 0) return new Array(nHitos).fill("");

    if (paragraphs.length >= nHitos) {
      // More paragraphs than hitos: distribute, combining extras into buckets
      const buckets: string[][] = Array.from({ length: nHitos }, () => []);
      for (let i = 0; i < paragraphs.length; i++) {
        const bucketIdx = Math.min(Math.floor((i / paragraphs.length) * nHitos), nHitos - 1);
        buckets[bucketIdx].push(paragraphs[i]);
      }
      return buckets.map((b) => b.join(" "));
    }

    // Fewer paragraphs than hitos: assign each paragraph to a hito in order,
    // then remaining hitos share the last paragraph's content via sentence splitting,
    // or get a portion of the full text.
    const result: string[] = new Array(nHitos).fill("");
    // Split all text into sentences, distribute evenly across all hitos
    const allText = paragraphs.join(" ");
    const sentences = allText.match(/[^.!?]+[.!?]+\s*/g) || [allText];
    for (let i = 0; i < sentences.length; i++) {
      const hitoIdx = Math.min(Math.floor((i / sentences.length) * nHitos), nHitos - 1);
      result[hitoIdx] = (result[hitoIdx] + sentences[i]).trim();
    }
    return result;
  }, [data, seo]);

  /* ───── scroll-driven progress via rAF ───── */
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (!tramosRef.current) return;
    const el = tramosRef.current;
    const rect = el.getBoundingClientRect();
    const elH = el.scrollHeight;
    const viewH = window.innerHeight;

    const rawP = (viewH - rect.top) / (elH + viewH);
    setProgress(Math.max(0, Math.min(1, rawP)));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(handleScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [handleScroll]);

  /* ───── IntersectionObserver for active tramo ───── */
  useEffect(() => {
    const els = Array.from(tramoElsRef.current.entries());
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const entry of entries) {
          const idx = Number(entry.target.getAttribute("data-tramo-idx"));
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.ratio)) {
            best = { idx, ratio: entry.intersectionRatio };
          }
        }
        if (best) setActiveTramo(best.idx);
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-120px 0px -30% 0px",
      },
    );

    for (const [, el] of els) observer.observe(el);
    return () => observer.disconnect();
  }, [data]);

  if (!data) return null;

  const { totalKm, points, hitos } = data;
  const currentKm = progress * totalKm;

  const activeHitoIdx = hitos.reduce(
    (acc, h, i) => (currentKm >= h.km ? i : acc),
    -1,
  );

  const currentHitoName =
    activeTramo >= 0 && activeTramo < hitos.length
      ? hitos[activeTramo].label[locale]
      : hitos[0].label[locale];

  const waText = encodeURIComponent(
    `${tr.wa_reserva_pre} ${seo?.h1 ?? slug}. ${tr.wa_reserva_post}`,
  );
  const waUrl = `https://wa.me/5492901489265?text=${waText}`;

  return (
    <div ref={containerRef} className="relative">
      {/* ─── Mobile: compact sticky bar ─── */}
      <div
        className="sticky z-10 min-[900px]:hidden mx-3 rounded-[20px] border border-[#E4E4E4] bg-white shadow-[0_6px_16px_rgba(0,0,0,.08)]"
        style={{ top: "var(--header-h)" }}
      >
        <div className="flex items-center gap-2 px-5 pt-2 pb-1">
          <span className="text-sm font-semibold tabular-nums text-[#1a1a1a]">
            {tr.perfil_km} {currentKm.toFixed(1)} {tr.perfil_de} {totalKm}
          </span>
          <span className="rounded-full bg-[rgba(232,93,4,.12)] px-3 py-0.5 text-xs font-medium text-[#E85D04]">
            {currentHitoName}
          </span>
        </div>
        <div className="px-5 pb-2">
          <ElevationSvg
            slug={slug} points={points} totalKm={totalKm} hitos={hitos}
            currentKm={currentKm} activeHitoIdx={activeHitoIdx} locale={locale}
            compact
          />
        </div>
      </div>

      {/* ─── Desktop grid / Mobile flow ─── */}
      <div className="min-[900px]:grid min-[900px]:grid-cols-[1fr_1.2fr] min-[900px]:gap-8">
        {/* ─── Tramos column (left on desktop, flow on mobile) ─── */}
        <div
          ref={tramosRef}
          className="px-5 min-[900px]:px-0 min-[900px]:order-1"
          style={{ paddingBottom: "76px" }}
        >
          {hitos.map((h, i) => {
            const isLast = i === hitos.length - 1;
            const prevKm = i === 0 ? 0 : hitos[i - 1].km;
            const isActive = i === activeTramo;
            const tramoDesc = tramoTexts[i] ?? "";

            return (
              <div
                key={`tramo-${i}`}
                ref={(el) => {
                  if (el) tramoElsRef.current.set(i, el);
                  else tramoElsRef.current.delete(i);
                }}
                data-tramo-idx={i}
                className={`flex flex-col justify-center py-5 min-[900px]:min-h-[46vh] ${
                  isActive ? "border-l-[3px] border-[#E85D04] pl-4" : "border-l-[3px] border-transparent pl-4"
                }`}
              >
                <span
                  className={`mb-1 text-xs font-bold uppercase tracking-wider ${
                    isActive ? "text-[#E85D04]" : "text-[#999]"
                  }`}
                >
                  KM {prevKm.toFixed(1)} &mdash; {h.km.toFixed(1)}
                </span>

                <h3 className="mb-2 text-lg font-bold text-[#111]">
                  {h.label[locale]}
                </h3>

                {tramoDesc && (
                  <p className="text-sm leading-relaxed" style={{ color: "#111" }}>
                    {tramoDesc}
                  </p>
                )}

                {isLast && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex h-[52px] items-center self-start rounded-full bg-[#E85D04] px-8 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#d45303]"
                  >
                    {tr.reservar}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Desktop: profile card (right, sticky) ─── */}
        <div className="hidden min-[900px]:block min-[900px]:order-2">
          <div className="sticky z-10" style={{ top: "calc(var(--header-h) + 24px)" }}>
            <div className="flex items-center gap-3 px-1 pb-2">
              <span className="text-sm font-semibold tabular-nums text-[#1a1a1a]">
                {tr.perfil_km} {currentKm.toFixed(1)} {tr.perfil_de} {totalKm}
              </span>
              <span className="rounded-full bg-[rgba(232,93,4,.12)] px-3 py-0.5 text-xs font-medium text-[#E85D04]">
                {currentHitoName}
              </span>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-md mb-6">
              <ElevationSvg
                slug={slug} points={points} totalKm={totalKm} hitos={hitos}
                currentKm={currentKm} activeHitoIdx={activeHitoIdx} locale={locale}
              />
              <p className="mt-2 text-center text-[13px]" style={{ color: "#2B2B2B" }}>
                {tr.perfil_nota}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
