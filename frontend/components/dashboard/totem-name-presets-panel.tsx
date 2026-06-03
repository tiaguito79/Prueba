"use client"

import { useState } from "react"
import {
  Pencil,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  Settings2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { TotemNamePresetItem } from "@/lib/totem-name-presets"

type Suggestion = TotemNamePresetItem & { suggestedName: string }

type Props = {
  sedeId: string
  sedeName: string
  presets: TotemNamePresetItem[]
  suggestions: Suggestion[]
  selectedName: string
  onSelectName: (name: string) => void
  onPresetsChange: (presets: TotemNamePresetItem[]) => void
}

export function TotemNamePresetsPanel({
  sedeId,
  sedeName,
  presets,
  suggestions,
  selectedName,
  onSelectName,
  onPresetsChange,
}: Props) {
  const [manageOpen, setManageOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingPreset, setEditingPreset] = useState<TotemNamePresetItem | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [editPrefix, setEditPrefix] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [newPrefix, setNewPrefix] = useState("")
  const [saving, setSaving] = useState(false)

  const sedePresets = presets.filter((p) => p.sedeId === sedeId)

  const authHeaders = () => {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  const openEdit = (preset: TotemNamePresetItem) => {
    setEditingPreset(preset)
    setEditLabel(preset.label)
    setEditPrefix(preset.prefix)
    setEditOpen(true)
  }

  const saveEdit = async () => {
    if (!editingPreset || !editLabel.trim() || !editPrefix.trim()) {
      toast.error("Completa la etiqueta y el prefijo.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/totem-name-presets/${editingPreset.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ label: editLabel.trim(), prefix: editPrefix.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "No se pudo guardar.")
        return
      }

      onPresetsChange(
        presets.map((p) =>
          p.id === editingPreset.id ? { ...p, label: data.label, prefix: data.prefix } : p
        )
      )
      toast.success("Plantilla actualizada.")
      setEditOpen(false)
      setEditingPreset(null)
    } catch {
      toast.error("Error de conexión.")
    } finally {
      setSaving(false)
    }
  }

  const deletePreset = async (id: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/totem-name-presets/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || "No se pudo eliminar.")
        return
      }

      onPresetsChange(presets.filter((p) => p.id !== id))
      toast.success("Plantilla eliminada.")
    } catch {
      toast.error("Error de conexión.")
    } finally {
      setSaving(false)
    }
  }

  const addPreset = async () => {
    if (!newLabel.trim() || !newPrefix.trim()) {
      toast.error("Completa etiqueta y prefijo.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/totem-name-presets", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          label: newLabel.trim(),
          prefix: newPrefix.trim(),
          sedeId,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "No se pudo crear.")
        return
      }

      onPresetsChange([...presets, data])
      setNewLabel("")
      setNewPrefix("")
      toast.success("Plantilla agregada.")
    } catch {
      toast.error("Error de conexión.")
    } finally {
      setSaving(false)
    }
  }

  const numberFromSuggestion = (suggestedName: string) => {
    const match = suggestedName.match(/(\d+)\s*$/)
    return match ? match[1] : ""
  }

  return (
    <div className="space-y-2 pt-1">
      {suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((preset) => {
            const isSelected =
              selectedName.trim().toUpperCase() === preset.suggestedName.toUpperCase()
            const num = numberFromSuggestion(preset.suggestedName)
            return (
              <button
                key={preset.id}
                type="button"
                title={preset.suggestedName}
                onClick={() => onSelectName(preset.suggestedName)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors",
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
                    : "border-border bg-muted/40 text-foreground hover:border-muted-foreground/50"
                )}
              >
                <span className="font-medium">{preset.label}</span>
                {num && (
                  <span className="rounded bg-background/60 px-1 font-mono text-[10px] text-muted-foreground">
                    {num}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          Sin plantillas en {sedeName}. Abrí gestionar para agregar.
        </p>
      )}

      <Collapsible open={manageOpen} onOpenChange={setManageOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings2 className="h-3 w-3" />
            <span>Gestionar plantillas</span>
            <ChevronDown
              className={cn("h-3 w-3 transition-transform", manageOpen && "rotate-180")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="rounded-md border border-border/80 bg-muted/20 p-2 space-y-1.5">
            {sedePresets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center gap-1.5 rounded px-1 py-0.5 hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium leading-tight">{preset.label}</p>
                  <p className="truncate font-mono text-[10px] text-muted-foreground leading-tight">
                    {preset.prefix}
                  </p>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 shrink-0"
                  onClick={() => openEdit(preset)}
                  disabled={saving}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 shrink-0 text-red-400 hover:text-red-300"
                  onClick={() => deletePreset(preset.id)}
                  disabled={saving}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <div className="flex gap-1.5 pt-1 border-t border-border/60">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Etiqueta"
                className="h-7 flex-1 text-xs bg-background"
              />
              <Input
                value={newPrefix}
                onChange={(e) => setNewPrefix(e.target.value)}
                placeholder="TOTEM ..."
                className="h-7 flex-[1.4] font-mono text-[10px] bg-background"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-7 w-7 shrink-0"
                disabled={saving}
                onClick={addPreset}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base">Editar plantilla</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              placeholder="Etiqueta"
              className="h-9 bg-muted/50"
            />
            <Input
              value={editPrefix}
              onChange={(e) => setEditPrefix(e.target.value)}
              placeholder="TOTEM ..."
              className="h-9 bg-muted/50 font-mono text-xs"
            />
            <Button type="button" className="w-full" disabled={saving} onClick={saveEdit}>
              <Check className="mr-1 h-4 w-4" />
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
