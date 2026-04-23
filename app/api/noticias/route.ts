import { NextResponse } from "next/server";
import noticias from "@/data/noticias.json";
import type { Noticia } from "@/types/health";

export async function GET() {
  return NextResponse.json({ data: noticias as Noticia[] });
}
