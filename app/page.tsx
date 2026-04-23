"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveSession } from "@/lib/session";
import { StatCounter } from "@/components/stat-counter";
import { Typewriter } from "@/components/typewriter";
import {
  ArrowRight,
  Map,
  Activity,
  Bell,
  FileText,
  Hospital,
  CalendarCheck2,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import type {
  Campana,
  ConfiguracionCitas,
  ModuloAtencion,
  Noticia,
} from "@/types/health";

type Estadisticas = {
  totalVacunacion: number;
  campanasActivas: number;
  modulosActivos: number;
};

type FormularioCitaPublica = {
  nombre: string;
  contacto: string;
  motivo: string;
};

export default function Home() {
  const router = useRouter();
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [modulos, setModulos] = useState<ModuloAtencion[]>([]);
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [citasConfig, setCitasConfig] = useState<ConfiguracionCitas | null>(
    null,
  );
  const [institucionSeleccionada, setInstitucionSeleccionada] =
    useState<string>("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>("");
  const [formularioCita, setFormularioCita] = useState<FormularioCitaPublica>({
    nombre: "",
    contacto: "",
    motivo: "",
  });
  const [mensajeCita, setMensajeCita] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const [campanasRes, noticiasRes, modulosRes, statsRes, citasConfigRes] =
        await Promise.all([
          fetch("/api/campanas"),
          fetch("/api/noticias"),
          fetch("/api/modulos"),
          fetch("/api/estadisticas"),
          fetch("/api/citas-config"),
        ]);

      const campanasJson = await campanasRes.json();
      const noticiasJson = await noticiasRes.json();
      const modulosJson = await modulosRes.json();
      const statsJson = await statsRes.json();
      const citasConfigJson = await citasConfigRes.json();

      setCampanas(campanasJson.data);
      setNoticias(noticiasJson.data);
      setModulos(modulosJson.data);
      setStats(statsJson.data);
      setCitasConfig(citasConfigJson.data);
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

  const instituciones = citasConfig?.instituciones ?? [];
  const institucionActiva =
    instituciones.find(
      (institucion) => institucion.id === institucionSeleccionada,
    ) ?? null;
  const serviciosDisponibles = institucionActiva?.servicios ?? [];

  const actualizarCampoFormulario = (
    campo: keyof FormularioCitaPublica,
    valor: string,
  ) => {
    setFormularioCita((estadoPrevio) => ({ ...estadoPrevio, [campo]: valor }));
  };

  const handleCitaPublica = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!institucionSeleccionada || !servicioSeleccionado) return;
    if (!formularioCita.nombre.trim() || !formularioCita.contacto.trim())
      return;

    const preRegistro = {
      institucion: institucionSeleccionada,
      servicio: servicioSeleccionado,
      ...formularioCita,
      createdAt: new Date().toISOString(),
    };
    window.localStorage.setItem(
      "salud_leon_pre_cita",
      JSON.stringify(preRegistro),
    );
    setMensajeCita(
      hasSession
        ? "Listo. Tu solicitud fue guardada y puedes continuar al dashboard de citas."
        : "Solicitud guardada. Continua con acceso o registro para elegir fecha y horario.",
    );
    router.push(hasSession ? "/dashboard" : "/login");
  };

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
              Plataforma Ciudadana de{" "}
              <span className="text-emerald-700">Salud para León</span>
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
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity className="w-32 h-32" />
              </div>
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 text-center md:text-left">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto md:mx-0 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800"
          >
            <CalendarCheck2 className="h-3.5 w-3.5" />
            Agenda de Citas Simulada
          </motion.span>
          <h2 className="text-3xl font-bold text-slate-900">
            Agenda tu cita en menos de 4 pasos
          </h2>
          <p className="text-slate-600">
            Selecciona institucion, servicio y contacto basico. Nunca pedimos
            CURP, NSS ni historial medico en esta etapa publica.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="surface-card p-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Hospital className="h-5 w-5 text-emerald-600" />
              Instituciones disponibles
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Referencias informativas para ayudarte a decidir donde agendar.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {instituciones.map((institucion) => (
                <button
                  key={institucion.id}
                  type="button"
                  onClick={() => {
                    setInstitucionSeleccionada(institucion.id);
                    setServicioSeleccionado("");
                    setMensajeCita("");
                  }}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    institucionSeleccionada === institucion.id
                      ? "border-emerald-400 bg-emerald-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl" aria-hidden="true">
                      {institucion.logo}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {institucion.tipo}
                    </span>
                  </div>
                  <p className="mt-3 font-semibold text-slate-900">
                    {institucion.nombre}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {institucion.descripcion}
                  </p>
                  <p className="mt-2 text-xs font-medium text-emerald-700">
                    {institucion.nota}
                  </p>
                </button>
              ))}
            </div>
          </article>

          <motion.article
            layout
            className="surface-card p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-blue-600" />
              Entrada rapida a cita
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Primero eliges institucion y servicio; despues solo pedimos nombre
              y un medio de contacto.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleCitaPublica}>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  1) Servicio
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {serviciosDisponibles.length > 0 ? (
                    serviciosDisponibles.map((servicio) => (
                      <button
                        key={servicio}
                        type="button"
                        onClick={() => {
                          setServicioSeleccionado(servicio);
                          setMensajeCita("");
                        }}
                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                          servicioSeleccionado === servicio
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {servicio}
                      </button>
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500 sm:col-span-2">
                      Selecciona una institucion para mostrar sus servicios.
                    </p>
                  )}
                </div>
              </div>

              {servicioSeleccionado ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      2) Nombre completo
                    </label>
                    <input
                      aria-label="Nombre completo"
                      value={formularioCita.nombre}
                      onChange={(event) =>
                        actualizarCampoFormulario("nombre", event.target.value)
                      }
                      className="input-modern"
                      placeholder="Ej. Maria Lopez"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      3) Email o telefono
                    </label>
                    <input
                      aria-label="Email o telefono"
                      value={formularioCita.contacto}
                      onChange={(event) =>
                        actualizarCampoFormulario(
                          "contacto",
                          event.target.value,
                        )
                      }
                      className="input-modern"
                      placeholder="correo@ejemplo.com o 4771234567"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Motivo (opcional)
                    </label>
                    <textarea
                      aria-label="Motivo de consulta"
                      value={formularioCita.motivo}
                      onChange={(event) =>
                        actualizarCampoFormulario("motivo", event.target.value)
                      }
                      className="input-modern min-h-[84px] resize-none"
                      placeholder="Ej. Revision general o seguimiento nutricional"
                    />
                  </div>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                  Elige un servicio para continuar con el formulario rapido.
                </p>
              )}

              {mensajeCita ? (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                  {mensajeCita}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!institucionSeleccionada || !servicioSeleccionado}
                className="btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {hasSession
                  ? "Continuar al dashboard de citas"
                  : "Continuar / Crear cuenta"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </form>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
              Tus datos se usan solo para simulacion local del MVP (sin
              backend).
            </div>
          </motion.article>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-4 py-8 sm:grid-cols-3 sm:px-6">
        <StatCounter
          value={stats?.totalVacunacion ?? 0}
          label="Vacunaciones registradas (demo)"
        />
        <StatCounter
          value={stats?.campanasActivas ?? 0}
          label="Campañas activas"
        />
        <StatCounter
          value={stats?.modulosActivos ?? 0}
          label="Módulos de atención"
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-emerald-600" />
              Campañas activas
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Programas con enfoque preventivo y cobertura local para todas las
              edades.
            </p>
          </div>
          <Link
            href="/campanas"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
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
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {campana.nombre}
              </h3>
              <p className="mt-3 text-sm text-slate-600 flex-1 leading-relaxed">
                {campana.descripcion}
              </p>

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
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
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
          <p className="mt-3 text-slate-600">
            Mantente informado con las últimas actualizaciones y recomendaciones
            para tu bienestar.
          </p>
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
                <span className="text-slate-500 font-medium">
                  {noticia.fecha}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {noticia.titulo}
              </h3>
              <p className="mt-3 text-sm text-slate-600 line-clamp-3 flex-1">
                {noticia.resumen}
              </p>
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
            <p className="mt-2 text-slate-600 max-w-2xl">
              Ubica los centros de salud disponibles y sus horarios de atención.
            </p>
          </div>
          <Link
            href="/modulos"
            className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
          >
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

              <h3 className="text-lg font-bold text-slate-900 relative z-10">
                {modulo.nombre}
              </h3>
              <p className="mt-2 text-sm text-slate-600 relative z-10">
                {modulo.direccion}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100/60 relative z-10">
                <p className="text-xs text-slate-500 mb-1">
                  Contacto y horario
                </p>
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
          <p>Salud León.</p>
        </div>
      </footer>
    </main>
  );
}
