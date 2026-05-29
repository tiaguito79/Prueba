import { NextResponse } from "next/server"
import { AuthError, requireAuth } from "@/lib/auth.server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const admin = await requireAuth(request)
    return NextResponse.json({ valid: true, admin })
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 401
    return NextResponse.json({ valid: false }, { status })
  }
}
