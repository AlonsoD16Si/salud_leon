"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getActiveSession } from "@/lib/session";
import { Home, Calendar, MapPin, LogIn, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/campanas", label: "Campañas", icon: Calendar },
  { href: "/modulos", label: "Módulos", icon: MapPin },
];

export function NavBar() {
  const pathname = usePathname();
  const [hasSession, setHasSession] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const syncSession = () => setHasSession(Boolean(getActiveSession()));
    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("salud-session-updated", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("salud-session-updated", syncSession);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 w-full",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="group flex items-center gap-3 font-semibold text-slate-900">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-2xl border border-white/70 shadow-sm transition-transform group-hover:scale-105 group-hover:shadow-md">
            <Image
              src="/logo_salud_leon.png"
              alt="Logo Salud León"
              fill
              sizes="(max-width: 768px) 40px, 48px"
              priority
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="block text-lg font-bold tracking-tight transition-colors group-hover:text-emerald-700">
              Salud León
            </span>
            <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
              Plataforma Municipal
            </span>
          </div>
        </Link>

        <nav className="glass-card flex w-full items-center gap-1 overflow-x-auto rounded-full p-1.5 sm:w-auto shadow-sm border border-slate-200/50">
          {links.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-emerald-600 text-white shadow-md transform scale-100"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-4 h-4", active ? "text-emerald-100" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
          <Link
            href={hasSession ? "/dashboard" : "/login"}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              pathname === "/dashboard" || pathname === "/login"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
            )}
          >
            {hasSession ? (
              <>
                <LayoutDashboard className={cn("w-4 h-4", pathname === "/dashboard" ? "text-blue-100" : "text-slate-400")} />
                Mi expediente
              </>
            ) : (
              <>
                <LogIn className={cn("w-4 h-4", pathname === "/login" ? "text-blue-100" : "text-slate-400")} />
                Iniciar sesión
              </>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
