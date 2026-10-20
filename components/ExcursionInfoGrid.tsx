"use client";

import { useState } from "react";
import {
  Mountain,
  Map,
  Clock,
  TrendingUp,
  Calendar,
  CloudSun,
  Backpack,
  Info,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

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
  const [openPanel, setOpenPanel] = useState<string | null>(null);

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
          <button
            onClick={() =>
              setOpenPanel(openPanel === "equip" ? null : "equip")
            }
            className="mb-3 flex h-[90px] w-[90px] items-center justify-center rounded-full bg-brand-orange transition-transform hover:scale-105"
            aria-expanded={openPanel === "equip"}
          >
            <Backpack className="h-8 w-8 text-white" />
          </button>
          <p className="text-sm font-bold text-brand-text">
            {locale === "en" ? "Equipment" : locale === "pt" ? "Equipamento" : "Equipamiento"}
          </p>
          <ChevronDown
            size={16}
            className={`mt-1 text-brand-text-secondary transition-transform ${
              openPanel === "equip" ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Info Adicional circle */}
        <div className="flex flex-col items-center text-center">
          <button
            onClick={() =>
              setOpenPanel(openPanel === "info" ? null : "info")
            }
            className="mb-3 flex h-[90px] w-[90px] items-center justify-center rounded-full bg-brand-orange transition-transform hover:scale-105"
            aria-expanded={openPanel === "info"}
          >
            <Info className="h-8 w-8 text-white" />
          </button>
          <p className="text-sm font-bold text-brand-text">
            {locale === "en" ? "Additional Info" : "Info Adicional"}
          </p>
          <ChevronDown
            size={16}
            className={`mt-1 text-brand-text-secondary transition-transform ${
              openPanel === "info" ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown panels */}
      <motion.div
        initial={false}
        animate={{
          height: openPanel ? "auto" : 0,
          opacity: openPanel ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="mt-6 rounded-xl bg-brand-text/90 p-6 text-sm leading-relaxed text-white">
          {openPanel === "equip" && equipamiento}
          {openPanel === "info" && infoAdicional}
        </div>
      </motion.div>
    </div>
  );
}
