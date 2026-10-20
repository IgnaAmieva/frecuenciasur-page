import type { Locale } from "@/lib/i18n";

export interface ElevationPoint {
  km: number;
  alt: number; // meters, normalized 0-1 for SVG rendering
}

export interface Hito {
  km: number;
  label: Record<Locale, string>;
}

export interface ElevationData {
  slug: string;
  totalKm: number;
  points: ElevationPoint[];
  hitos: Hito[];
}

// APROXIMADO — datos estimados hasta tener GPX reales
export const elevationProfiles: ElevationData[] = [
  {
    slug: "laguna-esmeralda",
    totalKm: 5,
    points: [
      { km: 0, alt: 0 }, { km: 0.5, alt: 0.04 }, { km: 1, alt: 0.08 },
      { km: 1.5, alt: 0.1 }, { km: 2, alt: 0.13 }, { km: 2.5, alt: 0.15 },
      { km: 3, alt: 0.2 }, { km: 3.4, alt: 0.32 }, { km: 3.8, alt: 0.5 },
      { km: 4.2, alt: 0.7 }, { km: 4.6, alt: 0.86 }, { km: 5, alt: 0.9 },
    ],
    hitos: [
      { km: 0.5, label: { es: "Bosque", en: "Forest", pt: "Floresta" } },
      { km: 2, label: { es: "Turbales", en: "Peat bogs", pt: "Turfeiras" } },
      { km: 3.7, label: { es: "Valle glaciar", en: "Glacial valley", pt: "Vale glaciar" } },
      { km: 5, label: { es: "Laguna", en: "Lagoon", pt: "Lagoa" } },
    ],
  },
  {
    slug: "glaciar-martial",
    totalKm: 4,
    points: [
      { km: 0, alt: 0 }, { km: 0.5, alt: 0.08 }, { km: 1, alt: 0.18 },
      { km: 1.5, alt: 0.3 }, { km: 2, alt: 0.45 }, { km: 2.5, alt: 0.58 },
      { km: 3, alt: 0.72 }, { km: 3.5, alt: 0.85 }, { km: 4, alt: 1 },
    ],
    hitos: [
      { km: 0.5, label: { es: "Aerosilla", en: "Chairlift", pt: "Teleférico" } },
      { km: 2, label: { es: "Bosque", en: "Forest", pt: "Floresta" } },
      { km: 3.5, label: { es: "Nieve", en: "Snow", pt: "Neve" } },
      { km: 4, label: { es: "Glaciar", en: "Glacier", pt: "Glaciar" } },
    ],
  },
  {
    slug: "glaciar-vinciguerra",
    totalKm: 7.5,
    points: [
      { km: 0, alt: 0 }, { km: 1, alt: 0.05 }, { km: 2, alt: 0.1 },
      { km: 3, alt: 0.18 }, { km: 4, alt: 0.32 }, { km: 5, alt: 0.5 },
      { km: 6, alt: 0.7 }, { km: 7, alt: 0.88 }, { km: 7.5, alt: 1 },
    ],
    hitos: [
      { km: 1, label: { es: "Bosque", en: "Forest", pt: "Floresta" } },
      { km: 3, label: { es: "Turbales", en: "Peat bogs", pt: "Turfeiras" } },
      { km: 5.5, label: { es: "Valle glaciar", en: "Glacial valley", pt: "Vale glaciar" } },
      { km: 7.5, label: { es: "Laguna de los Témpanos", en: "Iceberg Lagoon", pt: "Lagoa dos Icebergs" } },
    ],
  },
  {
    slug: "glaciar-ojo-del-albino",
    totalKm: 10,
    points: [
      { km: 0, alt: 0 }, { km: 1, alt: 0.04 }, { km: 2, alt: 0.08 },
      { km: 3, alt: 0.12 }, { km: 4, alt: 0.18 }, { km: 5, alt: 0.3 },
      { km: 6, alt: 0.45 }, { km: 7, alt: 0.6 }, { km: 8, alt: 0.75 },
      { km: 9, alt: 0.88 }, { km: 10, alt: 1 },
    ],
    hitos: [
      { km: 1, label: { es: "Bosque", en: "Forest", pt: "Floresta" } },
      { km: 3, label: { es: "Turbales", en: "Peat bogs", pt: "Turfeiras" } },
      { km: 5, label: { es: "Laguna Esmeralda", en: "Laguna Esmeralda", pt: "Laguna Esmeralda" } },
      { km: 10, label: { es: "Glaciar", en: "Glacier", pt: "Glaciar" } },
    ],
  },
  {
    slug: "laguna-cinco-hermanos",
    totalKm: 6.5,
    points: [
      { km: 0, alt: 0 }, { km: 1, alt: 0.1 }, { km: 2, alt: 0.25 },
      { km: 3, alt: 0.42 }, { km: 4, alt: 0.58 }, { km: 5, alt: 0.74 },
      { km: 5.5, alt: 0.85 }, { km: 6, alt: 0.92 }, { km: 6.5, alt: 1 },
    ],
    hitos: [
      { km: 1, label: { es: "Bosque", en: "Forest", pt: "Floresta" } },
      { km: 3, label: { es: "Cascada", en: "Waterfall", pt: "Cascata" } },
      { km: 5, label: { es: "Montaña", en: "Mountain", pt: "Montanha" } },
      { km: 6.5, label: { es: "Laguna", en: "Lagoon", pt: "Lagoa" } },
    ],
  },
  {
    slug: "monte-susana",
    totalKm: 4.5,
    points: [
      { km: 0, alt: 0 }, { km: 0.5, alt: 0.06 }, { km: 1, alt: 0.15 },
      { km: 1.5, alt: 0.28 }, { km: 2, alt: 0.42 }, { km: 2.5, alt: 0.55 },
      { km: 3, alt: 0.68 }, { km: 3.5, alt: 0.8 }, { km: 4, alt: 0.92 },
      { km: 4.5, alt: 1 },
    ],
    hitos: [
      { km: 0.5, label: { es: "Bosque", en: "Forest", pt: "Floresta" } },
      { km: 2, label: { es: "Ladera", en: "Hillside", pt: "Encosta" } },
      { km: 4.5, label: { es: "Cumbre", en: "Summit", pt: "Cume" } },
    ],
  },
];

export function getElevation(slug: string): ElevationData | undefined {
  return elevationProfiles.find((p) => p.slug === slug);
}
