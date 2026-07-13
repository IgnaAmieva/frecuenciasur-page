"use client";

import { motion } from "framer-motion";
import {
  Footprints,
  Wind,
  Layers,
  Hand,
  HardHat,
  Backpack,
  Droplets,
  Sun,
  Glasses,
} from "lucide-react";

const items = [
  { icon: Footprints, label: "Botas impermeables" },
  { icon: Wind, label: "Campera impermeable" },
  { icon: Layers, label: "Abrigo" },
  { icon: Hand, label: "Guantes" },
  { icon: HardHat, label: "Gorro" },
  { icon: Backpack, label: "Mochila pequeña" },
  { icon: Droplets, label: "Botella de agua" },
  { icon: Sun, label: "Protector solar" },
  { icon: Glasses, label: "Lentes de sol" },
];

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function QueLlevar() {
  return (
    <section id="que-llevar" className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center text-3xl font-extrabold text-brand-text md:text-4xl"
        >
          ¿Qué llevar?
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.06 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3"
        >
          {items.map((i) => (
            <motion.div
              key={i.label}
              variants={card}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 rounded-xl bg-white/60 p-4 shadow-sm backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange">
                <i.icon className="h-5 w-5 text-white" />
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
