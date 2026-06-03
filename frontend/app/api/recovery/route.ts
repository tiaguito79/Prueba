import { NextResponse } from "next/server"
import crypto from "crypto"
import connectDB from "@/lib/mongodb"
import Admin from "@/models/Admin"
import { getEmailConfig, getFrontendUrl, sendMail } from "@/lib/email"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!getEmailConfig()) {
    return NextResponse.json(
      {
        message:
          "El envío de correos no está configurado en el servidor. Contacta al administrador.",
      },
      { status: 503 }
    )
  }

  let body: { correo?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Datos inválidos." }, { status: 400 })
  }

  const { correo } = body

  if (!correo || !correo.trim()) {
    return NextResponse.json({ message: "El correo es requerido." }, { status: 400 })
  }

  const genericMessage =
    "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."

  try {
    await connectDB()

    const admin = await Admin.findOne({
      correo_electronico: correo.trim().toLowerCase(),
    })

    if (!admin) {
      return NextResponse.json({ message: genericMessage })
    }

    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")

    admin.resetPasswordToken = hashedToken
    admin.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000)
    await admin.save()

    const resetLink = `${getFrontendUrl()}/reset-password/${rawToken}`

    await sendMail({
      to: admin.correo_electronico,
      subject: "Restablecimiento de contraseña — TOTEM",
      html: `
        <div style="font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 30px; border-radius: 12px; max-width: 520px; margin: 0 auto;">
          <h2 style="text-align: center;">Panel de Administración TOTEM</h2>
          <p>Hola, <strong>${admin.nombre}</strong>.</p>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente botón. El enlace vence en 15 minutos.</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetLink}" style="background: #4f7cff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Restablecer contraseña
            </a>
          </div>
          <p style="font-size: 12px; color: #9ca3af;">Si no solicitaste este cambio, ignora este correo.</p>
        </div>
      `,
    })

    return NextResponse.json({ message: genericMessage })
  } catch (error) {
    console.error("Error en recuperación:", error)

    const err = error as { code?: string; message?: string }
    if (err?.message === "EMAIL_NOT_CONFIGURED") {
      return NextResponse.json(
        { message: "El envío de correos no está configurado en el servidor." },
        { status: 503 }
      )
    }

    if (err?.code === "EAUTH" || err?.code === "ESOCKET") {
      return NextResponse.json(
        {
          message:
            "No se pudo enviar el correo. Verifica EMAIL_USER y EMAIL_PASS (contraseña de aplicación de Gmail) en Vercel.",
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { message: "Error al procesar la solicitud. Intenta más tarde." },
      { status: 500 }
    )
  }
}
