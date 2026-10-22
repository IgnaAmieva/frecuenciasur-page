"use client";

import { useState, useCallback } from "react";
import { Mountain, Clock, Waves, Snowflake, Eye, Sun, Map } from "lucide-react";
import { excursiones, type Excursion } from "@/data/excursiones";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/translations";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type See = "lagunas" | "glaciares" | "canal" | "nieve" | "esquiar";
type Exp = 1 | 2 | 3;
type Time = "short" | "long";

interface Answers {
  exp: Exp | null;
  time: Time | null;
  see: See | null;
}

const WA_NUMBER = "5492901489265";

/* ------------------------------------------------------------------ */
/*  Scoring helpers                                                    */
/* ------------------------------------------------------------------ */

const SEE_MAP: Record<See, string[]> = {
  lagunas: ["laguna-esmeralda", "laguna-cinco-hermanos"],
  glaciares: ["glaciar-martial", "glaciar-vinciguerra", "glaciar-ojo-del-albino"],
  canal: ["monte-susana", "glaciar-martial"],
  nieve: ["glaciar-ojo-del-albino", "glaciar-vinciguerra"],
  esquiar: ["esqui-de-travesia"],
};

function parseDurationHours(exc: Excursion): number {
  const raw = exc.duracion.es;
  const m = raw.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 99;
}

function difficultyLevel(exc: Excursion): "media" | "media-alta" | "alta" {
  const d = exc.dificultad.es.toLowerCase();
  if (d.includes("alta") && d.includes("media")) return "media-alta";
  if (d.includes("alta")) return "alta";
  return "media";
}

function score(answers: { exp: Exp; time: Time; see: See }): { best: Excursion; alt: Excursion } {
  // If user chose "esquiar", Esquí de Travesía is the primary result
  if (answers.see === "esquiar") {
    const esqui = excursiones.find((e) => e.slug === "esqui-de-travesia")!;
    // Alt: best non-ski excursion based on experience/time
    const others = excursiones.filter((e) => e.slug !== "esqui-de-travesia");
    others.sort((a, b) => {
      const order = { media: 1, "media-alta": 2, alta: 3 };
      const da = order[difficultyLevel(a)];
      const db = order[difficultyLevel(b)];
      if (answers.exp === 1) return da - db;
      if (answers.exp === 3) return db - da;
      return 0;
    });
    if (answers.time === "short") {
      const short = others.filter((e) => parseDurationHours(e) <= 5);
      if (short.length > 0) return { best: esqui, alt: short[0] };
    }
    return { best: esqui, alt: others[0] ?? excursiones[0] };
  }

  // For all other choices, exclude Esquí de Travesía
  const candidateSlugs = SEE_MAP[answers.see];
  let candidates = excursiones.filter(
    (e) => candidateSlugs.includes(e.slug) && e.slug !== "esqui-de-travesia"
  );

  // Time filter: short = <=5h
  if (answers.time === "short") {
    const filtered = candidates.filter((e) => parseDurationHours(e) <= 5);
    if (filtered.length > 0) candidates = filtered;
  }

  // Experience sort: 1 = prefer Media, 3 = prefer Alta
  candidates.sort((a, b) => {
    const order = { media: 1, "media-alta": 2, alta: 3 };
    const da = order[difficultyLevel(a)];
    const db = order[difficultyLevel(b)];
    if (answers.exp === 1) return da - db; // easiest first
    if (answers.exp === 3) return db - da; // hardest first
    return 0; // exp 2: any order
  });

  const best = candidates[0] ?? excursiones.find((e) => e.slug !== "esqui-de-travesia") ?? excursiones[0];
  // Alt: next candidate or next from full list (excluding ski)
  const alt =
    candidates[1] ??
    excursiones.find((e) => e.slug !== best.slug && e.slug !== "esqui-de-travesia") ??
    excursiones[0];

  return { best, alt };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Quiz() {
  const { lang } = useLang();
  const tr = t[lang];

  const [step, setStep] = useState(0); // 0,1,2 = questions; 3 = result
  const [answers, setAnswers] = useState<Answers>({
    exp: null,
    time: null,
    see: null,
  });

  const totalSteps = 3;
  const progress = step >= totalSteps ? 100 : ((step) / totalSteps) * 100;

  const pick = useCallback(
    (key: keyof Answers, value: Exp | Time | See) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setStep((s) => s + 1);
    },
    [],
  );

  const goBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const reset = useCallback(() => {
    setAnswers({ exp: null, time: null, see: null });
    setStep(0);
  }, []);

  const result =
    step >= totalSteps && answers.exp && answers.time && answers.see
      ? score(answers as { exp: Exp; time: Time; see: See })
      : null;

  const waUrl = result
    ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
        `${tr.quiz_wa_pre} ${result.best.nombre[lang]}. exp=${answers.exp}, time=${answers.time}, see=${answers.see}`,
      )}`
    : "#";

  return (
    <section
      id="quiz"
      className="py-16 md:py-24"
      style={{ background: "linear-gradient(180deg, #FFF1E7, #fff)" }}
    >
      <div
        className="max-w-[760px] mx-auto bg-white rounded-3xl shadow-md p-6 md:p-10"
        role="region"
        aria-live="polite"
        aria-label={tr.quiz_titulo}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {tr.quiz_titulo}
          </h2>
          <p className="text-gray-500 text-sm">{tr.quiz_subtitle}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#E85D04] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicator + back */}
        {step < totalSteps && (
          <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
            {step > 0 ? (
              <button
                onClick={goBack}
                className="hover:text-[#E85D04] transition-colors"
              >
                {tr.quiz_back}
              </button>
            ) : (
              <span />
            )}
            <span>
              {tr.quiz_step} {step + 1} {tr.quiz_of} {totalSteps}
            </span>
          </div>
        )}

        {/* ---- Q1: Experience ---- */}
        {step === 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {tr.quiz_q1}
            </h3>
            <div className="flex flex-col gap-3">
              <OptionBtn
                icon={<Sun size={18} />}
                label={tr.quiz_q1_a1}
                onClick={() => pick("exp", 1)}
              />
              <OptionBtn
                icon={<Mountain size={18} />}
                label={tr.quiz_q1_a2}
                onClick={() => pick("exp", 2)}
              />
              <OptionBtn
                icon={<Eye size={18} />}
                label={tr.quiz_q1_a3}
                onClick={() => pick("exp", 3)}
              />
            </div>
          </div>
        )}

        {/* ---- Q2: Time ---- */}
        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {tr.quiz_q2}
            </h3>
            <div className="flex flex-col gap-3">
              <OptionBtn
                icon={<Clock size={18} />}
                label={tr.quiz_q2_a1}
                onClick={() => pick("time", "short")}
              />
              <OptionBtn
                icon={<Sun size={18} />}
                label={tr.quiz_q2_a2}
                onClick={() => pick("time", "long")}
              />
            </div>
          </div>
        )}

        {/* ---- Q3: What to see ---- */}
        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {tr.quiz_q3}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <OptionBtn
                icon={<Waves size={18} />}
                label={tr.quiz_q3_a1}
                onClick={() => pick("see", "lagunas")}
              />
              <OptionBtn
                icon={<Mountain size={18} />}
                label={tr.quiz_q3_a2}
                onClick={() => pick("see", "glaciares")}
              />
              <OptionBtn
                icon={<Eye size={18} />}
                label={tr.quiz_q3_a3}
                onClick={() => pick("see", "canal")}
              />
              <OptionBtn
                icon={<Snowflake size={18} />}
                label={tr.quiz_q3_a4}
                onClick={() => pick("see", "nieve")}
              />
              <OptionBtn
                icon={<Mountain size={18} />}
                label={tr.quiz_q3_a5}
                onClick={() => pick("see", "esquiar")}
              />
            </div>
          </div>
        )}

        {/* ---- Result ---- */}
        {step >= totalSteps && result && (
          <div className="text-center">
            {/* Badge */}
            <span className="inline-block rounded-full bg-[#FFF1E7] text-[#E85D04] text-xs font-semibold px-4 py-1 mb-4 uppercase tracking-wide">
              {tr.quiz_result_label}
            </span>

            {/* Excursion name */}
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {result.best.nombre[lang]}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed max-w-lg mx-auto mb-5">
              {result.best.descripcionCorta[lang]}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-8">
              <span className="flex items-center gap-1.5">
                <Map size={16} className="text-[#E85D04]" />
                {result.best.distancia[lang]}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-[#E85D04]" />
                {result.best.duracion[lang]}
              </span>
            </div>

            {/* CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-[#E85D04] px-10 py-4 text-lg font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#d45303] mb-8"
            >
              {tr.reservar}
            </a>

            {/* Alternative */}
            <p className="text-sm text-gray-400 mb-1">{tr.quiz_also}</p>
            <p className="text-base font-medium text-gray-700 mb-6">
              {result.alt.nombre[lang]}
            </p>

            {/* Reset */}
            <button
              onClick={reset}
              className="text-sm text-[#E85D04] hover:underline transition-colors"
            >
              {tr.quiz_again}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Option button                                                      */
/* ------------------------------------------------------------------ */

function OptionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-gray-200 p-3 flex items-center gap-3 text-left transition-colors hover:border-[#E85D04] hover:bg-[#FFF1E7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2"
    >
      <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-[#FFF1E7] text-[#E85D04]">
        {icon}
      </span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
