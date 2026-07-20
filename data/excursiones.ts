export interface Excursion {
  slug: string;
  nombre: string;
  descripcion: string;
  descripcionCorta: string;
  dificultad: "Baja" | "Media" | "Media / Alta" | "Alta";
  distancia: string;
  desnivel: string;
  duracion: string;
  incluye: string[];
  imagenHero: string;
  imagenes: string[];
  pickUp: string;
  temporada: string;
  clima: string;
  equipamiento: string;
  infoAdicional: string;
  precio?: string;
}

export const excursiones: Excursion[] = [
  {
    slug: "laguna-esmeralda",
    nombre: "Laguna Esmeralda",
    descripcion:
      "La Laguna Esmeralda es uno de los senderos más emblemáticos de Ushuaia y una excelente opción para descubrir la naturaleza fueguina. Durante el recorrido atravesaremos bosques de lenga, turbales y antiguos valles glaciares hasta llegar a una impresionante laguna de color verde esmeralda rodeada por montañas. Es una caminata ideal para quienes buscan disfrutar del paisaje, observar la flora y fauna local y vivir una experiencia inolvidable en el Fin del Mundo. Al llegar a la laguna habrá tiempo para descansar, disfrutar del entorno y compartir un box lunch antes de regresar.",
    descripcionCorta:
      "Caminata icónica hasta una laguna de color verde esmeralda rodeada de montañas fueguinas.",
    dificultad: "Media",
    distancia: "10 km",
    desnivel: "200–300 m",
    duracion: "5 horas",
    incluye: ["Guía profesional", "Traslado ida y vuelta", "Box Lunch", "Seguro"],
    imagenHero: "/images/excursiones/laguna-esmeralda/IMG_7464.JPG",
    imagenes: [
      "/images/excursiones/laguna-esmeralda/IMG_7464.JPG",
      "/images/excursiones/laguna-esmeralda/IMG_7494.JPG",
      "/images/excursiones/laguna-esmeralda/IMG_8330.JPG",
      "/images/excursiones/laguna-esmeralda/IMG_8938.JPG",
    ],
    pickUp: "Pick Up 08:00",
    temporada: "OCT a MAY",
    clima: "Variable",
    equipamiento:
      "Botas o borcegos de trekking, campera y pantalón impermeables. Agua y mochila.",
    infoAdicional:
      "Incluye box lunch (sandwich, alfajor y frutos secos) y una infusión caliente. No se cancela por lluvias, únicamente por condiciones climatológicas extremas. Seguro de accidentes personales incluido.",
  },
  {
    slug: "glaciar-martial",
    nombre: "Glaciar Martial",
    descripcion:
      "El Glaciar Martial ofrece una de las mejores vistas panorámicas de Ushuaia. El sendero asciende atravesando bosques fueguinos hasta alcanzar el área glaciar, desde donde pueden observarse la ciudad de Ushuaia, el Canal Beagle y la Cordillera de los Andes. Es una excursión ideal para quienes desean combinar naturaleza, trekking y fotografía.",
    descripcionCorta:
      "Ascenso hasta el glaciar con vistas panorámicas de Ushuaia, el Canal Beagle y los Andes.",
    dificultad: "Media",
    distancia: "8 km",
    desnivel: "400 m",
    duracion: "5 horas",
    incluye: ["Guía profesional", "Traslado ida y vuelta", "Box Lunch", "Seguro"],
    imagenHero: "/images/excursiones/glaciar-martial/IMG_0225.jpg",
    imagenes: [
      "/images/excursiones/glaciar-martial/IMG_0225.jpg",
      "/images/excursiones/glaciar-martial/IMG_0239.jpg",
      "/images/excursiones/glaciar-martial/IMG_0247.jpg",
      "/images/excursiones/glaciar-martial/IMG_0472.JPG",
      "/images/excursiones/glaciar-martial/IMG_9493.jpg",
      "/images/excursiones/glaciar-martial/d9849998-f20f-42da-a2c9-b402f25306b7.jpg",
    ],
    pickUp: "Pick Up 08:30",
    temporada: "OCT a MAY",
    clima: "Frío y variable",
    equipamiento:
      "Botas de trekking impermeables, campera rompevientos, abrigo, guantes y gorro. Mochila con agua.",
    infoAdicional:
      "Incluye box lunch e infusión caliente. No se cancela por lluvias leves. Seguro de accidentes personales incluido.",
  },
  {
    slug: "glaciar-vinciguerra",
    nombre: "Glaciar Vinciguerra",
    descripcion:
      "El Glaciar Vinciguerra es una de las caminatas más completas de Ushuaia. El recorrido atraviesa extensos turbales, bosques de lenga y un valle glaciar hasta llegar a la Laguna de los Témpanos, ubicada al pie del Glaciar Vinciguerra. Durante la caminata se observan cascadas, cursos de agua y un paisaje de alta montaña característico de Tierra del Fuego. Una experiencia ideal para quienes desean un trekking más exigente.",
    descripcionCorta:
      "Travesía completa hasta la Laguna de los Témpanos al pie del Glaciar Vinciguerra.",
    dificultad: "Media / Alta",
    distancia: "15 km",
    desnivel: "650 m",
    duracion: "7 horas",
    incluye: ["Guía profesional", "Traslado ida y vuelta", "Box Lunch", "Seguro"],
    imagenHero: "/images/excursiones/glaciar-vinciguerra/IMG_1464.jpg",
    imagenes: [
      "/images/excursiones/glaciar-vinciguerra/IMG_1464.jpg",
      "/images/excursiones/glaciar-vinciguerra/1000054131.jpg",
      "/images/excursiones/glaciar-vinciguerra/IMG_1468.jpg",
      "/images/excursiones/glaciar-vinciguerra/IMG_1478.jpg",
      "/images/excursiones/glaciar-vinciguerra/IMG_8633.JPG",
    ],
    pickUp: "Pick Up 07:30",
    temporada: "NOV a ABR",
    clima: "Frío y variable",
    equipamiento:
      "Botas de trekking impermeables, campera y pantalón impermeables, abrigo térmico, guantes, gorro. Mochila con agua y snacks extra.",
    infoAdicional:
      "Excursión de mayor exigencia. Se recomienda experiencia previa en trekking. Incluye box lunch e infusión caliente. Seguro incluido.",
  },
  {
    slug: "glaciar-ojo-del-albino",
    nombre: "Glaciar Ojo del Albino",
    descripcion:
      "El Glaciar Ojo del Albino es una de las excursiones más exigentes y espectaculares de Ushuaia. Luego de recorrer el sendero hacia Laguna Esmeralda, la caminata continúa ascendiendo hasta alcanzar un entorno completamente glaciar. Durante el ascenso se obtienen vistas privilegiadas de valles, lagunas y montañas del Fin del Mundo. Es una excursión recomendada para personas con buena condición física y experiencia en caminatas largas.",
    descripcionCorta:
      "La excursión más desafiante: ascenso glaciar con vistas privilegiadas del Fin del Mundo.",
    dificultad: "Alta",
    distancia: "20 km",
    desnivel: "900 m",
    duracion: "8 horas",
    incluye: ["Guía profesional", "Traslado ida y vuelta", "Box Lunch", "Seguro"],
    imagenHero: "/images/excursiones/glaciar-ojo-del-albino/DJI_0658.JPG",
    imagenes: [
      "/images/excursiones/glaciar-ojo-del-albino/DJI_0658.JPG",
      "/images/excursiones/glaciar-ojo-del-albino/IMG_4474.JPG",
      "/images/excursiones/glaciar-ojo-del-albino/IMG_4514.JPG",
      "/images/excursiones/glaciar-ojo-del-albino/IMG_4539.JPG",
      "/images/excursiones/glaciar-ojo-del-albino/IMG_8771.JPG",
      "/images/excursiones/glaciar-ojo-del-albino/IMG_8812.JPG",
      "/images/excursiones/glaciar-ojo-del-albino/IMG_8832.JPG",
      "/images/excursiones/glaciar-ojo-del-albino/20240226_123050.jpg",
    ],
    pickUp: "Pick Up 07:00",
    temporada: "DIC a MAR",
    clima: "Frío intenso y variable",
    equipamiento:
      "Botas de trekking impermeables de caña alta, campera y pantalón impermeables, abrigo térmico, guantes, gorro, bastones de trekking recomendados. Mochila con agua y snacks.",
    infoAdicional:
      "Requiere buena condición física y experiencia previa en trekking de montaña. Incluye box lunch e infusión caliente. Seguro incluido. La salida puede cancelarse por condiciones climáticas adversas.",
  },
  {
    slug: "laguna-cinco-hermanos",
    nombre: "Laguna Cinco Hermanos",
    descripcion:
      "Un trekking en un rincón poco transitado que combina silencio, naturaleza intacta y una vista privilegiada de la Cordillera Fueguina. Caminar hasta la Laguna no es solo un destino, sino una experiencia para adentrarse en uno de los paisajes más auténticos y prístinos en el fin del mundo.",
    descripcionCorta:
      "Trekking por un rincón prístino con vistas privilegiadas de la Cordillera Fueguina.",
    dificultad: "Alta",
    distancia: "13 km ida y vuelta",
    desnivel: "800 m",
    duracion: "8 horas",
    incluye: [
      "Guía de Montaña",
      "Almuerzo e infusión caliente",
      "Vianda de marcha",
      "Equipo técnico: bastones, grampines, etc.",
      "Traslado ida y vuelta al alojamiento",
      "Seguro de accidentes personales",
    ],
    imagenHero: "/images/excursiones/laguna-cinco-hermanos/IMG_6270.JPG",
    imagenes: [
      "/images/excursiones/laguna-cinco-hermanos/IMG_5492.jpg",
      "/images/excursiones/laguna-cinco-hermanos/IMG_4788.JPG",
      "/images/excursiones/laguna-cinco-hermanos/IMG_5379.jpg",
      "/images/excursiones/laguna-cinco-hermanos/IMG_5431.jpg",
      "/images/excursiones/laguna-cinco-hermanos/IMG_5445.jpg",
      "/images/excursiones/laguna-cinco-hermanos/IMG_6270.JPG",
    ],
    pickUp: "Pick Up 08:00",
    temporada: "Todo el año",
    clima: "Frío y variable",
    equipamiento:
      "Botas de trekking de media caña impermeables. Ropa de abrigo (campera y pantalón impermeables). Gorro, guantes, lentes de sol y protector solar. Mochila mediana. Agua mínimo medio litro. (Equipo personal no incluido)",
    infoAdicional:
      "Las sendas presentan humedad, barro y nieve gran parte del año. El uso del equipo es obligatorio. No se cancela por lluvias, únicamente por condiciones climatológicas extremas.",
    precio: "$189.000 por persona",
  },
  {
    slug: "martial-aventura",
    nombre: "Martial Aventura",
    descripcion:
      "Una experiencia única que combina aventura, gastronomía y montaña. Ascendé en Pisten Bully con cabina de pasajeros recorriendo el centro de montaña Martial, seguido de un mini trekking guiado donde conocerás la historia, geografía y condiciones del glaciar. La noche culmina con una cena de tres pasos en el refugio con bebida libre.",
    descripcionCorta:
      "Ascenso en Pisten Bully, trekking guiado y cena de tres pasos en el refugio del Martial.",
    dificultad: "Media",
    distancia: "// A confirmar",
    desnivel: "// A confirmar",
    duracion: "// A confirmar",
    incluye: [
      "Ascenso en Pisten Bully con cabina de pasajeros",
      "Mini trekking con guía experto en montaña",
      "Equipos de montaña: linternas, crampines y bastones",
      "Cena en refugio de tres pasos con bebida libre",
      "Seguro de actividad",
    ],
    imagenHero: "/images/excursiones/martial-aventura/8c51fea1-f555-4f23-933a-ebb5c165b340.jpg",
    imagenes: [
      "/images/excursiones/martial-aventura/8c51fea1-f555-4f23-933a-ebb5c165b340.jpg",
      "/images/excursiones/martial-aventura/IMG_0437.JPG",
      "/images/excursiones/martial-aventura/IMG_0620.JPG",
      "/images/excursiones/martial-aventura/IMG_8440.JPG",
    ],
    pickUp: "A confirmar",
    temporada: "Todo el año",
    clima: "Frío y variable",
    equipamiento: "Ropa de abrigo. El equipo técnico está incluido.",
    infoAdicional:
      "Menores de 12 años $125.000. Menores de 3 años LIBRE. Seguro de actividad incluido.",
    precio: "$190.000 por persona",
  },
  {
    slug: "monte-susana",
    nombre: "Monte Susana",
    descripcion:
      "El Monte Susana es una de las caminatas más gratificantes de Ushuaia. El sendero atraviesa bosques de lenga hasta alcanzar la cumbre, desde donde se obtienen vistas panorámicas de la ciudad, el Canal Beagle y las islas chilenas. Es una excursión ideal para quienes buscan una experiencia de montaña accesible con paisajes inolvidables del Fin del Mundo.",
    descripcionCorta:
      "Ascenso con vistas panorámicas de Ushuaia, el Canal Beagle y las islas desde la cumbre.",
    dificultad: "Media",
    distancia: "9 km ida y vuelta",
    desnivel: "500 m",
    duracion: "5 horas",
    incluye: [
      "Guía de Montaña",
      "Almuerzo e infusión caliente",
      "Traslado ida y vuelta al alojamiento",
      "Seguro de accidentes personales",
    ],
    imagenHero: "/images/excursiones/monte-susana/IMG_5732.JPG",
    imagenes: [
      "/images/excursiones/monte-susana/IMG_5732.JPG",
      "/images/excursiones/monte-susana/IMG_2406.jpg",
      "/images/excursiones/monte-susana/IMG_2411.jpg",
      "/images/excursiones/monte-susana/IMG_2416.jpg",
      "/images/excursiones/monte-susana/IMG_2419.jpg",
      "/images/excursiones/monte-susana/IMG_2426.jpg",
      "/images/excursiones/monte-susana/IMG_3056.JPG",
      "/images/excursiones/monte-susana/IMG_5736.JPG",
      "/images/excursiones/monte-susana/IMG_5793.JPG",
      "/images/excursiones/monte-susana/IMG_7354.JPG",
      "/images/excursiones/monte-susana/IMG_7356.JPG",
      "/images/excursiones/monte-susana/IMG_7373.JPG",
      "/images/excursiones/monte-susana/IMG_7382.JPG",
      "/images/excursiones/monte-susana/IMG_7386.JPG",
    ],
    pickUp: "Pick Up 08:00",
    temporada: "Todo el año",
    clima: "Variable",
    equipamiento:
      "Botas de trekking, campera y pantalón impermeables. Gorro, guantes, lentes de sol. Mochila con agua.",
    infoAdicional:
      "No se cancela por lluvias, únicamente por condiciones climatológicas extremas. Seguro de accidentes personales incluido.",
  },
  {
    slug: "esqui-de-travesia",
    nombre: "Esquí Alpino",
    descripcion: "// TODO: Completar descripción. Contamos con instructor certificado Nivel 2.",
    descripcionCorta: "// TODO: Completar descripción corta",
    dificultad: "Media / Alta",
    distancia: "// TODO",
    desnivel: "// TODO",
    duracion: "// TODO",
    incluye: ["Guía profesional", "Traslado ida y vuelta", "Box Lunch", "Seguro"],
    imagenHero: "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.54.18.jpeg",
    imagenes: [
      "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.52.58.jpeg",
      "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.52.59.jpeg",
      "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.54.18.jpeg",
      "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.54.24.jpeg",
      "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.54.25.jpeg",
    ],
    pickUp: "// TODO",
    temporada: "JUN a SEP",
    clima: "Frío y nevado",
    equipamiento: "// TODO",
    infoAdicional: "Instructor certificado Nivel 2.",
  },
];

export function excursionPorSlug(slug: string): Excursion | undefined {
  return excursiones.find((e) => e.slug === slug);
}
