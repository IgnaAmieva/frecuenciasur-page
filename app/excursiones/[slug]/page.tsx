import { notFound } from "next/navigation";
import Link from "next/link";
import { excursiones, excursionPorSlug } from "@/data/excursiones";
import {
  ArrowLeft,
  CheckCircle,
  UserCheck,
  Car,
  UtensilsCrossed,
  Shield,
  Coffee,
  ShoppingBag,
  Wrench,
  Mountain,
  Footprints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const INCLUYE_ICONS: Record<string, LucideIcon> = {
  "Guía profesional": UserCheck,
  "Guía de Montaña": UserCheck,
  "Mini trekking con guía experto en montaña": Footprints,
  "Traslado ida y vuelta": Car,
  "Traslado ida y vuelta al alojamiento": Car,
  "Box Lunch": UtensilsCrossed,
  "Seguro": Shield,
  "Seguro de accidentes personales": Shield,
  "Seguro de actividad": Shield,
  "Almuerzo e infusión caliente": Coffee,
  "Vianda de marcha": ShoppingBag,
  "Equipo técnico: bastones, grampines, etc.": Wrench,
  "Equipos de montaña: linternas, crampines y bastones": Wrench,
  "Ascenso en Pisten Bully con cabina de pasajeros": Mountain,
  "Cena en refugio de tres pasos con bebida libre": UtensilsCrossed,
};

function getIcon(label: string): LucideIcon {
  if (INCLUYE_ICONS[label]) return INCLUYE_ICONS[label];
  for (const key of Object.keys(INCLUYE_ICONS)) {
    if (label.toLowerCase().includes(key.toLowerCase())) return INCLUYE_ICONS[key];
  }
  return CheckCircle;
}
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

  const heroObjectPosition: Record<string, string> = {
    "esqui-de-travesia": "center 40%",
  };

  return (
    <>
      <Navbar />

      {/* Hero Carousel */}
      <ExcursionHeroCarousel
        imagenes={exc.imagenes}
        imagenHero={exc.imagenHero}
        nombre={exc.nombre}
        dificultad={exc.dificultad}
        objectPosition={heroObjectPosition[slug] ?? "center center"}
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
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-8 text-2xl font-extrabold" style={{ color: "#1a1a1a" }}>
                Qué incluye
              </h2>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {exc.incluye.map((item) => {
                  const Icon = getIcon(item);
                  return (
                    <div key={item} className="flex flex-col items-center gap-2">
                      <Icon size={28} color="#e85d04" />
                      <span className="text-sm" style={{ color: "#374151" }}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
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
