import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    return NextResponse.json({ valid: false }, { status: 500 })
  }

  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    return NextResponse.json({ valid: true, admin: decoded })
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
}
