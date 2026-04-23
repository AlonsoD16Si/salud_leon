"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { ConfiguracionCitas, DisponibilidadDia, UsuarioMock } from "@/types/health";
import { getAvatarColor, getInitials } from "@/lib/avatar";
import { getActiveSession, LOGOUT_NOTICE_KEY, SESSION_KEY } from "@/lib/session";
import { 
  LayoutDashboard, 
  History, 
  Activity, 
  FileText, 
  LogOut,
  Calendar,
  User,
  Droplets,
  HeartPulse,
  AlertCircle,
  Syringe,
  ChevronRight,
  CalendarDays,
  Clock3,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight as ChevronRightSmall
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "citas", label: "Citas", icon: CalendarDays },
  { id: "historial", label: "Historial", icon: History },
  { id: "laboratorios", label: "Laboratorios", icon: Activity },
  { id: "antecedentes", label: "Antecedentes", icon: FileText },
];

type EstadoDisponibilidad = Record<
  string,
  {
    disponible: string[];
    reservado: string[];
    no_disponible: string[];
  }
>;

type CitaProgramada = {
  id: string;
  fecha: string;
  hora: string;
  institucion: string;
  area: string;
  doctor: string;
  notas: string;
  estado: "Completada" | "Programada";
};

export default function DashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("resumen");
  const [patient] = useState<UsuarioMock | null>(() => getActiveSession());
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [logoutAnimating, setLogoutAnimating] = useState(false);
  const [configCitas, setConfigCitas] = useState<ConfiguracionCitas | null>(null);
  const [estadoDisponibilidad, setEstadoDisponibilidad] = useState<EstadoDisponibilidad>({});
  const [historialCitas, setHistorialCitas] = useState<CitaProgramada[]>([]);
  const [institucionCita, setInstitucionCita] = useState("");
  const [servicioCita, setServicioCita] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [slotSeleccionado, setSlotSeleccionado] = useState("");
  const [notasCita, setNotasCita] = useState("");
  const [mensajeCita, setMensajeCita] = useState("");
  const [mesVisible, setMesVisible] = useState(() => {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  });

  useEffect(() => {
    if (!patient) {
      router.replace("/login");
    }
  }, [patient, router]);

  useEffect(() => {
    const loadCitas = async () => {
      const response = await fetch("/api/citas-config");
      const json = await response.json();
      const config = json.data as ConfiguracionCitas;
      setConfigCitas(config);
      setEstadoDisponibilidad(mapearDisponibilidad(config.disponibilidad));
      setInstitucionCita(config.instituciones[0]?.id ?? "");
      setServicioCita(config.servicios[0] ?? "");
      setFechaSeleccionada(config.disponibilidad[0]?.fecha ?? "");

      if (!patient) return;
      const key = `salud_leon_citas_${patient.id}`;
      const citasGuardadas = window.localStorage.getItem(key);
      if (citasGuardadas) {
        setHistorialCitas(JSON.parse(citasGuardadas) as CitaProgramada[]);
        return;
      }
      setHistorialCitas(config.historial_demo as CitaProgramada[]);
    };

    void loadCitas();
  }, [patient]);

  useEffect(() => {
    if (!patient || historialCitas.length === 0) return;
    window.localStorage.setItem(
      `salud_leon_citas_${patient.id}`,
      JSON.stringify(historialCitas),
    );
  }, [historialCitas, patient]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buen día";
    if (hour < 19) return "¡Buena tarde";
    return "¡Buena noche";
  }, []);

  const fullName = patient?.nombre ?? "Paciente demo";
  const avatarStyle = useMemo(
    () => ({
      background: getAvatarColor(patient?.curp ?? "salud-leon"),
    }),
    [patient?.curp],
  );

  const institucionActiva = useMemo(
    () =>
      configCitas?.instituciones.find((item) => item.id === institucionCita) ?? null,
    [configCitas?.instituciones, institucionCita],
  );

  const serviciosInstitucion = institucionActiva?.servicios ?? configCitas?.servicios ?? [];

  const disponibilidadDiaSeleccionado = fechaSeleccionada
    ? estadoDisponibilidad[fechaSeleccionada]
    : undefined;

  const celdasCalendario = useMemo(() => crearCeldasCalendario(mesVisible), [mesVisible]);

  const etiquetaMes = useMemo(
    () =>
      mesVisible.toLocaleDateString("es-MX", {
        month: "long",
        year: "numeric",
      }),
    [mesVisible],
  );

  const crearCita = () => {
    if (!institucionActiva || !servicioCita || !fechaSeleccionada || !slotSeleccionado) {
      return;
    }

    const disponibilidad = estadoDisponibilidad[fechaSeleccionada];
    if (!disponibilidad?.disponible.includes(slotSeleccionado)) {
      setMensajeCita("El horario ya no esta disponible. Selecciona otro horario.");
      return;
    }

    const nuevaCita: CitaProgramada = {
      id: `apt-${Date.now()}`,
      fecha: fechaSeleccionada,
      hora: slotSeleccionado,
      institucion: institucionActiva.nombre,
      area: servicioCita,
      doctor: "Asignacion automatica (demo)",
      notas: notasCita.trim() || "Sin notas adicionales.",
      estado: "Programada",
    };

    setHistorialCitas((previo) => [nuevaCita, ...previo]);
    setEstadoDisponibilidad((previo) => ({
      ...previo,
      [fechaSeleccionada]: {
        ...previo[fechaSeleccionada],
        disponible: previo[fechaSeleccionada].disponible.filter(
          (slot) => slot !== slotSeleccionado,
        ),
        reservado: [...previo[fechaSeleccionada].reservado, slotSeleccionado],
      },
    }));
    setMensajeCita("Cita confirmada en entorno simulado.");
    setNotasCita("");
    setSlotSeleccionado("");
    setActiveSection("citas");
  };

  const handleLogout = () => {
    setConfirmLogout(false);
    setLogoutAnimating(true);
    window.setTimeout(() => {
      window.sessionStorage.removeItem(SESSION_KEY);
      window.sessionStorage.setItem(
        LOGOUT_NOTICE_KEY,
        "¡Hasta pronto! Tu sesión ha sido cerrada correctamente.",
      );
      window.dispatchEvent(new Event("salud-session-updated"));
      router.push("/login");
    }, 450);
  };

  if (!patient) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"></div>
          <p className="text-slate-600 font-medium">Cargando expediente seguro...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 bg-slate-50/50 relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
      
      <AnimatePresence>
        {logoutAnimating ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-white/80 backdrop-blur-md flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"></div>
              <p className="text-emerald-800 font-medium">Cerrando sesión de forma segura...</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 sm:py-8 relative z-10">
        <aside className="hidden w-64 shrink-0 md:flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-4 sticky top-24">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu Principal</p>
            <nav className="space-y-1.5">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                      isActive
                        ? "text-blue-700 bg-blue-50/80"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"
                      />
                    )}
                    <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                    {section.label}
                  </button>
                );
              })}
            </nav>
            
            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmLogout(true)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-5 h-5 text-rose-400" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        <section className="w-full max-w-4xl space-y-6">
          <header className="surface-card p-6 border-b-4 border-b-emerald-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-inner ring-4 ring-white"
                  style={avatarStyle}
                >
                  {getInitials(fullName)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl tracking-tight">
                    {greeting}, {fullName.split(' ')[0]}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                      <User className="w-3 h-3" /> CURP: {patient.curp}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Activity className="w-3 h-3" /> Paciente Activo
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmLogout(true)}
                className="md:hidden flex items-center justify-center gap-2 w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100 sm:w-auto"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          </header>

          <div className="md:hidden flex gap-2 overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-100 p-1.5 scrollbar-hide">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "relative flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                    activeSection === section.id ? "text-blue-700" : "text-slate-600"
                  )}
                >
                  {activeSection === section.id ? (
                    <motion.span
                      layoutId="active-mobile-tab"
                      className="absolute inset-0 rounded-xl bg-blue-50 border border-blue-100"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeSection === "resumen" && (
                <>
                  <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    <Card icon={Calendar} title="Edad" value={`${patient.edad} años`} color="blue" />
                    <Card icon={User} title="Sexo" value={patient.sexo} color="purple" />
                    <Card icon={Droplets} title="Sangre" value={patient.tipo_sangre} color="rose" />
                    <Card icon={HeartPulse} title="Última cita" value={patient.ultima_consulta} color="emerald" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <article className="surface-card p-6 flex flex-col h-full border-t-4 border-t-amber-400">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-bold text-slate-900">Atención Importante</h2>
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <p className="text-sm font-medium text-slate-500">Alergias Registradas</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {patient.alergias.map((alergia) => (
                              <span key={alergia} className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                                {alergia}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-100">
                          <p className="text-sm font-medium text-slate-500">Padecimientos Crónicos</p>
                          <ul className="mt-1 space-y-1">
                            {patient.antecedentes.padecimientos_cronicos.map((p) => (
                              <li key={p} className="text-sm text-slate-800 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </article>

                    <article className="surface-card p-6 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-4 justify-between">
                        <div className="flex items-center gap-2">
                          <History className="w-5 h-5 text-blue-500" />
                          <h2 className="text-lg font-bold text-slate-900">Última Consulta</h2>
                        </div>
                        <button onClick={() => setActiveSection("historial")} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center">
                          Ver todo <ChevronRight className="w-3 h-3 ml-0.5" />
                        </button>
                      </div>
                      {patient.historial_medico.slice(0, 1).map((record) => (
                        <div key={record.fecha} className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{record.fecha}</span>
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1"><User className="w-3 h-3"/> {record.medico}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 mt-2">{record.diagnostico}</p>
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{record.notas}</p>
                        </div>
                      ))}
                    </article>
                  </div>
                </>
              )}

              {activeSection === "citas" && (
                <div className="space-y-6">
                  <article className="surface-card p-6 border-l-4 border-l-emerald-500">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-emerald-600" />
                          Appointment Dashboard (Simulado)
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                          Agenda una cita en 3 pasos: institucion, fecha y horario.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                          <User className="h-3 w-3" /> CURP {patient.curp}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          NSS {patient.nss}
                        </span>
                      </div>
                    </div>
                  </article>

                  <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
                    <article className="surface-card p-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Institucion
                          </label>
                          <select
                            value={institucionCita}
                            onChange={(event) => {
                              const id = event.target.value;
                              const institucion = configCitas?.instituciones.find(
                                (item) => item.id === id,
                              );
                              setInstitucionCita(id);
                              setServicioCita(institucion?.servicios[0] ?? "");
                              setMensajeCita("");
                            }}
                            className="input-modern"
                          >
                            {(configCitas?.instituciones ?? []).map((institucion) => (
                              <option key={institucion.id} value={institucion.id}>
                                {institucion.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Servicio
                          </label>
                          <select
                            value={servicioCita}
                            onChange={(event) => {
                              setServicioCita(event.target.value);
                              setMensajeCita("");
                            }}
                            className="input-modern"
                          >
                            {serviciosInstitucion.map((servicio) => (
                              <option key={servicio} value={servicio}>
                                {servicio}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() =>
                              setMesVisible(
                                (previo) =>
                                  new Date(previo.getFullYear(), previo.getMonth() - 1, 1),
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <p className="text-sm font-semibold capitalize text-slate-800">
                            {etiquetaMes}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setMesVisible(
                                (previo) =>
                                  new Date(previo.getFullYear(), previo.getMonth() + 1, 1),
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100"
                          >
                            <ChevronRightSmall className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
                          {["L", "M", "M", "J", "V", "S", "D"].map((dia, idx) => (
                            <span key={`${dia}-${idx}`}>{dia}</span>
                          ))}
                        </div>

                        <div className="mt-2 grid grid-cols-7 gap-2">
                          {celdasCalendario.map((celda, index) => {
                            if (!celda) {
                              return (
                                <span
                                  key={`empty-${index}`}
                                  className="h-11 rounded-lg bg-transparent"
                                />
                              );
                            }
                            const disponibilidad = estadoDisponibilidad[celda.iso];
                            const disponibles = disponibilidad?.disponible.length ?? 0;
                            const isSelected = fechaSeleccionada === celda.iso;
                            return (
                              <button
                                key={celda.iso}
                                type="button"
                                onClick={() => {
                                  setFechaSeleccionada(celda.iso);
                                  setSlotSeleccionado("");
                                  setMensajeCita("");
                                }}
                                className={cn(
                                  "h-11 rounded-xl border text-sm font-semibold transition",
                                  isSelected
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                                  disponibles === 0 && "opacity-70",
                                )}
                              >
                                <span>{celda.dia}</span>
                                <span className="block text-[10px] font-medium text-slate-500">
                                  {disponibles > 0 ? `${disponibles} disp.` : "No disp."}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </article>

                    <article className="surface-card p-6">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-blue-600" />
                        Horarios para {fechaSeleccionada || "selecciona una fecha"}
                      </h3>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {(disponibilidadDiaSeleccionado?.disponible ?? []).map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setSlotSeleccionado(slot);
                              setMensajeCita("");
                            }}
                            className={cn(
                              "rounded-xl border px-3 py-2 text-sm font-medium transition",
                              slotSeleccionado === slot
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-emerald-200 bg-white text-emerald-700 hover:border-emerald-300",
                            )}
                          >
                            {slot}
                          </button>
                        ))}

                        {(disponibilidadDiaSeleccionado?.reservado ?? []).map((slot) => (
                          <span
                            key={slot}
                            className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm font-medium text-amber-700"
                          >
                            {slot} reservado
                          </span>
                        ))}

                        {(disponibilidadDiaSeleccionado?.no_disponible ?? []).map((slot) => (
                          <span
                            key={slot}
                            className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-center text-sm font-medium text-slate-500"
                          >
                            {slot} bloqueado
                          </span>
                        ))}
                      </div>

                      <div className="mt-5">
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                          Notas opcionales
                        </label>
                        <textarea
                          value={notasCita}
                          onChange={(event) => setNotasCita(event.target.value)}
                          className="input-modern min-h-[82px] resize-none"
                          placeholder="Ej. Llevar estudios previos"
                        />
                      </div>

                      {mensajeCita ? (
                        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                          {mensajeCita}
                        </p>
                      ) : null}

                      <button
                        type="button"
                        onClick={crearCita}
                        disabled={!fechaSeleccionada || !slotSeleccionado || !servicioCita}
                        className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Confirmar cita simulada
                      </button>

                      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                        <p className="font-semibold">Leyenda</p>
                        <p className="mt-1">Verde: disponible | Amarillo: reservado | Gris: no disponible</p>
                      </div>
                    </article>
                  </div>

                  <article className="surface-card p-6">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-indigo-600" />
                      Historial de citas
                    </h3>
                    <div className="mt-4 space-y-3">
                      {historialCitas.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                          No hay citas registradas aun.
                        </p>
                      ) : (
                        historialCitas.map((cita) => (
                          <div
                            key={cita.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4"
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {cita.institucion} - {cita.area}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {cita.fecha} a las {cita.hora} | {cita.doctor}
                                </p>
                              </div>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                                  cita.estado === "Programada"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200",
                                )}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {cita.estado}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">{cita.notas}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                </div>
              )}

              {activeSection === "antecedentes" && (
                <div className="space-y-6">
                  <article className="surface-card p-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                      <FileText className="w-6 h-6 text-indigo-500" />
                      Antecedentes Clínicos Completos
                    </h2>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100">
                          <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2 mb-3">
                            <AlertCircle className="w-4 h-4" /> Alergias
                          </h3>
                          <ul className="space-y-2">
                            {patient.alergias.map((item) => (
                              <li key={item} className="text-sm text-slate-700 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                          <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-3">
                            <HeartPulse className="w-4 h-4" /> Padecimientos Crónicos
                          </h3>
                          <ul className="space-y-2">
                            {patient.antecedentes.padecimientos_cronicos.map((item) => (
                              <li key={item} className="text-sm text-slate-700 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                          <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-3">
                            <Syringe className="w-4 h-4" /> Cirugías
                          </h3>
                          <ul className="space-y-2">
                            {patient.antecedentes.cirugias.map((item) => (
                              <li key={item} className="text-sm text-slate-700 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                          <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3">
                            <User className="w-4 h-4" /> Historial Familiar
                          </h3>
                          <ul className="space-y-2">
                            {patient.antecedentes.historial_familiar.map((item) => (
                              <li key={item} className="text-sm text-slate-700 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {activeSection === "historial" && (
                <article className="surface-card p-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                    <History className="w-6 h-6 text-blue-500" />
                    Línea de Tiempo Médica
                  </h2>
                  <div className="relative mt-4 space-y-6 pl-8 py-2">
                    <div className="absolute left-3.5 top-0 h-full w-[2px] rounded-full bg-slate-300" />
                    {patient.historial_medico.map((record, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={`${record.fecha}-${record.medico}`}
                        className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <div className="absolute left-[-27px] top-5 h-4 w-4 rounded-full bg-white border-4 border-blue-500 group-hover:scale-125 transition-transform" />
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                            <Calendar className="w-3 h-3 mr-1.5" /> {record.fecha}
                          </span>
                          <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                            <User className="w-4 h-4 text-slate-400" /> {record.medico} <span className="text-slate-300">|</span> <span className="text-blue-600">{record.especialidad}</span>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{record.diagnostico}</h3>
                        <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100/50 leading-relaxed">
                          {record.notas}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </article>
              )}

              {activeSection === "laboratorios" && (
                <article className="surface-card p-0 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-white">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-emerald-500" />
                      Resultados de Laboratorio
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Histórico de estudios realizados recientemente.</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50">
                        <tr className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
                          <th className="px-6 py-4">Estudio</th>
                          <th className="px-6 py-4">Fecha</th>
                          <th className="px-6 py-4">Resultado</th>
                          <th className="px-6 py-4 hidden sm:table-cell">Rango Normal</th>
                          <th className="px-6 py-4">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {patient.resultados_laboratorio.map((item, idx) => (
                          <motion.tr
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={`${item.nombre_estudio}-${item.fecha}`}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-medium text-slate-900">{item.nombre_estudio}</td>
                            <td className="px-6 py-4 text-slate-500">{item.fecha}</td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-slate-700">{item.resultado}</span>{" "}
                              <span className="text-xs text-slate-400">{item.unidad}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 hidden sm:table-cell">{item.rango_normal}</td>
                            <td className="px-6 py-4">{getLabStatus(item.estado)}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <AnimatePresence>
        {confirmLogout ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
          >
            <motion.article
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-rose-500"></div>
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600">
                <LogOut className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">¿Cerrar sesión?</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Tu sesión actual del expediente clínico se cerrará y volverás a la pantalla de acceso principal.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 shadow-sm shadow-rose-200 transition-colors"
                >
                  Sí, salir
                </button>
              </div>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function mapearDisponibilidad(disponibilidad: DisponibilidadDia[]): EstadoDisponibilidad {
  return disponibilidad.reduce<EstadoDisponibilidad>((acc, item) => {
    acc[item.fecha] = {
      disponible: [...item.disponible],
      reservado: [...item.reservado],
      no_disponible: [...item.no_disponible],
    };
    return acc;
  }, {});
}

function crearCeldasCalendario(mes: Date): Array<{ iso: string; dia: number } | null> {
  const anio = mes.getFullYear();
  const numeroMes = mes.getMonth();
  const primerDiaMes = new Date(anio, numeroMes, 1);
  const totalDias = new Date(anio, numeroMes + 1, 0).getDate();
  const offset = (primerDiaMes.getDay() + 6) % 7;

  const celdas: Array<{ iso: string; dia: number } | null> = [];
  for (let i = 0; i < offset; i += 1) celdas.push(null);

  for (let dia = 1; dia <= totalDias; dia += 1) {
    const fecha = new Date(anio, numeroMes, dia);
    const mesTexto = String(fecha.getMonth() + 1).padStart(2, "0");
    const diaTexto = String(fecha.getDate()).padStart(2, "0");
    celdas.push({
      iso: `${fecha.getFullYear()}-${mesTexto}-${diaTexto}`,
      dia,
    });
  }

  return celdas;
}

function getLabStatus(status: "Normal" | "Elevado" | "Bajo") {
  if (status === "Normal") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Normal
      </span>
    );
  }
  if (status === "Elevado") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-100">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Elevado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 border border-rose-100">
      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Bajo
    </span>
  );
}

function Card({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  color: "blue" | "emerald" | "rose" | "purple";
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };
  
  return (
    <article className="surface-card p-5 group flex flex-col justify-between hover:border-blue-200 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-xl border transition-transform group-hover:scale-110", colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
        <p className="mt-1 text-xl font-bold text-slate-900 truncate">{value}</p>
      </div>
    </article>
  );
}
