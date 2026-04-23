"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getActiveSession } from "@/lib/session";
import { StatCounter } from "@/components/stat-counter";
import { Typewriter } from "@/components/typewriter";
import { ArrowRight, Map, Activity, Bell, FileText } from "lucide-react";
import type { Campana, ModuloAtencion, Noticia } from "@/types/health";

type Estadisticas = {
  totalVacunacion: number;
  campanasActivas: number;
  modulosActivos: number;
};

export default function Home() {
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [modulos, setModulos] = useState<ModuloAtencion[]>([]);
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [campanasRes, noticiasRes, modulosRes, statsRes] = await Promise.all([
        fetch("/api/campanas"),
        fetch("/api/noticias"),
        fetch("/api/modulos"),
        fetch("/api/estadisticas"),
      ]);

      const campanasJson = await campanasRes.json();
      const noticiasJson = await noticiasRes.json();
      const modulosJson = await modulosRes.json();
      const statsJson = await statsRes.json();

      setCampanas(campanasJson.data);
      setNoticias(noticiasJson.data);
      setModulos(modulosJson.data);
      setStats(statsJson.data);
    };

    void loadData();

    const syncSession = () => setHasSession(Boolean(getActiveSession()));
    syncSession();
    window.addEventListener("salud-session-updated", syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener("salud-session-updated", syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  return (
    <main className="relative flex-1 bg-slate-50">
      <section className="hero-gradient grain-overlay relative overflow-hidden border-b border-slate-200/50">
        <div className="blob -left-20 top-0 h-64 w-64 bg-emerald-300" />
        <div className="blob -right-20 bottom-0 h-72 w-72 bg-blue-300" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-28 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-800 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Salud Pública Municipal - MVP
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl md:text-6xl tracking-tight"
            >
              Plataforma Ciudadana de <span className="text-emerald-700">Salud para León</span>
            </motion.h1>
            
            <div className="mt-6 text-lg text-slate-600 h-16 md:h-8">
              <Typewriter
                phrases={[
                  "Informacion publica de salud en un solo lugar.",
                  "Expediente clínico digital en entorno simulado.",
                  "Experiencia clara, rápida y centrada en la ciudadanía.",
                ]}
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 items-center md:justify-start justify-center"
            >
              <Link
                href="/campanas"
                className="btn-primary w-full sm:w-auto px-6 py-3.5 text-base"
              >
                Ver campañas activas <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href={hasSession ? "/dashboard" : "/login"}
                className="btn-secondary w-full sm:w-auto px-6 py-3.5 text-base group"
              >
                {hasSession ? "Ir a mi expediente" : "Entrar al panel"}
              </Link>
            </motion.div>
            

          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="hidden lg:block flex-1 relative"
          >
            <div className="absolute inset-0 bg-slate-100 rounded-3xl transform rotate-3 scale-105 opacity-70 blur-xl"></div>
            <div className="glass-card rounded-3xl p-6 relative z-10 border border-white/80 shadow-2xl overflow-hidden bg-white/40">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-32 h-32" /></div>
              <div className="flex flex-col gap-4 relative z-20">
                <div className="h-4 w-1/3 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-32 w-full bg-slate-50 rounded-xl border border-slate-100 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-3 w-1/4 bg-emerald-200 rounded-full"></div>
                    <div className="h-6 w-6 rounded-full bg-emerald-100"></div>
                  </div>
                  <div className="space-y-2 mt-6">
                    <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                    <div className="h-2 w-4/5 bg-slate-200 rounded-full"></div>
                    <div className="h-2 w-3/4 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="h-20 bg-white rounded-xl border border-slate-100 shadow-sm p-3">
                    <div className="h-3 w-1/2 bg-blue-100 rounded-full mb-2"></div>
                    <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
                  </div>
                  <div className="h-20 bg-white rounded-xl border border-slate-100 shadow-sm p-3">
                    <div className="h-3 w-1/2 bg-amber-100 rounded-full mb-2"></div>
                    <div className="h-6 w-3/4 bg-slate-200 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-4 py-8 sm:grid-cols-3 sm:px-6">
        <StatCounter value={stats?.totalVacunacion ?? 0} label="Vacunaciones registradas (demo)" />
        <StatCounter value={stats?.campanasActivas ?? 0} label="Campañas activas" />
        <StatCounter value={stats?.modulosActivos ?? 0} label="Módulos de atención" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-emerald-600" />
              Campañas activas
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl">Programas con enfoque preventivo y cobertura local para todas las edades.</p>
          </div>
          <Link href="/campanas" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campanas.slice(0, 3).map((campana, index) => (
            <motion.article
              key={campana.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="surface-card p-6 flex flex-col h-full group"
            >
              <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
                <span className="rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {campana.categoria}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {campana.fechaInicio} - {campana.fechaFin}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{campana.nombre}</h3>
              <p className="mt-3 text-sm text-slate-600 flex-1 leading-relaxed">{campana.descripcion}</p>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="mb-2 flex justify-between text-xs font-medium text-slate-700">
                  <span>Avance de cobertura</span>
                  <span className="text-emerald-600">{campana.cobertura}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${campana.cobertura}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                    className="h-full rounded-full bg-emerald-500"
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 bg-slate-50 rounded-3xl my-8 border border-slate-100">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 flex justify-center items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Noticias de salud municipal
          </h2>
          <p className="mt-3 text-slate-600">Mantente informado con las últimas actualizaciones y recomendaciones para tu bienestar.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {noticias.slice(0, 3).map((noticia, i) => (
            <motion.article 
              key={noticia.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="surface-card bg-white p-6 group cursor-pointer flex flex-col"
            >
              <div className="mb-4 flex items-center justify-between text-xs">
                <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700 border border-blue-100">
                  {noticia.categoria}
                </span>
                <span className="text-slate-500 font-medium">{noticia.fecha}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{noticia.titulo}</h3>
              <p className="mt-3 text-sm text-slate-600 line-clamp-3 flex-1">{noticia.resumen}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Leer más <ArrowRight className="w-4 h-4" />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Map className="w-6 h-6 text-teal-600" />
              Módulos de atención
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl">Ubica los centros de salud disponibles y sus horarios de atención.</p>
          </div>
          <Link href="/modulos" className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors">
            Ver mapa interactivo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {modulos.slice(0, 4).map((modulo, index) => (
            <motion.article
              key={modulo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl border border-teal-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-teal-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
              
              <h3 className="text-lg font-bold text-slate-900 relative z-10">{modulo.nombre}</h3>
              <p className="mt-2 text-sm text-slate-600 relative z-10">{modulo.direccion}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100/60 relative z-10">
                <p className="text-xs text-slate-500 mb-1">Contacto y horario</p>
                <p className="text-sm font-medium text-slate-700">
                  {modulo.telefono}
                </p>
                <p className="text-sm font-medium text-slate-700">
                  {modulo.horario}
                </p>
              </div>
              
              <div className="mt-4 flex relative z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 border border-teal-100/50">
                  Zona {modulo.zona}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <footer className="mt-8 border-t border-slate-200 bg-slate-50/90">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600 sm:px-6">
          <p>Salud León - Prototipo MVP demostrativo de tecnología cívica en salud.</p>
          <p className="mt-1">No representa un sistema clínico oficial ni maneja información personal real.</p>
          <p className="mt-1 text-xs text-slate-500">
            Palabras clave: health León, health modules León, health campaigns Mexico.
          </p>
        </div>
      </footer>
    </main>
  );
}
