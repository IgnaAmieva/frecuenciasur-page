"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import { homeSeo } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Carousel photos                                                    */
/* ------------------------------------------------------------------ */

const PHOTOS = [
  { src: "/images/excursiones/laguna-esmeralda/IMG_7464.JPG", alt: "Laguna Esmeralda" },
  { src: "/images/excursiones/glaciar-vinciguerra/IMG_1464.jpg", alt: "Glaciar Vinciguerra" },
  { src: "/images/excursiones/laguna-cinco-hermanos/IMG_5379.jpg", alt: "Laguna Cinco Hermanos" },
  { src: "/images/excursiones/glaciar-ojo-del-albino/DJI_0658.JPG", alt: "Glaciar Ojo del Albino" },
  { src: "/images/excursiones/martial-aventura/IMG_0437.JPG", alt: "Martial Aventura" },
  { src: "/images/excursiones/monte-susana/IMG_7354.JPG", alt: "Monte Susana" },
];

/* ------------------------------------------------------------------ */
/*  Mountain ridge data                                                */
/* ------------------------------------------------------------------ */

const R: [number, number][] = [
  [0, 0.3], [0.05, 0.36], [0.09, 0.33], [0.14, 0.47], [0.18, 0.42],
  [0.22, 0.55], [0.26, 0.5], [0.3, 0.62], [0.34, 0.56], [0.38, 0.68],
  [0.41, 0.63], [0.45, 0.8], [0.49, 0.7], [0.53, 0.74], [0.57, 0.64],
  [0.61, 0.71], [0.65, 0.6], [0.7, 0.66], [0.74, 0.55], [0.79, 0.6],
  [0.84, 0.48], [0.89, 0.52], [0.94, 0.4], [1, 0.44],
];

const OLIVIA_IDX = 11;

function buildDense(): [number, number][] {
  const out: [number, number][] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < R.length - 1; i++) {
    const [x0, y0] = R[i];
    const [x1, y1] = R[i + 1];
    const n = 6;
    for (let k = 0; k < n; k++) {
      const tt = k / n;
      const j = k === 0 ? 0 : (rnd() - 0.5) * 0.035;
      out.push([x0 + (x1 - x0) * tt, y0 + (y1 - y0) * tt + j]);
    }
  }
  out.push(R[R.length - 1]);
  return out;
}

const DENSE = buildDense();
const PI = R.map((r) => DENSE.findIndex((d) => d[0] === r[0] && d[1] === r[1]));

const peakLabel: Record<string, string> = {
  es: "Monte Olivia · 1.326 m",
  en: "Mount Olivia · 1,326 m",
  pt: "Monte Olivia · 1.326 m",
};

/* ------------------------------------------------------------------ */
/*  SVG helper                                                         */
/* ------------------------------------------------------------------ */

function svgEl(parent: SVGElement, tag: string, attrs: Record<string, string>): SVGElement {
  const NS = "http://www.w3.org/2000/svg";
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  parent.appendChild(el);
  return el;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Hero({ locale }: { locale: Locale }) {
  const { lang } = useLang();
  const tr = t[lang];
  const seo = homeSeo[locale];

  const ridgeRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [photoIdx, setPhotoIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIdx((i) => (i + 1) % PHOTOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const mqMob = window.matchMedia("(max-width: 699px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsMobile(mqMob.matches);
    reducedMotion.current = mqMotion.matches;
    const onMob = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const onMotion = (e: MediaQueryListEvent) => { reducedMotion.current = e.matches; };
    mqMob.addEventListener("change", onMob);
    mqMotion.addEventListener("change", onMotion);
    return () => { mqMob.removeEventListener("change", onMob); mqMotion.removeEventListener("change", onMotion); };
  }, []);

  // Mountain ridge SVG — draws within the ridge zone only
  useEffect(() => {
    const svg = svgRef.current;
    const ridge = ridgeRef.current;
    if (!svg || !ridge) return;

    const RM = reducedMotion.current;
    const mob = isMobile;
    let animId: number | null = null;

    function build() {
      svg!.innerHTML = "";
      const W = ridge!.clientWidth;
      const H = ridge!.clientHeight;
      if (H === 0 || W === 0) return;

      svg!.setAttribute("viewBox", `0 0 ${W} ${H}`);

      const base = H * 0.05;
      const amp = H * 0.7;

      const P = DENSE.map(([x, y]) => [x * W, H - base - y * amp] as [number, number]);

      let d = `M${P[0][0]} ${P[0][1]}`;
      for (let i = 1; i < P.length; i++) {
        const a = P[i - 1];
        const b = P[i];
        d += ` Q${a[0].toFixed(1)} ${a[1].toFixed(1)} ${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`;
      }
      d += ` L${P[P.length - 1][0]} ${P[P.length - 1][1]}`;

      // White fill below ridge (extends well below for clean cover)
      const fill = svgEl(svg!, "path", {
        d: d + ` L${W} ${H * 3} L0 ${H * 3}Z`,
        fill: "#fff",
        opacity: RM ? "1" : "0",
      });

      // Ridge stroke
      const line = svgEl(svg!, "path", {
        d, fill: "none", stroke: "#fff", "stroke-width": "2",
        "stroke-linejoin": "round", "stroke-linecap": "round",
      }) as SVGPathElement;

      const len = (line as SVGGeometryElement).getTotalLength();
      (line as SVGElement).style.strokeDasharray = `${len}`;
      (line as SVGElement).style.strokeDashoffset = RM ? "0" : `${len}`;

      // Monte Olivia peak
      const oliviaDenseIdx = PI[OLIVIA_IDX];
      const [ox, oy] = P[oliviaDenseIdx];

      // Label + flag: desktop only
      if (!mob) {
        const labelG = svgEl(svg!, "g", { opacity: RM ? "1" : "0", class: "hero-label" });
        const labelTxt = svgEl(labelG, "text", {
          x: `${ox}`, y: `${oy - 46}`,
          "text-anchor": "middle",
          fill: "rgba(255,255,255,0.85)",
          "font-size": "11",
          "font-weight": "500",
          "letter-spacing": ".06em",
          "font-family": "var(--font-inter), system-ui, sans-serif",
        });
        labelTxt.textContent = peakLabel[lang] ?? peakLabel.es;

        const flagG = svgEl(svg!, "g", { opacity: RM ? "1" : "0", class: "hero-flag" });
        svgEl(flagG, "line", {
          x1: `${ox}`, x2: `${ox}`, y1: `${oy}`, y2: `${oy - 22}`,
          stroke: "#fff", "stroke-width": "1.5",
        });
        svgEl(flagG, "path", {
          d: `M${ox} ${oy - 22} h14 l-3.5 4.5 3.5 4.5 h-14z`,
          fill: "#E85D04",
        });
      }

      // Walking dot (always shown)
      const dot = svgEl(svg!, "circle", {
        r: "5", fill: "#E85D04", stroke: "#fff", "stroke-width": "2",
      });

      // Summit distance
      let summitLen = 0;
      for (let i = 1; i <= oliviaDenseIdx; i++) {
        summitLen += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
      }

      const startPt = RM
        ? (line as SVGGeometryElement).getPointAtLength(summitLen)
        : (line as SVGGeometryElement).getPointAtLength(0);
      dot.setAttribute("cx", `${startPt.x}`);
      dot.setAttribute("cy", `${startPt.y}`);

      if (RM) return;

      let drawT = 0;
      let start: number | null = null;
      const ease = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const labelG = !mob ? svg!.querySelector(".hero-label") : null;
      const flagG = !mob ? svg!.querySelector(".hero-flag") : null;

      function intro(ts: number) {
        if (start === null) start = ts;
        drawT = Math.min(1, (ts - start) / 2400);
        const e = ease(drawT);

        (line as SVGElement).style.strokeDashoffset = `${len * (1 - e)}`;

        const fillIn = Math.max(0, Math.min(1, (drawT - 0.75) / 0.25));
        fill.setAttribute("opacity", fillIn.toFixed(3));

        const walk = Math.min(e * len, summitLen);
        const pt = (line as SVGGeometryElement).getPointAtLength(walk);
        dot.setAttribute("cx", `${pt.x}`);
        dot.setAttribute("cy", `${pt.y}`);

        const atSummit = walk >= summitLen - 1;
        if (flagG) flagG.setAttribute("opacity", atSummit ? "1" : "0");
        if (labelG) labelG.setAttribute("opacity", drawT >= 1 ? "1" : "0");

        if (drawT < 1) {
          animId = requestAnimationFrame(intro);
        }
      }

      animId = requestAnimationFrame(intro);
    }

    let cleanup = () => {
      if (animId !== null) cancelAnimationFrame(animId);
    };

    build();

    const onResize = () => {
      cleanup();
      animId = null;
      build();
    };
    window.addEventListener("resize", onResize);

    return () => { cleanup(); window.removeEventListener("resize", onResize); };
  }, [isMobile, lang]);

  return (
    <section
      className="hero-wrap relative overflow-hidden"
      data-alt="Canal Beagle"
      style={{ minHeight: "100svh", background: "#3c4c55" }}
    >
      {/* Carousel (absolute, covers entire hero) */}
      <div className="absolute inset-0">
        {PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === photoIdx ? 1 : 0 }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              style={{ objectPosition: isMobile ? "center center" : "70% center" }}
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isMobile
            ? "linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.45) 55%, rgba(0,0,0,.6))"
            : "linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.3) 40%, transparent 70%), linear-gradient(180deg, rgba(0,0,0,.35), transparent 40%, rgba(0,0,0,.45))",
        }}
      />

      {/* 3-zone flex layout */}
      <div className="relative z-[3] flex flex-col text-white" style={{ minHeight: "100svh" }}>
        {/* Zone 1: Header spacer */}
        <div className="shrink-0" style={{ height: "var(--header-h)" }} />

        {/* Zone 2: Content — centered vertically & horizontally (mobile) / left-aligned (desktop) */}
        <div
          className={`flex-1 flex ${
            isMobile
              ? "flex-col justify-center items-center text-center px-5 py-6"
              : "items-center"
          }`}
          data-hero-content
        >
          <div className={isMobile ? "w-full" : "mx-auto w-full max-w-[1200px] px-5 text-left"}>
            <div className={`grid ${isMobile ? "gap-6 justify-items-center" : "gap-4 justify-items-start max-w-[640px]"}`}>
              {/* Kicker H1 */}
              <h1
                className={`font-semibold uppercase text-white/75 ${
                  isMobile
                    ? "text-[11px] tracking-[.14em] whitespace-nowrap"
                    : "text-[12px] tracking-[.25em]"
                }`}
              >
                {seo.h1}
              </h1>

              {/* Title */}
              <p
                className={
                  isMobile
                    ? "leading-[1.05]"
                    : "leading-[1.05] min-[1420px]:whitespace-nowrap"
                }
                style={
                  isMobile
                    ? { fontSize: "38px" }
                    : { fontSize: "clamp(40px, 4.6vw, 68px)" }
                }
                aria-hidden="true"
              >
                {isMobile ? (
                  <>
                    <span className="font-light">{tr.hero_titulo1a}</span>
                    <br />
                    <span className="font-light">{tr.hero_titulo1b}</span>
                    <br />
                    <span className="font-extrabold">{tr.hero_titulo2}</span>
                  </>
                ) : (
                  <>
                    <span className="font-light min-[900px]:whitespace-nowrap">
                      {tr.hero_titulo1}
                      <br className="min-[1420px]:hidden" />
                      {" "}
                    </span>
                    <span className="font-extrabold">{tr.hero_titulo2}</span>
                  </>
                )}
              </p>

              {/* Buttons */}
              <div className={
                isMobile
                  ? "flex w-full flex-col gap-3 mt-6"
                  : "mt-4 flex flex-col gap-4 sm:flex-row"
              }>
                <a
                  href="https://wa.me/5492901489265?text=Hola%20Frecuencia%20Sur%2C%20quiero%20consultar%20sobre%20una%20excursi%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[52px] items-center justify-center rounded-full border border-white/50 bg-white/15 px-7 text-sm font-semibold uppercase tracking-[.12em] text-white backdrop-blur-sm transition hover:bg-white/25"
                  data-hero-btn
                >
                  {tr.hero_boton}
                </a>
                <a
                  href="#excursiones"
                  className="inline-flex h-[52px] items-center justify-center rounded-full bg-brand-orange px-7 text-sm font-semibold uppercase tracking-[.12em] text-white transition hover:brightness-110"
                  data-hero-btn
                >
                  {tr.hero_ver_excursiones}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Zone 3: Ridge — fixed height, SVG lives only here */}
        <div
          ref={ridgeRef}
          className="shrink-0 pointer-events-none"
          style={{ height: "16svh", overflow: "visible" }}
        >
          <svg
            ref={svgRef}
            className="w-full h-full"
            style={{ overflow: "visible" }}
            preserveAspectRatio="none"
          />
        </div>
      </div>
    </section>
  );
}
