import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard de Expediente",
  description:
    "Panel demostrativo de expediente clínico digital simulado para usuarios de Salud León.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
