"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  LogIn,
  CheckCircle2,
} from "lucide-react";
import type { UsuarioMock } from "@/types/health";
import { LOGOUT_NOTICE_KEY, SESSION_KEY } from "@/lib/session";
import { cn } from "@/lib/utils";

const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9]{2}$/;
const nssRegex = /^[0-9]{11}$/;

export default function LoginPage() {
  const router = useRouter();
  const [curp, setCurp] = useState("");
  const [nss, setNss] = useState("");
  const [error, setError] = useState("");
  const [notice] = useState(() => {
    if (typeof window === "undefined") return "";
    const logoutNotice = window.sessionStorage.getItem(LOGOUT_NOTICE_KEY) ?? "";
    if (logoutNotice) {
      window.sessionStorage.removeItem(LOGOUT_NOTICE_KEY);
    }
    return logoutNotice;
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCurp = curp.toUpperCase().trim();
    const normalizedNss = nss.trim();

    if (!curpRegex.test(normalizedCurp)) {
      setError("Ingresa una CURP válida en formato oficial.");
      return;
    }

    if (!nssRegex.test(normalizedNss)) {
      setError("El NSS debe contener 11 dígitos.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/usuarios");
      const json = await response.json();
      const user = (json.data as UsuarioMock[]).find(
        (item) => item.curp === normalizedCurp && item.nss === normalizedNss,
      );

      if (!user) {
        setLoading(false);
        setError("CURP o NSS incorrectos. Verifica tus datos.");
        return;
      }

      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event("salud-session-updated"));
      router.push("/dashboard");
    } catch {
      setLoading(false);
      setError("Hubo un error de conexión.");
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-12 sm:px-6 relative">
      <div className="absolute inset-0 bg-slate-50/50 -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card mx-auto w-full max-w-md rounded-[2rem] p-8 sm:p-10 relative overflow-hidden shadow-2xl shadow-blue-900/5"
      >
        <div className="absolute top-0 left-0 h-2 w-full bg-blue-500"></div>

        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-inner border border-blue-100">
            <Lock className="w-8 h-8" />
          </div>
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 mb-3 shadow-sm">
            Acceso Simulado
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Expediente Clínico
          </h1>
        </div>

        <AnimatePresence>
          {notice ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-emerald-800 leading-relaxed">
                {notice}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1.5 text-sm font-bold text-slate-700">
              CURP
            </label>
            <div className="relative">

              <input
                aria-label="CURP"
                type="text"
                value={curp}
                onChange={(event) => setCurp(event.target.value)}
                maxLength={18}
                autoComplete="off"
                className={cn(
                  "input-modern pl-10 uppercase transition-all duration-300",
                  error && !curp
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                    : "",
                )}
                placeholder="RATA980725MGTMRN07"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-bold text-slate-700">
              Número de Seguro Social (NSS)
            </label>
            <div className="relative">
    
              <input
                aria-label="NSS"
                type="text"
                value={nss}
                onChange={(event) => setNss(event.target.value)}
                maxLength={11}
                autoComplete="off"
                className={cn(
                  "input-modern pl-10 transition-all duration-300",
                  error && !nss
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                    : "",
                )}
                placeholder="12345678901"
              />
            </div>
          </div>

          <AnimatePresence>
            {error ? (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100"
              >
                {error}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/40 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                Validando...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Entrar al dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-100 p-4 flex flex-col gap-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Datos demo sugeridos
          </p>
          <div className="flex justify-between items-center text-sm bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm">
            <span className="text-slate-500 font-medium">CURP</span>
            <span className="font-mono font-bold text-slate-800">
              RATA980725MGTMRN07
            </span>
          </div>
          <div className="flex justify-between items-center text-sm bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm">
            <span className="text-slate-500 font-medium">NSS</span>
            <span className="font-mono font-bold text-slate-800">
              12345678901
            </span>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
