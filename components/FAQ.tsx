"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";

const faqs = [
  {
    pregunta: "¿Necesito experiencia previa?",
    respuesta:
      "No para las excursiones de dificultad Media. Solo necesitás condición física básica y ganas de caminar. Para las de dificultad Media / Alta y Alta recomendamos experiencia previa en trekking.",
  },
  {
    pregunta: "¿Las excursiones incluyen traslado?",
    respuesta:
      "Sí, todas nuestras excursiones incluyen traslado ida y vuelta. Te buscamos y te dejamos en tu alojamiento en Ushuaia.",
  },
  {
    pregunta: "¿Qué pasa si llueve?",
    respuesta:
      "En Ushuaia la lluvia es parte de la experiencia. Salimos con lluvia leve. En caso de condiciones climáticas extremas, se reprograma la salida sin costo adicional.",
  },
  {
    pregunta: "¿Se suspenden por mal clima?",
    respuesta:
      "Solo en caso de viento fuerte, nieve intensa o riesgo real para los participantes. Se avisa con anticipación y se reprograma sin costo.",
  },
  {
    pregunta: "¿Cómo reservo?",
    respuesta:
      "Podés reservar por WhatsApp o Instagram. Te confirmamos disponibilidad y te enviamos todos los detalles de la excursión.",
  },
  {
    pregunta: "¿Qué formas de pago aceptan?",
    respuesta:
      "Aceptamos efectivo, transferencia bancaria y tarjeta de crédito/débito.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <section id="faq" className="px-5 py-20">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center text-3xl font-extrabold md:text-4xl"
          style={{ color: "#1a1a1a" }}
        >
          {tr.faq_titulo}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`overflow-hidden rounded-xl transition-colors ${
                  isOpen ? "bg-white/70 shadow-sm" : "bg-white/40"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 text-sm font-bold md:text-base" style={{ color: "#1a1a1a" }}>
                    {faq.pregunta}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown
                      size={20}
                      className="shrink-0"
                      style={{ color: "#555555" }}
                    />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "#555555" }}>
                    {faq.respuesta}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
