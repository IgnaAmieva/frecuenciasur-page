import type { MetadataRoute } from "next";
import { excursiones } from "@/data/excursiones";

const BASE = "https://www.frecuenciasurushuaia.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["es", "en", "pt"] as const;

  function localeUrl(locale: string, path: string = "") {
    const prefix = locale === "es" ? "" : `/${locale}`;
    return `${BASE}${prefix}${path}`;
  }

  const entries: MetadataRoute.Sitemap = [];

  // Home pages
  for (const locale of locales) {
    entries.push({
      url: localeUrl(locale),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          es: localeUrl("es"),
          en: localeUrl("en"),
          pt: localeUrl("pt"),
        },
      },
    });
  }

  // Excursion pages
  for (const exc of excursiones) {
    for (const locale of locales) {
      entries.push({
        url: localeUrl(locale, `/excursiones/${exc.slug}`),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            es: localeUrl("es", `/excursiones/${exc.slug}`),
            en: localeUrl("en", `/excursiones/${exc.slug}`),
            pt: localeUrl("pt", `/excursiones/${exc.slug}`),
          },
        },
      });
    }
  }

  return entries;
}
