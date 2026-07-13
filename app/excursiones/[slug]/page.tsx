import { notFound } from "next/navigation";
import Link from "next/link";
import { excursiones, excursionPorSlug } from "@/data/excursiones";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExcursionInfoGrid from "@/components/ExcursionInfoGrid";
import ExcursionHeroCarousel from "@/components/ExcursionHeroCarousel";
import ExcursionGallery from "@/components/ExcursionGallery";

export function generateStaticParams() {
  return excursiones.map((e) => ({ slug: e.slug }));
}

export default async function ExcursionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exc = excursionPorSlug(slug);
  if (!exc) notFound();

  return (
    <>
      <Navbar />

      {/* Hero Carousel */}
      <ExcursionHeroCarousel
        imagenes={exc.imagenes}
        imagenHero={exc.imagenHero}
        nombre={exc.nombre}
        dificultad={exc.dificultad}
      />

      {/* Content with gradient */}
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 45%, #e85d04 100%)",
        }}
      >
        <div className="relative">
          {/* Info del recorrido */}
          <section className="px-5 py-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-2 text-center text-2xl font-extrabold text-brand-text md:text-3xl">
                Información del Recorrido
              </h2>
              <p className="mb-12 text-center text-sm text-brand-text-secondary">
                Todo lo que necesitás saber antes de tu aventura
              </p>

              <ExcursionInfoGrid
                items={[
                  { icon: "Mountain", label: "Dificultad", value: exc.dificultad },
                  { icon: "Map", label: "Distancia", value: exc.distancia },
                  { icon: "Clock", label: "Duración", value: exc.duracion },
                  { icon: "TrendingUp", label: "Desnivel", value: exc.desnivel },
                  { icon: "Calendar", label: "Pick Up", value: exc.pickUp },
                  { icon: "CloudSun", label: "Clima", value: exc.clima },
                ]}
                equipamiento={exc.equipamiento}
                infoAdicional={exc.infoAdicional}
              />
            </div>
          </section>

          {/* Descripción */}
          <section className="px-5 py-16">
            <div className="mx-auto max-w-2xl">
              <Link
                href="/#excursiones"
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-brand-orange transition-colors hover:text-brand-orange-mid"
              >
                <ArrowLeft size={16} />
                Volver a excursiones
              </Link>
              <p className="text-base leading-relaxed text-brand-text-secondary">
                {exc.descripcion}
              </p>
            </div>
          </section>

          {/* Qué incluye */}
          <section className="px-5 py-16">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-8 text-center text-2xl font-extrabold text-brand-text">
                Qué incluye
              </h2>
              <ul className="space-y-3">
                {exc.incluye.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle size={20} className="shrink-0 text-brand-orange" />
                    <span className="text-brand-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Galería */}
          {exc.imagenes.length > 0 ? (
            <ExcursionGallery imagenes={exc.imagenes} nombre={exc.nombre} />
          ) : (
            <section className="px-5 py-16">
              <div className="mx-auto max-w-md rounded-xl bg-white/60 p-10 text-center">
                <p className="text-brand-text-secondary">
                  Próximamente — Fotos de esta excursión
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
