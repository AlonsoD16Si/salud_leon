import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso al Panel",
  description:
    "Acceso demostrativo al panel personal de Salud León para experiencia UX/UI de expediente simulado.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
