import type { UsuarioMock } from "@/types/health";

export const SESSION_KEY = "salud_leon_session";
export const LOGOUT_NOTICE_KEY = "salud_leon_logout_notice";

export function getActiveSession(): UsuarioMock | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UsuarioMock;
  } catch {
    return null;
  }
}
