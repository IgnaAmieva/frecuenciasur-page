"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";
import type { Locale } from "@/lib/i18n";

interface Props {
  imagenes: string[];
  nombre: string;
  alts?: string[];
  locale?: Locale;
}

export default function ExcursionGallery({ imagenes, nombre, alts = [] }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  function getAlt(i: number): string {
    if (alts.length === 0) return nombre;
    return alts[i % alts.length];
  }

  return (
    <>
      <section className="px-5 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-brand-text">
            {nombre}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {imagenes.map((src, i) => (
              <div
                key={i}
                className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                onClick={() => setLightboxIndex(i)}
              >
                <div className="relative aspect-square">
                  <Image
                    src={src}
                    alt={getAlt(i)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 336px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={imagenes}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
