import type { Locale } from "./i18n";

export const metadataBase = new URL("https://www.frecuenciasurushuaia.com");

/* ───────────────── Home SEO ───────────────── */

export const homeSeo: Record<Locale, {
  title: string;
  description: string;
  keywords: string;
  h1: string;
}> = {
  es: {
    title: "Frecuencia Sur - Turismo aventura alternativo",
    description:
      "Descubrí Ushuaia con Frecuencia Sur. Excursiones de trekking y turismo aventura con guías profesionales, grupos reducidos y paisajes únicos.",
    keywords:
      "trekking en Ushuaia, turismo aventura Ushuaia, excursiones en Ushuaia, trekking guiado Ushuaia, excursiones de montaña Ushuaia, senderismo en Ushuaia, experiencias de aventura en Ushuaia, trekking en Tierra del Fuego",
    h1: "Trekking y Turismo Aventura en Ushuaia",
  },
  en: {
    title: "Frecuencia Sur - Alternative Adventure Tourism",
    description:
      "Discover Ushuaia with Frecuencia Sur. Trekking and adventure tourism excursions with professional guides, small groups and unique landscapes.",
    keywords:
      "trekking in Ushuaia, adventure tourism Ushuaia, excursions in Ushuaia, guided trekking Ushuaia, mountain excursions Ushuaia, hiking in Ushuaia, adventure experiences in Ushuaia, trekking in Tierra del Fuego",
    h1: "Trekking and Adventure Tourism in Ushuaia",
  },
  pt: {
    title: "Frecuencia Sur - Turismo de aventura alternativo",
    description:
      "Descubra Ushuaia com a Frecuencia Sur. Excursões de trekking e turismo de aventura com guias profissionais, grupos reduzidos e paisagens únicas.",
    keywords:
      "trekking em Ushuaia, turismo de aventura Ushuaia, excursões em Ushuaia, trekking guiado Ushuaia, excursões de montanha Ushuaia, caminhada em Ushuaia, experiências de aventura em Ushuaia, trekking na Terra do Fogo",
    h1: "Trekking e Turismo de Aventura em Ushuaia",
  },
};

/* ───────────────── Excursion SEO ───────────────── */

export interface ExcursionSeo {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  alts: string[];
  description: string[];
}

export const excursionSeo: Record<string, Record<Locale, ExcursionSeo>> = {
  "laguna-esmeralda": {
    es: {
      h1: "Trekking a Laguna Esmeralda",
      metaTitle: "Trekking Laguna Esmeralda Ushuaia | Frecuencia Sur",
      metaDescription:
        "Descubrí Laguna Esmeralda con una excursión de trekking en Ushuaia. Explorá bosques, turbales y montañas con Frecuencia Sur.",
      keywords:
        "trekking Laguna Esmeralda, Ushuaia excursión, Laguna Esmeralda trekking en Ushuaia, Laguna Esmeralda Ushuaia, trekking guiado Laguna Esmeralda, excursiones de trekking en Ushuaia, turismo aventura Ushuaia, senderismo en Ushuaia",
      alts: ["trekking en laguna esmeralda", "vistas a laguna esmeralda"],
      description: [
        "El trekking a Laguna Esmeralda es una de las excursiones más emblemáticas de Ushuaia y una excelente oportunidad para descubrir los paisajes naturales de Tierra del Fuego. Durante esta caminata atravesaremos bosques de lenga, turbales y antiguos valles glaciares hasta llegar a la impresionante Laguna Esmeralda, reconocida por sus aguas de tonalidad verde y las montañas que la rodean.",
        "Esta excursión de senderismo en Ushuaia permite disfrutar de la flora y fauna local, conectar con la naturaleza patagónica y vivir una auténtica experiencia de turismo aventura en el Fin del Mundo.",
        "Al llegar a la laguna, tendremos tiempo para descansar, contemplar el paisaje y disfrutar de un box lunch antes de emprender el regreso. Una experiencia ideal para quienes desean explorar los senderos fueguinos y descubrir uno de los rincones naturales más fascinantes de la Patagonia.",
      ],
    },
    en: {
      h1: "Trekking to Laguna Esmeralda",
      metaTitle: "Trekking Laguna Esmeralda Ushuaia | Frecuencia Sur",
      metaDescription:
        "Discover Laguna Esmeralda with a trekking excursion in Ushuaia. Explore forests, peat bogs and mountains with Frecuencia Sur.",
      keywords:
        "trekking Laguna Esmeralda, Ushuaia excursion, Laguna Esmeralda trekking in Ushuaia, Laguna Esmeralda Ushuaia, guided trekking Laguna Esmeralda, trekking excursions in Ushuaia, adventure tourism Ushuaia, hiking in Ushuaia",
      alts: ["trekking at laguna esmeralda", "views of laguna esmeralda"],
      description: [
        "The trekking to Laguna Esmeralda is one of the most iconic excursions in Ushuaia and an excellent opportunity to discover the natural landscapes of Tierra del Fuego. During this hike we will cross lenga forests, peat bogs and ancient glacial valleys until reaching the impressive Laguna Esmeralda, known for its green-toned waters and the mountains that surround it.",
        "This hiking excursion in Ushuaia allows you to enjoy the local flora and fauna, connect with Patagonian nature and live an authentic adventure tourism experience at the End of the World.",
        "Upon arriving at the lagoon, we will have time to rest, contemplate the landscape and enjoy a box lunch before starting the return. An ideal experience for those who wish to explore the Fuegian trails and discover one of the most fascinating natural corners of Patagonia.",
      ],
    },
    pt: {
      h1: "Trekking à Laguna Esmeralda",
      metaTitle: "Trekking Laguna Esmeralda Ushuaia | Frecuencia Sur",
      metaDescription:
        "Descubra a Laguna Esmeralda com uma excursão de trekking em Ushuaia. Explore florestas, turfeiras e montanhas com a Frecuencia Sur.",
      keywords:
        "trekking Laguna Esmeralda, excursão Ushuaia, Laguna Esmeralda trekking em Ushuaia, Laguna Esmeralda Ushuaia, trekking guiado Laguna Esmeralda, excursões de trekking em Ushuaia, turismo de aventura Ushuaia, caminhada em Ushuaia",
      alts: ["trekking na laguna esmeralda", "vistas da laguna esmeralda"],
      description: [
        "O trekking à Laguna Esmeralda é uma das excursões mais emblemáticas de Ushuaia e uma excelente oportunidade para descobrir as paisagens naturais da Terra do Fogo. Durante esta caminhada atravessaremos florestas de lenga, turfeiras e antigos vales glaciais até chegar à impressionante Laguna Esmeralda, reconhecida por suas águas de tonalidade verde e as montanhas que a rodeiam.",
        "Esta excursão de caminhada em Ushuaia permite desfrutar da flora e fauna local, conectar-se com a natureza patagônica e viver uma autêntica experiência de turismo de aventura no Fim do Mundo.",
        "Ao chegar à lagoa, teremos tempo para descansar, contemplar a paisagem e desfrutar de um box lunch antes de empreender o regresso. Uma experiência ideal para quem deseja explorar as trilhas fueguinas e descobrir um dos cantos naturais mais fascinantes da Patagônia.",
      ],
    },
  },
  "glaciar-martial": {
    es: {
      h1: "Trekking al Glaciar Martial",
      metaTitle: "Trekking Glaciar Martial Ushuaia | Frecuencia Sur",
      metaDescription:
        "Trekking al Glaciar Martial en Ushuaia: bosques fueguinos y vistas panorámicas del Canal Beagle y la ciudad. Excursión guiada con Frecuencia Sur.",
      keywords:
        "excursión Glaciar Martial, trekking en Ushuaia, senderismo Glaciar Martial, turismo aventura Ushuaia",
      alts: [
        "montañas del martial",
        "sendero glaciar martial",
        "cumbre glaciar martial",
        "trekking glaciar martial",
      ],
      description: [
        "Durante el recorrido, nos adentraremos en el entorno natural del Martial, disfrutando de la tranquilidad de la montaña y de algunos de los paisajes más representativos de la ciudad. Es una excelente opción para quienes buscan hacer trekking en Ushuaia, conectar con la naturaleza y vivir una aventura al aire libre.",
        "La caminata combina actividad física, paisajes únicos y la oportunidad de conocer el entorno fueguino acompañado por guías especializados. A lo largo de la excursión podrás disfrutar de diferentes perspectivas de las montañas y descubrir la belleza natural que hace de Ushuaia un destino ideal para el turismo aventura.",
      ],
    },
    en: {
      h1: "Trekking to Martial Glacier",
      metaTitle: "Trekking Martial Glacier Ushuaia | Frecuencia Sur",
      metaDescription:
        "Trek to Martial Glacier in Ushuaia: Fuegian forests and panoramic views of the Beagle Channel and the city. Guided tour with Frecuencia Sur.",
      keywords:
        "Martial Glacier excursion, trekking in Ushuaia, hiking Martial Glacier, adventure tourism Ushuaia",
      alts: [
        "martial mountains",
        "martial glacier trail",
        "martial glacier summit",
        "trekking martial glacier",
      ],
      description: [
        "During the tour, we will enter the natural environment of Martial, enjoying the tranquility of the mountain and some of the most representative landscapes of the city. It is an excellent option for those looking to do trekking in Ushuaia, connect with nature and live an outdoor adventure.",
        "The hike combines physical activity, unique landscapes and the opportunity to get to know the Fuegian surroundings accompanied by specialized guides. Throughout the excursion you will be able to enjoy different perspectives of the mountains and discover the natural beauty that makes Ushuaia an ideal destination for adventure tourism.",
      ],
    },
    pt: {
      h1: "Trekking ao Glaciar Martial",
      metaTitle: "Trekking Glaciar Martial Ushuaia | Frecuencia Sur",
      metaDescription:
        "Trekking ao Glaciar Martial em Ushuaia: florestas fueguinas e vistas panorâmicas do Canal Beagle e da cidade. Excursão guiada com a Frecuencia Sur.",
      keywords:
        "excursão Glaciar Martial, trekking em Ushuaia, caminhada Glaciar Martial, turismo de aventura Ushuaia",
      alts: [
        "montanhas do martial",
        "trilha glaciar martial",
        "cume glaciar martial",
        "trekking glaciar martial",
      ],
      description: [
        "Durante o percurso, adentraremos o ambiente natural do Martial, desfrutando da tranquilidade da montanha e de algumas das paisagens mais representativas da cidade. É uma excelente opção para quem busca fazer trekking em Ushuaia, conectar-se com a natureza e viver uma aventura ao ar livre.",
        "A caminhada combina atividade física, paisagens únicas e a oportunidade de conhecer o entorno fueguino acompanhado por guias especializados. Ao longo da excursão você poderá desfrutar de diferentes perspectivas das montanhas e descobrir a beleza natural que faz de Ushuaia um destino ideal para o turismo de aventura.",
      ],
    },
  },
  "glaciar-vinciguerra": {
    es: {
      h1: "Trekking al Glaciar Vinciguerra",
      metaTitle: "Trekking Glaciar Vinciguerra Ushuaia | Frecuencia Sur",
      metaDescription:
        "Viví el trekking al Glaciar Vinciguerra en Ushuaia. Explorá la Laguna de los Témpanos con guía, traslados y box lunch. ¡Consultá con Frecuencia Sur!",
      keywords:
        "trekking Glaciar Vinciguerra Ushuaia, excursión Glaciar Vinciguerra, Laguna de los Témpanos trekking, trekking en Ushuaia, Glaciar Vinciguerra y Laguna de los Témpanos, excursiones de montaña en Ushuaia, turismo aventura Ushuaia",
      alts: [
        "cuevas de hielo vinciguerra",
        "vistas laguna de los tempanos",
        "trekking",
        "glaciar vinciguerra",
      ],
      description: [
        "Descubrí uno de los paisajes de montaña más impresionantes de Tierra del Fuego con nuestra excursión de trekking al Glaciar Vinciguerra en Ushuaia. Esta travesía te lleva a recorrer bosques de lenga, extensos turbales y valles glaciares hasta llegar a la espectacular Laguna de los Témpanos, ubicada al pie del glaciar.",
        "Durante el recorrido vas a disfrutar de cascadas, cursos de agua y paisajes de alta montaña que reflejan la belleza natural de la Patagonia austral. El trekking combina aventura, actividad física y conexión con la naturaleza, ofreciendo una experiencia ideal para quienes buscan explorar los senderos más desafiantes del Fin del Mundo.",
        "La excursión presenta una dificultad media-alta y requiere una buena preparación física para afrontar terrenos irregulares, sectores húmedos y pendientes de montaña. Por eso, es importante contar con indumentaria adecuada y seguir las indicaciones del guía durante toda la caminata.",
        "En Frecuencia Sur ofrecemos una experiencia guiada que incluye traslado de ida y vuelta, guía profesional, box lunch y seguro de actividad, para que puedas disfrutar de esta aventura con acompañamiento y atención personalizada.",
      ],
    },
    en: {
      h1: "Trekking to Vinciguerra Glacier",
      metaTitle: "Trekking Vinciguerra Glacier Ushuaia | Frecuencia Sur",
      metaDescription:
        "Experience the trekking to Vinciguerra Glacier in Ushuaia. Explore Laguna de los Témpanos with a guide, transfers and box lunch. Check with Frecuencia Sur!",
      keywords:
        "trekking Vinciguerra Glacier Ushuaia, Vinciguerra Glacier excursion, Laguna de los Témpanos trekking, trekking in Ushuaia, Vinciguerra Glacier and Laguna de los Témpanos, mountain excursions in Ushuaia, adventure tourism Ushuaia",
      alts: [
        "vinciguerra ice caves",
        "laguna de los tempanos views",
        "trekking",
        "vinciguerra glacier",
      ],
      description: [
        "Discover one of the most impressive mountain landscapes in Tierra del Fuego with our trekking excursion to Vinciguerra Glacier in Ushuaia. This journey takes you through lenga forests, extensive peat bogs and glacial valleys until reaching the spectacular Laguna de los Témpanos, located at the foot of the glacier.",
        "During the route you will enjoy waterfalls, water courses and high mountain landscapes that reflect the natural beauty of southern Patagonia. The trekking combines adventure, physical activity and connection with nature, offering an ideal experience for those looking to explore the most challenging trails of the End of the World.",
        "The excursion has a medium-high difficulty and requires good physical preparation to face irregular terrain, wet sections and mountain slopes. Therefore, it is important to have adequate clothing and follow the guide's instructions throughout the hike.",
        "At Frecuencia Sur we offer a guided experience that includes round-trip transfer, professional guide, box lunch and activity insurance, so you can enjoy this adventure with accompaniment and personalized attention.",
      ],
    },
    pt: {
      h1: "Trekking ao Glaciar Vinciguerra",
      metaTitle: "Trekking Glaciar Vinciguerra Ushuaia | Frecuencia Sur",
      metaDescription:
        "Viva o trekking ao Glaciar Vinciguerra em Ushuaia. Explore a Laguna de los Témpanos com guia, traslados e box lunch. Consulte com a Frecuencia Sur!",
      keywords:
        "trekking Glaciar Vinciguerra Ushuaia, excursão Glaciar Vinciguerra, trekking Laguna de los Témpanos, trekking em Ushuaia, Glaciar Vinciguerra e Laguna de los Témpanos, excursões de montanha em Ushuaia, turismo de aventura Ushuaia",
      alts: [
        "cavernas de gelo vinciguerra",
        "vistas laguna de los tempanos",
        "trekking",
        "glaciar vinciguerra",
      ],
      description: [
        "Descubra uma das paisagens de montanha mais impressionantes da Terra do Fogo com nossa excursão de trekking ao Glaciar Vinciguerra em Ushuaia. Esta travessia leva você a percorrer florestas de lenga, extensas turfeiras e vales glaciais até chegar à espetacular Laguna de los Témpanos, localizada ao pé do glaciar.",
        "Durante o percurso você vai desfrutar de cascatas, cursos de água e paisagens de alta montanha que refletem a beleza natural da Patagônia austral. O trekking combina aventura, atividade física e conexão com a natureza, oferecendo uma experiência ideal para quem busca explorar as trilhas mais desafiadoras do Fim do Mundo.",
        "A excursão apresenta uma dificuldade média-alta e requer uma boa preparação física para enfrentar terrenos irregulares, setores úmidos e declives de montanha. Por isso, é importante contar com indumentária adequada e seguir as indicações do guia durante toda a caminhada.",
        "Na Frecuencia Sur oferecemos uma experiência guiada que inclui traslado de ida e volta, guia profissional, box lunch e seguro de atividade, para que você possa desfrutar desta aventura com acompanhamento e atenção personalizada.",
      ],
    },
  },
  "glaciar-ojo-del-albino": {
    es: {
      h1: "Trekking al Glaciar Ojo del Albino",
      metaTitle: "Trekking Ojo del Albino Ushuaia | Frecuencia Sur",
      metaDescription:
        "Descubrí el Glaciar Ojo del Albino con un trekking de montaña en Ushuaia. Una aventura exigente con guía y traslados. Consultá con Frecuencia Sur.",
      keywords:
        "trekking Glaciar Ojo del Albino Ushuaia, excursión Glaciar Ojo del Albino, Glaciar Ojo del Albino trekking, trekking de montaña en Ushuaia, Laguna Esmeralda y Glaciar Ojo del Albino, turismo aventura Ushuaia",
      alts: [
        "trekking ojo del albino",
        "sendero ojo del albino",
        "glaciar ojo del albino",
      ],
      description: [
        "Viví una de las experiencias de trekking más desafiantes de Ushuaia con la excursión al Glaciar Ojo del Albino. Esta travesía de alta montaña recorre algunos de los paisajes más impresionantes de Tierra del Fuego, atravesando bosques fueguinos, turbales y valles glaciares hasta alcanzar un entorno natural dominado por montañas y hielo.",
        "Durante el recorrido compartiremos parte del sendero que conduce a Laguna Esmeralda, para luego continuar con el ascenso hacia el Glaciar Ojo del Albino. A medida que ganamos altura, el paisaje se transforma y ofrece vistas panorámicas de la cordillera fueguina y sus formaciones naturales.",
        "Esta excursión de trekking en Ushuaia presenta una dificultad alta y requiere una buena condición física y experiencia previa en caminatas exigentes. El terreno irregular, las pendientes y las condiciones cambiantes de la montaña hacen fundamental contar con el equipamiento adecuado y seguir las indicaciones del guía.",
      ],
    },
    en: {
      h1: "Trekking to Ojo del Albino Glacier",
      metaTitle: "Trekking Ojo del Albino Ushuaia | Frecuencia Sur",
      metaDescription:
        "Discover the Ojo del Albino Glacier with a mountain trekking in Ushuaia. A demanding adventure with guide and transfers. Check with Frecuencia Sur.",
      keywords:
        "trekking Ojo del Albino Glacier Ushuaia, Ojo del Albino Glacier excursion, Ojo del Albino Glacier trekking, mountain trekking in Ushuaia, Laguna Esmeralda and Ojo del Albino Glacier, adventure tourism Ushuaia",
      alts: [
        "trekking ojo del albino",
        "ojo del albino trail",
        "ojo del albino glacier",
      ],
      description: [
        "Experience one of the most challenging trekking experiences in Ushuaia with the excursion to the Ojo del Albino Glacier. This high mountain journey covers some of the most impressive landscapes of Tierra del Fuego, crossing Fuegian forests, peat bogs and glacial valleys until reaching a natural environment dominated by mountains and ice.",
        "During the route we will share part of the trail that leads to Laguna Esmeralda, and then continue with the ascent towards the Ojo del Albino Glacier. As we gain altitude, the landscape transforms and offers panoramic views of the Fuegian mountain range and its natural formations.",
        "This trekking excursion in Ushuaia has a high difficulty and requires good physical condition and previous experience in demanding hikes. The irregular terrain, slopes and changing mountain conditions make it essential to have adequate equipment and follow the guide's instructions.",
      ],
    },
    pt: {
      h1: "Trekking ao Glaciar Ojo del Albino",
      metaTitle: "Trekking Ojo del Albino Ushuaia | Frecuencia Sur",
      metaDescription:
        "Descubra o Glaciar Ojo del Albino com um trekking de montanha em Ushuaia. Uma aventura exigente com guia e traslados. Consulte com a Frecuencia Sur.",
      keywords:
        "trekking Glaciar Ojo del Albino Ushuaia, excursão Glaciar Ojo del Albino, trekking Glaciar Ojo del Albino, trekking de montanha em Ushuaia, Laguna Esmeralda e Glaciar Ojo del Albino, turismo de aventura Ushuaia",
      alts: [
        "trekking ojo del albino",
        "trilha ojo del albino",
        "glaciar ojo del albino",
      ],
      description: [
        "Viva uma das experiências de trekking mais desafiadoras de Ushuaia com a excursão ao Glaciar Ojo del Albino. Esta travessia de alta montanha percorre algumas das paisagens mais impressionantes da Terra do Fogo, atravessando florestas fueguinas, turfeiras e vales glaciais até alcançar um ambiente natural dominado por montanhas e gelo.",
        "Durante o percurso compartilharemos parte da trilha que conduz à Laguna Esmeralda, para depois continuar com a subida em direção ao Glaciar Ojo del Albino. À medida que ganhamos altitude, a paisagem se transforma e oferece vistas panorâmicas da cordilheira fueguina e suas formações naturais.",
        "Esta excursão de trekking em Ushuaia apresenta uma dificuldade alta e requer uma boa condição física e experiência prévia em caminhadas exigentes. O terreno irregular, as declives e as condições mutáveis da montanha tornam fundamental contar com o equipamento adequado e seguir as indicações do guia.",
      ],
    },
  },
  "laguna-cinco-hermanos": {
    es: {
      h1: "Trekking a Laguna Cinco Hermanos",
      metaTitle: "Trekking Laguna Cinco Hermanos | Frecuencia Sur",
      metaDescription:
        "Descubrí Laguna Cinco Hermanos con un trekking de montaña en Ushuaia. Bosque fueguino, cascadas y vistas a la cordillera. Consultá con Frecuencia Sur.",
      keywords:
        "trekking Laguna Cinco Hermanos Ushuaia, excursión Laguna Cinco Hermanos, Laguna Cinco Hermanos Ushuaia, trekking de montaña en Ushuaia, senderismo en Ushuaia, trekking de dificultad alta en Ushuaia, Cascada Velo de la Novia Ushuaia",
      alts: [
        "sendero de laguna cinco hermanos",
        "laguna cinco hermanos",
        "montaña laguna cinco hermanos",
      ],
      description: [
        "Descubrí uno de los rincones más fascinantes de Tierra del Fuego con nuestra excursión de trekking a Laguna Cinco Hermanos en Ushuaia. Esta aventura de montaña te invita a recorrer bosques fueguinos, atravesar paisajes naturales y ascender hacia una laguna rodeada por el imponente relieve de la cordillera fueguina.",
        "Durante el recorrido, compartiremos parte del sendero que conduce a la Cascada Velo de la Novia, para luego continuar por el bosque y avanzar hacia sectores de mayor altura. A medida que ganamos elevación, el paisaje se transforma y ofrece vistas panorámicas de las montañas, los valles y los alrededores de Ushuaia.",
        "El trekking a Laguna Cinco Hermanos es una excelente alternativa para quienes buscan una experiencia de turismo aventura en Ushuaia, lejos de los circuitos más tradicionales. La combinación de bosque, montaña y una subida exigente convierte esta caminata en una oportunidad para conectar con la naturaleza de la Patagonia austral.",
        "La excursión presenta una alta exigencia física, con pendientes pronunciadas y terrenos irregulares. Por eso, es importante contar con una buena preparación física, llevar indumentaria adecuada para las condiciones cambiantes de Tierra del Fuego y seguir las indicaciones del guía durante todo el recorrido.",
      ],
    },
    en: {
      h1: "Trekking to Laguna Cinco Hermanos",
      metaTitle: "Trekking Laguna Cinco Hermanos | Frecuencia Sur",
      metaDescription:
        "Discover Laguna Cinco Hermanos on a mountain trek in Ushuaia. Fuegian forest, waterfalls and mountain views. Ask Frecuencia Sur.",
      keywords:
        "trekking Laguna Cinco Hermanos Ushuaia, Laguna Cinco Hermanos excursion, Laguna Cinco Hermanos Ushuaia, mountain trekking in Ushuaia, hiking in Ushuaia, high difficulty trekking in Ushuaia, Cascada Velo de la Novia Ushuaia",
      alts: [
        "laguna cinco hermanos trail",
        "laguna cinco hermanos",
        "laguna cinco hermanos mountain",
      ],
      description: [
        "Discover one of the most fascinating corners of Tierra del Fuego with our trekking excursion to Laguna Cinco Hermanos in Ushuaia. This mountain adventure invites you to walk through Fuegian forests, cross natural landscapes and ascend towards a lagoon surrounded by the imposing relief of the Fuegian mountain range.",
        "During the route, we will share part of the trail that leads to Cascada Velo de la Novia, and then continue through the forest and advance towards higher altitude sections. As we gain elevation, the landscape transforms and offers panoramic views of the mountains, valleys and surroundings of Ushuaia.",
        "The trekking to Laguna Cinco Hermanos is an excellent alternative for those seeking an adventure tourism experience in Ushuaia, away from the more traditional circuits. The combination of forest, mountain and a demanding climb turns this hike into an opportunity to connect with the nature of southern Patagonia.",
        "The excursion has a high physical demand, with steep slopes and irregular terrain. Therefore, it is important to have good physical preparation, wear suitable clothing for the changing conditions of Tierra del Fuego and follow the guide's instructions throughout the route.",
      ],
    },
    pt: {
      h1: "Trekking à Laguna Cinco Hermanos",
      metaTitle: "Trekking Laguna Cinco Hermanos | Frecuencia Sur",
      metaDescription:
        "Descubra a Laguna Cinco Hermanos com um trekking de montanha em Ushuaia. Floresta fueguina, cascatas e vistas da cordilheira. Fale com a Frecuencia Sur.",
      keywords:
        "trekking Laguna Cinco Hermanos Ushuaia, excursão Laguna Cinco Hermanos, Laguna Cinco Hermanos Ushuaia, trekking de montanha em Ushuaia, caminhada em Ushuaia, trekking de alta dificuldade em Ushuaia, Cascada Velo de la Novia Ushuaia",
      alts: [
        "trilha de laguna cinco hermanos",
        "laguna cinco hermanos",
        "montanha laguna cinco hermanos",
      ],
      description: [
        "Descubra um dos cantos mais fascinantes da Terra do Fogo com nossa excursão de trekking à Laguna Cinco Hermanos em Ushuaia. Esta aventura de montanha convida você a percorrer florestas fueguinas, atravessar paisagens naturais e subir em direção a uma lagoa rodeada pelo imponente relevo da cordilheira fueguina.",
        "Durante o percurso, compartilharemos parte da trilha que conduz à Cascada Velo de la Novia, para depois continuar pela floresta e avançar em direção a setores de maior altitude. À medida que ganhamos elevação, a paisagem se transforma e oferece vistas panorâmicas das montanhas, dos vales e dos arredores de Ushuaia.",
        "O trekking à Laguna Cinco Hermanos é uma excelente alternativa para quem busca uma experiência de turismo de aventura em Ushuaia, longe dos circuitos mais tradicionais. A combinação de floresta, montanha e uma subida exigente transforma esta caminhada em uma oportunidade para se conectar com a natureza da Patagônia austral.",
        "A excursão apresenta uma alta exigência física, com declives pronunciados e terrenos irregulares. Por isso, é importante contar com uma boa preparação física, levar indumentária adequada para as condições mutáveis da Terra do Fogo e seguir as indicações do guia durante todo o percurso.",
      ],
    },
  },
  "martial-aventura": {
    es: {
      h1: "Martial Aventura en Ushuaia: montaña y cena en refugio",
      metaTitle: "Martial Aventura Ushuaia | Montaña y Gastronomía",
      metaDescription:
        "Descubrí Martial Aventura en Ushuaia: ascenso en Pisten Bully, mini trekking guiado y cena de tres pasos en un refugio de montaña.",
      keywords:
        "Martial Aventura Ushuaia, excursión Martial Aventura, aventura en Cerro Martial, Pisten Bully Ushuaia, experiencia de montaña en Ushuaia, cena en refugio de montaña Ushuaia, turismo aventura y gastronomía Ushuaia, Snowcat Ushuaia",
      alts: [
        "pisten bully martial",
        "vistas de excursion martial aventura",
      ],
      description: [
        "Viví una experiencia diferente en el Cerro Martial con Martial Aventura, una propuesta que combina aventura, paisajes de montaña y gastronomía en uno de los entornos naturales más emblemáticos de Ushuaia.",
        "La experiencia comienza con un ascenso en Pisten Bully, un vehículo oruga acondicionado para transportar pasajeros por la montaña. Durante el recorrido podrás descubrir distintos paisajes y disfrutar de vistas panorámicas del entorno natural del Cerro Martial.",
        "La aventura continúa con un mini trekking guiado, durante el cual conocerás más sobre la historia, la geografía y las características del ambiente de montaña. Acompañado por un guía especializado, vas a explorar el paisaje y disfrutar de una experiencia que combina naturaleza, aprendizaje y aventura.",
        "Para cerrar la jornada, te espera una cena de tres pasos en el refugio, acompañada de bebidas incluidas. La combinación de montaña y gastronomía convierte a Martial Aventura en una alternativa ideal para quienes buscan una experiencia diferente en Ushuaia, más allá de las excursiones tradicionales.",
        "La actividad incluye ascenso en Pisten Bully, mini trekking con guía experto en montaña, equipamiento técnico para la actividad, cena de tres pasos con bebida incluida y seguro de actividad.",
      ],
    },
    en: {
      h1: "Martial Aventura in Ushuaia: mountain and dinner in a refuge",
      metaTitle: "Martial Aventura Ushuaia | Mountain and Gastronomy",
      metaDescription:
        "Discover Martial Aventura in Ushuaia: ascent in Pisten Bully, guided mini trekking and three-course dinner in a mountain refuge.",
      keywords:
        "Martial Aventura Ushuaia, Martial Aventura excursion, adventure on Cerro Martial, Pisten Bully Ushuaia, mountain experience in Ushuaia, dinner in mountain refuge Ushuaia, adventure tourism and gastronomy Ushuaia, Snowcat Ushuaia",
      alts: [
        "pisten bully martial",
        "views of martial aventura excursion",
      ],
      description: [
        "Experience a different adventure on Cerro Martial with Martial Aventura, a proposal that combines adventure, mountain landscapes and gastronomy in one of the most emblematic natural environments of Ushuaia.",
        "The experience begins with an ascent in a Pisten Bully, a tracked vehicle prepared to transport passengers through the mountain. During the ride you will be able to discover different landscapes and enjoy panoramic views of the natural surroundings of Cerro Martial.",
        "The adventure continues with a guided mini trekking, during which you will learn more about the history, geography and characteristics of the mountain environment. Accompanied by a specialized guide, you will explore the landscape and enjoy an experience that combines nature, learning and adventure.",
        "To close the day, a three-course dinner awaits you at the refuge, accompanied by included drinks. The combination of mountain and gastronomy makes Martial Aventura an ideal alternative for those seeking a different experience in Ushuaia, beyond traditional excursions.",
        "The activity includes ascent in Pisten Bully, mini trekking with a mountain expert guide, technical equipment for the activity, three-course dinner with drink included and activity insurance.",
      ],
    },
    pt: {
      h1: "Martial Aventura em Ushuaia: montanha e jantar em refúgio",
      metaTitle: "Martial Aventura Ushuaia | Montanha e Gastronomia",
      metaDescription:
        "Descubra Martial Aventura em Ushuaia: subida em Pisten Bully, mini trekking guiado e jantar de três pratos em um refúgio de montanha.",
      keywords:
        "Martial Aventura Ushuaia, excursão Martial Aventura, aventura no Cerro Martial, Pisten Bully Ushuaia, experiência de montanha em Ushuaia, jantar em refúgio de montanha Ushuaia, turismo de aventura e gastronomia Ushuaia, Snowcat Ushuaia",
      alts: [
        "pisten bully martial",
        "vistas da excursão martial aventura",
      ],
      description: [
        "Viva uma experiência diferente no Cerro Martial com Martial Aventura, uma proposta que combina aventura, paisagens de montanha e gastronomia em um dos ambientes naturais mais emblemáticos de Ushuaia.",
        "A experiência começa com uma subida em Pisten Bully, um veículo esteira preparado para transportar passageiros pela montanha. Durante o percurso você poderá descobrir diferentes paisagens e desfrutar de vistas panorâmicas do entorno natural do Cerro Martial.",
        "A aventura continua com um mini trekking guiado, durante o qual você conhecerá mais sobre a história, a geografia e as características do ambiente de montanha. Acompanhado por um guia especializado, você vai explorar a paisagem e desfrutar de uma experiência que combina natureza, aprendizado e aventura.",
        "Para fechar a jornada, espera por você um jantar de três pratos no refúgio, acompanhado de bebidas incluídas. A combinação de montanha e gastronomia transforma Martial Aventura em uma alternativa ideal para quem busca uma experiência diferente em Ushuaia, além das excursões tradicionais.",
        "A atividade inclui subida em Pisten Bully, mini trekking com guia especialista em montanha, equipamento técnico para a atividade, jantar de três pratos com bebida incluída e seguro de atividade.",
      ],
    },
  },
  "monte-susana": {
    es: {
      h1: "Trekking al Monte Susana",
      metaTitle: "Trekking Monte Susana Ushuaia | Frecuencia Sur",
      metaDescription:
        "Descubrí el Monte Susana con un trekking guiado en Ushuaia. Bosques fueguinos y vistas panorámicas del Canal Beagle con Frecuencia Sur.",
      keywords:
        "trekking Monte Susana Ushuaia, excursión Monte Susana, Monte Susana Ushuaia, trekking con vistas panorámicas en Ushuaia, senderismo en Ushuaia, trekking con guía en Ushuaia, caminata de montaña en Tierra del Fuego",
      alts: [
        "vistas monte susana",
        "nieve en monte susana",
        "sendero monte susana",
        "paisaje desde monte susana",
      ],
      description: [
        "Descubrí los paisajes de Tierra del Fuego con nuestra excursión de trekking al Monte Susana en Ushuaia. Esta caminata de montaña te invita a recorrer bosques fueguinos y ascender hasta una cumbre desde donde se pueden contemplar vistas panorámicas de la ciudad, el Canal Beagle y las montañas que rodean el Fin del Mundo.",
        "Durante el recorrido, avanzaremos por senderos rodeados de vegetación autóctona, atravesando sectores de bosque de lenga mientras ganamos altura por la ladera del monte. A medida que ascendemos, el paisaje se abre y permite disfrutar de diferentes perspectivas de Ushuaia y su entorno natural.",
        "Llegar a la cumbre del Monte Susana es la recompensa de esta experiencia: un mirador natural desde el que se pueden apreciar la inmensidad del Canal Beagle, las montañas fueguinas y los paisajes característicos de la Patagonia austral.",
        "Esta excursión de trekking en Ushuaia es una excelente alternativa para quienes buscan combinar actividad física, naturaleza y vistas panorámicas en una salida guiada. El recorrido presenta una dificultad media, aunque las pendientes, el desnivel y las condiciones cambiantes del terreno requieren una preparación física acorde.",
        "En Frecuencia Sur te acompañamos durante la experiencia con un guía de montaña, traslado de ida y vuelta desde tu alojamiento, almuerzo, infusión caliente y seguro de accidentes personales.",
      ],
    },
    en: {
      h1: "Trekking to Monte Susana",
      metaTitle: "Trekking Monte Susana Ushuaia | Frecuencia Sur",
      metaDescription:
        "Discover Monte Susana with a guided trekking in Ushuaia. Fuegian forests and panoramic views of the Beagle Channel with Frecuencia Sur.",
      keywords:
        "trekking Monte Susana Ushuaia, Monte Susana excursion, Monte Susana Ushuaia, trekking with panoramic views in Ushuaia, hiking in Ushuaia, guided trekking in Ushuaia, mountain hike in Tierra del Fuego",
      alts: [
        "monte susana views",
        "snow on monte susana",
        "monte susana trail",
        "landscape from monte susana",
      ],
      description: [
        "Discover the landscapes of Tierra del Fuego with our trekking excursion to Monte Susana in Ushuaia. This mountain hike invites you to walk through Fuegian forests and ascend to a summit from where you can contemplate panoramic views of the city, the Beagle Channel and the mountains that surround the End of the World.",
        "During the route, we will advance along trails surrounded by native vegetation, crossing sections of lenga forest while gaining altitude on the mountainside. As we ascend, the landscape opens up and allows us to enjoy different perspectives of Ushuaia and its natural surroundings.",
        "Reaching the summit of Monte Susana is the reward of this experience: a natural viewpoint from which you can appreciate the immensity of the Beagle Channel, the Fuegian mountains and the characteristic landscapes of southern Patagonia.",
        "This trekking excursion in Ushuaia is an excellent alternative for those looking to combine physical activity, nature and panoramic views on a guided outing. The route has a medium difficulty, although the slopes, elevation gain and changing terrain conditions require appropriate physical preparation.",
      ],
    },
    pt: {
      h1: "Trekking ao Monte Susana",
      metaTitle: "Trekking Monte Susana Ushuaia | Frecuencia Sur",
      metaDescription:
        "Descubra o Monte Susana com um trekking guiado em Ushuaia. Florestas fueguinas e vistas panorâmicas do Canal Beagle com a Frecuencia Sur.",
      keywords:
        "trekking Monte Susana Ushuaia, excursão Monte Susana, Monte Susana Ushuaia, trekking com vistas panorâmicas em Ushuaia, caminhada em Ushuaia, trekking guiado em Ushuaia, caminhada de montanha na Terra do Fogo",
      alts: [
        "vistas monte susana",
        "neve no monte susana",
        "trilha monte susana",
        "paisagem desde monte susana",
      ],
      description: [
        "Descubra as paisagens da Terra do Fogo com nossa excursão de trekking ao Monte Susana em Ushuaia. Esta caminhada de montanha convida você a percorrer florestas fueguinas e subir até um cume de onde se podem contemplar vistas panorâmicas da cidade, do Canal Beagle e das montanhas que rodeiam o Fim do Mundo.",
        "Durante o percurso, avançaremos por trilhas cercadas de vegetação nativa, atravessando setores de floresta de lenga enquanto ganhamos altitude pela encosta do monte. À medida que subimos, a paisagem se abre e permite desfrutar de diferentes perspectivas de Ushuaia e seu entorno natural.",
        "Chegar ao cume do Monte Susana é a recompensa desta experiência: um mirante natural a partir do qual se podem apreciar a imensidão do Canal Beagle, as montanhas fueguinas e as paisagens características da Patagônia austral.",
        "Esta excursão de trekking em Ushuaia é uma excelente alternativa para quem busca combinar atividade física, natureza e vistas panorâmicas em uma saída guiada. O percurso apresenta uma dificuldade média, embora as declives, o desnível e as condições mutáveis do terreno requeiram uma preparação física adequada.",
      ],
    },
  },
  "esqui-de-travesia": {
    es: {
      h1: "Esquí de Travesía en Ushuaia",
      metaTitle: "Esquí de Travesía en Ushuaia | Frecuencia Sur",
      metaDescription:
        "Descubrí el esquí de travesía en Ushuaia con Frecuencia Sur. Explorá la montaña fueguina y conocé las características de esta aventura en la nieve.",
      keywords:
        "esquí de travesía Ushuaia, excursión de esquí de travesía en Ushuaia, esquí de montaña Ushuaia, skimo Ushuaia, esquí fuera de pista Ushuaia, esquí de travesía en Tierra del Fuego, aventura de montaña en Ushuaia",
      alts: ["esqui en el cerro", "aerosilla en el cerro"],
      description: [
        "Descubrí la montaña de Tierra del Fuego con una experiencia de esquí de travesía en Ushuaia. Esta modalidad combina el ascenso por terrenos de montaña con descensos sobre nieve, permitiéndote explorar paisajes naturales del Fin del Mundo y disfrutar de una perspectiva diferente de la cordillera fueguina.",
        "El esquí de travesía, también conocido como skimo, es una actividad que une el esquí y la exploración de montaña. A diferencia del esquí alpino tradicional, permite recorrer entornos naturales fuera de las pistas convencionales, siempre en función de las condiciones de la nieve, el terreno y la evaluación profesional.",
        "Los alrededores de Ushuaia ofrecen escenarios de montaña únicos para disfrutar de esta actividad, con valles, bosques y paisajes nevados que reflejan la belleza de la Patagonia austral. Cada salida depende de las condiciones meteorológicas y nivológicas, por lo que la planificación y el acompañamiento de profesionales especializados son fundamentales.",
      ],
    },
    en: {
      h1: "Backcountry Skiing in Ushuaia",
      metaTitle: "Backcountry Skiing in Ushuaia | Frecuencia Sur",
      metaDescription:
        "Discover backcountry skiing in Ushuaia with Frecuencia Sur. Explore the Fuegian mountains and learn about the characteristics of this snow adventure.",
      keywords:
        "backcountry skiing Ushuaia, backcountry skiing excursion in Ushuaia, mountain skiing Ushuaia, skimo Ushuaia, off-piste skiing Ushuaia, backcountry skiing in Tierra del Fuego, mountain adventure in Ushuaia",
      alts: ["skiing on the mountain", "chairlift on the mountain"],
      description: [
        "Discover the mountains of Tierra del Fuego with a backcountry skiing experience in Ushuaia. This modality combines ascent through mountain terrain with descents on snow, allowing you to explore the natural landscapes of the End of the World and enjoy a different perspective of the Fuegian mountain range.",
        "Backcountry skiing, also known as skimo, is an activity that combines skiing and mountain exploration. Unlike traditional alpine skiing, it allows you to travel through natural environments outside conventional slopes, always depending on snow conditions, terrain and professional assessment.",
        "The surroundings of Ushuaia offer unique mountain settings to enjoy this activity, with valleys, forests and snowy landscapes that reflect the beauty of southern Patagonia. Each outing depends on weather and snow conditions, so planning and the accompaniment of specialized professionals are essential.",
      ],
    },
    pt: {
      h1: "Esqui de Travessia em Ushuaia",
      metaTitle: "Esqui de Travessia em Ushuaia | Frecuencia Sur",
      metaDescription:
        "Descubra o esqui de travessia em Ushuaia com a Frecuencia Sur. Explore a montanha fueguina e conheça as características desta aventura na neve.",
      keywords:
        "esqui de travessia em Ushuaia, excursão de esqui de travessia em Ushuaia, esqui de montanha em Ushuaia, esqui alpino de montanha Ushuaia, esqui fora de pista em Ushuaia, esqui de travessia na Terra do Fogo, aventura na montanha em Ushuaia",
      alts: ["esqui no cerro", "teleférico no cerro"],
      description: [
        "Descubra a montanha da Terra do Fogo com uma experiência de esqui de travessia em Ushuaia. Esta modalidade combina a subida por terrenos de montanha com descidas sobre a neve, permitindo explorar paisagens naturais do Fim do Mundo e desfrutar de uma perspectiva diferente da cordilheira fueguina.",
        "O esqui de travessia, também conhecido como skimo, é uma atividade que une o esqui e a exploração de montanha. Diferentemente do esqui alpino tradicional, permite percorrer ambientes naturais fora das pistas convencionais, sempre de acordo com as condições da neve, do terreno e da avaliação profissional.",
        "Os arredores de Ushuaia oferecem cenários de montanha únicos para desfrutar desta atividade, com vales, florestas e paisagens nevadas que refletem a beleza da Patagônia austral. Cada saída depende das condições meteorológicas e nivológicas, por isso o planejamento e o acompanhamento de profissionais especializados são fundamentais.",
      ],
    },
  },
};
