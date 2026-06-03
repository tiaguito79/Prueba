export type TotemNamePresetItem = {
  id: string
  label: string
  prefix: string
  sedeId: string
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

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

export function buildSuggestedNames(
  presets: TotemNamePresetItem[],
  existingNames: string[],
  sedeId?: string
) {
  if (!sedeId) return []

  return presets
    .filter((preset) => preset.sedeId === sedeId)
    .map((preset) => ({
      ...preset,
      suggestedName: getNextTotemName(preset.prefix, existingNames),
    }))
}

export function isPresetNameForOtherSede(
  name: string,
  sedeId: string,
  presets: TotemNamePresetItem[]
) {
  const normalized = name.trim().toUpperCase()
  return presets.some(
    (preset) =>
      preset.sedeId !== sedeId &&
      normalized.startsWith(preset.prefix.toUpperCase())
  )
}
