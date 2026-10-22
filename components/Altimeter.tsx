"use client";

import { useEffect, useState, useCallback } from "react";

const SECTIONS_SELECTOR = "[data-alt]";

export default function Altimeter() {
  const [altitude, setAltitude] = useState("0 m");
  const [label, setLabel] = useState("Canal Beagle");
  const [progress, setProgress] = useState(0);
  const [altT, setAltT] = useState(0);

  const [mapVisible, setMapVisible] = useState(false);

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? y / max : 0;
    const val = (Math.round(p * 130) * 10).toLocaleString("es-AR") + " m";

    const secs = document.querySelectorAll<HTMLElement>(SECTIONS_SELECTOR);
    let lbl = "Canal Beagle";
    secs.forEach((s) => {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.5) {
        lbl = s.dataset.alt || lbl;
      }
    });

    setAltitude(val);
    setLabel(lbl);
    setProgress(p);

    // A5: reveal altimeter once user scrolls past ~50% of viewport height
    const vpH = window.innerHeight;
    const reveal = Math.max(0, Math.min(1, (y - vpH * 0.5) / (vpH * 0.5)));
    setAltT(reveal);

    // Hide chip when #excursiones map section is in viewport
    const mapSec = document.querySelector("#excursiones");
    const mapInView = mapSec ? mapSec.getBoundingClientRect().top < window.innerHeight && mapSec.getBoundingClientRect().bottom > 0 : false;
    setMapVisible(mapInView);

  }, []);

  useEffect(() => {
    const handler = () => requestAnimationFrame(onScroll);
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    handler();
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [onScroll]);

  const posPercent = `${(100 - progress * 100).toFixed(1)}%`;
  const fillPercent = `${(progress * 100).toFixed(1)}%`;

  return (
    <>
      {/* Desktop rail — hidden during hero, fades + rises in (A5) */}
      <div
        className="pointer-events-none fixed right-3 top-1/2 z-40 hidden h-[52vh] w-[48px] transition-opacity duration-500 min-[900px]:block"
        style={{
          opacity: altT,
          transform: `translateY(calc(-50% + ${((1 - altT) * 12).toFixed(1)}px))`,
        }}
        aria-hidden="true"
      >
        <div className="absolute bottom-0 right-[5px] top-0 w-0.5 rounded-full bg-[rgba(26,26,26,0.12)]" />
        <div
          className="absolute bottom-0 right-[5px] w-0.5 rounded-full bg-brand-orange"
          style={{ height: fillPercent }}
        />
        <div
          className="absolute right-0 h-3 w-3 rounded-full bg-brand-orange shadow-[0_0_0_4px_rgba(232,93,4,0.2)]"
          style={{ top: posPercent, transform: "translateY(-50%)" }}
        />
        <div
          className="absolute right-5 whitespace-nowrap rounded-xl bg-white p-[6px_10px] text-right shadow-[0_1px_2px_rgba(0,0,0,.04),0_8px_24px_rgba(0,0,0,.06)] transition-opacity duration-300"
          style={{ top: posPercent, transform: "translateY(-50%)", opacity: mapVisible ? 0 : 1, pointerEvents: mapVisible ? "none" : "auto" }}
        >
          <b className="block text-sm font-bold tabular-nums">{altitude}</b>
          <span className="text-[11px] text-brand-text-secondary">{label}</span>
        </div>
      </div>

      {/* Mobile chip removed — altitude display only on desktop sidebar */}
    </>
  );
}
