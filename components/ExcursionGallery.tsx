"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";

interface Props {
  imagenes: string[];
  nombre: string;
}

export default function ExcursionGallery({ imagenes, nombre }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <section className="px-5 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-brand-text">
            Galería
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
                    alt={`${nombre} — foto ${i + 1}`}
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
