import { NextResponse } from "next/server";
import modulos from "@/data/modulos.json";
import type { ModuloAtencion } from "@/types/health";

export async function GET() {
  return NextResponse.json({ data: modulos as ModuloAtencion[] });
}
