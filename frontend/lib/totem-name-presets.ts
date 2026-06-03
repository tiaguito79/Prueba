export type TotemNamePreset = {
  id: string
  label: string
  prefix: string
  /** Id de sede: cochabamba | santa-cruz | la-paz */
  sedeId: string
}

export const TOTEM_NAME_PRESETS: TotemNamePreset[] = [
  {
    id: "campus-tiquipaya",
    label: "Campus Tiquipaya",
    prefix: "TOTEM CAMPUS TIQUIPAYA",
    sedeId: "cochabamba",
  },
  {
    id: "hospital-ayacucho",
    label: "Hospital Ayacucho",
    prefix: "TOTEM HOSPITAL AYACUCHO",
    sedeId: "cochabamba",
  },
  {
    id: "torre-america",
    label: "Torre América",
    prefix: "TOTEM TORRE AMERICA",
    sedeId: "la-paz",
  },
  {
    id: "centro-santa-cruz",
    label: "Centro Santa Cruz",
    prefix: "TOTEM CENTRO SANTA CRUZ",
    sedeId: "santa-cruz",
  },
  {
    id: "equipetrol",
    label: "Equipetrol",
    prefix: "TOTEM EQUIPETROL",
    sedeId: "santa-cruz",
  },
]

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Devuelve el siguiente nombre disponible, p. ej. "TOTEM CAMPUS TIQUIPAYA 03" */
export function getNextTotemName(prefix: string, existingNames: string[]) {
  const pattern = new RegExp(`^${escapeRegex(prefix)}\\s+(\\d+)$`, "i")
  let maxNum = 0

  for (const rawName of existingNames) {
    const match = rawName.trim().match(pattern)
    if (!match) continue
    const num = parseInt(match[1], 10)
    if (!Number.isNaN(num) && num > maxNum) {
      maxNum = num
    }
  }

  const next = maxNum + 1
  return `${prefix} ${String(next).padStart(2, "0")}`
}

export function getSuggestedNames(existingNames: string[], sedeId?: string) {
  if (!sedeId) return []

  return TOTEM_NAME_PRESETS.filter((preset) => preset.sedeId === sedeId).map(
    (preset) => ({
      ...preset,
      suggestedName: getNextTotemName(preset.prefix, existingNames),
    })
  )
}

export function isPresetNameForOtherSede(name: string, sedeId: string) {
  const normalized = name.trim().toUpperCase()
  return TOTEM_NAME_PRESETS.some(
    (preset) =>
      preset.sedeId !== sedeId &&
      normalized.startsWith(preset.prefix.toUpperCase())
  )
}
