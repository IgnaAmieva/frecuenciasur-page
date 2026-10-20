"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";

export default function Nosotros() {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section id="nosotros" className="px-5 pt-16 md:pt-24">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-10 text-3xl font-extrabold md:text-4xl" style={{ color: "#1a1a1a" }}>
            {tr.nosotros_titulo}
          </h2>

          <div className="mx-auto mb-10 max-w-lg space-y-4">
            <div className="relative w-full overflow-hidden rounded-xl shadow-md" style={{ aspectRatio: "4/3" }}>
              <Image
                src="/images/excursiones/foto-equipo/IMG_7382.JPG"
                alt="Equipo Frecuencia Sur"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 512px"
              />
            </div>
            <div className="relative w-full overflow-hidden rounded-xl shadow-md" style={{ aspectRatio: "4/3" }}>
              <Image
                src="/images/excursiones/foto-equipo/IMG_8812.JPG"
                alt="Equipo Frecuencia Sur"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 512px"
              />
            </div>
          </div>

          <div className="mx-auto max-w-xl space-y-4 text-base leading-relaxed" style={{ color: "#555555" }}>
            <p>{tr.nosotros_p1}</p>
            <p>{tr.nosotros_p2}</p>
            <p>{tr.nosotros_p3}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
