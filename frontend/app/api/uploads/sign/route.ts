import { NextResponse } from "next/server"
import { createUploadSignature, getCloudinaryConfig } from "@/lib/cloudinary-server"
import { AuthError, requireAuth } from "@/lib/auth.server"

export const runtime = "nodejs"

type ResourceType = "image" | "video" | "raw"

export async function POST(request: Request) {
  try {
    await requireAuth(request)

    const body = await request.json().catch(() => ({}))
    const resourceType = (body.resourceType || "image") as ResourceType

    if (!["image", "video", "raw"].includes(resourceType)) {
      return NextResponse.json({ error: "Tipo de recurso inválido" }, { status: 400 })
    }

    const { cloudName, apiKey } = getCloudinaryConfig()
    const { signature, timestamp, folder } = createUploadSignature(resourceType)

    return NextResponse.json({
      cloudName,
      apiKey,
      signature,
      timestamp,
      folder,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("Error firmando subida Cloudinary:", error)
    const message =
      error instanceof Error ? error.message : "Error al preparar la subida"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
