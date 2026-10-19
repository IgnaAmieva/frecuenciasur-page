import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { excursiones, excursionPorSlug } from "@/data/excursiones";
import { locales, type Locale } from "@/lib/i18n";
import { excursionSeo, metadataBase } from "@/lib/seo";
import { localePath } from "@/lib/locale-utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExcursionInfoGrid from "@/components/ExcursionInfoGrid";
import ExcursionHeroCarousel from "@/components/ExcursionHeroCarousel";
import ExcursionGallery from "@/components/ExcursionGallery";
import ExcursionBookButton from "@/components/ExcursionBookButton";
import ExcursionMobileBar from "@/components/ExcursionMobileBar";
import ExcursionBackLink from "@/components/ExcursionBackLink";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const exc of excursiones) {
      params.push({ locale, slug: exc.slug });
    }
  }
  return params;
}

function localeUrl(locale: Locale, path: string = "") {
  const prefix = locale === "es" ? "" : `/${locale}`;
  return `${metadataBase.origin}${prefix}${path}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: loc, slug } = await params;
  const locale = (locales.includes(loc as Locale) ? loc : "es") as Locale;
  const seo = excursionSeo[slug]?.[locale];
  const exc = excursionPorSlug(slug);

  if (!seo || !exc) return {};

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: {
      canonical: localeUrl(locale, `/excursiones/${slug}`),
      languages: {
        es: localeUrl("es", `/excursiones/${slug}`),
        en: localeUrl("en", `/excursiones/${slug}`),
        pt: localeUrl("pt", `/excursiones/${slug}`),
        "x-default": localeUrl("es", `/excursiones/${slug}`),
      },
    },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: localeUrl(locale, `/excursiones/${slug}`),
      siteName: "Frecuencia Sur Ushuaia",
      locale: locale === "es" ? "es_AR" : locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
      images: [{ url: exc.imagenHero }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
  };
}

export default async function ExcursionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: loc, slug } = await params;
  const locale = (locales.includes(loc as Locale) ? loc : "es") as Locale;
  const exc = excursionPorSlug(slug);
  if (!exc) notFound();

  const seo = excursionSeo[slug]?.[locale];
  const h1 = seo?.h1 ?? exc.nombre[locale];
  const descriptionParagraphs = seo?.description ?? [exc.descripcion[locale]];
  const alts = seo?.alts ?? [exc.nombre[locale]];

  const heroObjectPosition: Record<string, string> = {
    "esqui-de-travesia": "center 40%",
  };

  // JSON-LD TouristTrip
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: h1,
    description: descriptionParagraphs.join(" "),
    touristType: "Adventure",
    image: `${metadataBase.origin}${exc.imagenHero}`,
    provider: {
      "@type": "TravelAgency",
      name: "Frecuencia Sur Ushuaia",
      url: "https://www.frecuenciasurushuaia.com",
    },
  };

  // WhatsApp booking URL
  const waText = encodeURIComponent(
    locale === "en"
      ? `Hi! I'd like to book the ${h1} tour. What dates do you have available?`
      : locale === "pt"
        ? `Olá! Quero reservar a excursão ${h1}. Quais datas vocês têm disponíveis?`
        : `Hola! Quiero reservar la excursión ${h1}. ¿Qué fechas tienen disponibles?`
  );
  const waUrl = `https://wa.me/5492901489265?text=${waText}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar locale={locale} />

      {/* Hero Carousel */}
      <ExcursionHeroCarousel
        imagenes={exc.imagenes}
        imagenHero={exc.imagenHero}
        nombre={h1}
        dificultad={exc.dificultad[locale]}
        alts={alts}
        objectPosition={heroObjectPosition[slug] ?? "center center"}
        precio={exc.precio?.[locale]}
      />

      {/* Book button — position 1: after hero */}
      <div className="flex justify-center px-5 py-8">
        <ExcursionBookButton
          waUrl={waUrl}
          locale={locale}
          excursionSlug={slug}
          position="hero"
        />
      </div>

      {/* Content with gradient */}
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 45%, #e85d04 100%)",
        }}
      >
        <div className="relative">
          {/* Info del recorrido */}
          <section className="px-5 py-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-2 text-center text-2xl font-extrabold text-brand-text md:text-3xl">
                {locale === "en"
                  ? "Trail Information"
                  : locale === "pt"
                    ? "Informação do Percurso"
                    : "Información del Recorrido"}
              </h2>
              <p className="mb-12 text-center text-sm text-brand-text-secondary">
                {locale === "en"
                  ? "Everything you need to know before your adventure"
                  : locale === "pt"
                    ? "Tudo o que você precisa saber antes da sua aventura"
                    : "Todo lo que necesitás saber antes de tu aventura"}
              </p>

              <ExcursionInfoGrid
                items={[
                  {
                    icon: "Mountain",
                    label: locale === "en" ? "Difficulty" : locale === "pt" ? "Dificuldade" : "Dificultad",
                    value: exc.dificultad[locale],
                  },
                  {
                    icon: "Map",
                    label: locale === "en" ? "Distance" : locale === "pt" ? "Distância" : "Distancia",
                    value: exc.distancia[locale],
                  },
                  {
                    icon: "Clock",
                    label: locale === "en" ? "Duration" : locale === "pt" ? "Duração" : "Duración",
                    value: exc.duracion[locale],
                  },
                  {
                    icon: "TrendingUp",
                    label: locale === "en" ? "Elevation gain" : locale === "pt" ? "Desnível" : "Desnivel",
                    value: exc.desnivel[locale],
                  },
                  {
                    icon: "Calendar",
                    label: "Pick Up",
                    value: exc.pickUp[locale],
                  },
                  {
                    icon: "CloudSun",
                    label: locale === "en" ? "Weather" : "Clima",
                    value: exc.clima[locale],
                  },
                ]}
                equipamiento={exc.equipamiento[locale]}
                infoAdicional={exc.infoAdicional[locale]}
                locale={locale}
              />
            </div>
          </section>

          {/* Book button — position 2: after info grid */}
          <div className="flex justify-center px-5 pb-8">
            <ExcursionBookButton
              waUrl={waUrl}
              locale={locale}
              excursionSlug={slug}
              position="info"
            />
          </div>

          {/* Descripción */}
          <section className="px-5 py-16">
            <div className="mx-auto max-w-2xl">
              <ExcursionBackLink locale={locale} />
              <div className="space-y-4">
                {descriptionParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-brand-text-secondary"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* Qué incluye */}
          <section className="px-5 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-8 text-2xl font-extrabold" style={{ color: "#1a1a1a" }}>
                {locale === "en"
                  ? "What's included"
                  : locale === "pt"
                    ? "O que inclui"
                    : "Qué incluye"}
              </h2>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {exc.incluye[locale].map((item) => (
                  <div key={item} className="flex flex-col items-center gap-2">
                    <span className="text-sm" style={{ color: "#374151" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Galería */}
          {exc.imagenes.length > 0 && (
            <ExcursionGallery
              imagenes={exc.imagenes}
              nombre={exc.nombre[locale]}
              alts={alts}
              locale={locale}
            />
          )}
        </div>
      </div>

      <Footer locale={locale} />

      {/* Mobile sticky bar */}
      <ExcursionMobileBar
        waUrl={waUrl}
        locale={locale}
        excursionSlug={slug}
      />
    </>
  );
}
