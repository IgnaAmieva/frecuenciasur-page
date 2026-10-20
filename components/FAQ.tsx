"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";

const faqKeys = ["faq_1", "faq_2", "faq_3", "faq_4", "faq_5", "faq_6"] as const;

export default function FAQ({ locale }: { locale: Locale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { lang } = useLang();
  const tr = t[lang];

  const faqs = faqKeys.map((key) => ({
    pregunta: tr[`${key}_q` as keyof typeof tr],
    respuesta: tr[`${key}_a` as keyof typeof tr],
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.respuesta,
      },
    })),
  };

  return (
    <section id="faq" className="px-5 pt-16 md:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
                  <h3 className="pr-4 text-sm font-bold md:text-base" style={{ color: "#1a1a1a" }}>
                    {faq.pregunta}
                  </h3>
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
