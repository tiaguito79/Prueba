import { createRequire } from "module"

const require = createRequire(import.meta.url)

export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  const { extractText } = require("unpdf")
  const result = await extractText(new Uint8Array(buffer), { mergePages: true })
  return typeof result.text === "string" ? result.text : (result.text as string[]).join("\n")
}

export function parseFaqText(text: string): { question: string; answer: string }[] {
  const normalized = text.replace(/\s+/g, " ").trim()

  const regex = /PREGUNTA:\s*(.*?)\s*RESPUESTA:\s*(.*?)(?=PREGUNTA:|$)/gi
  const items: { question: string; answer: string }[] = []
  let match

  while ((match = regex.exec(normalized)) !== null) {
    items.push({
      question: match[1].trim(),
      answer: match[2].trim(),
    })
  }

  return items
}
