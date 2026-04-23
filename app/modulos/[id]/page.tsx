import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import modulos from "@/data/modulos.json";
import { MapEmbed } from "@/components/map-embed";
import type { ModuloAtencion } from "@/types/health";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const modulo = (modulos as ModuloAtencion[]).find((item) => item.id === id);

  if (!modulo) {
    return {
      title: "Módulo no encontrado",
      description: "El módulo solicitado no existe dentro del catálogo demostrativo de Salud León.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${modulo.nombre} - Zona ${modulo.zona}`,
    description: `Información del módulo ${modulo.nombre}: dirección, horario y ubicación en mapa para atención municipal en León, Guanajuato.`,
    alternates: {
      canonical: `/modulos/${modulo.id}`,
    },
    openGraph: {
      title: `${modulo.nombre} | Salud León`,
      description: `Consulta ubicación y datos de contacto de ${modulo.nombre}.`,
      url: `/modulos/${modulo.id}`,
      type: "article",
    },
  };
}

export default async function ModuloDetallePage({ params }: Props) {
  const { id } = await params;
  const modulo = (modulos as ModuloAtencion[]).find((item) => item.id === id);

  if (!modulo) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/modulos" className="text-sm font-medium text-blue-700 hover:underline">
        ← Volver a módulos
      </Link>
      <section className="surface-card mt-4 rounded-3xl p-4 sm:p-5">
        <h1 className="text-2xl text-slate-900 sm:text-3xl">{modulo.nombre}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {modulo.colonia} | Zona {modulo.zona}
        </p>
        <div className="mt-4">
          <MapEmbed url={modulo.google_maps_embed_url} title={`Mapa detalle ${modulo.nombre}`} />
        </div>
        <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-800">Dirección</dt>
            <dd>{modulo.direccion}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">Teléfono</dt>
            <dd>{modulo.telefono}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">Horario</dt>
            <dd>{modulo.horario}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">Coordenadas</dt>
            <dd className="font-mono text-xs">
              {modulo.coordenadas_lat}, {modulo.coordenadas_lng}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
