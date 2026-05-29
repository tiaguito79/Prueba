import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { GridFSBucket } from "mongodb"
import connectDB from "@/lib/mongodb"
import { subirPdfAGridFS } from "@/lib/gridfs"
import { extractTextFromPdfBuffer, parseFaqText } from "@/lib/pdf-service"
import Totem from "@/models/Totem"
import Content from "@/models/Content"
import DocumentModel from "@/models/Document"
import Faq from "@/models/Faq"

export const runtime = "nodejs"
export const maxDuration = 60

async function subirArchivoAGridFS(file: File, nombre: string) {
  const db = mongoose.connection.db

  if (!db) {
    throw new Error("No hay conexión activa con MongoDB")
  }

  const bucket = new GridFSBucket(db, {
    bucketName: "uploads"
  })

  const buffer = Buffer.from(await file.arrayBuffer())

  return new Promise<any>((resolve, reject) => {
   const uploadStream = bucket.openUploadStream(file.name, {
  metadata: {
    nombre,
    contentType: file.type
  }
})

    uploadStream.end(buffer)

    uploadStream.on("finish", () => {
      resolve(uploadStream.id)
    })

    uploadStream.on("error", reject)
  })
}

export async function GET() {
  try {
    await connectDB()

    const totems = await Totem.find({})
      .populate("contenido.archivos.contentId")
      .sort({ createdAt: -1 })

    return NextResponse.json(totems)
  } catch (error) {
    console.error("Error GET:", error)
    return NextResponse.json(
      { error: "Error al obtener los tótems" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()

    const formData = await request.formData()

    const nombre = formData.get("nombre") as string
    const totem_id = formData.get("totem_id") as string
    const campus_id = formData.get("campus_id") as string
    const plantilla = formData.get("plantilla") as string
    const estado = formData.get("estado") as string
    const usuario = formData.get("usuario") as string
    const contraseña = formData.get("contraseña") as string
    const mostrarDesde = formData.get("mostrarDesde") as string
    const mostrarHasta = formData.get("mostrarHasta") as string

    const archivosConfig = [
      { key: "imagen1", slot: "Imagen Carrusel 1", tipo: "imagen" },
      { key: "imagen2", slot: "Imagen Carrusel 2", tipo: "imagen" },
      { key: "imagen3", slot: "Imagen Carrusel 3", tipo: "imagen" },
      { key: "imagen4", slot: "Imagen Carrusel 4", tipo: "imagen" },
      { key: "imagen5", slot: "Imagen Carrusel 5", tipo: "imagen" },
      { key: "video1", slot: "Video Principal 1", tipo: "video" },
      { key: "video2", slot: "Video Principal 2", tipo: "video" },
    ]

    const archivosGuardados = []

    for (const item of archivosConfig) {
      const file = formData.get(item.key) as File | null

      if (file && file.size > 0) {
        const fileId = await subirArchivoAGridFS(file, item.slot)

        const content = await Content.create({
          content_id: `CONTENT-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
          tipo: item.tipo,
          nombre: item.slot,
          fileId,
          url_contenido: `/api/contents/file/${fileId}`,
          descripcion: `${item.slot} del tótem ${nombre}`
        })

        archivosGuardados.push({
          slot: item.slot,
          tipo: item.tipo,
          contentId: content._id
        })
      }
    }

    let infoBloques = null
    const infoBloqueRaw = formData.get("info_bloques") as string | null
    if (infoBloqueRaw) {
      try { infoBloques = JSON.parse(infoBloqueRaw) } catch {}
    }

    const newTotem = await Totem.create({
      nombre,
      totem_id,
      campus_id,
      plantilla,
      estado,
      credenciales: {
        usuario,
        contraseña
      },
      contenido: {
        mostrarDesde: mostrarDesde ? new Date(mostrarDesde) : null,
        mostrarHasta: mostrarHasta ? new Date(mostrarHasta) : null,
        archivos: archivosGuardados
      },
      contenido_count: archivosGuardados.length,
      ...(infoBloques ? { info_bloques: infoBloques } : {}),
    })

    const pdfFile = formData.get("faqPdf") as File | null
    console.log("[POST totem] faqPdf recibido:", pdfFile ? `${pdfFile.name} (${pdfFile.size} bytes)` : "ninguno")

    if (pdfFile && pdfFile.size > 0) {
      try {
        const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())
        const pdfFileName = `${Date.now()}-${pdfFile.name}`

        console.log("[POST totem] Subiendo PDF a GridFS...")
        const pdfFileId = await subirPdfAGridFS(pdfBuffer, pdfFileName, pdfFile.type)
        console.log("[POST totem] PDF subido, fileId:", pdfFileId)

        console.log("[POST totem] Extrayendo texto del PDF...")
        const extractedText = await extractTextFromPdfBuffer(pdfBuffer)
        console.log("[POST totem] Texto extraído, longitud:", extractedText.length)

        const items = parseFaqText(extractedText)
        console.log("[POST totem] FAQ items parseados:", items.length)

        const document = await DocumentModel.create({
          name: pdfFile.name,
          type: "faq_pdf",
          fileId: pdfFileId,
          mimeType: pdfFile.type,
          extractedText,
        })
        console.log("[POST totem] Document creado:", document._id)

        const faq = await Faq.create({
          title: `FAQ - ${nombre}`,
          campusId: null,
          totemId: newTotem._id,
          documentId: document._id,
          pdfFileId,
          items,
          isActive: true,
        })
        console.log("[POST totem] FAQ creada:", faq._id, "con", items.length, "preguntas")
      } catch (pdfError) {
        console.error("[POST totem] ERROR procesando PDF:", pdfError)
      }
    }

    return NextResponse.json(newTotem, { status: 201 })
  } catch (error) {
    console.error("Error POST:", error)
    const message =
      error instanceof Error ? error.message : "Error al crear el tótem"
    const isDuplicate =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    return NextResponse.json(
      {
        error: isDuplicate
          ? "Ya existe un tótem con ese ID. Intenta de nuevo."
          : message,
      },
      { status: isDuplicate ? 409 : 500 }
    )
  }
}