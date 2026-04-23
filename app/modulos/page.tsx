"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, MapPin, Filter, Navigation, Phone, Clock, Info } from "lucide-react";
import type { ModuloAtencion } from "@/types/health";
import { MapEmbed } from "@/components/map-embed";
import { cn } from "@/lib/utils";

const zones = ["Todas", "Centro", "Norte", "Sur", "Poniente"];

export default function ModulosPage() {
  const [modulos, setModulos] = useState<ModuloAtencion[]>([]);
  const [activeZone, setActiveZone] = useState("Todas");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/modulos");
        const json = await response.json();
        setModulos(json.data);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const filtered = useMemo(() => {
    if (activeZone === "Todas") return modulos;
    return modulos.filter((module) => module.zona === activeZone);
  }, [activeZone, modulos]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 relative">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-teal-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 shadow-sm">
          <Map className="w-3.5 h-3.5" />
          Atención territorial
        </span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
      >
        Módulos de Atención
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 max-w-2xl text-lg text-slate-600 leading-relaxed"
      >
        Consulta ubicaciones de atención municipal con dirección, teléfono, horario y mapa interactivo para llegar fácilmente.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 mb-8"
      >
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">
          <Filter className="w-4 h-4" /> Zonas
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {zones.map((zone) => {
            const isActive = activeZone === zone;
            return (
              <button
                key={zone}
                type="button"
                onClick={() => setActiveZone(zone)}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-white shadow-md shadow-teal-200 transform scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-sm"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-filter-modulos"
                    className="absolute inset-0 rounded-full bg-teal-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{zone}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="surface-card p-6 h-[400px] animate-pulse flex flex-col">
              <div className="h-6 w-1/3 bg-slate-200 rounded-full mb-2"></div>
              <div className="h-4 w-1/4 bg-slate-200 rounded-md mb-4"></div>
              <div className="flex-1 bg-slate-100 rounded-xl mb-4 w-full h-[250px]"></div>
              <div className="space-y-2 mt-auto">
                <div className="h-4 w-full bg-slate-100 rounded-md"></div>
                <div className="h-4 w-3/4 bg-slate-100 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <section className="mt-6 grid gap-8 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((module, index) => (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={module.id}
                className="surface-card border-teal-100/50 bg-white p-1 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="p-5 pb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{module.nombre}</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700 border border-teal-100">
                      <Navigation className="w-3 h-3" /> {module.zona}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-4 h-4" /> {module.colonia}
                  </p>
                  
                  <MapEmbed url={module.google_maps_embed_url} title={`Mapa ${module.nombre}`} />
                  
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> Teléfono
                      </p>
                      <p className="text-sm font-medium text-slate-700">{module.telefono}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Horario
                      </p>
                      <p className="text-sm font-medium text-slate-700">{module.horario}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Dirección
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">{module.direccion}</p>
                  </div>
                </div>
                
                <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                  <Link
                    href={`/modulos/${module.id}`}
                    className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-md hover:shadow-teal-200 focus:ring-4 focus:ring-teal-100"
                  >
                    <Info className="w-4 h-4" />
                    Ver detalle completo
                  </Link>
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
              <h3 className="text-lg font-bold text-slate-900">No hay módulos en esta zona</h3>
              <p className="mt-2 text-slate-500">Intenta seleccionar otra zona en los filtros.</p>
            </motion.div>
          )}
        </section>
      )}
    </main>
  );
}
