"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Check,
  LayoutGrid,
  FileText,
  Calendar,
  Gift,
  Grid3X3,
  Monitor,
  Send,
  Settings2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Header } from "@/components/dashboard/header"
import { TemplateLivePreview } from "@/components/dashboard/template-live-preview"
import { ApplyTemplateDialog } from "@/components/dashboard/apply-template-dialog"

interface TemplateModule {
  id: string
  label: string
  enabled: boolean
}

interface Template {
  id: string
  name: string
  category: string
  description: string
  features: string[]
  color: string
  isNew: boolean
  modules: TemplateModule[]
}

const templates: Template[] = [
  {
    id: "clasica",
    name: "Plantilla Clásica",
    category: "Informativo",
    description: "Carousel → Video → Información",
    features: ["Carrusel", "Video", "Info x2"],
    color: "emerald",
    isNew: false,
    modules: [
      { id: "carrusel", label: "Carrusel de imágenes", enabled: true },
      { id: "video", label: "Video", enabled: true },
      { id: "info", label: "Bloques de información", enabled: true },
    ],
  },
  {
    id: "eventos",
    name: "Plantilla Eventos",
    category: "Eventos",
    description: "Eventos destacados + calendario",
    features: ["Encabezado", "Eventos", "Calendario"],
    color: "cyan",
    isNew: true,
    modules: [
      { id: "carrusel", label: "Carrusel de imágenes", enabled: true },
      { id: "eventos", label: "Agenda del día", enabled: true },
      { id: "video", label: "Video", enabled: true },
      { id: "calendario", label: "Calendario", enabled: true },
    ],
  },
  {
    id: "promocional",
    name: "Plantilla Promocional",
    category: "Promocional",
    description: "Carrusel grande + video destacado",
    features: ["Carrusel", "Video Dest.", "Aviso"],
    color: "amber",
    isNew: false,
    modules: [
      { id: "carrusel", label: "Carrusel / Banner", enabled: true },
      { id: "video", label: "Video destacado", enabled: true },
      { id: "info", label: "Información", enabled: true },
    ],
  },
  {
    id: "minimal",
    name: "Plantilla Minimal",
    category: "Minimalista",
    description: "Solo información y anuncios",
    features: ["Título", "Info", "Anuncios"],
    color: "purple",
    isNew: false,
    modules: [
      { id: "carrusel", label: "Carrusel de imágenes", enabled: true },
      { id: "info", label: "Información y agenda", enabled: true },
    ],
  },
  {
    id: "corporativa",
    name: "Plantilla Corporativa",
    category: "Informativo",
    description: "Logo + info institucional + video",
    features: ["Logo", "Info Corp.", "Video Inst.", "Contacto"],
    color: "pink",
    isNew: false,
    modules: [
      { id: "carrusel", label: "Carrusel institucional", enabled: true },
      { id: "video", label: "Videos", enabled: true },
      { id: "info", label: "Información", enabled: true },
      { id: "contacto", label: "Contacto", enabled: true },
    ],
  },
  {
    id: "directorio",
    name: "Plantilla Directorio",
    category: "Informativo",
    description: "Directorio + mapa de instalaciones",
    features: ["Header", "Mapa/Plano", "Directorio"],
    color: "blue",
    isNew: false,
    modules: [
      { id: "video", label: "Video / Mapa", enabled: true },
      { id: "info", label: "Directorio", enabled: true },
    ],
  },
]

const categoryIcons: Record<string, React.ReactNode> = {
  "Todas las Plantillas": <LayoutGrid className="w-4 h-4" />,
  Informativo: <FileText className="w-4 h-4" />,
  Eventos: <Calendar className="w-4 h-4" />,
  Promocional: <Gift className="w-4 h-4" />,
  Minimalista: <Grid3X3 className="w-4 h-4" />,
}

const colorClasses: Record<string, { bg: string; border: string; accent: string }> = {
  emerald: { bg: "bg-emerald-500/20", border: "border-emerald-500", accent: "bg-emerald-500" },
  cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500", accent: "bg-cyan-500" },
  amber: { bg: "bg-amber-500/20", border: "border-amber-500", accent: "bg-amber-500" },
  purple: { bg: "bg-purple-500/20", border: "border-purple-500", accent: "bg-purple-500" },
  pink: { bg: "bg-pink-500/20", border: "border-pink-500", accent: "bg-pink-500" },
  blue: { bg: "bg-blue-500/20", border: "border-blue-500", accent: "bg-blue-500" },
}

const categoryBadgeColors: Record<string, string> = {
  Informativo: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Eventos: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Promocional: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Minimalista: "bg-purple-500/20 text-purple-400 border-purple-500/30",
}

function TemplatePreview({ color }: { color: string }) {
  const colors = colorClasses[color] || colorClasses.emerald
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 p-2 relative w-28 h-36">
      <div className="bg-slate-700 rounded mb-1 h-1.5" />
      <div className={cn(colors.bg, "rounded mb-1 h-10")} />
      <div className="bg-slate-800 rounded mb-1 flex items-center justify-center h-7">
        <div className={cn(colors.accent, "rounded-full w-3.5 h-3.5")} />
      </div>
      <div className="flex gap-1">
        <div className={cn(colors.bg, "rounded flex-1 h-5")} />
        <div className={cn(colors.bg, "rounded flex-1 h-5")} />
      </div>
    </div>
  )
}

interface TotemInfo {
  _id: string
  nombre: string
  campus_id: string
  plantilla: string
  estado: string
}

export default function TemplateEditorPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todas las Plantillas")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplateId, setSelectedTemplateId] = useState("clasica")
  const [carouselSpeed, setCarouselSpeed] = useState(4)
  const [moduleOverrides, setModuleOverrides] = useState<Record<string, boolean>>({})
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [applyTemplateId, setApplyTemplateId] = useState("")
  const [applyTemplateName, setApplyTemplateName] = useState("")

  // Totem data for status display
  const [totems, setTotems] = useState<TotemInfo[]>([])
  const [totemsLoaded, setTotemsLoaded] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch("/api/totems", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setTotems(data) })
      .catch(() => {})
      .finally(() => setTotemsLoaded(true))
  }, [])

  const totemsByTemplate = useMemo(() => {
    const map: Record<string, TotemInfo[]> = {}
    totems.forEach((t) => {
      const key = t.plantilla || "unknown"
      if (!map[key]) map[key] = []
      map[key].push(t)
    })
    return map
  }, [totems])

  const refreshTotems = () => {
    const token = localStorage.getItem("token")
    fetch("/api/totems", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setTotems(data) })
      .catch(() => {})
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "Todas las Plantillas": templates.length }
    templates.forEach((t) => { counts[t.category] = (counts[t.category] || 0) + 1 })
    return counts
  }, [])

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory = selectedCategory === "Todas las Plantillas" || t.category === selectedCategory
      const matchesSearch = searchQuery === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id)
    setModuleOverrides({})
    setCarouselSpeed(4)
  }

  const handleOpenApply = (templateId: string, templateName: string) => {
    setApplyTemplateId(templateId)
    setApplyTemplateName(templateName)
    setApplyDialogOpen(true)
  }

  const toggleModule = (moduleId: string) => {
    setModuleOverrides((prev) => ({
      ...prev,
      [moduleId]: prev[moduleId] !== undefined ? !prev[moduleId] : false,
    }))
  }

  const enabledModules = useMemo(() => {
    if (!selectedTemplate) return {}
    const result: Record<string, boolean> = {}
    selectedTemplate.modules.forEach((m) => {
      result[m.id] = moduleOverrides[m.id] !== undefined ? moduleOverrides[m.id] : m.enabled
    })
    return result
  }, [selectedTemplate, moduleOverrides])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Categories */}
        <aside className="w-52 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Categorías
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Filtra por tipo</p>
            </div>

            <nav className="space-y-1">
              {["Todas las Plantillas", "Informativo", "Eventos", "Promocional", "Minimalista"].map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {categoryIcons[category]}
                      <span className="truncate">{category}</span>
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full shrink-0",
                      selectedCategory === category
                        ? "bg-blue-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {categoryCounts[category] || 0}
                    </span>
                  </button>
                )
              )}
            </nav>
          </div>
        </aside>

        {/* Center - Templates Grid */}
        <main className="flex-1 p-5 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Plantillas Disponibles</h2>
              <p className="text-sm text-muted-foreground">
                {filteredTemplates.length} resultados
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar plantilla..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-56 bg-muted border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const isSelected = template.id === selectedTemplateId
              const totemsUsing = totemsByTemplate[template.id] || []
              const activeCount = totemsUsing.filter((t) => t.estado === "Activo").length

              return (
                <Card
                  key={template.id}
                  className={cn(
                    "p-4 bg-card border-border transition-all cursor-pointer hover:border-blue-500/50",
                    isSelected && "ring-2 ring-blue-500 border-blue-500"
                  )}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div className="flex gap-4">
                    <TemplatePreview color={template.color} />

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-medium text-sm text-foreground truncate">{template.name}</h3>
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] shrink-0", categoryBadgeColors[template.category])}
                        >
                          {template.category}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2">{template.description}</p>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {template.features.map((f) => (
                          <Badge key={f} variant="outline" className="text-[10px] bg-muted/50 text-muted-foreground border-border">
                            {f}
                          </Badge>
                        ))}
                      </div>

                      {/* Totem status badges */}
                      {totemsLoaded && (
                        <div className="flex items-center gap-2 mt-auto">
                          {totemsUsing.length > 0 ? (
                            <>
                              <Badge variant="outline" className="text-[10px] gap-1">
                                <Monitor className="w-3 h-3" />
                                {totemsUsing.length} totem{totemsUsing.length > 1 ? "s" : ""}
                              </Badge>
                              {activeCount > 0 && (
                                <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  {activeCount} activo{activeCount > 1 ? "s" : ""}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Sin totems asignados</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          className="flex-1 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenApply(template.id, template.name)
                          }}
                        >
                          <Send className="w-3 h-3" />
                          Aplicar a Totems
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-500 text-white text-[10px]">
                        <Check className="w-3 h-3 mr-0.5" />
                        Seleccionada
                      </Badge>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </main>

        {/* Right Panel - Live Preview + Config */}
        <aside className="w-[340px] border-l border-border bg-card flex flex-col shrink-0 overflow-y-auto">
          {selectedTemplate ? (
            <>
              {/* Preview header */}
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground mb-0.5">
                  Vista Previa en Vivo
                </h3>
                <p className="text-xs text-muted-foreground">{selectedTemplate.name}</p>
              </div>

              {/* Live preview */}
              <div className="p-4 flex justify-center border-b border-border">
                <TemplateLivePreview
                  templateId={selectedTemplate.id}
                  templateName={selectedTemplate.name}
                  carouselSpeed={carouselSpeed}
                  enabledModules={enabledModules}
                />
              </div>

              {/* Module configuration */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Personalización
                  </h4>
                </div>

                <div className="space-y-3">
                  {selectedTemplate.modules.map((mod) => {
                    const isOn = enabledModules[mod.id] !== false
                    return (
                      <div key={mod.id} className="flex items-center justify-between">
                        <Label className="text-sm text-foreground cursor-pointer" htmlFor={`mod-${mod.id}`}>
                          {mod.label}
                        </Label>
                        <Switch
                          id={`mod-${mod.id}`}
                          checked={isOn}
                          onCheckedChange={() => toggleModule(mod.id)}
                        />
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-foreground">Velocidad carrusel</Label>
                    <span className="text-xs text-muted-foreground">{carouselSpeed}s</span>
                  </div>
                  <Slider
                    value={[carouselSpeed]}
                    onValueChange={([v]) => setCarouselSpeed(v)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Rápido</span>
                    <span>Lento</span>
                  </div>
                </div>
              </div>

              {/* Totems using this template */}
              {totemsLoaded && (
                <div className="p-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Totems con esta plantilla
                  </h4>

                  {(totemsByTemplate[selectedTemplate.id] || []).length === 0 ? (
                    <p className="text-xs text-muted-foreground">Ningún totem usa esta plantilla.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {(totemsByTemplate[selectedTemplate.id] || []).map((totem) => (
                        <div
                          key={totem._id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded bg-muted/30"
                        >
                          <span className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            totem.estado === "Activo" ? "bg-emerald-500" :
                            totem.estado === "En Mantenimiento" ? "bg-amber-500" : "bg-slate-500"
                          )} />
                          <Monitor className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="text-xs text-foreground flex-1 truncate">{totem.nombre}</span>
                          <span className="text-[10px] text-muted-foreground">{totem.campus_id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4 text-center">
              <div>
                <Monitor className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Selecciona una plantilla para ver la vista previa
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>

      <ApplyTemplateDialog
        open={applyDialogOpen}
        onOpenChange={setApplyDialogOpen}
        templateId={applyTemplateId}
        templateName={applyTemplateName}
        onApplied={refreshTotems}
      />
    </div>
  )
}
