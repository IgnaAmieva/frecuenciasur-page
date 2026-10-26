"use client";

import {
  Mountain,
  Map,
  Clock,
  TrendingUp,
  Calendar,
  CloudSun,
  Backpack,
  Info,
} from "lucide-react";

import { t } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mountain,
  Map,
  Clock,
  TrendingUp,
  Calendar,
  CloudSun,
  Backpack,
  Info,
};

interface InfoItem {
  icon: string;
  label: string;
  value: string;
}

interface Props {
  items: InfoItem[];
  equipamiento: string;
  infoAdicional: string;
  locale?: string;
}

export default function ExcursionInfoGrid({
  items,
  equipamiento,
  infoAdicional,
  locale,
}: Props) {
  const tr = t[(locale as Locale) ?? "es"];

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((item) => {
          const Icon = iconMap[item.icon] ?? Mountain;
          return (
            <div key={item.label} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-[90px] w-[90px] items-center justify-center rounded-full bg-brand-orange">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm font-bold text-brand-text">{item.label}</p>
              <p className="mt-0.5 text-xs text-brand-text-secondary">
                {item.value}
              </p>
            </div>
          );
        })}

        {/* Equipamiento circle */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-[90px] w-[90px] items-center justify-center rounded-full bg-brand-orange">
            <Backpack className="h-8 w-8 text-white" />
          </div>
          <p className="text-sm font-bold text-brand-text">
            {tr.equipamiento}
          </p>
        </div>

        {/* Info Adicional circle */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-[90px] w-[90px] items-center justify-center rounded-full bg-brand-orange">
            <Info className="h-8 w-8 text-white" />
          </div>
          <p className="text-sm font-bold text-brand-text">
            {tr.info_adicional}
          </p>
        </div>
      </div>

      {/* Always-visible panels */}
      <div className="mt-6 space-y-4">
        <div className="rounded-xl bg-brand-text/90 p-6 text-sm leading-relaxed text-white">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-white/60">
            {tr.equipamiento}
          </p>
          {equipamiento}
        </div>
        <div className="rounded-xl bg-brand-text/90 p-6 text-sm leading-relaxed text-white">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-white/60">
            {tr.info_adicional}
          </p>
          {infoAdicional}
        </div>
      </div>
    </div>
  );
}
