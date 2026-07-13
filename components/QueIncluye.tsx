"use client";

import { motion } from "framer-motion";
import { Car, UserCheck, UtensilsCrossed, Shield, Star } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function QueIncluye() {
  const { lang } = useLang();
  const tr = t[lang];

  const items = [
    { icon: Car, label: tr.incluye_traslado },
    { icon: UserCheck, label: tr.incluye_guia },
    { icon: UtensilsCrossed, label: tr.incluye_lunch },
    { icon: Shield, label: tr.incluye_seguro },
    { icon: Star, label: tr.incluye_atencion },
  ];

  return (
    <section id="incluye" className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center text-3xl font-extrabold md:text-4xl"
          style={{ color: "#1a1a1a" }}
        >
          {tr.incluye_titulo}
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
                <i.icon className="h-8 w-8 md:h-10 md:w-10" color="white" />
              </div>
              <span className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
                {i.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
