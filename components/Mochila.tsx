"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";

interface PackItem {
  label: string;
  tag: "clave" | "opcional" | "";
}

const STORAGE_KEY = "fs-pack";

function loadChecked(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {
    /* ignore */
  }
  return new Set();
}

function saveChecked(checked: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
  } catch {
    /* ignore */
  }
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    setDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return desktop;
}

export default function Mochila() {
  const { lang } = useLang();
  const tr = t[lang];
  const isDesktop = useIsDesktop();

  const items: PackItem[] = [
    { label: tr.llevar_campera ?? "Campera impermeable", tag: "clave" },
    { label: tr.llevar_botas ?? "Botas de trekking", tag: "clave" },
    { label: lang === "en" ? "Thermal base layer" : lang === "pt" ? "Primeira camada térmica" : "Primera capa térmica", tag: "clave" },
    { label: tr.llevar_abrigo ?? "Abrigo", tag: "" },
    { label: lang === "en" ? "Gloves & hat" : lang === "pt" ? "Luvas e gorro" : "Guantes y gorro", tag: "clave" },
    { label: lang === "en" ? "Water 1.5L" : lang === "pt" ? "Água 1.5L" : "Agua 1.5L", tag: "" },
    { label: tr.llevar_protector ?? "Protector solar", tag: "" },
    { label: tr.llevar_lentes ?? "Lentes de sol", tag: "" },
    { label: lang === "en" ? "Trail snacks" : lang === "pt" ? "Lanches para o caminho" : "Snacks para el camino", tag: "" },
    { label: lang === "en" ? "Trekking poles" : lang === "pt" ? "Bastões de caminhada" : "Bastones de trekking", tag: "opcional" },
  ];

  const total = items.length;

  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChecked(loadChecked());
    setMounted(true);
  }, []);

  const toggle = useCallback((idx: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      saveChecked(next);
      return next;
    });
  }, []);

  const checkedCount = checked.size;
  const fillRatio = checkedCount / total;

  /* ---- Wave animation ---- */
  const wavePathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let running = true;

    const animate = () => {
      if (!running || !wavePathRef.current) return;
      const now = performance.now();
      const baseY = 236 - fillRatio * 184;
      let d = `M 40 ${baseY}`;
      for (let x = 40; x <= 160; x += 2) {
        const y = baseY + Math.sin(x / 9 + now / 300) * 4;
        d += ` L ${x} ${y}`;
      }
      d += " L 160 250 L 40 250 Z";
      wavePathRef.current.setAttribute("d", d);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [fillRatio]);

  /* ---- WhatsApp ---- */
  const sendWhatsApp = () => {
    const trAny = tr as Record<string, string>;
    const title = trAny.mochila_wa_title ?? "Mi mochila para el trekking en Ushuaia (Frecuencia Sur):";
    const lines = items.map((item, i) => {
      const icon = checked.has(i) ? "\u2705" : "\u2B1C";
      return `${icon} ${item.label}`;
    });
    const text = encodeURIComponent(`${title}\n\n${lines.join("\n")}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  /* ---- Translation helpers ---- */
  const trAny = tr as Record<string, string>;
  const titulo = trAny.mochila_titulo ?? "Armá tu mochila";
  const subtitle = trAny.mochila_subtitle ?? "Marcá lo que ya tenés y mandate la lista por WhatsApp.";
  const readyLabel = trAny.mochila_ready ?? "listos";
  const sendLabel = trAny.mochila_send ?? "Mandame la lista";
  const claveLabel = trAny.mochila_clave ?? "clave";
  const opcionalLabel = trAny.mochila_opcional ?? "opcional";

  return (
    <section id="mochila" className="px-5 pt-16 md:pt-24">
      <div className="mx-auto max-w-5xl">
        <h2
          className="mb-2 text-center text-3xl font-extrabold md:text-4xl"
          style={{ color: "#1a1a1a" }}
        >
          {titulo}
        </h2>
        <p className="mb-12 text-center text-gray-500">{subtitle}</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? ".8fr 1.2fr" : "1fr",
            gap: 40,
            alignItems: "start",
          }}
        >
          {/* ---- Backpack SVG ---- */}
          <div
            className="flex flex-col items-center"
            style={isDesktop ? { position: "sticky", top: 100 } : undefined}
          >
            <svg
              viewBox="0 0 200 250"
              style={{ width: "100%", maxWidth: 220 }}
              aria-hidden="true"
            >
              <defs>
                <clipPath id="bp-clip">
                  <path d="M40 72 Q40 50 62 50 H138 Q160 50 160 72 V222 Q160 236 146 236 H54 Q40 236 40 222Z" />
                </clipPath>
              </defs>

              {/* Straps */}
              <path
                d="M74 52 Q74 20 100 20 Q126 20 126 52"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth={7}
                strokeLinecap="round"
              />

              {/* Body fill base */}
              <path
                d="M40 72 Q40 50 62 50 H138 Q160 50 160 72 V222 Q160 236 146 236 H54 Q40 236 40 222Z"
                fill="#F4F4F2"
              />

              {/* Animated wave fill */}
              <path
                ref={wavePathRef}
                d="M 40 236 L 160 236 L 160 250 L 40 250 Z"
                fill="#E85D04"
                clipPath="url(#bp-clip)"
              />

              {/* Body outline */}
              <path
                d="M40 72 Q40 50 62 50 H138 Q160 50 160 72 V222 Q160 236 146 236 H54 Q40 236 40 222Z"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth={3}
              />

              {/* Divider line */}
              <line
                x1={40}
                y1={112}
                x2={160}
                y2={112}
                stroke="#1A1A1A"
                strokeWidth={2}
              />

              {/* Pocket */}
              <rect
                x={68}
                y={150}
                width={64}
                height={46}
                rx={10}
                fill="none"
                stroke="#1A1A1A"
                strokeWidth={2}
              />
            </svg>

            {/* Counter */}
            <p
              className="mt-3 text-center text-lg font-semibold"
              style={{ color: "#E85D04" }}
            >
              {mounted ? checkedCount : 0}/{total} {readyLabel}
            </p>
          </div>

          {/* ---- Items checklist ---- */}
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
                gap: 12,
              }}
            >
              {items.map((item, i) => {
                const isChecked = mounted && checked.has(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggle(i)}
                    className="rounded-xl border border-gray-200 bg-white p-3 flex items-center gap-3 text-left transition-colors hover:border-gray-300"
                    style={{ cursor: "pointer" }}
                  >
                    {/* Check circle */}
                    <span
                      className="flex shrink-0 items-center justify-center rounded-full"
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor: isChecked ? "#E85D04" : "transparent",
                        border: isChecked ? "2px solid #E85D04" : "2px solid #d1d5db",
                        transition: "background-color 0.15s, border-color 0.15s",
                      }}
                    >
                      {isChecked && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M3 7.5L5.5 10L11 4"
                            stroke="white"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>

                    {/* Label */}
                    <span
                      className="flex-1 text-sm font-medium"
                      style={{
                        color: "#1a1a1a",
                        textDecoration: isChecked ? "line-through" : "none",
                        opacity: isChecked ? 0.5 : 1,
                      }}
                    >
                      {item.label}
                    </span>

                    {/* Tag pill */}
                    {item.tag && (
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{
                          backgroundColor: item.tag === "clave" ? "#FFF3E0" : "#F3F4F6",
                          color: item.tag === "clave" ? "#E85D04" : "#6B7280",
                        }}
                      >
                        {item.tag === "clave" ? claveLabel : opcionalLabel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* WhatsApp button */}
            <button
              type="button"
              onClick={sendWhatsApp}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366", cursor: "pointer" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {sendLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
