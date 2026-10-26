"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";

interface Props {
  images: string[];
  labels?: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, labels, initialIndex, onClose }: Props) {
  const { lang } = useLang();
  const tr = t[lang];
  const [index, setIndex] = useState(initialIndex);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label={tr.aria_close}
        className="fixed right-4 top-4 z-[101] flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
      >
        <X size={22} />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        aria-label={tr.aria_prev}
        className="fixed left-3 top-1/2 z-[101] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        aria-label={tr.aria_next}
        className="fixed right-3 top-1/2 z-[101] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
      >
        <ChevronRight size={24} />
      </button>

      {/* Image */}
      <div
        className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Image
              src={images[index]}
              alt={labels?.[index] ?? `${tr.aria_go_photo} ${index + 1}`}
              width={1920}
              height={1080}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              sizes="90vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Label */}
      {labels?.[index] && (
        <p className="mt-3 text-center text-sm text-white/80">
          {labels[index]}
        </p>
      )}

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            aria-label={`${tr.aria_go_photo} ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === index ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
