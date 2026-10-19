"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  imagenes: string[];
  imagenHero: string;
  nombre: string;
  dificultad: string;
  precio?: string;
  objectPosition?: string;
  alts?: string[];
}

export default function ExcursionHeroCarousel({
  imagenes,
  imagenHero,
  nombre,
  dificultad,
  precio,
  objectPosition = "center center",
  alts = [],
}: Props) {
  const fotos = imagenes.length > 0 ? imagenes : [imagenHero];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (fotos.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % fotos.length);
    }, 3500);
    return () => clearInterval(id);
  }, [fotos.length]);

  function getAlt(i: number): string {
    if (alts.length === 0) return nombre;
    return alts[i % alts.length];
  }

  return (
    <section className="relative h-[60vh] w-full overflow-hidden md:h-[70vh]">
      {/* Images */}
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
            src={fotos[index]}
            alt={getAlt(index)}
            fill
            className="object-cover"
            style={{ objectPosition }}
            sizes="100vw"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
        <h1 className="max-w-lg text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
          {nombre}
        </h1>
        <span className="mt-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold text-white backdrop-blur-sm">
          {dificultad}
        </span>
        {precio && (
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white md:text-4xl">
              {precio.split(" ")[0]}
            </span>
            <span className="ml-2 text-base font-medium text-white/80">
              {precio.split(" ").slice(1).join(" ")}
            </span>
          </div>
        )}
      </div>

      {/* Dots */}
      {fotos.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
          {fotos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir a foto ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

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
