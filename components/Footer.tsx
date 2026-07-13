"use client";

import Image from "next/image";
import { Camera, Music2, MessageCircle, Mail } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";

const secciones = [
  { href: "#nosotros", key: "nav_nosotros" as const },
  { href: "#excursiones", key: "nav_excursiones" as const },
  { href: "#galeria", key: "nav_galeria" as const },
  { href: "#contacto", key: "nav_contacto" as const },
];

const redes = [
  { icon: Camera, href: "https://instagram.com/frecuenciasur.ushuaia", label: "Instagram" },
  { icon: Music2, href: "https://tiktok.com/@frecuenciasur.ushuaia", label: "TikTok" },
  { icon: MessageCircle, href: "https://wa.me/5492901489265", label: "WhatsApp" },
  { icon: Mail, href: "mailto:frecuenciasurushuaia@gmail.com", label: "Email" },
];

export default function Footer() {
  const { lang } = useLang();
  const tr = t[lang];

  return (
    <footer style={{ backgroundColor: "#e85d04" }}>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 py-10">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo/logo.png"
            alt="Frecuencia Sur Ushuaia"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-base font-bold" style={{ color: "white" }}>
            Frecuencia Sur Ushuaia
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-5">
          {secciones.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="text-sm transition-colors hover:opacity-100"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              {tr[s.key]}
            </a>
          ))}
        </nav>

        <div className="flex gap-5">
          {redes.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={r.label}
              className="transition-colors hover:opacity-100"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              <r.icon size={20} />
            </a>
          ))}
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          &copy; {new Date().getFullYear()} Frecuencia Sur Ushuaia. {tr.footer_derechos}.
        </p>
      </div>
    </footer>
  );
}
