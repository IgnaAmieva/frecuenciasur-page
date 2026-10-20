import type { Locale } from "@/lib/i18n";

export const business = {
  rating: null as null | {
    source: "Google" | "TripAdvisor";
    value: number;
    count: number;
    url: string;
  },
  yearsOperating: null as null | number,
  peopleGuided: null as null | number,
  reviews: [] as {
    name: string;
    country: string;
    excursion: string;
    stars: number;
    text: Record<Locale, string>;
    source: string;
    url?: string;
  }[],
  pricesFrom: {} as Record<string, number>, // slug → precio ARS o USD
  currency: "ARS" as "ARS" | "USD",
  cancellationPolicy: null as null | Record<Locale, string>,
  supportHours: null as null | string, // ej. "Todos los días de 8 a 21 h"
  season: {} as Record<string, Record<Locale, string>>,
};
