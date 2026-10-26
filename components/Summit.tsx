"use client";

import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";

export default function Summit() {
  const { lang } = useLang();
  const tr = t[lang];
  const WA_URL = `https://wa.me/5492901489265?text=${encodeURIComponent(tr.wa_generic)}`;

  return (
    <section
      id="cumbre"
      data-alt={tr.alt_cumbre}
      className="relative overflow-hidden px-5 py-16 md:py-24 text-center"
      style={{
        background:
          "linear-gradient(180deg, #fff 0%, #fff 30%, #e85d04 100%)",
      }}
    >
      <div className="mx-auto grid max-w-2xl justify-items-center gap-5">
        {/* Flag icon */}
        <svg
          className="h-16 w-16"
          viewBox="0 0 64 64"
          aria-hidden="true"
        >
          <path d="M6 56 26 20l8 13 6-8 18 31z" fill="#1A1A1A" />
          <path d="M26 20 V6" stroke="#1A1A1A" strokeWidth="2.5" />
          <path
            d="M26 6 h14 l-4 5 4 5 H26z"
            fill="#E85D04"
          />
        </svg>

        <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          {tr.cumbre_titulo}
        </h2>

        <p className="max-w-lg text-brand-text-secondary">
          {tr.cumbre_texto}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-widest text-brand-orange transition hover:bg-gray-50"
          >
            {tr.cumbre_reservar}
          </a>
          <a
            href="#excursiones"
            style={{ color: "white" }}
            className="rounded-full border border-white/40 bg-white/15 px-8 py-3 text-sm font-semibold uppercase tracking-widest backdrop-blur-sm transition hover:bg-white/25"
          >
            {tr.cumbre_ver}
          </a>
        </div>
      </div>
    </section>
  );
}
