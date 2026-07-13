import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ventajas from "@/components/Ventajas";
import Excursiones from "@/components/Excursiones";
import Nosotros from "@/components/Nosotros";
import Contacto from "@/components/Contacto";
import QueIncluye from "@/components/QueIncluye";
import QueLlevar from "@/components/QueLlevar";
import Galeria from "@/components/Galeria";
import Testimonios from "@/components/Testimonios";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <div
        className="relative"
        style={{
          background:
            "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 45%, #e85d04 100%)",
        }}
      >
        {/* Subtle noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />
        <div className="relative">
          <Ventajas />
          <Excursiones />
          <Nosotros />
          <Contacto />
          <QueIncluye />
          <QueLlevar />
          <Galeria />
          <Testimonios />
          <FAQ />
        </div>
      </div>
      <Footer />
    </>
  );
}
