"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Nosotros() {
  return (
    <section id="nosotros" className="px-5 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-10 text-3xl font-extrabold text-brand-text md:text-4xl">
            ¿Quiénes somos?
          </h2>

          <div className="mx-auto mb-10 max-w-lg space-y-4">
            <div className="relative w-full overflow-hidden rounded-xl shadow-md" style={{ aspectRatio: "4/3" }}>
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-orange/20 to-brand-orange-mid/10">
                <span className="text-sm text-brand-text-secondary">
                  Foto equipo
                </span>
              </div>
            </div>
            <div className="relative w-full overflow-hidden rounded-xl shadow-md" style={{ aspectRatio: "4/3" }}>
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-orange-mid/20 to-brand-orange/10">
                <span className="text-sm text-brand-text-secondary">
                  Foto equipo
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-xl space-y-4 text-base leading-relaxed text-brand-text-secondary">
            <p>
              En Frecuencia Sur creemos que conocer Ushuaia significa mucho más
              que visitar un destino. Nuestra misión es acercar a cada visitante
              a la naturaleza del Fin del Mundo mediante experiencias auténticas,
              seguras y personalizadas.
            </p>
            <p>
              Somos apasionados por la montaña y buscamos que cada excursión
              combine aventura, aprendizaje y conexión con uno de los paisajes
              más increíbles del planeta.
            </p>
            <p>
              Trabajamos con grupos reducidos para brindar una experiencia de
              mayor calidad, priorizando siempre la seguridad y el trato
              personalizado.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
