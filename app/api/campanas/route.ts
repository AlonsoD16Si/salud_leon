import { NextResponse } from "next/server";
import campanas from "@/data/campanas.json";
import type { Campana } from "@/types/health";

export async function GET() {
  return NextResponse.json({ data: campanas as Campana[] });
}
