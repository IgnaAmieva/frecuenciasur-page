import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ventajas from "@/components/Ventajas";
import Excursiones from "@/components/Excursiones";
import Nosotros from "@/components/Nosotros";
import Contacto from "@/components/Contacto";
import QueIncluye from "@/components/QueIncluye";
import QueLlevar from "@/components/QueLlevar";
import Galeria from "@/components/Galeria";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import JsonLdTravelAgency from "@/components/JsonLdTravelAgency";
import { locales, type Locale } from "@/lib/i18n";
import { homeSeo, metadataBase } from "@/lib/seo";

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
    title: seo.title,
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

  return (
    <>
      <JsonLdTravelAgency />
      <Navbar locale={locale} />
      <Hero locale={locale} />
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 45%, #e85d04 100%)",
        }}
      >
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
          <Excursiones locale={locale} />
          <Ventajas />
          <Nosotros />
          <FAQ locale={locale} />
          <QueLlevar />
          <QueIncluye />
          <Galeria />
          <Contacto locale={locale} />
        </div>
      </div>
      <Footer locale={locale} />
    </>
  );
}
