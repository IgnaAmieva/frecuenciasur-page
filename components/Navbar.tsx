"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import { localePath } from "@/lib/locale-utils";
import type { Locale } from "@/lib/i18n";

const FLAGS: Record<string, string> = {
  es: "\u{1F1E6}\u{1F1F7}",
  en: "\u{1F1FA}\u{1F1F8}",
  pt: "\u{1F1E7}\u{1F1F7}",
};

export default function Navbar({ locale }: { locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const tr = t[lang];
  const pathname = usePathname();

  const links = [
    { href: `${localePath(locale, "/")}#excursiones`, label: tr.nav_excursiones },
    { href: `${localePath(locale, "/")}#ventajas`, label: tr.ventajas_titulo },
    { href: `${localePath(locale, "/")}#nosotros`, label: tr.nav_nosotros },
    { href: `${localePath(locale, "/")}#galeria`, label: tr.nav_galeria },
    { href: `${localePath(locale, "/")}#contacto`, label: tr.nav_contacto },
  ];

  // Build the equivalent path in the target locale
  function switchLocalePath(targetLocale: Locale): string {
    // Remove current locale prefix from pathname
    let basePath = pathname;
    if (locale !== "es" && basePath.startsWith(`/${locale}`)) {
      basePath = basePath.slice(`/${locale}`.length) || "/";
    }
    return localePath(targetLocale, basePath === "/" ? "/" : basePath);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-100 bg-white shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href={localePath(locale, "/")} className="flex items-center gap-3">
          <Image
            src="/images/logo/logo.png"
            alt="Frecuencia Sur Ushuaia"
            width={44}
            height={44}
            className="rounded-full"
          />
          <span
            style={{ color: scrolled ? "#1f2937" : "white" }}
            className="text-sm font-bold transition-colors duration-300 sm:text-base"
          >
            Frecuencia Sur Ushuaia
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  style={{ color: scrolled ? "#1f2937" : "white" }}
                  className="text-sm font-medium transition-colors duration-300 hover:text-brand-orange"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Language selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                scrolled
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "bg-white/20 backdrop-blur-sm hover:bg-white/30"
              }`}
              style={{ color: scrolled ? "#1f2937" : "white" }}
            >
              <span>{FLAGS[lang]}</span>
              <span>{lang.toUpperCase()}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-1 overflow-hidden rounded-lg bg-white shadow-lg">
                {(["es", "en", "pt"] as const).map((l) => (
                  <Link
                    key={l}
                    href={switchLocalePath(l)}
                    onClick={() => setLangOpen(false)}
                    className={`flex w-full items-center gap-2 px-4 py-2 text-xs font-medium transition-colors hover:bg-gray-50 ${
                      l === lang ? "bg-gray-50" : ""
                    }`}
                    style={{ color: "#1a1a1a" }}
                  >
                    <span>{FLAGS[l]}</span>
                    <span>{l.toUpperCase()}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: scrolled ? "#1f2937" : "white" }}
            className="transition-colors duration-300 md:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`overflow-hidden md:hidden ${
              scrolled
                ? "border-t border-gray-100 bg-white"
                : "bg-black/70 backdrop-blur-md"
            }`}
          >
            <ul className="flex flex-col px-5 pb-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{ color: scrolled ? "#1f2937" : "white" }}
                    className="block py-3 transition-colors hover:text-brand-orange"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
