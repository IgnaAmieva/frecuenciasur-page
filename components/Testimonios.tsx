"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
}

const fallbackReviews: Review[] = [
  {
    author_name: "Martín Rodríguez",
    rating: 5,
    text: "Una experiencia increíble. El guía conocía cada rincón del sendero y nos hizo sentir seguros en todo momento. La Laguna Esmeralda superó todas mis expectativas.",
    relative_time_description: "hace 2 meses",
  },
  {
    author_name: "Carolina Méndez",
    rating: 5,
    text: "Hicimos el Glaciar Vinciguerra y fue el mejor día de nuestro viaje. Grupo reducido, atención impecable y paisajes que no se pueden describir con palabras.",
    relative_time_description: "hace 1 mes",
  },
  {
    author_name: "Sebastián López",
    rating: 5,
    text: "Muy profesionales y apasionados por lo que hacen. Se nota que aman la montaña. El box lunch en medio del paisaje fue un detalle hermoso. Totalmente recomendable.",
    relative_time_description: "hace 3 semanas",
  },
];

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ReviewCard({ review }: { review: Review }) {
  const initials = review.author_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      variants={card}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-white/70 p-6 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < review.rating
                ? "fill-brand-orange text-brand-orange"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <p className="mb-5 text-sm leading-relaxed text-brand-text-secondary">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        {review.profile_photo_url ? (
          <img
            src={review.profile_photo_url}
            alt={review.author_name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/20 text-sm font-bold text-brand-orange">
            {initials}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-brand-text">
            {review.author_name}
          </p>
          <p className="text-xs text-brand-text-secondary">
            {review.relative_time_description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl bg-white/50 p-6">
      <div className="mb-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-4 rounded bg-gray-200" />
        ))}
      </div>
      <div className="mb-2 h-3 w-full rounded bg-gray-200" />
      <div className="mb-2 h-3 w-4/5 rounded bg-gray-200" />
      <div className="mb-5 h-3 w-3/5 rounded bg-gray-200" />
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div>
          <div className="mb-1 h-3 w-24 rounded bg-gray-200" />
          <div className="h-2 w-16 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function Testimonios() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          const sorted = [...data.reviews]
            .sort((a: Review, b: Review) => b.rating - a.rating)
            .slice(0, 5);
          setReviews(sorted);
        } else {
          setReviews(fallbackReviews);
        }
      })
      .catch(() => {
        setReviews(fallbackReviews);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayReviews = reviews ?? fallbackReviews;

  return (
    <section id="testimonios" className="px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center text-3xl font-extrabold text-brand-text md:text-4xl"
        >
          Reseñas
        </motion.h2>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.12 }}
            className="grid gap-5 md:grid-cols-3"
          >
            {displayReviews.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
