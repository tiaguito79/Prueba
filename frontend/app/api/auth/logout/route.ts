import { NextResponse } from "next/server"
import { AUTH_COOKIE_NAME } from "@/lib/auth.constants"

export const runtime = "nodejs"

export async function POST() {
  const response = NextResponse.json({ message: "Sesión cerrada" })
  response.cookies.delete(AUTH_COOKIE_NAME)
  return response
}
