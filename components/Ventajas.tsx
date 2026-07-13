"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Award,
  Users,
  HeartHandshake,
  Car,
  UtensilsCrossed,
  Shield,
} from "lucide-react";

const ventajas = [
  { icon: Award, titulo: "Guías especializados", desc: "Profesionales certificados con años en montaña" },
  { icon: Users, titulo: "Grupos reducidos", desc: "Máximo 8 personas por salida" },
  { icon: HeartHandshake, titulo: "Atención personalizada", desc: "Te acompañamos en todo momento" },
  { icon: Car, titulo: "Traslados incluidos", desc: "Buscamos y dejamos en tu alojamiento" },
  { icon: UtensilsCrossed, titulo: "Box Lunch incluido", desc: "Almuerzo en todas las excursiones" },
  { icon: Shield, titulo: "Seguridad garantizada", desc: "Equipo de primeros auxilios y seguros" },
];

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Ventajas() {
  return (
    <section id="ventajas" className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center text-3xl font-extrabold text-brand-text md:text-4xl"
        >
          ¿Por qué elegirnos?
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-3"
        >
          {ventajas.map((v) => (
            <motion.div
              key={v.titulo}
              variants={item}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange md:h-24 md:w-24">
                <v.icon className="h-8 w-8 text-white md:h-10 md:w-10" />
              </div>
              <h3 className="text-sm font-bold text-brand-text md:text-base">
                {v.titulo}
              </h3>
              <p className="mt-1 text-xs text-brand-text-secondary md:text-sm">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Logo animado */}
        <motion.div
          style={{ perspective: 800 }}
          className="mb-0 flex justify-center"
        >
          <motion.div
            animate={{
              rotateY: [0, 15, 0, -15, 0],
              scale: [1, 1.05, 1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          >
            <Image
              src="/images/logo/logo.png"
              alt="Frecuencia Sur Ushuaia"
              width={200}
              height={200}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
