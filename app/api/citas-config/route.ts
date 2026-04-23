import { NextResponse } from "next/server";
import citasConfig from "@/data/citas-config.json";
import type { ConfiguracionCitas } from "@/types/health";

export async function GET() {
  return NextResponse.json({ data: citasConfig as ConfiguracionCitas });
}
