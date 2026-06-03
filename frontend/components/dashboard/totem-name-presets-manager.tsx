"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { TotemNamePresetItem } from "@/lib/totem-name-presets"

type Props = {
  sedeId: string
  sedeName: string
  presets: TotemNamePresetItem[]
  onPresetsChange: (presets: TotemNamePresetItem[]) => void
}

export function TotemNamePresetsManager({
  sedeId,
  sedeName,
  presets,
  onPresetsChange,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
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

  const startEdit = (preset: TotemNamePresetItem) => {
    setEditingId(preset.id)
    setEditLabel(preset.label)
    setEditPrefix(preset.prefix)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditLabel("")
    setEditPrefix("")
  }

  const saveEdit = async (id: string) => {
    if (!editLabel.trim() || !editPrefix.trim()) {
      toast.error("Completa la etiqueta y el prefijo.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/totem-name-presets/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ label: editLabel.trim(), prefix: editPrefix.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "No se pudo guardar la plantilla.")
        return
      }

      onPresetsChange(
        presets.map((p) => (p.id === id ? { ...p, label: data.label, prefix: data.prefix } : p))
      )
      toast.success("Plantilla actualizada.")
      cancelEdit()
    } catch {
      toast.error("Error de conexión al guardar.")
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
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data.error || "No se pudo eliminar la plantilla.")
        return
      }

      onPresetsChange(presets.filter((p) => p.id !== id))
      toast.success("Plantilla eliminada.")
      if (editingId === id) cancelEdit()
    } catch {
      toast.error("Error de conexión al eliminar.")
    } finally {
      setSaving(false)
    }
  }

  const addPreset = async () => {
    if (!newLabel.trim() || !newPrefix.trim()) {
      toast.error("Completa la etiqueta y el prefijo del nuevo tótem.")
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
        toast.error(data.error || "No se pudo crear la plantilla.")
        return
      }

      onPresetsChange([...presets, data])
      setNewLabel("")
      setNewPrefix("")
      toast.success("Plantilla agregada.")
    } catch {
      toast.error("Error de conexión al crear.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
      <p className="text-xs font-medium text-foreground">
        Editar o agregar plantillas — {sedeName}
      </p>

      {sedePresets.length === 0 ? (
        <p className="text-xs text-muted-foreground">No hay plantillas para esta sede.</p>
      ) : (
        <div className="space-y-2">
          {sedePresets.map((preset) =>
            editingId === preset.id ? (
              <div key={preset.id} className="space-y-2 rounded-md border border-border p-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground">Etiqueta</Label>
                  <Input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="h-8 bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground">
                    Prefijo del nombre
                  </Label>
                  <Input
                    value={editPrefix}
                    onChange={(e) => setEditPrefix(e.target.value)}
                    placeholder="TOTEM CENTRO SANTA CRUZ"
                    className="h-8 bg-background font-mono text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 flex-1"
                    disabled={saving}
                    onClick={() => saveEdit(preset.id)}
                  >
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Guardar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={cancelEdit}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                key={preset.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border px-2 py-1.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{preset.label}</p>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">
                    {preset.prefix}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => startEdit(preset)}
                    disabled={saving}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-400 hover:text-red-300"
                    onClick={() => deletePreset(preset.id)}
                    disabled={saving}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <div className="space-y-2 border-t border-border pt-3">
        <p className="text-xs font-medium text-muted-foreground">Agregar nueva plantilla</p>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase text-muted-foreground">Etiqueta</Label>
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Ej: Ventura Mall"
            className="h-8 bg-background"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase text-muted-foreground">Prefijo del nombre</Label>
          <Input
            value={newPrefix}
            onChange={(e) => setNewPrefix(e.target.value)}
            placeholder="TOTEM VENTURA MALL"
            className="h-8 bg-background font-mono text-xs"
          />
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="w-full"
          disabled={saving}
          onClick={addPreset}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Agregar plantilla
        </Button>
      </div>
    </div>
  )
}
