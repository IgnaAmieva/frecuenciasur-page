"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/context/LangContext";
import { trackLead } from "@/lib/tracking";
import { excursionPorSlug } from "@/data/excursiones";

const label: Record<string, string> = {
  es: "Reservar por WhatsApp",
  en: "Book via WhatsApp",
  pt: "Reservar pelo WhatsApp",
};

const DEFAULT_WA_URL =
  "https://wa.me/5492901489265?text=Hola%20Frecuencia%20Sur%2C%20quiero%20consultar%20sobre%20una%20excursi%C3%B3n.";

/** Height of the bar (px) — used for content padding */
export const MOBILE_BAR_H = 76;

export default function MobileCTA() {
  const { lang } = useLang();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const ctaOverlapRef = useRef(false);
  const footerOverlapRef = useRef(false);
  const scrolledPastHeroRef = useRef(false);

  // Detect excursion page and build specific WA URL
  const excMatch = pathname.match(/\/excursiones\/([^/]+)/);
  const excSlug = excMatch?.[1] ?? null;
  const exc = excSlug ? excursionPorSlug(excSlug) : null;

  let waUrl = DEFAULT_WA_URL;
  if (exc && excSlug) {
    const name = exc.nombre[lang as "es" | "en" | "pt"] ?? exc.nombre.es;
    const waText = encodeURIComponent(
      lang === "en"
        ? `Hi! I'd like to book the ${name} tour. What dates do you have available?`
        : lang === "pt"
          ? `Ol\u00e1! Quero reservar a excurs\u00e3o ${name}. Quais datas voc\u00eas t\u00eam dispon\u00edveis?`
          : `Hola! Quiero reservar la excursi\u00f3n ${name}. \u00bfQu\u00e9 fechas tienen disponibles?`
    );
    waUrl = `https://wa.me/5492901489265?text=${waText}`;
  }

  useEffect(() => {
    function update() {
      setVisible(
        scrolledPastHeroRef.current &&
          !ctaOverlapRef.current &&
          !footerOverlapRef.current
      );
    }

    // --- Scroll: show after hero ---
    const onScroll = () => {
      scrolledPastHeroRef.current = window.scrollY > window.innerHeight * 0.8;
      update();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- IntersectionObserver: inline CTA buttons ---
    const visibleCtas = new Set<Element>();
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visibleCtas.add(e.target);
          else visibleCtas.delete(e.target);
        }
        ctaOverlapRef.current = visibleCtas.size > 0;
        update();
      },
      { threshold: 0, rootMargin: "100px 0px 100px 0px" }
    );

    // Observe all inline booking buttons (not the bar itself)
    const ctaEls = document.querySelectorAll(
      '[data-cta-position]:not([data-cta-position="barra-mobile"])'
    );
    ctaEls.forEach((el) => ctaObserver.observe(el));

    // --- IntersectionObserver: footer ---
    const footerObserver = new IntersectionObserver(
      (entries) => {
        footerOverlapRef.current = entries.some((e) => e.isIntersecting);
        update();
      },
      { threshold: 0 }
    );
    const footer = document.querySelector("footer");
    if (footer) footerObserver.observe(footer);

    return () => {
      window.removeEventListener("scroll", onScroll);
      ctaObserver.disconnect();
      footerObserver.disconnect();
    };
  }, [pathname]);

  return (
    <div
      data-cta-position="barra-mobile"
      className="fixed bottom-0 left-0 right-0 z-50 p-3 transition-opacity duration-300 md:hidden"
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackLead({
            content_name: excSlug ?? "home",
            cta_position: "barra-mobile",
          })
        }
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand-orange text-base font-bold uppercase tracking-wider text-white shadow-lg transition hover:brightness-110"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {label[lang]}
      </a>
    </div>
  );
}
