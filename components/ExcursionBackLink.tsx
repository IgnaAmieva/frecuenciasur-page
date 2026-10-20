"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { t } from "@/lib/translations";
import { localePath } from "@/lib/locale-utils";
import type { Locale } from "@/lib/i18n";

export default function ExcursionBackLink({ locale }: { locale: Locale }) {
  const tr = t[locale];

  return (
    <Link
      href={`${localePath(locale, "/")}#excursiones`}
      className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-orange transition-colors hover:text-brand-orange-mid"
    >
      <ArrowLeft size={16} />
      {tr.volver_excursiones}
    </Link>
  );
}
