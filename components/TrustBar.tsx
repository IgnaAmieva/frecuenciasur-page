"use client";

import { Star } from "lucide-react";
import { business } from "@/data/business";
import { useLang } from "@/context/LangContext";

const trustLine: Record<string, string> = {
  es: "Grupos reducidos · Traslado desde tu alojamiento · Guías de montaña",
  en: "Small groups · Transfer from your hotel · Mountain guides",
  pt: "Grupos reduzidos · Traslado do seu hotel · Guias de montanha",
};

export default function TrustBar() {
  const { lang } = useLang();

  const hasRating = business.rating !== null;
  const hasYears = business.yearsOperating !== null;
  const hasPeople = business.peopleGuided !== null;
  const hasAny = hasRating || hasYears || hasPeople;

  return (
    <section className="py-6 text-center">
      {/* Trust line — always visible */}
      <p className="text-sm font-medium tracking-wide text-brand-text-secondary">
        {trustLine[lang]}
      </p>

      {/* Stats bar — only if data exists */}
      {hasAny && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-brand-text">
          {hasRating && business.rating && (
            <a
              href={business.rating.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-brand-orange"
            >
              <Star size={16} className="fill-brand-orange text-brand-orange" />
              <span className="font-bold">{business.rating.value}</span>
              <span className="text-brand-text-secondary">
                ({business.rating.count}+ {business.rating.source})
              </span>
            </a>
          )}
          {hasYears && (
            <span>
              <span className="font-bold">{business.yearsOperating}+</span>{" "}
              <span className="text-brand-text-secondary">
                {lang === "en" ? "years" : lang === "pt" ? "anos" : "años"}
              </span>
            </span>
          )}
          {hasPeople && (
            <span>
              <span className="font-bold">{business.peopleGuided?.toLocaleString()}+</span>{" "}
              <span className="text-brand-text-secondary">
                {lang === "en" ? "guided" : lang === "pt" ? "guiados" : "guiados"}
              </span>
            </span>
          )}
        </div>
      )}
    </section>
  );
}
