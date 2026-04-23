import { NextResponse } from "next/server";
import campanas from "@/data/campanas.json";
import modulos from "@/data/modulos.json";

export async function GET() {
  const totalVacunacion = 15320;
  const campanasActivas = campanas.length;
  const modulosActivos = modulos.length;

  return NextResponse.json({
    data: {
      totalVacunacion,
      campanasActivas,
      modulosActivos,
    },
  });
}
