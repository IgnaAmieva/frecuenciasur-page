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
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Ventajas() {
  const { lang } = useLang();
  const tr = t[lang];

  const ventajas = [
    { icon: Award, titulo: tr.ventajas_guias, desc: tr.ventajas_guias_desc },
    { icon: Users, titulo: tr.ventajas_grupos, desc: tr.ventajas_grupos_desc },
    { icon: HeartHandshake, titulo: tr.ventajas_atencion, desc: tr.ventajas_atencion_desc },
    { icon: Car, titulo: tr.ventajas_traslados, desc: tr.ventajas_traslados_desc },
    { icon: UtensilsCrossed, titulo: tr.ventajas_lunch, desc: tr.ventajas_lunch_desc },
    { icon: Shield, titulo: tr.ventajas_seguridad, desc: tr.ventajas_seguridad_desc },
  ];

  return (
    <section id="ventajas" className="px-5 pt-0">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center text-3xl font-extrabold md:text-4xl"
          style={{ color: "#1a1a1a" }}
        >
          {tr.ventajas_titulo}
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
                <v.icon className="h-8 w-8 md:h-10 md:w-10" color="white" />
              </div>
              <h3 className="text-sm font-bold md:text-base" style={{ color: "#1a1a1a" }}>
                {v.titulo}
              </h3>
              <p className="mt-1 text-xs md:text-sm" style={{ color: "#555555" }}>
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
