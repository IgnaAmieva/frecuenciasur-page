import type { Locale } from "./i18n";

/** Return the URL prefix for the given locale ("" for es, "/en", "/pt") */
export function localePrefix(locale: Locale): string {
  return locale === "es" ? "" : `/${locale}`;
}

/** Build a path with locale prefix */
export function localePath(locale: Locale, path: string): string {
  return `${localePrefix(locale)}${path}`;
}
