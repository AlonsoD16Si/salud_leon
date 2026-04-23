"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Filter, Megaphone, Target, ArrowRight } from "lucide-react";
import type { Campana } from "@/types/health";
import { cn } from "@/lib/utils";

const filters = ["Todas", "Vacunación", "Prevención", "Nutrición", "Salud Respiratoria"];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export default function CampanasPage() {
  const [campaigns, setCampaigns] = useState<Campana[]>([]);
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/campanas");
        const json = await response.json();
        setCampaigns(json.data);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "Todas") return campaigns;
    return campaigns.filter(
      (campaign) => normalizeText(campaign.categoria) === normalizeText(activeFilter),
    );
  }, [activeFilter, campaigns]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 relative">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm">
          <Megaphone className="w-3.5 h-3.5" />
          Prevención y bienestar
        </span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
      >
        Campañas de Salud
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 max-w-2xl text-lg text-slate-600 leading-relaxed"
      >
        Explora iniciativas activas de vacunación, prevención y bienestar impulsadas en León. Participa y cuida de ti y tu familia.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 mb-8"
      >
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">
          <Filter className="w-4 h-4" /> Filtros
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-white shadow-md shadow-emerald-200 transform scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-sm"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-filter-campanas"
                    className="absolute inset-0 rounded-full bg-emerald-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="surface-card p-6 h-[260px] animate-pulse">
              <div className="h-6 w-1/3 bg-slate-200 rounded-full mb-4"></div>
              <div className="h-8 w-3/4 bg-slate-200 rounded-md mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded-md"></div>
                <div className="h-4 w-full bg-slate-100 rounded-md"></div>
                <div className="h-4 w-4/5 bg-slate-100 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <section className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((campaign, index) => (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={campaign.id}
                className="surface-card p-6 group flex flex-col justify-between hover:border-emerald-200 transition-colors h-full"
              >
                <div>
                  <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
                    <span className="rounded-full bg-emerald-100/80 px-3 py-1.5 text-xs font-bold text-emerald-800 flex items-center gap-1.5 border border-emerald-200/50">
                      <Target className="w-3.5 h-3.5" /> {campaign.categoria}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-full">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {campaign.fechaInicio} - {campaign.fechaFin}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {campaign.nombre}
                  </h2>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {campaign.descripcion}
                  </p>
                </div>
                
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="mb-2 flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Avance de cobertura</span>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{campaign.cobertura}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${campaign.cobertura}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="absolute top-0 bottom-0 left-0 rounded-full bg-emerald-500"
                    />
                  </div>
                  
                  <button className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group/btn">
                    Conocer más detalles
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No hay campañas para esta categoría</h3>
              <p className="mt-2 text-slate-500">Intenta seleccionar otra categoría de filtros.</p>
            </motion.div>
          )}
        </section>
      )}
    </main>
  );
}
