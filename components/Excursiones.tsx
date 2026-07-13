"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Map, Clock } from "lucide-react";
import { excursiones } from "@/data/excursiones";

function BadgeDificultad({ nivel }: { nivel: string }) {
  const styles: Record<string, string> = {
    Baja: "bg-green-500 text-white",
    Media: "bg-brand-orange text-white",
    "Media / Alta": "bg-yellow-500 text-black",
    Alta: "bg-red-600 text-white",
  };
  return (
    <span
      className={`rounded-full px-3 py-0.5 text-xs font-bold ${styles[nivel] ?? "bg-brand-orange text-white"}`}
    >
      {nivel}
    </span>
  );
}

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Excursiones() {
  return (
    <section id="excursiones" className="px-5 pb-20 pt-0">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center text-3xl font-extrabold text-brand-text md:text-4xl"
        >
          Nuestras Excursiones
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {excursiones.map((exc) => (
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
                    alt={exc.nombre}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-orange/30 to-brand-orange-mid/20">
                    <span className="text-lg font-bold text-brand-text/50">
                      {exc.nombre}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 text-center">
                <div className="mb-2">
                  <BadgeDificultad nivel={exc.dificultad} />
                </div>

                <h3 className="mb-2 text-xl font-bold text-brand-text">
                  {exc.nombre}
                </h3>

                <div className="mb-3 flex justify-center gap-4 text-sm text-brand-text-secondary">
                  <span className="flex items-center gap-1">
                    <Map size={14} /> {exc.distancia}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {exc.duracion}
                  </span>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-brand-text-secondary">
                  {exc.descripcionCorta}
                </p>

                <Link
                  href={`/excursiones/${exc.slug}`}
                  className="inline-block rounded-full border-2 border-brand-orange px-6 py-2 text-sm font-bold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white"
                >
                  Ver más &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
