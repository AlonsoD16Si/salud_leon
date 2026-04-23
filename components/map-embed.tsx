"use client";

import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type MapEmbedProps = {
  url: string;
  title: string;
};

export function MapEmbed({ url, title }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-200 h-[300px] sm:h-[350px]">
      <AnimatePresence>
        {!loaded ? (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600 mb-2"></div>
            <p className="text-sm font-medium text-emerald-800">Cargando mapa interactivo...</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Ubicación precisa
      </div>

      <iframe
        src={url}
        title={title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="h-full w-full opacity-90 transition-opacity duration-700 ease-in-out group-hover:opacity-100 filter contrast-[1.05] saturate-[1.1] sepia-[0.1]"
        referrerPolicy="no-referrer-when-downgrade"
      />
      
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between border-white/60 shadow-lg translate-y-2 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{title}</p>
              <p className="text-xs font-medium text-slate-500">Haz clic en el mapa para navegar</p>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <Navigation className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
