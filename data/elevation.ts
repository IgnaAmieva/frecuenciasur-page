import type { Locale } from "@/lib/i18n";

/* ───────── Types ───────── */

export interface ElevationPoint {
  km: number;
  /** Accumulated elevation gain in meters (0 at trailhead) */
  alt: number;
}

export interface Hito {
  km: number;
  label: Record<Locale, string>;
}

export interface ElevationData {
  slug: string;
  /** One-way distance in km (= ficha distance / 2) */
  totalKm: number;
  /** Total elevation gain in meters (= ficha desnivel) */
  desnivelM: number;
  points: ElevationPoint[];
  hitos: Hito[];
  /** true if generated from a real GPX track */
  hasGpx: boolean;
}

/* ───────── Curve generation ───────── */

/**
 * Generate a monotone-increasing elevation curve.
 * exponent > 1 → concave-up (gentle start, steep end, typical of glacial valleys).
 */
function curve(
  totalKm: number,
  desnivelM: number,
  exponent: number,
  steps = 20,
): ElevationPoint[] {
  const pts: ElevationPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({
      km: +(t * totalKm).toFixed(2),
      alt: +(desnivelM * Math.pow(t, exponent)).toFixed(0),
    });
  }
  return pts;
}

/* ─────────────────────────────────────────────────────────────
   Profile definitions — all values derived from data/excursiones.ts ficha:
     totalKm = distancia (km) / 2   (all are round-trip)
     desnivelM = desnivel upper bound in meters
   Hito km positions based on relative walking time (see prompt table).
   ⚠ = CONFIRMAR CON GUÍA
   ───────────────────────────────────────────────────────────── */

// APROXIMADO — se actualizará con el track GPS real.
export const elevationProfiles: ElevationData[] = [
  {
    // Ficha: 10 km / 5 h / 200–300 m → 5 km ida, 300 m desnivel
    slug: "laguna-esmeralda",
    totalKm: 5,
    desnivelM: 300,
    points: curve(5, 300, 1.6),
    hitos: [
      { km: 1.8, label: { es: "Bosque de lenga", en: "Lenga forest", pt: "Floresta de lenga" } },
      { km: 3.2, label: { es: "Turbal", en: "Peat bog", pt: "Turfeira" } },
      { km: 5.0, label: { es: "Laguna Esmeralda", en: "Laguna Esmeralda", pt: "Laguna Esmeralda" } },
    ],
    hasGpx: false,
  },
  {
    // Ficha: 8 km / 5 h / 400 m → 4 km ida, 400 m desnivel
    slug: "glaciar-martial",
    totalKm: 4,
    desnivelM: 400,
    points: curve(4, 400, 1.3),
    hitos: [
      { km: 0.3, label: { es: "Aerosilla", en: "Chairlift", pt: "Teleférico" } },
      { km: 1.8, label: { es: "Bosque", en: "Forest", pt: "Floresta" } },
      { km: 4.0, label: { es: "Glaciar", en: "Glacier", pt: "Glaciar" } },
    ],
    hasGpx: false,
  },
  {
    // Ficha: 15 km / 7 h / 650 m ⚠ → 7.5 km ida, 650 m desnivel
    slug: "glaciar-vinciguerra",
    totalKm: 7.5,
    desnivelM: 650,
    points: curve(7.5, 650, 1.7),
    hitos: [
      { km: 0.5, label: { es: "Portón y puente", en: "Gate and bridge", pt: "Portão e ponte" } },
      { km: 2.6, label: { es: "Bosque (bifurcación)", en: "Forest (fork)", pt: "Floresta (bifurcação)" } },
      { km: 4.5, label: { es: "Turbal y arroyos", en: "Peat bog and streams", pt: "Turfeira e riachos" } },
      { km: 6.4, label: { es: "Laguna de los Témpanos", en: "Iceberg Lagoon", pt: "Lagoa dos Icebergs" } },
      { km: 7.5, label: { es: "Glaciar Vinciguerra", en: "Vinciguerra Glacier", pt: "Glaciar Vinciguerra" } },
    ],
    hasGpx: false,
  },
  {
    // Ficha: 20 km / 8 h / 900 m ⚠ → 10 km ida, 900 m desnivel
    // Steep final ascent (exponent 2.0)
    slug: "glaciar-ojo-del-albino",
    totalKm: 10,
    desnivelM: 900,
    points: curve(10, 900, 2.0),
    hitos: [
      { km: 3.5, label: { es: "Bosque de lenga", en: "Lenga forest", pt: "Floresta de lenga" } },
      { km: 7.0, label: { es: "Turbal y valle", en: "Peat bog and valley", pt: "Turfeira e vale" } },
      { km: 10.0, label: { es: "Glaciar Ojo del Albino", en: "Ojo del Albino Glacier", pt: "Glaciar Ojo del Albino" } },
    ],
    hasGpx: false,
  },
  {
    // Ficha: 13 km ida y vuelta / 8 h / 800 m ⚠ → 6.5 km ida, 800 m desnivel
    // Cruce de río at ~60%, steep final 40%
    slug: "laguna-cinco-hermanos",
    totalKm: 6.5,
    desnivelM: 800,
    points: curve(6.5, 800, 1.8),
    hitos: [
      { km: 0.5, label: { es: "Kawi Yoppen", en: "Kawi Yoppen", pt: "Kawi Yoppen" } },
      { km: 1.2, label: { es: "Cascada Velo de la Novia", en: "Bridal Veil Waterfall", pt: "Cascata Véu da Noiva" } },
      { km: 3.9, label: { es: "Cruce de río", en: "River crossing", pt: "Travessia do rio" } },
      { km: 6.5, label: { es: "Laguna Cinco Hermanos", en: "Laguna Cinco Hermanos", pt: "Laguna Cinco Hermanos" } },
    ],
    hasGpx: false,
  },
  {
    // Ficha: 9 km ida y vuelta / 5 h / 500 m ⚠ → 4.5 km ida, 500 m desnivel
    // Mirador at ~40% ascent time (~1h of ~2.5h)
    slug: "monte-susana",
    totalKm: 4.5,
    desnivelM: 500,
    points: curve(4.5, 500, 1.4),
    hitos: [
      { km: 0.5, label: { es: "Barrio Costa Susana", en: "Costa Susana", pt: "Bairro Costa Susana" } },
      { km: 1.8, label: { es: "Mirador", en: "Viewpoint", pt: "Mirante" } },
      { km: 4.5, label: { es: "Cumbre", en: "Summit", pt: "Cume" } },
    ],
    hasGpx: false,
  },
  // martial-aventura: sin datos — NO perfil
  // esqui-de-travesia: sin datos — NO perfil
];

export function getElevation(slug: string): ElevationData | undefined {
  return elevationProfiles.find((p) => p.slug === slug);
}
