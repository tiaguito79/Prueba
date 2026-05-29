import { v2 as cloudinary } from "cloudinary"

export function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()
  const folder = process.env.CLOUDINARY_FOLDER?.trim() || "totem-uploads"

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Configura CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET"
    )
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })

  return { cloudName, apiKey, apiSecret, folder }
}

export function createUploadSignature(resourceType: "image" | "video" | "raw") {
  const { apiSecret, folder } = getCloudinaryConfig()
  const timestamp = Math.round(Date.now() / 1000)
  const params: Record<string, string | number> = {
    timestamp,
    folder,
  }

  if (resourceType === "raw") {
    params.resource_type = "raw"
  }

  const signature = cloudinary.utils.api_sign_request(params, apiSecret)

  return { signature, timestamp, folder, params }
}

export async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
) {
  if (!publicId) return
  getCloudinaryConfig()
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  })
}

export async function fetchRemoteBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`No se pudo descargar el archivo (${response.status})`)
  }
  return Buffer.from(await response.arrayBuffer())
}
