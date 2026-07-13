"use client";

import { motion } from "framer-motion";
import { Car, UserCheck, UtensilsCrossed, Shield, Star } from "lucide-react";

const items = [
  { icon: Car, label: "Traslado desde tu alojamiento" },
  { icon: UserCheck, label: "Guía profesional certificado" },
  { icon: UtensilsCrossed, label: "Box Lunch" },
  { icon: Shield, label: "Seguro de actividad" },
  { icon: Star, label: "Atención personalizada" },
];

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function QueIncluye() {
  return (
    <section id="incluye" className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center text-3xl font-extrabold text-brand-text md:text-4xl"
        >
          Todas las excursiones incluyen
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="flex flex-wrap justify-center gap-10"
        >
          {items.map((i) => (
            <motion.div
              key={i.label}
              variants={item}
              transition={{ duration: 0.4 }}
              className="flex w-28 flex-col items-center text-center md:w-32"
            >
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange md:h-24 md:w-24">
                <i.icon className="h-8 w-8 text-white md:h-10 md:w-10" />
              </div>
              <span className="text-sm font-medium text-brand-text">
                {i.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
