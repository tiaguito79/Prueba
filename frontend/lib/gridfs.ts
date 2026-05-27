import mongoose from "mongoose"
import { GridFSBucket, ObjectId } from "mongodb"

type BucketName = "uploads" | "pdfs"

function getBucket(bucketName: BucketName = "uploads"): GridFSBucket {
  const db = mongoose.connection.db
  if (!db) {
    throw new Error("No hay conexión activa con MongoDB")
  }
  return new GridFSBucket(db, { bucketName })
}

export async function subirArchivoAGridFS(file: File, nombre: string) {
  const bucket = getBucket("uploads")
  const buffer = Buffer.from(await file.arrayBuffer())

  return new Promise<ObjectId>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: { nombre, contentType: file.type },
    })

    uploadStream.end(buffer)
    uploadStream.on("finish", () => resolve(uploadStream.id))
    uploadStream.on("error", reject)
  })
}

export async function subirPdfAGridFS(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ObjectId> {
  const bucket = getBucket("pdfs")

  return new Promise<ObjectId>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: mimeType,
    })

    uploadStream.end(buffer)
    uploadStream.on("finish", () => resolve(uploadStream.id))
    uploadStream.on("error", reject)
  })
}

export async function eliminarArchivoGridFS(
  fileId: ObjectId,
  bucketName: BucketName = "uploads"
) {
  try {
    const bucket = getBucket(bucketName)
    await bucket.delete(fileId)
  } catch {
    // El archivo puede no existir en GridFS
  }
}
