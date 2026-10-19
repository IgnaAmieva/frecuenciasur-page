"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import { homeSeo } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";

const heroImages = [
  { src: "/images/excursiones/laguna-esmeralda/IMG_7464.JPG", excursion: "Laguna Esmeralda" },
  { src: "/images/excursiones/glaciar-vinciguerra/IMG_1464.jpg", excursion: "Glaciar Vinciguerra" },
  { src: "/images/excursiones/glaciar-ojo-del-albino/DJI_0658.JPG", excursion: "Glaciar Ojo del Albino" },
  { src: "/images/excursiones/laguna-cinco-hermanos/IMG_5492.jpg", excursion: "Laguna Cinco Hermanos" },
  { src: "/images/excursiones/martial-aventura/IMG_0620.JPG", excursion: "Martial Aventura" },
  { src: "/images/excursiones/monte-susana/IMG_5732.JPG", excursion: "Monte Susana" },
];

const fade = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const { lang } = useLang();
  const tr = t[lang];
  const seo = homeSeo[locale];

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background carousel */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[index].src}
            alt={heroImages[index].excursion}
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.25 }}
        className="relative z-10 flex flex-col items-center px-5 text-center"
      >
        {/* SEO H1 — visible kicker */}
        <motion.h1
          variants={fade}
          transition={{ duration: 0.5 }}
          className="mb-4 text-sm font-medium uppercase tracking-widest text-white/80 md:text-base"
        >
          {seo.h1}
        </motion.h1>

        {/* Visual headline — not h1 */}
        <motion.p
          variants={fade}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
          aria-hidden="true"
        >
          <span style={{ color: "white" }} className="block text-3xl font-light tracking-wide md:text-5xl">
            {tr.hero_titulo1}
          </span>
          <span className="mx-auto my-3 block h-px w-12 bg-white/60" />
          <span style={{ color: "white" }} className="block text-4xl font-bold italic md:text-6xl">
            {tr.hero_titulo2}
          </span>
        </motion.p>

        <motion.a
          variants={fade}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          href="https://wa.me/5492901489265?text=Hola%20Frecuencia%20Sur%2C%20quiero%20consultar%20sobre%20una%20excursi%C3%B3n."
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
          className="mt-8 max-w-xs rounded-full border border-white/40 bg-white/15 px-8 py-3 text-sm font-medium uppercase tracking-widest backdrop-blur-sm transition hover:bg-white/25"
        >
          {tr.hero_boton}
        </motion.a>
      </motion.div>

      {/* Dots */}
      <div className="absolute bottom-24 left-0 right-0 z-10 flex justify-center gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Ir a foto ${i + 1}`}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === index ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Mountain silhouette divider */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block h-[80px] w-full md:h-[120px]"
          fill="#FFFFFF"
        >
          <path d="M0,120 L0,95 C40,90 60,78 90,82 C120,86 140,65 180,58 C220,51 240,68 270,72 C300,76 320,55 360,42 C400,29 420,52 460,60 C500,68 520,48 560,38 C600,28 630,50 670,55 C710,60 740,35 780,25 C820,15 850,40 890,48 C930,56 960,38 1000,32 C1040,26 1070,45 1110,55 C1150,65 1180,42 1220,35 C1260,28 1290,50 1320,62 C1350,74 1380,60 1410,55 L1440,50 L1440,120 Z" />
        </svg>
      </div>
    </section>
  );
}
