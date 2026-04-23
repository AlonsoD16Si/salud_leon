import { NextResponse } from "next/server";
import usuarios from "@/data/usuarios.json";
import type { UsuarioMock } from "@/types/health";

export async function GET() {
  return NextResponse.json({ data: usuarios as UsuarioMock[] });
}
