"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Map, Clock } from "lucide-react";
import { excursiones } from "@/data/excursiones";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import { localePath } from "@/lib/locale-utils";
import { excursionSeo } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";

function BadgeDificultad({ nivel }: { nivel: string }) {
  const styles: Record<string, string> = {
    Baja: "bg-green-500",
    Media: "bg-brand-orange",
    Medium: "bg-brand-orange",
    "Média": "bg-brand-orange",
    "Media / Alta": "bg-yellow-500",
    "Medium / High": "bg-yellow-500",
    "Média / Alta": "bg-yellow-500",
    Alta: "bg-red-600",
    High: "bg-red-600",
  };
  const isYellow = nivel.includes("/");
  return (
    <span
      className={`rounded-full px-3 py-0.5 text-xs font-bold ${styles[nivel] ?? "bg-brand-orange"}`}
      style={{ color: isYellow ? "#000" : "white" }}
    >
      {nivel}
    </span>
  );
}

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Excursiones({ locale }: { locale: Locale }) {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section id="excursiones" className="px-5 pb-20 pt-0">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center text-3xl font-extrabold md:text-4xl"
          style={{ color: "#1a1a1a" }}
        >
          {tr.excursiones_titulo}
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {excursiones.map((exc) => {
            const seo = excursionSeo[exc.slug]?.[locale];
            const heroAlt = seo?.alts[0] ?? exc.nombre[locale];

            return (
              <motion.div
                key={exc.slug}
                variants={card}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="relative h-52 overflow-hidden">
                  {exc.imagenHero && exc.imagenes.length > 0 ? (
                    <Image
                      src={exc.imagenHero}
                      alt={heroAlt}
                      fill
                      className="object-cover object-center transition-transform duration-300 hover:scale-105"
                      style={exc.slug === "martial-aventura" ? { objectPosition: "center 75%" } : undefined}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-orange/30 to-brand-orange-mid/20">
                      <span className="text-lg font-bold" style={{ color: "rgba(26,26,26,0.5)" }}>
                        {exc.nombre[locale]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 text-center">
                  <div className="mb-2">
                    <BadgeDificultad nivel={exc.dificultad[locale]} />
                  </div>

                  <h3 className="mb-2 text-xl font-bold" style={{ color: "#1a1a1a" }}>
                    {exc.nombre[locale]}
                  </h3>

                  <div className="mb-3 flex justify-center gap-4 text-sm" style={{ color: "#555555" }}>
                    <span className="flex items-center gap-1">
                      <Map size={14} /> {exc.distancia[locale]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {exc.duracion[locale]}
                    </span>
                  </div>

                  <p className="mb-4 line-clamp-2 text-sm" style={{ color: "#555555" }}>
                    {exc.descripcionCorta[locale]}
                  </p>

                  <Link
                    href={localePath(locale, `/excursiones/${exc.slug}`)}
                    className="inline-block border-2 border-[#e85d04] text-[#e85d04] font-medium px-6 py-2 rounded-full hover:bg-[#e85d04] hover:text-white transition-colors"
                  >
                    {tr.excursiones_ver_mas}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
