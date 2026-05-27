import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Ad from "@/models/Ad"

export const runtime = "nodejs"

type RouteContext = { params: Promise<{ totemId: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await connectDB()

    const { totemId } = await params

    const ads = await Ad.find({
      $or: [{ totemId }, { totemId: null }],
      isActive: true,
    }).sort({ createdAt: -1 })

    return NextResponse.json(ads)
  } catch (error) {
    console.error("Error obteniendo publicidad:", error)
    const msg =
      error instanceof Error ? error.message : "Error obteniendo publicidad"
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
