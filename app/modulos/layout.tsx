import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Módulos de Salud en León",
  description:
    "Consulta ubicación, contacto y horarios de módulos de atención de salud municipal en León, Guanajuato.",
  alternates: {
    canonical: "/modulos",
  },
  openGraph: {
    title: "Módulos de Salud en León | Salud León",
    description: "Ubica módulos de atención por zona y consulta su información principal.",
    url: "/modulos",
    type: "website",
  },
};

export default function ModulosLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
