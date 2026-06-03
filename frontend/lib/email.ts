import nodemailer from "nodemailer"

function normalizeEnvValue(value?: string) {
  if (!value) return ""
  return value.trim().replace(/^["']|["']$/g, "")
}

export function getEmailConfig() {
  const user = normalizeEnvValue(process.env.EMAIL_USER)
  const pass = normalizeEnvValue(process.env.EMAIL_PASS)

  if (!user || !pass) {
    return null
  }

  return { user, pass }
}

export function createMailTransporter() {
  const config = getEmailConfig()
  if (!config) {
    throw new Error("EMAIL_NOT_CONFIGURED")
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  })
}

export async function sendMail(options: {
  to: string
  subject: string
  html: string
}) {
  const config = getEmailConfig()
  if (!config) {
    throw new Error("EMAIL_NOT_CONFIGURED")
  }

  const transporter = createMailTransporter()
  await transporter.sendMail({
    from: `"TOTEM Management" <${config.user}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}

export function getFrontendUrl() {
  const raw = normalizeEnvValue(process.env.FRONTEND_URL)
  if (raw) return raw.replace(/\/$/, "")
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}
