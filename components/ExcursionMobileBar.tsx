"use client";

import { t } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";

interface Props {
  waUrl: string;
  locale: Locale;
  excursionSlug: string;
}

export default function ExcursionMobileBar({
  waUrl,
  locale,
  excursionSlug,
}: Props) {
  const tr = t[locale];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-orange-200 bg-white p-3 shadow-2xl md:hidden">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-excursion={excursionSlug}
        data-cta-position="mobile-bar"
        className="block w-full rounded-full bg-[#e85d04] py-3 text-center text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#d45303]"
      >
        {tr.reservar}
      </a>
    </div>
  );
}
