"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";

const IMAGES = [
  { src: "/images/excursiones/laguna-esmeralda/IMG_7464.JPG", label: "Laguna Esmeralda" },
  { src: "/images/excursiones/laguna-esmeralda/IMG_8330.JPG", label: "Laguna Esmeralda" },
  { src: "/images/excursiones/glaciar-vinciguerra/IMG_1464.jpg", label: "Glaciar Vinciguerra" },
  { src: "/images/excursiones/glaciar-vinciguerra/IMG_8633.JPG", label: "Glaciar Vinciguerra" },
  { src: "/images/excursiones/glaciar-ojo-del-albino/DJI_0658.JPG", label: "Glaciar Ojo del Albino" },
  { src: "/images/excursiones/glaciar-ojo-del-albino/IMG_4474.JPG", label: "Glaciar Ojo del Albino" },
  { src: "/images/excursiones/laguna-cinco-hermanos/IMG_5492.jpg", label: "Laguna Cinco Hermanos" },
  { src: "/images/excursiones/laguna-cinco-hermanos/IMG_6270.JPG", label: "Laguna Cinco Hermanos" },
  { src: "/images/excursiones/martial-aventura/8c51fea1-f555-4f23-933a-ebb5c165b340.jpg", label: "Martial Aventura" },
  { src: "/images/excursiones/martial-aventura/IMG_0620.JPG", label: "Martial Aventura" },
  { src: "/images/excursiones/monte-susana/IMG_5732.JPG", label: "Monte Susana" },
  { src: "/images/excursiones/monte-susana/IMG_7373.JPG", label: "Monte Susana" },
];

export default function Galeria() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { lang } = useLang();
  const tr = t[lang];

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + IMAGES.length) % IMAGES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 4000);
    return () => clearInterval(id);
  }, [paused, go]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section id="galeria" className="px-5 pt-16 md:pt-24">
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center text-3xl font-extrabold md:text-4xl"
          style={{ color: "#1a1a1a" }}
        >
          {tr.galeria_titulo}
        </motion.h2>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* Image container */}
          <div
            className="relative w-full cursor-pointer overflow-hidden rounded-xl"
            style={{ aspectRatio: "16/9" }}
            onClick={() => setLightboxIndex(index)}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={IMAGES[index].src}
                  alt={IMAGES[index].label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority={index === 0}
                />
                {/* Label */}
                <span
                  className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium backdrop-blur-sm"
                  style={{ color: "white" }}
                >
                  {IMAGES[index].label}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next */}
          <button
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/60 p-2 text-brand-orange shadow backdrop-blur transition hover:bg-brand-orange hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/60 p-2 text-brand-orange shadow backdrop-blur transition hover:bg-brand-orange hover:text-white"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Ir a foto ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === index ? "bg-brand-orange" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={IMAGES.map((img) => img.src)}
          labels={IMAGES.map((img) => img.label)}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
