import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IntroLoaderWrapper from "@/components/IntroLoaderWrapper";
// TrustBar removed — trust line now lives inside Hero
import ExcursionesMap from "@/components/ExcursionesMap";
import Quiz from "@/components/Quiz";
import Ventajas from "@/components/Ventajas";
import Reviews from "@/components/Reviews";
import QueIncluye from "@/components/QueIncluye";
import Mochila from "@/components/Mochila";
import Nosotros from "@/components/Nosotros";
import FAQ from "@/components/FAQ";
import Galeria from "@/components/Galeria";
import Summit from "@/components/Summit";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import JsonLdTravelAgency from "@/components/JsonLdTravelAgency";
import Altimeter from "@/components/Altimeter";
import SmoothScroll from "@/components/SmoothScroll";
import { locales, type Locale } from "@/lib/i18n";
import { homeSeo, metadataBase } from "@/lib/seo";
import { t } from "@/lib/translations";

function localeUrl(locale: Locale, path: string = "") {
  const prefix = locale === "es" ? "" : `/${locale}`;
  return `${metadataBase.origin}${prefix}${path}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: loc } = await params;
  const locale = (locales.includes(loc as Locale) ? loc : "es") as Locale;
  const seo = homeSeo[locale];

  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: localeUrl(locale),
      languages: {
        es: localeUrl("es"),
        en: localeUrl("en"),
        pt: localeUrl("pt"),
        "x-default": localeUrl("es"),
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: localeUrl(locale),
      siteName: "Frecuencia Sur Ushuaia",
      locale: locale === "es" ? "es_AR" : locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
      images: [{ url: "/images/logo/logo.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: loc } = await params;
  const locale = (locales.includes(loc as Locale) ? loc : "es") as Locale;
  const tr = t[locale];

  return (
    <>
      <JsonLdTravelAgency />
      <SmoothScroll />
      <Altimeter />
      <IntroLoaderWrapper />
      <Navbar locale={locale} />
      <Hero locale={locale} />
      <div className="relative z-[5] bg-white">
        {/* Subtle noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />
        <div className="relative">
          <div data-alt={tr.alt_bosque}>
            <ExcursionesMap locale={locale} />
          </div>
          <div data-alt={tr.alt_turbal}>
            <Quiz />
          </div>
          <div data-alt={tr.alt_valle}>
            <Ventajas />
          </div>
          <Reviews />
          <div data-alt={tr.alt_refugio}>
            <div className="flex flex-col md:flex-row md:gap-8 max-w-6xl mx-auto px-5">
              <div className="md:flex-1"><QueIncluye /></div>
              <div className="md:flex-1"><Mochila /></div>
            </div>
          </div>
          <div data-alt={tr.alt_laguna}>
            <Nosotros />
            <FAQ locale={locale} />
          </div>
          <Galeria />
        </div>
      </div>
      <div className="relative z-[5]">
        <Summit />
        <Contacto locale={locale} />
        <Footer locale={locale} />
      </div>
    </>
  );
}
