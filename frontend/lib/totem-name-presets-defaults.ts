export const DEFAULT_TOTEM_NAME_PRESETS = [
  {
    label: "Campus Tiquipaya",
    prefix: "TOTEM CAMPUS TIQUIPAYA",
    sedeId: "cochabamba",
  },
  {
    label: "Hospital Ayacucho",
    prefix: "TOTEM HOSPITAL AYACUCHO",
    sedeId: "cochabamba",
  },
  {
    label: "Torre América",
    prefix: "TOTEM TORRE AMERICA",
    sedeId: "la-paz",
  },
  {
    label: "Centro Santa Cruz",
    prefix: "TOTEM CENTRO SANTA CRUZ",
    sedeId: "santa-cruz",
  },
  {
    label: "Equipetrol",
    prefix: "TOTEM EQUIPETROL",
    sedeId: "santa-cruz",
  },
] as const

export function normalizeTotemPrefix(value: string) {
  const trimmed = value.trim().replace(/\s+/g, " ").toUpperCase()
  if (!trimmed) return ""
  return trimmed.startsWith("TOTEM ") ? trimmed : `TOTEM ${trimmed}`
}
