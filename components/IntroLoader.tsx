"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";

/* ═══════════════════════════════════════════════════════════════════
   IntroLoader — animated splash: radio wave → Fuegian ridge morph,
   snow cap, switchback trail, coords typing, logo drop, circle reveal.
   Shown once per visit (sessionStorage). Skippable by tap/click.
   Respects prefers-reduced-motion (never shown).
   The hero is ALWAYS rendered underneath — this is a visual overlay.
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Geometry: 90-point wave/ridge morph ─── */

const N = 90;
const Xp = (i: number) => i * (1000 / (N - 1));

/** Radio-signal waveform */
function wave(ph: number, amp: number): number[] {
  return Array.from({ length: N }, (_, i) => {
    const x = i / (N - 1);
    const env = Math.sin(Math.PI * x);
    return 250 + env * amp * (Math.sin(x * 42 + ph) * 0.6 + Math.sin(x * 17 - ph * 1.3) * 0.4);
  });
}

/** Fuegian ridge profile (gaussian peaks + jag) */
const PEAK = 0.56;
const ridge = Array.from({ length: N }, (_, i) => {
  const x = i / (N - 1);
  const m = (c: number, w: number, h: number) => h * Math.exp(-(((x - c) / w) ** 2));
  const h =
    m(0.12, 0.06, 120) + m(0.24, 0.05, 170) + m(0.36, 0.07, 150) +
    m(PEAK, 0.075, 265) + m(0.7, 0.06, 190) + m(0.83, 0.05, 140) + m(0.95, 0.05, 95);
  const jag = Math.sin(x * 130) * 6 + Math.sin(x * 61) * 5;
  return 360 - h - jag * (h > 40 ? 1 : 0.3);
});

/** SVG path from Y array */
function toD(ys: number[]) {
  return "M" + ys.map((y, i) => `${Xp(i).toFixed(1)} ${y.toFixed(1)}`).join(" L");
}
function fillD(ys: number[]) {
  return toD(ys) + " L1000 400 L0 400 Z";
}

/** Snow cap around main summit */
const pi = Math.round(PEAK * (N - 1));
const snowD = (() => {
  const L = pi - 3, R = pi + 3;
  const top: [number, number][] = [];
  for (let i = L; i <= R; i++) top.push([Xp(i), ridge[i]]);
  const bot: [number, number][] = [];
  for (let i = R; i >= L; i--) {
    const d = i === pi ? 20 : Math.abs(i - pi) % 2 ? 10 : 15;
    bot.push([Xp(i), Math.min(ridge[i] + d, ridge[pi] + 26)]);
  }
  return "M" + top.concat(bot).map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") + " Z";
})();

/** Switchback trail up to summit */
const trailPts = [
  [Xp(pi) - 70, 398], [Xp(pi) + 45, 372], [Xp(pi) - 45, 342],
  [Xp(pi) + 32, 312], [Xp(pi) - 28, 280], [Xp(pi) + 18, 250],
  [Xp(pi) - 10, ridge[pi] + 44], [Xp(pi), ridge[pi] + 6],
];
const trailD = "M" + trailPts.map((p) => p.join(" ")).join(" L");

/* ─── Component ─── */

export default function IntroLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (tlRef.current) tlRef.current.kill();
    const root = rootRef.current;
    if (root) root.style.display = "none";
    // Tell Hero to animate entrance
    window.dispatchEvent(new CustomEvent("intro-done"));
  }, []);

  useEffect(() => {
    // Reduced motion → skip entirely
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    // Already seen this session → skip
    try {
      if (sessionStorage.getItem("intro-seen") === "1") {
        finish();
        return;
      }
    } catch { /* private browsing */ }

    const $ = (s: string) => document.querySelector(s);

    /* ── Set up SVG elements ── */
    const waveEl = $("#intro-wave") as SVGPathElement;
    const fillEl = $("#intro-ridgeFill") as SVGPathElement;
    const snowEl = $("#intro-snow") as SVGPathElement;
    const trailEl = $("#intro-trail") as SVGPathElement;
    const trailDrawEl = $("#intro-trailDraw") as SVGPathElement;
    const logoEl = $("#intro-logo") as HTMLElement;
    const glowEl = $("#intro-glow") as HTMLElement;
    const coordsEl = $("#intro-coords") as HTMLElement;
    const sceneEl = $("#intro-scene") as SVGElement;
    const freqEl = $("#intro-freq") as HTMLElement;

    if (!waveEl || !fillEl || !sceneEl || !logoEl) {
      finish();
      return;
    }

    snowEl.setAttribute("d", snowD);
    trailEl.setAttribute("d", trailD);
    trailDrawEl.setAttribute("d", trailD);
    const tlen = trailDrawEl.getTotalLength();
    gsap.set(trailDrawEl, { strokeDasharray: tlen, strokeDashoffset: tlen });

    /** Mix wave↔ridge and update SVG */
    function setMix(k: number, ph: number, amp: number) {
      const a = wave(ph, amp);
      const ys = a.map((y, i) => y + (ridge[i] - y) * k);
      waveEl.setAttribute("d", toD(ys));
      fillEl.setAttribute("d", fillD(ys));
    }

    /** Place logo over the summit peak */
    function placeOverSummit() {
      const svg = sceneEl.getBoundingClientRect();
      const x = svg.left + svg.width * (Xp(pi) / 1000);
      const y = svg.top + svg.height * (ridge[pi] / 400);
      const top = y - svg.height * 0.18;
      logoEl.style.left = `${x}px`;
      logoEl.style.top = `${top}px`;
      glowEl.style.left = `${x}px`;
      glowEl.style.top = `${top}px`;
      return { x, y: top };
    }

    placeOverSummit();
    setMix(0, 0, 0);
    coordsEl.textContent = "";
    gsap.set([coordsEl, sceneEl, freqEl], { opacity: 1 });
    gsap.set([logoEl, glowEl], { scale: 0, opacity: 0 });
    gsap.set(snowEl, { opacity: 0 });
    gsap.set(fillEl, { opacity: 0 });

    /* ── Coords typing text ── */
    const plain = "54°48′S · 68°18′O · Ushuaia · Fin del Mundo";

    /* ── Animated state ── */
    const st = { ph: 0, amp: 0, k: 0, c: 0 };
    const draw = () => {
      setMix(st.k, st.ph, st.amp);
      const n = Math.round(st.c * plain.length);
      const s = plain.slice(0, n);
      coordsEl.innerHTML = s.replace("Ushuaia", "<b>Ushuaia</b>");
    };

    /* ── Circle-reveal hole ── */
    const hole = { x: 0, y: 0, r: 0 };
    function applyHole() {
      const m = `radial-gradient(circle at ${hole.x}px ${hole.y}px, transparent ${hole.r}px, #000 ${hole.r + 1}px)`;
      const el = rootRef.current;
      if (el) {
        el.style.webkitMaskImage = m;
        el.style.maskImage = m;
      }
    }

    /* ── GSAP Timeline ── */
    const tl = gsap.timeline({
      onUpdate: draw,
      onComplete: () => {
        try { sessionStorage.setItem("intro-seen", "1"); } catch { /* ok */ }
        finish();
      },
    });
    tlRef.current = tl;

    tl
      // Wave appears
      .to(st, { amp: 70, duration: 0.6, ease: "power2.out" }, 0)
      .to(st, { ph: 9, duration: 1.6, ease: "none" }, 0)
      // Coords type
      .to(st, { c: 1, duration: 1.1, ease: "none" }, 0.1)
      // "SINTONIZANDO" fades
      .to(freqEl, { opacity: 0, duration: 0.3 }, 1.0)
      // Morph wave → ridge
      .to(st, { k: 1, duration: 0.9, ease: "power3.inOut" }, 0.95)
      // Fill appears
      .to(fillEl, { opacity: 1, duration: 0.6 }, 1.25)
      // Snow cap
      .to(snowEl, { opacity: 1, duration: 0.3 }, 1.75)
      // Trail draws
      .to(trailDrawEl, { strokeDashoffset: 0, duration: 0.85, ease: "power1.inOut" }, 1.8)
      // Glow
      .to(glowEl, { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" }, 2.45)
      // Logo drops in with spin
      .fromTo(logoEl,
        { scale: 0, opacity: 0, rotation: -200, y: 40 },
        { scale: 1, opacity: 1, rotation: 0, y: 0, duration: 0.75, ease: "back.out(1.7)" },
        2.5,
      )
      // Compute hole center
      .call(() => {
        const q = placeOverSummit();
        hole.x = q.x;
        hole.y = q.y;
      }, undefined, 3.5)
      // Circle reveal
      .to(hole, {
        r: Math.hypot(2000, 2000),
        duration: 1.0,
        ease: "power3.in",
        onUpdate: applyHole,
      }, 3.55)
      // Logo scales out
      .to(logoEl, { scale: 1.6, opacity: 0, duration: 0.6, ease: "power2.in" }, 3.6)
      // Scene fades
      .to([glowEl, coordsEl, sceneEl], { opacity: 0, duration: 0.5 }, 3.7)
      // Trigger hero entrance
      .call(() => {
        try { sessionStorage.setItem("intro-seen", "1"); } catch { /* ok */ }
      }, undefined, 3.75);

    /* ── Resize handler ── */
    const onResize = () => placeOverSummit();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      tl.kill();
    };
  }, [finish]);

  return (
    <div
      ref={rootRef}
      id="intro-root"
      onClick={finish}
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "radial-gradient(120% 80% at 50% 110%, #1a0f08 0%, #07090B 60%)",
        cursor: "pointer",
      }}
    >
      {/* Coords */}
      <div
        id="intro-coords"
        style={{
          position: "absolute",
          left: "50%",
          top: "calc(16% + env(safe-area-inset-top, 0px))",
          transform: "translateX(-50%)",
          fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
          fontSize: "clamp(11px, 1.6vw, 14px)",
          letterSpacing: ".18em",
          color: "rgba(244,246,247,.62)",
          whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}
      />

      {/* Glow */}
      <div
        id="intro-glow"
        style={{
          position: "absolute",
          width: "clamp(260px, 40vw, 520px)",
          aspectRatio: "1",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(255,138,61,.55), rgba(232,93,4,.18) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* SVG Scene */}
      <svg
        id="intro-scene"
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: 0,
          bottom: "22%",
          width: "100%",
          height: "46%",
          overflow: "visible",
        }}
      >
        <defs>
          <linearGradient id="mfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#14181c" />
            <stop offset="1" stopColor="#07090B" />
          </linearGradient>
          <mask id="trailMask">
            <path id="intro-trailDraw" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
          </mask>
        </defs>
        <path id="intro-ridgeFill" fill="url(#mfill)" opacity="0" />
        <path
          id="intro-wave"
          fill="none"
          stroke="#F4F6F7"
          strokeWidth="2.4"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path id="intro-snow" fill="#F4F6F7" opacity="0" />
        <path
          id="intro-trail"
          fill="none"
          stroke="#E85D04"
          strokeWidth="3"
          strokeDasharray="7 9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          mask="url(#trailMask)"
        />
      </svg>

      {/* Logo */}
      <Image
        id="intro-logo"
        src="/images/logo/logo.png"
        alt=""
        width={170}
        height={170}
        style={{
          position: "absolute",
          width: "clamp(110px, 16vw, 170px)",
          height: "auto",
          transform: "translate(-50%, -50%)",
          filter: "drop-shadow(0 10px 30px rgba(232,93,4,.45))",
        }}
        priority
      />

      {/* Frequency text */}
      <div
        id="intro-freq"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "calc(14% + env(safe-area-inset-bottom, 0px))",
          transform: "translateX(-50%)",
          fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
          fontSize: "12px",
          letterSpacing: ".2em",
          color: "rgba(244,246,247,.62)",
          whiteSpace: "nowrap",
        }}
      >
        SINTONIZANDO · FRECUENCIA SUR
      </div>

      {/* Skip hint */}
      <div
        style={{
          position: "absolute",
          right: "max(16px, env(safe-area-inset-right, 0px))",
          bottom: "calc(18px + env(safe-area-inset-bottom, 0px))",
          fontSize: "11px",
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,.4)",
        }}
      >
        tap to skip
      </div>
    </div>
  );
}
