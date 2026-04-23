import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LeonBot } from "@/components/leonbot";
import { NavBar } from "@/components/nav-bar";
import { RouteTransition } from "@/components/route-transition";

const headingFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://saludleon.vercel.app"),
  title: {
    default: "Salud León | Plataforma de Salud Municipal",
    template: "%s | Salud León",
  },
  description:
    "Plataforma municipal de Salud León para consultar campañas, módulos de atención y un expediente clínico demostrativo con experiencia moderna y accesible.",
  keywords: [
    "health León",
    "salud León",
    "módulos de salud León",
    "campañas de salud México",
    "salud municipal Guanajuato",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Salud León | Plataforma de Salud Municipal",
    description:
      "Consulta campañas, módulos y experiencia demo de expediente digital para ciudadanía en León, Guanajuato.",
    type: "website",
    locale: "es_MX",
    siteName: "Salud León",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salud León | Plataforma de Salud Municipal",
    description:
      "Información municipal de salud, campañas activas y módulos de atención en León, Guanajuato.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#2E7D32",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Salud León",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://saludleon.vercel.app",
    areaServed: {
      "@type": "City",
      name: "León, Guanajuato, México",
    },
    sameAs: [],
    description:
      "Plataforma demostrativa de salud municipal para campañas, módulos de atención y expediente digital simulado.",
  };

  return (
    <html
      lang="es-MX"
      className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-slate-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <NavBar />
        <RouteTransition>{children}</RouteTransition>
        <LeonBot />
      </body>
    </html>
  );
}
