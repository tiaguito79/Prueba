import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Faq from "@/models/Faq"

export const runtime = "nodejs"

type RouteContext = { params: Promise<{ totemId: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await connectDB()

    const { totemId } = await params

    const faq = await Faq.findOne({
      $or: [{ totemId }, { totemId: null }],
      isActive: true,
    }).sort({ createdAt: -1 })

    if (!faq) {
      return NextResponse.json({ hasFaq: false, items: [] })
    }

    return NextResponse.json(faq)
  } catch (error) {
    console.error("Error obteniendo FAQ:", error)
    const msg = error instanceof Error ? error.message : "Error obteniendo FAQ"
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}
