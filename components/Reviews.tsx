"use client";

import { Star } from "lucide-react";
import { business } from "@/data/business";
import { useLang } from "@/context/LangContext";

const title: Record<string, string> = {
  es: "Lo que dicen nuestros clientes",
  en: "What our clients say",
  pt: "O que dizem nossos clientes",
};

export default function Reviews() {
  const { lang } = useLang();

  if (business.reviews.length === 0) return null;

  return (
    <section className="pt-16 md:pt-24 px-5">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-2xl font-extrabold text-brand-text md:text-[2.75rem] md:leading-tight">
          {title[lang]}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {business.reviews.map((review, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: review.stars }).map((_, s) => (
                  <Star
                    key={s}
                    size={16}
                    className="fill-brand-orange text-brand-orange"
                  />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-brand-text-secondary">
                &ldquo;{review.text[lang]}&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-brand-text-secondary">
                <span className="font-semibold text-brand-text">
                  {review.name} · {review.country}
                </span>
                <span>{review.excursion}</span>
              </div>
              {review.source && (
                <span className="mt-2 inline-block text-[11px] text-gray-400">
                  {review.url ? (
                    <a href={review.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {review.source}
                    </a>
                  ) : (
                    review.source
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
