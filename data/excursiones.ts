import type { Locale } from "@/lib/i18n";

export interface IncluyeItem {
  key: string;
  label: Record<Locale, string>;
}

export interface Excursion {
  slug: string;
  nombre: Record<Locale, string>;
  descripcion: Record<Locale, string>;
  descripcionCorta: Record<Locale, string>;
  dificultad: Record<Locale, string>;
  distancia: Record<Locale, string>;
  desnivel: Record<Locale, string>;
  duracion: Record<Locale, string>;
  incluye: IncluyeItem[];
  imagenHero: string;
  imagenes: string[];
  pickUp: Record<Locale, string>;
  temporada: string;
  clima: Record<Locale, string>;
  equipamiento: Record<Locale, string>;
  infoAdicional: Record<Locale, string>;
  precio?: Record<Locale, string>;
}

export const excursiones: Excursion[] = [
  {
    slug: "laguna-esmeralda",
    nombre: {
      es: "Laguna Esmeralda",
      en: "Laguna Esmeralda",
      pt: "Laguna Esmeralda",
    },
    descripcion: {
      es: "La Laguna Esmeralda es uno de los senderos más emblemáticos de Ushuaia y una excelente opción para descubrir la naturaleza fueguina. Durante el recorrido atravesaremos bosques de lenga, turbales y antiguos valles glaciares hasta llegar a una impresionante laguna de color verde esmeralda rodeada por montañas. Es una caminata ideal para quienes buscan disfrutar del paisaje, observar la flora y fauna local y vivir una experiencia inolvidable en el Fin del Mundo. Al llegar a la laguna habrá tiempo para descansar, disfrutar del entorno y compartir un box lunch antes de regresar.",
      en: "Laguna Esmeralda is one of the most iconic trails in Ushuaia and an excellent option to discover Fuegian nature. During the trek we will cross lenga forests, peat bogs and ancient glacial valleys until reaching an impressive emerald-green lagoon surrounded by mountains. It is an ideal hike for those looking to enjoy the landscape, observe local flora and fauna and live an unforgettable experience at the End of the World. Upon arriving at the lagoon there will be time to rest, enjoy the surroundings and share a box lunch before returning.",
      pt: "A Laguna Esmeralda é uma das trilhas mais emblemáticas de Ushuaia e uma excelente opção para descobrir a natureza fueguina. Durante o percurso atravessaremos florestas de lenga, turfeiras e antigos vales glaciais até chegar a uma impressionante lagoa de cor verde esmeralda rodeada por montanhas. É uma caminhada ideal para quem busca desfrutar da paisagem, observar a flora e fauna local e viver uma experiência inesquecível no Fim do Mundo. Ao chegar à lagoa haverá tempo para descansar, desfrutar do entorno e compartilhar um box lunch antes de retornar.",
    },
    descripcionCorta: {
      es: "Caminata icónica hasta una laguna de color verde esmeralda rodeada de montañas fueguinas.",
      en: "Iconic hike to an emerald-green lagoon surrounded by Fuegian mountains.",
      pt: "Caminhada icônica até uma lagoa de cor verde esmeralda rodeada de montanhas fueguinas.",
    },
    dificultad: { es: "Media", en: "Medium", pt: "Média" },
    distancia: { es: "10 km", en: "10 km", pt: "10 km" },
    desnivel: { es: "200–300 m", en: "200–300 m", pt: "200–300 m" },
    duracion: { es: "5 horas", en: "5 hours", pt: "5 horas" },
    incluye: [
      { key: "guia", label: { es: "Guía profesional", en: "Professional guide", pt: "Guia profissional" } },
      { key: "traslado", label: { es: "Traslado ida y vuelta", en: "Round-trip transfer", pt: "Traslado ida e volta" } },
      { key: "boxLunch", label: { es: "Box Lunch", en: "Box Lunch", pt: "Box Lunch" } },
      { key: "seguro", label: { es: "Seguro", en: "Insurance", pt: "Seguro" } },
    ],
    imagenHero: "/images/excursiones/laguna-esmeralda/IMG_7464.JPG",
    imagenes: [
      "/images/excursiones/laguna-esmeralda/IMG_7464.JPG",
      "/images/excursiones/laguna-esmeralda/IMG_7494.JPG",
      "/images/excursiones/laguna-esmeralda/IMG_8330.JPG",
      "/images/excursiones/laguna-esmeralda/IMG_8938.JPG",
    ],
    pickUp: { es: "Pick Up 08:00", en: "Pick Up 08:00", pt: "Pick Up 08:00" },
    temporada: "OCT a MAY",
    clima: { es: "Variable", en: "Variable", pt: "Variável" },
    equipamiento: {
      es: "Botas o borcegos de trekking, campera y pantalón impermeables. Agua y mochila.",
      en: "Trekking boots, waterproof jacket and pants. Water and backpack.",
      pt: "Botas de trekking, jaqueta e calça impermeáveis. Água e mochila.",
    },
    infoAdicional: {
      es: "Incluye box lunch (sandwich, alfajor y frutos secos) y una infusión caliente. No se cancela por lluvias, únicamente por condiciones climatológicas extremas. Seguro de accidentes personales incluido.",
      en: "Includes box lunch (sandwich, alfajor and nuts) and a hot beverage. Not cancelled for rain, only for extreme weather conditions. Personal accident insurance included.",
      pt: "Inclui box lunch (sanduíche, alfajor e frutas secas) e uma infusão quente. Não se cancela por chuvas, apenas por condições climáticas extremas. Seguro de acidentes pessoais incluído.",
    },
  },
  {
    slug: "glaciar-martial",
    nombre: {
      es: "Glaciar Martial",
      en: "Martial Glacier",
      pt: "Glaciar Martial",
    },
    descripcion: {
      es: "El Glaciar Martial ofrece una de las mejores vistas panorámicas de Ushuaia. El sendero asciende atravesando bosques fueguinos hasta alcanzar el área glaciar, desde donde pueden observarse la ciudad de Ushuaia, el Canal Beagle y la Cordillera de los Andes. Es una excursión ideal para quienes desean combinar naturaleza, trekking y fotografía.",
      en: "Martial Glacier offers one of the best panoramic views of Ushuaia. The trail ascends through Fuegian forests until reaching the glacier area, from where you can observe the city of Ushuaia, the Beagle Channel and the Andes mountain range. It is an ideal excursion for those who wish to combine nature, trekking and photography.",
      pt: "O Glaciar Martial oferece uma das melhores vistas panorâmicas de Ushuaia. A trilha sobe atravessando florestas fueguinas até alcançar a área glaciar, de onde podem ser observadas a cidade de Ushuaia, o Canal Beagle e a Cordilheira dos Andes. É uma excursão ideal para quem deseja combinar natureza, trekking e fotografia.",
    },
    descripcionCorta: {
      es: "Ascenso hasta el glaciar con vistas panorámicas de Ushuaia, el Canal Beagle y los Andes.",
      en: "Ascent to the glacier with panoramic views of Ushuaia, the Beagle Channel and the Andes.",
      pt: "Subida até o glaciar com vistas panorâmicas de Ushuaia, o Canal Beagle e os Andes.",
    },
    dificultad: { es: "Media", en: "Medium", pt: "Média" },
    distancia: { es: "8 km", en: "8 km", pt: "8 km" },
    desnivel: { es: "400 m", en: "400 m", pt: "400 m" },
    duracion: { es: "5 horas", en: "5 hours", pt: "5 horas" },
    incluye: [
      { key: "guia", label: { es: "Guía profesional", en: "Professional guide", pt: "Guia profissional" } },
      { key: "traslado", label: { es: "Traslado ida y vuelta", en: "Round-trip transfer", pt: "Traslado ida e volta" } },
      { key: "boxLunch", label: { es: "Box Lunch", en: "Box Lunch", pt: "Box Lunch" } },
      { key: "seguro", label: { es: "Seguro", en: "Insurance", pt: "Seguro" } },
    ],
    imagenHero: "/images/excursiones/glaciar-martial/IMG_0225.jpg",
    imagenes: [
      "/images/excursiones/glaciar-martial/IMG_0225.jpg",
      "/images/excursiones/glaciar-martial/IMG_0239.jpg",
      "/images/excursiones/glaciar-martial/IMG_0247.jpg",
      "/images/excursiones/glaciar-martial/IMG_0472.JPG",
      "/images/excursiones/glaciar-martial/IMG_9493.jpg",
      "/images/excursiones/glaciar-martial/d9849998-f20f-42da-a2c9-b402f25306b7.jpg",
    ],
    pickUp: { es: "Pick Up 08:30", en: "Pick Up 08:30", pt: "Pick Up 08:30" },
    temporada: "OCT a MAY",
    clima: { es: "Frío y variable", en: "Cold and variable", pt: "Frio e variável" },
    equipamiento: {
      es: "Botas de trekking impermeables, campera rompevientos, abrigo, guantes y gorro. Mochila con agua.",
      en: "Waterproof trekking boots, windbreaker, warm layers, gloves and hat. Backpack with water.",
      pt: "Botas de trekking impermeáveis, jaqueta corta-vento, agasalho, luvas e gorro. Mochila com água.",
    },
    infoAdicional: {
      es: "Incluye box lunch e infusión caliente. No se cancela por lluvias leves. Seguro de accidentes personales incluido.",
      en: "Includes box lunch and hot beverage. Not cancelled for light rain. Personal accident insurance included.",
      pt: "Inclui box lunch e infusão quente. Não se cancela por chuvas leves. Seguro de acidentes pessoais incluído.",
    },
  },
  {
    slug: "glaciar-vinciguerra",
    nombre: {
      es: "Glaciar Vinciguerra",
      en: "Vinciguerra Glacier",
      pt: "Glaciar Vinciguerra",
    },
    descripcion: {
      es: "El Glaciar Vinciguerra es una de las caminatas más completas de Ushuaia. El recorrido atraviesa extensos turbales, bosques de lenga y un valle glaciar hasta llegar a la Laguna de los Témpanos, ubicada al pie del Glaciar Vinciguerra. Durante la caminata se observan cascadas, cursos de agua y un paisaje de alta montaña característico de Tierra del Fuego. Una experiencia ideal para quienes desean un trekking más exigente.",
      en: "Vinciguerra Glacier is one of the most complete treks in Ushuaia. The route crosses extensive peat bogs, lenga forests and a glacial valley until reaching Laguna de los Témpanos, located at the foot of Vinciguerra Glacier. During the hike you can observe waterfalls, streams and high mountain landscapes characteristic of Tierra del Fuego. An ideal experience for those seeking a more demanding trek.",
      pt: "O Glaciar Vinciguerra é uma das caminhadas mais completas de Ushuaia. O percurso atravessa extensas turfeiras, florestas de lenga e um vale glaciar até chegar à Laguna de los Témpanos, localizada ao pé do Glaciar Vinciguerra. Durante a caminhada observam-se cascatas, cursos de água e uma paisagem de alta montanha característica da Terra do Fogo. Uma experiência ideal para quem deseja um trekking mais exigente.",
    },
    descripcionCorta: {
      es: "Travesía completa hasta la Laguna de los Témpanos al pie del Glaciar Vinciguerra.",
      en: "Complete trek to Laguna de los Témpanos at the foot of Vinciguerra Glacier.",
      pt: "Travessia completa até a Laguna de los Témpanos ao pé do Glaciar Vinciguerra.",
    },
    dificultad: { es: "Media / Alta", en: "Medium / High", pt: "Média / Alta" },
    distancia: { es: "15 km", en: "15 km", pt: "15 km" },
    desnivel: { es: "650 m", en: "650 m", pt: "650 m" }, // CONFIRMAR CON GUÍA — fuente oficial dice 350 m
    duracion: { es: "7 horas", en: "7 hours", pt: "7 horas" },
    incluye: [
      { key: "guia", label: { es: "Guía profesional", en: "Professional guide", pt: "Guia profissional" } },
      { key: "traslado", label: { es: "Traslado ida y vuelta", en: "Round-trip transfer", pt: "Traslado ida e volta" } },
      { key: "boxLunch", label: { es: "Box Lunch", en: "Box Lunch", pt: "Box Lunch" } },
      { key: "seguro", label: { es: "Seguro", en: "Insurance", pt: "Seguro" } },
    ],
    imagenHero: "/images/excursiones/glaciar-vinciguerra/IMG_1464.jpg",
    imagenes: [
      "/images/excursiones/glaciar-vinciguerra/IMG_1464.jpg",
      "/images/excursiones/glaciar-vinciguerra/1000054131.jpg",
      "/images/excursiones/glaciar-vinciguerra/IMG_1468.jpg",
      "/images/excursiones/glaciar-vinciguerra/IMG_1478.jpg",
      "/images/excursiones/glaciar-vinciguerra/IMG_8633.JPG",
    ],
    pickUp: { es: "Pick Up 07:30", en: "Pick Up 07:30", pt: "Pick Up 07:30" },
    temporada: "NOV a ABR",
    clima: { es: "Frío y variable", en: "Cold and variable", pt: "Frio e variável" },
    equipamiento: {
      es: "Botas de trekking impermeables, campera y pantalón impermeables, abrigo térmico, guantes, gorro. Mochila con agua y snacks extra.",
      en: "Waterproof trekking boots, waterproof jacket and pants, thermal layers, gloves, hat. Backpack with water and extra snacks.",
      pt: "Botas de trekking impermeáveis, jaqueta e calça impermeáveis, agasalho térmico, luvas, gorro. Mochila com água e snacks extra.",
    },
    infoAdicional: {
      es: "Excursión de mayor exigencia. Se recomienda experiencia previa en trekking. Incluye box lunch e infusión caliente. Seguro incluido.",
      en: "More demanding excursion. Previous trekking experience recommended. Includes box lunch and hot beverage. Insurance included.",
      pt: "Excursão de maior exigência. Recomenda-se experiência prévia em trekking. Inclui box lunch e infusão quente. Seguro incluído.",
    },
  },
  {
    slug: "glaciar-ojo-del-albino",
    nombre: {
      es: "Glaciar Ojo del Albino",
      en: "Ojo del Albino Glacier",
      pt: "Glaciar Ojo del Albino",
    },
    descripcion: {
      es: "El Glaciar Ojo del Albino es una de las excursiones más exigentes y espectaculares de Ushuaia. Luego de recorrer el sendero hacia Laguna Esmeralda, la caminata continúa ascendiendo hasta alcanzar un entorno completamente glaciar. Durante el ascenso se obtienen vistas privilegiadas de valles, lagunas y montañas del Fin del Mundo. Es una excursión recomendada para personas con buena condición física y experiencia en caminatas largas.",
      en: "Ojo del Albino Glacier is one of the most demanding and spectacular excursions in Ushuaia. After hiking the trail to Laguna Esmeralda, the walk continues ascending until reaching a fully glacial environment. During the ascent you get privileged views of valleys, lagoons and mountains of the End of the World. It is recommended for people with good physical condition and experience in long hikes.",
      pt: "O Glaciar Ojo del Albino é uma das excursões mais exigentes e espetaculares de Ushuaia. Depois de percorrer a trilha até a Laguna Esmeralda, a caminhada continua subindo até alcançar um ambiente completamente glaciar. Durante a subida obtêm-se vistas privilegiadas de vales, lagoas e montanhas do Fim do Mundo. É uma excursão recomendada para pessoas com boa condição física e experiência em caminhadas longas.",
    },
    descripcionCorta: {
      es: "La excursión más desafiante: ascenso glaciar con vistas privilegiadas del Fin del Mundo.",
      en: "The most challenging excursion: glacier ascent with privileged views of the End of the World.",
      pt: "A excursão mais desafiadora: subida glaciar com vistas privilegiadas do Fim do Mundo.",
    },
    dificultad: { es: "Alta", en: "High", pt: "Alta" },
    distancia: { es: "20 km", en: "20 km", pt: "20 km" }, // CONFIRMAR CON GUÍA — Headout dice ~21 km
    desnivel: { es: "900 m", en: "900 m", pt: "900 m" }, // CONFIRMAR CON GUÍA — Headout dice ~1200 m
    duracion: { es: "8 horas", en: "8 hours", pt: "8 horas" }, // CONFIRMAR CON GUÍA — Headout dice 12 h
    incluye: [
      { key: "guia", label: { es: "Guía profesional", en: "Professional guide", pt: "Guia profissional" } },
      { key: "traslado", label: { es: "Traslado ida y vuelta", en: "Round-trip transfer", pt: "Traslado ida e volta" } },
      { key: "boxLunch", label: { es: "Box Lunch", en: "Box Lunch", pt: "Box Lunch" } },
      { key: "seguro", label: { es: "Seguro", en: "Insurance", pt: "Seguro" } },
    ],
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
    pickUp: { es: "Pick Up 07:00", en: "Pick Up 07:00", pt: "Pick Up 07:00" },
    temporada: "DIC a MAR",
    clima: { es: "Frío intenso y variable", en: "Intense cold and variable", pt: "Frio intenso e variável" },
    equipamiento: {
      es: "Botas de trekking impermeables de caña alta, campera y pantalón impermeables, abrigo térmico, guantes, gorro, bastones de trekking recomendados. Mochila con agua y snacks.",
      en: "High-cut waterproof trekking boots, waterproof jacket and pants, thermal layers, gloves, hat, trekking poles recommended. Backpack with water and snacks.",
      pt: "Botas de trekking impermeáveis de cano alto, jaqueta e calça impermeáveis, agasalho térmico, luvas, gorro, bastões de trekking recomendados. Mochila com água e snacks.",
    },
    infoAdicional: {
      es: "Requiere buena condición física y experiencia previa en trekking de montaña. Incluye box lunch e infusión caliente. Seguro incluido. La salida puede cancelarse por condiciones climáticas adversas.",
      en: "Requires good physical condition and previous mountain trekking experience. Includes box lunch and hot beverage. Insurance included. The outing may be cancelled due to adverse weather conditions.",
      pt: "Requer boa condição física e experiência prévia em trekking de montanha. Inclui box lunch e infusão quente. Seguro incluído. A saída pode ser cancelada por condições climáticas adversas.",
    },
  },
  {
    slug: "laguna-cinco-hermanos",
    nombre: {
      es: "Laguna Cinco Hermanos",
      en: "Laguna Cinco Hermanos",
      pt: "Laguna Cinco Hermanos",
    },
    descripcion: {
      es: "Un trekking en un rincón poco transitado que combina silencio, naturaleza intacta y una vista privilegiada de la Cordillera Fueguina. Caminar hasta la Laguna no es solo un destino, sino una experiencia para adentrarse en uno de los paisajes más auténticos y prístinos en el fin del mundo.",
      en: "A trek through a seldom-visited corner that combines silence, untouched nature and a privileged view of the Fuegian mountain range. Walking to the Laguna is not just a destination, but an experience to immerse yourself in one of the most authentic and pristine landscapes at the end of the world.",
      pt: "Um trekking em um canto pouco transitado que combina silêncio, natureza intacta e uma vista privilegiada da Cordilheira Fueguina. Caminhar até a Laguna não é apenas um destino, mas uma experiência para adentrar-se em uma das paisagens mais autênticas e pristinas no fim do mundo.",
    },
    descripcionCorta: {
      es: "Trekking por un rincón prístino con vistas privilegiadas de la Cordillera Fueguina.",
      en: "Trek through a pristine corner with privileged views of the Fuegian mountain range.",
      pt: "Trekking por um canto pristino com vistas privilegiadas da Cordilheira Fueguina.",
    },
    dificultad: { es: "Alta", en: "High", pt: "Alta" },
    distancia: { es: "13 km ida y vuelta", en: "13 km round trip", pt: "13 km ida e volta" }, // CONFIRMAR CON GUÍA — blog dice 11 km
    desnivel: { es: "800 m", en: "800 m", pt: "800 m" }, // CONFIRMAR CON GUÍA — blog dice ~910 m
    duracion: { es: "8 horas", en: "8 hours", pt: "8 horas" },
    incluye: [
      { key: "guia", label: { es: "Guía de Montaña", en: "Mountain Guide", pt: "Guia de Montanha" } },
      { key: "almuerzo", label: { es: "Almuerzo e infusión caliente", en: "Lunch and hot beverage", pt: "Almoço e infusão quente" } },
      { key: "vianda", label: { es: "Vianda de marcha", en: "Trail snack", pt: "Lanche de trilha" } },
      { key: "equipo", label: { es: "Equipo técnico: bastones, grampines, etc.", en: "Technical equipment: poles, crampons, etc.", pt: "Equipamento técnico: bastões, grampões, etc." } },
      { key: "traslado", label: { es: "Traslado ida y vuelta al alojamiento", en: "Round-trip transfer to accommodation", pt: "Traslado ida e volta ao alojamento" } },
      { key: "seguro", label: { es: "Seguro de accidentes personales", en: "Personal accident insurance", pt: "Seguro de acidentes pessoais" } },
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
    pickUp: { es: "Pick Up 08:00", en: "Pick Up 08:00", pt: "Pick Up 08:00" },
    temporada: "Todo el año",
    clima: { es: "Frío y variable", en: "Cold and variable", pt: "Frio e variável" },
    equipamiento: {
      es: "Botas de trekking de media caña impermeables. Ropa de abrigo (campera y pantalón impermeables). Gorro, guantes, lentes de sol y protector solar. Mochila mediana. Agua mínimo medio litro. (Equipo personal no incluido)",
      en: "Mid-cut waterproof trekking boots. Warm clothing (waterproof jacket and pants). Hat, gloves, sunglasses and sunscreen. Medium backpack. At least half a litre of water. (Personal equipment not included)",
      pt: "Botas de trekking de cano médio impermeáveis. Roupa de agasalho (jaqueta e calça impermeáveis). Gorro, luvas, óculos de sol e protetor solar. Mochila média. Água mínimo meio litro. (Equipamento pessoal não incluído)",
    },
    infoAdicional: {
      es: "Las sendas presentan humedad, barro y nieve gran parte del año. El uso del equipo es obligatorio. No se cancela por lluvias, únicamente por condiciones climatológicas extremas.",
      en: "The trails have moisture, mud and snow most of the year. Equipment use is mandatory. Not cancelled for rain, only for extreme weather conditions.",
      pt: "As trilhas apresentam umidade, lama e neve grande parte do ano. O uso do equipamento é obrigatório. Não se cancela por chuvas, apenas por condições climáticas extremas.",
    },
    precio: { es: "$189.000 por persona", en: "$189.000 per person", pt: "$189.000 por pessoa" },
  },
  {
    slug: "martial-aventura",
    nombre: {
      es: "Martial Aventura",
      en: "Martial Aventura",
      pt: "Martial Aventura",
    },
    descripcion: {
      es: "Una experiencia única que combina aventura, gastronomía y montaña. Ascendé en Pisten Bully con cabina de pasajeros recorriendo el centro de montaña Martial, seguido de un mini trekking guiado donde conocerás la historia, geografía y condiciones del glaciar. La noche culmina con una cena de tres pasos en el refugio con bebida libre.",
      en: "A unique experience that combines adventure, gastronomy and mountain. Ascend in a Pisten Bully with a passenger cabin through the Martial mountain centre, followed by a guided mini trekking where you will learn about the history, geography and conditions of the glacier. The night culminates with a three-course dinner at the refuge with open bar.",
      pt: "Uma experiência única que combina aventura, gastronomia e montanha. Suba em um Pisten Bully com cabine de passageiros percorrendo o centro de montanha Martial, seguido de um mini trekking guiado onde conhecerá a história, geografia e condições do glaciar. A noite culmina com um jantar de três pratos no refúgio com bebida livre.",
    },
    descripcionCorta: {
      es: "Ascenso en Pisten Bully, trekking guiado y cena de tres pasos en el refugio del Martial.",
      en: "Pisten Bully ascent, guided trekking and three-course dinner at the Martial refuge.",
      pt: "Subida em Pisten Bully, trekking guiado e jantar de três pratos no refúgio do Martial.",
    },
    dificultad: { es: "Media", en: "Medium", pt: "Média" },
    distancia: { es: "A confirmar", en: "To be confirmed", pt: "A confirmar" },
    desnivel: { es: "A confirmar", en: "To be confirmed", pt: "A confirmar" },
    duracion: { es: "A confirmar", en: "To be confirmed", pt: "A confirmar" },
    incluye: [
      { key: "pistenBully", label: { es: "Ascenso en Pisten Bully con cabina de pasajeros", en: "Pisten Bully ascent with passenger cabin", pt: "Subida em Pisten Bully com cabine de passageiros" } },
      { key: "miniTrekking", label: { es: "Mini trekking con guía experto en montaña", en: "Mini trekking with mountain expert guide", pt: "Mini trekking com guia especialista em montanha" } },
      { key: "equipo", label: { es: "Equipos de montaña: linternas, crampines y bastones", en: "Mountain equipment: flashlights, crampons and poles", pt: "Equipamento de montanha: lanternas, grampões e bastões" } },
      { key: "cena", label: { es: "Cena en refugio de tres pasos con bebida libre", en: "Three-course dinner at refuge with open bar", pt: "Jantar de três pratos no refúgio com bebida livre" } },
      { key: "seguro", label: { es: "Seguro de actividad", en: "Activity insurance", pt: "Seguro de atividade" } },
    ],
    imagenHero: "/images/excursiones/martial-aventura/8c51fea1-f555-4f23-933a-ebb5c165b340.jpg",
    imagenes: [
      "/images/excursiones/martial-aventura/8c51fea1-f555-4f23-933a-ebb5c165b340.jpg",
      "/images/excursiones/martial-aventura/IMG_0437.JPG",
      "/images/excursiones/martial-aventura/IMG_0620.JPG",
      "/images/excursiones/martial-aventura/IMG_8440.JPG",
    ],
    pickUp: { es: "A confirmar", en: "To be confirmed", pt: "A confirmar" },
    temporada: "Todo el año",
    clima: { es: "Frío y variable", en: "Cold and variable", pt: "Frio e variável" },
    equipamiento: {
      es: "Ropa de abrigo. El equipo técnico está incluido.",
      en: "Warm clothing. Technical equipment is included.",
      pt: "Roupa de agasalho. O equipamento técnico está incluído.",
    },
    infoAdicional: {
      es: "Menores de 12 años $125.000. Menores de 3 años LIBRE. Seguro de actividad incluido.",
      en: "Children under 12: $125,000. Children under 3: FREE. Activity insurance included.",
      pt: "Menores de 12 anos $125.000. Menores de 3 anos LIVRE. Seguro de atividade incluído.",
    },
    precio: { es: "$190.000 por persona", en: "$190,000 per person", pt: "$190.000 por pessoa" },
  },
  {
    slug: "monte-susana",
    nombre: {
      es: "Monte Susana",
      en: "Monte Susana",
      pt: "Monte Susana",
    },
    descripcion: {
      es: "El Monte Susana es una de las caminatas más gratificantes de Ushuaia. El sendero atraviesa bosques de lenga hasta alcanzar la cumbre, desde donde se obtienen vistas panorámicas de la ciudad, el Canal Beagle y las islas chilenas. Es una excursión ideal para quienes buscan una experiencia de montaña accesible con paisajes inolvidables del Fin del Mundo.",
      en: "Monte Susana is one of the most rewarding hikes in Ushuaia. The trail crosses lenga forests until reaching the summit, from where you get panoramic views of the city, the Beagle Channel and the Chilean islands. It is an ideal excursion for those looking for an accessible mountain experience with unforgettable landscapes of the End of the World.",
      pt: "O Monte Susana é uma das caminhadas mais gratificantes de Ushuaia. A trilha atravessa florestas de lenga até alcançar o cume, de onde se obtêm vistas panorâmicas da cidade, do Canal Beagle e das ilhas chilenas. É uma excursão ideal para quem busca uma experiência de montanha acessível com paisagens inesquecíveis do Fim do Mundo.",
    },
    descripcionCorta: {
      es: "Ascenso con vistas panorámicas de Ushuaia, el Canal Beagle y las islas desde la cumbre.",
      en: "Ascent with panoramic views of Ushuaia, the Beagle Channel and the islands from the summit.",
      pt: "Subida com vistas panorâmicas de Ushuaia, o Canal Beagle e as ilhas desde o cume.",
    },
    dificultad: { es: "Media", en: "Medium", pt: "Média" },
    distancia: { es: "9 km ida y vuelta", en: "9 km round trip", pt: "9 km ida e volta" }, // CONFIRMAR CON GUÍA — oficial dice 7 km
    desnivel: { es: "500 m", en: "500 m", pt: "500 m" }, // CONFIRMAR CON GUÍA — oficial dice cumbre a 500 m s.n.m.
    duracion: { es: "5 horas", en: "5 hours", pt: "5 horas" },
    incluye: [
      { key: "guia", label: { es: "Guía de Montaña", en: "Mountain Guide", pt: "Guia de Montanha" } },
      { key: "almuerzo", label: { es: "Almuerzo e infusión caliente", en: "Lunch and hot beverage", pt: "Almoço e infusão quente" } },
      { key: "traslado", label: { es: "Traslado ida y vuelta al alojamiento", en: "Round-trip transfer to accommodation", pt: "Traslado ida e volta ao alojamento" } },
      { key: "seguro", label: { es: "Seguro de accidentes personales", en: "Personal accident insurance", pt: "Seguro de acidentes pessoais" } },
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
    pickUp: { es: "Pick Up 08:00", en: "Pick Up 08:00", pt: "Pick Up 08:00" },
    temporada: "Todo el año",
    clima: { es: "Variable", en: "Variable", pt: "Variável" },
    equipamiento: {
      es: "Botas de trekking, campera y pantalón impermeables. Gorro, guantes, lentes de sol. Mochila con agua.",
      en: "Trekking boots, waterproof jacket and pants. Hat, gloves, sunglasses. Backpack with water.",
      pt: "Botas de trekking, jaqueta e calça impermeáveis. Gorro, luvas, óculos de sol. Mochila com água.",
    },
    infoAdicional: {
      es: "No se cancela por lluvias, únicamente por condiciones climatológicas extremas. Seguro de accidentes personales incluido.",
      en: "Not cancelled for rain, only for extreme weather conditions. Personal accident insurance included.",
      pt: "Não se cancela por chuvas, apenas por condições climáticas extremas. Seguro de acidentes pessoais incluído.",
    },
  },
  {
    slug: "esqui-de-travesia",
    nombre: {
      es: "Esquí de Travesía",
      en: "Backcountry Skiing",
      pt: "Esqui de Travessia",
    },
    descripcion: {
      es: "El esquí de travesía combina el ascenso por terrenos de montaña con descensos sobre nieve, permitiéndote explorar paisajes naturales del Fin del Mundo. A diferencia del esquí alpino tradicional, permite recorrer entornos naturales fuera de las pistas convencionales. Contamos con instructor certificado Nivel 2.",
      en: "Backcountry skiing combines ascent through mountain terrain with descents on snow, allowing you to explore the natural landscapes of the End of the World. Unlike traditional alpine skiing, it allows you to travel through natural environments outside conventional slopes. We have a certified Level 2 instructor.",
      pt: "O esqui de travessia combina a subida por terrenos de montanha com descidas sobre neve, permitindo explorar paisagens naturais do Fim do Mundo. Diferentemente do esqui alpino tradicional, permite percorrer ambientes naturais fora das pistas convencionais. Contamos com instrutor certificado Nível 2.",
    },
    descripcionCorta: {
      es: "Esquí de montaña con ascenso y descenso en nieve por la cordillera fueguina.",
      en: "Mountain skiing with ascent and descent on snow through the Fuegian mountain range.",
      pt: "Esqui de montanha com subida e descida na neve pela cordilheira fueguina.",
    },
    dificultad: { es: "Media / Alta", en: "Medium / High", pt: "Média / Alta" },
    distancia: { es: "Consultar", en: "Ask us", pt: "Consultar" },
    desnivel: { es: "Consultar", en: "Ask us", pt: "Consultar" },
    duracion: { es: "Consultar", en: "Ask us", pt: "Consultar" },
    incluye: [
      { key: "guia", label: { es: "Guía profesional", en: "Professional guide", pt: "Guia profissional" } },
      { key: "traslado", label: { es: "Traslado ida y vuelta", en: "Round-trip transfer", pt: "Traslado ida e volta" } },
      { key: "boxLunch", label: { es: "Box Lunch", en: "Box Lunch", pt: "Box Lunch" } },
      { key: "seguro", label: { es: "Seguro", en: "Insurance", pt: "Seguro" } },
    ],
    imagenHero: "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.54.18.jpeg",
    imagenes: [
      "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.52.58.jpeg",
      "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.52.59.jpeg",
      "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.54.18.jpeg",
      "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.54.24.jpeg",
      "/images/excursiones/esqui-de-travesia/WhatsApp Image 2026-07-20 at 14.54.25.jpeg",
    ],
    pickUp: { es: "Consultar", en: "Ask us", pt: "Consultar" },
    temporada: "JUN a SEP",
    clima: { es: "Frío y nevado", en: "Cold and snowy", pt: "Frio e nevado" },
    equipamiento: {
      es: "Consultar según la salida.",
      en: "Ask us depending on the outing.",
      pt: "Consultar conforme a saída.",
    },
    infoAdicional: {
      es: "Instructor certificado Nivel 2.",
      en: "Certified Level 2 instructor.",
      pt: "Instrutor certificado Nível 2.",
    },
  },
];

export function excursionPorSlug(slug: string): Excursion | undefined {
  return excursiones.find((e) => e.slug === slug);
}
