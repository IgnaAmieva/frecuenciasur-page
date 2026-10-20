import type { Locale } from "@/lib/i18n";

export interface MapPin {
  slug: string;
  x: number; // SVG viewBox coords (0-600)
  y: number; // SVG viewBox coords (0-440)
  nombre: Record<Locale, string>;
  dificultad: string; // es difficulty key for filtering
}

// APROXIMADO — coordenadas mapeadas al viewBox 600x440 del SVG
export const mapPins: MapPin[] = [
  { slug: "glaciar-martial", x: 292, y: 238, nombre: { es: "Glaciar Martial", en: "Martial Glacier", pt: "Glaciar Martial" }, dificultad: "Media" },
  { slug: "monte-susana", x: 150, y: 286, nombre: { es: "Monte Susana", en: "Monte Susana", pt: "Monte Susana" }, dificultad: "Media" },
  { slug: "laguna-esmeralda", x: 430, y: 162, nombre: { es: "Laguna Esmeralda", en: "Laguna Esmeralda", pt: "Laguna Esmeralda" }, dificultad: "Media" },
  { slug: "glaciar-vinciguerra", x: 338, y: 126, nombre: { es: "Glaciar Vinciguerra", en: "Vinciguerra Glacier", pt: "Glaciar Vinciguerra" }, dificultad: "Media / Alta" },
  { slug: "glaciar-ojo-del-albino", x: 492, y: 96, nombre: { es: "Ojo del Albino", en: "Ojo del Albino", pt: "Ojo del Albino" }, dificultad: "Alta" },
  { slug: "laguna-cinco-hermanos", x: 520, y: 236, nombre: { es: "Cinco Hermanos", en: "Cinco Hermanos", pt: "Cinco Hermanos" }, dificultad: "Alta" },
  // Martial Aventura y Esquí comparten pin con Glaciar Martial
  { slug: "martial-aventura", x: 292, y: 238, nombre: { es: "Martial Aventura", en: "Martial Aventura", pt: "Martial Aventura" }, dificultad: "Media" },
  { slug: "esqui-de-travesia", x: 292, y: 238, nombre: { es: "Esquí de Travesía", en: "Backcountry Skiing", pt: "Esqui de Travessia" }, dificultad: "Media / Alta" },
];

// Unique pin positions (martial-aventura and esqui share glaciar-martial's pin)
export const uniquePinPositions = mapPins.filter(
  (p, i, arr) => arr.findIndex((q) => q.x === p.x && q.y === p.y) === i
);
