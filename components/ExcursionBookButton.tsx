"use client";

import { t } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";

interface Props {
  waUrl: string;
  locale: Locale;
  excursionSlug: string;
  position: "hero" | "info";
}

export default function ExcursionBookButton({
  waUrl,
  locale,
  excursionSlug,
  position,
}: Props) {
  const tr = t[locale];

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-excursion={excursionSlug}
      data-cta-position={position}
      className="inline-block rounded-full bg-[#e85d04] px-10 py-4 text-lg font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#d45303]"
    >
      {tr.reservar}
    </a>
  );
}
