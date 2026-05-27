"use client"

import { useState, useEffect, useMemo } from "react"
import { Monitor, MapPin, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface Totem {
  _id: string
  nombre: string
  campus_id: string
  plantilla: string
  estado: string
}

interface ApplyTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateId: string
  templateName: string
  onApplied?: () => void
}

export function ApplyTemplateDialog({
  open,
  onOpenChange,
  templateId,
  templateName,
  onApplied,
}: ApplyTemplateDialogProps) {
  const [totems, setTotems] = useState<Totem[]>([])
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!open) return
    setSelected(new Set())
    setProgress(0)
    setLoading(true)

    const token = localStorage.getItem("token")
    fetch("/api/totems", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTotems(data)
      })
      .catch(() => toast.error("Error al cargar totems."))
      .finally(() => setLoading(false))
  }, [open])

  const grouped = useMemo(() => {
    const map: Record<string, Totem[]> = {}
    totems.forEach((t) => {
      const sede = t.campus_id || "Sin sede"
      if (!map[sede]) map[sede] = []
      map[sede].push(t)
    })
    return map
  }, [totems])

  const sedes = Object.keys(grouped).sort()

  const toggleTotem = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSede = (sede: string) => {
    const sedeIds = grouped[sede].map((t) => t._id)
    const allSelected = sedeIds.every((id) => selected.has(id))
    setSelected((prev) => {
      const next = new Set(prev)
      sedeIds.forEach((id) => {
        if (allSelected) next.delete(id)
        else next.add(id)
      })
      return next
    })
  }

  const selectAll = () => {
    if (selected.size === totems.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(totems.map((t) => t._id)))
    }
  }

  const handleApply = async () => {
    if (selected.size === 0) {
      toast.error("Selecciona al menos un tótem.")
      return
    }

    setApplying(true)
    setProgress(0)
    const token = localStorage.getItem("token")
    const ids = Array.from(selected)
    let success = 0

    for (let i = 0; i < ids.length; i++) {
      try {
        const res = await fetch(`/api/totems/${ids[i]}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plantilla: templateId }),
        })
        if (res.ok) success++
      } catch {
        // continue with next
      }
      setProgress(Math.round(((i + 1) / ids.length) * 100))
    }

    setApplying(false)
    toast.success(`Plantilla aplicada a ${success} de ${ids.length} totems.`)
    onApplied?.()
    onOpenChange(false)
  }

  const alreadyUsingCount = totems.filter((t) => t.plantilla === templateId).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Aplicar Plantilla</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Selecciona los totems a los que quieres aplicar{" "}
            <span className="font-medium text-foreground">{templateName}</span>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Select all */}
            <div className="flex items-center justify-between">
              <button
                onClick={selectAll}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {selected.size === totems.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </button>
              <Badge variant="secondary" className="text-xs">
                {selected.size} seleccionados
              </Badge>
            </div>

            {/* Grouped by sede */}
            <div className="max-h-[320px] overflow-y-auto space-y-3 pr-1">
              {sedes.map((sede) => {
                const sedeItems = grouped[sede]
                const sedeIds = sedeItems.map((t) => t._id)
                const allChecked = sedeIds.every((id) => selected.has(id))
                const someChecked = sedeIds.some((id) => selected.has(id))

                return (
                  <div key={sede} className="space-y-1">
                    <div
                      className="flex items-center gap-2 py-1 cursor-pointer"
                      onClick={() => toggleSede(sede)}
                    >
                      <Checkbox
                        checked={allChecked ? true : someChecked ? "indeterminate" : false}
                        onCheckedChange={() => toggleSede(sede)}
                      />
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{sede}</span>
                      <Badge variant="outline" className="text-[10px] ml-auto">
                        {sedeItems.length} totems
                      </Badge>
                    </div>

                    <div className="ml-6 space-y-0.5">
                      {sedeItems.map((totem) => {
                        const isUsing = totem.plantilla === templateId
                        return (
                          <div
                            key={totem._id}
                            className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50 cursor-pointer"
                            onClick={() => toggleTotem(totem._id)}
                          >
                            <Checkbox
                              checked={selected.has(totem._id)}
                              onCheckedChange={() => toggleTotem(totem._id)}
                            />
                            <Monitor className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-sm text-foreground flex-1">{totem.nombre}</span>
                            {isUsing && (
                              <Badge className="text-[9px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                Ya aplicada
                              </Badge>
                            )}
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              totem.estado === "Activo"
                                ? "bg-emerald-500"
                                : totem.estado === "En Mantenimiento"
                                ? "bg-amber-500"
                                : "bg-slate-500"
                            }`} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {alreadyUsingCount > 0 && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                {alreadyUsingCount} totem{alreadyUsingCount > 1 ? "s" : ""} ya usa
                {alreadyUsingCount > 1 ? "n" : ""} esta plantilla
              </p>
            )}

            {/* Progress bar */}
            {applying && (
              <div className="space-y-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">{progress}%</p>
              </div>
            )}

            <Button
              onClick={handleApply}
              disabled={applying || selected.size === 0}
              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {applying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Aplicando...
                </>
              ) : (
                `Aplicar a ${selected.size} totem${selected.size !== 1 ? "s" : ""}`
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
