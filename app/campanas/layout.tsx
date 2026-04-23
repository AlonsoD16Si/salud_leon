import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campañas de Salud en León",
  description:
    "Explora campañas de vacunación, prevención y bienestar activas en León, Guanajuato.",
  alternates: {
    canonical: "/campanas",
  },
  openGraph: {
    title: "Campañas de Salud en León | Salud León",
    description: "Iniciativas activas de salud pública para ciudadanía en León.",
    url: "/campanas",
    type: "website",
  },
};

export default function CampanasLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
