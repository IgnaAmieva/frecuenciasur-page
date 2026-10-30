import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import MobileCTA from "@/components/MobileCTA";
import { LangProvider } from "@/context/LangContext";
import { locales, type Locale } from "@/lib/i18n";
import { homeSeo, metadataBase } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e85d04",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
    metadataBase,
    title: {
      default: seo.title,
      template: `%s | Frecuencia Sur`,
    },
    description: seo.description,
    keywords: seo.keywords,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon.png", sizes: "512x512", type: "image/png" },
      ],
      apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    },
    manifest: "/manifest.webmanifest",
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
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: "Frecuencia Sur - Trekking y turismo aventura en Ushuaia",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/og.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      className={inter.variable}
    >
      <body style={{ color: "#1a1a1a" }} className="font-sans text-brand-text pb-[92px] md:pb-0">
        <LangProvider locale={locale as "es" | "en" | "pt"}>
          {children}
          <MobileCTA />
        </LangProvider>
      </body>
    </html>
  );
}
