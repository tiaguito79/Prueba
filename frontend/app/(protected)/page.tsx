"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Eye,
  Search,
  Copy,
  Check,
  LayoutGrid,
  FileText,
  Calendar,
  Gift,
  Grid3X3,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Template data with categories and features
const templates = [
  {
    id: "clasica",
    name: "Plantilla Clásica",
    category: "Informativo",
    description: "Carousel → Video → Información",
    features: ["Carrusel", "Video", "Info x2"],
    color: "emerald",
    isActive: true,
    isNew: false,
  },
  {
    id: "eventos",
    name: "Plantilla Eventos",
    category: "Eventos",
    description: "Eventos destacados + calendario",
    features: ["Encabezado", "Eventos", "Calendario"],
    color: "cyan",
    isActive: false,
    isNew: true,
  },
  {
    id: "promocional",
    name: "Plantilla Promocional",
    category: "Promocional",
    description: "Carrusel grande + video destacado",
    features: ["Carrusel", "Video Dest.", "Aviso"],
    color: "amber",
    isActive: false,
    isNew: false,
  },
  {
    id: "minimal",
    name: "Plantilla Minimal",
    category: "Minimalista",
    description: "Solo información y anuncios",
    features: ["Título", "Info", "Anuncios"],
    color: "purple",
    isActive: false,
    isNew: false,
  },
  {
    id: "corporativa",
    name: "Plantilla Corporativa",
    category: "Informativo",
    description: "Logo + info institucional + video",
    features: ["Logo", "Info Corp.", "Video Inst.", "Contacto"],
    color: "pink",
    isActive: false,
    isNew: false,
  },
  {
    id: "directorio",
    name: "Plantilla Directorio",
    category: "Informativo",
    description: "Directorio + mapa de instalaciones",
    features: ["Header", "Mapa/Plano", "Directorio"],
    color: "blue",
    isActive: false,
    isNew: false,
  },
]

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  "Todas las Plantillas": <LayoutGrid className="w-4 h-4" />,
  Informativo: <FileText className="w-4 h-4" />,
  Eventos: <Calendar className="w-4 h-4" />,
  Promocional: <Gift className="w-4 h-4" />,
  Minimalista: <Grid3X3 className="w-4 h-4" />,
}

// Color mappings for template previews
const colorClasses: Record<string, { bg: string; border: string; accent: string }> = {
  emerald: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500",
    accent: "bg-emerald-500",
  },
  cyan: {
    bg: "bg-cyan-500/20",
    border: "border-cyan-500",
    accent: "bg-cyan-500",
  },
  amber: {
    bg: "bg-amber-500/20",
    border: "border-amber-500",
    accent: "bg-amber-500",
  },
  purple: {
    bg: "bg-purple-500/20",
    border: "border-purple-500",
    accent: "bg-purple-500",
  },
  pink: {
    bg: "bg-pink-500/20",
    border: "border-pink-500",
    accent: "bg-pink-500",
  },
  blue: {
    bg: "bg-blue-500/20",
    border: "border-blue-500",
    accent: "bg-blue-500",
  },
}

// Template preview component
function TemplatePreview({ color, size = "large" }: { color: string; size?: "large" | "small" }) {
  const colors = colorClasses[color] || colorClasses.emerald
  const isSmall = size === "small"

  return (
    <div
      className={cn(
        "bg-slate-900 rounded-lg border border-slate-700 p-2 relative",
        isSmall ? "w-16 h-20" : "w-32 h-40"
      )}
    >
      {/* Header bar */}
      <div className={cn("bg-slate-700 rounded mb-1", isSmall ? "h-1" : "h-2")} />

      {/* Main content area */}
      <div className={cn(colors.bg, "rounded mb-1", isSmall ? "h-6" : "h-12")} />

      {/* Video section */}
      <div className={cn("bg-slate-800 rounded mb-1 flex items-center justify-center", isSmall ? "h-4" : "h-8")}>
        <div className={cn(colors.accent, "rounded-full", isSmall ? "w-2 h-2" : "w-4 h-4")} />
      </div>

      {/* Info sections */}
      <div className={cn("flex gap-1", isSmall ? "" : "")}>
        <div className={cn(colors.bg, "rounded flex-1", isSmall ? "h-3" : "h-6")} />
        <div className={cn(colors.bg, "rounded flex-1", isSmall ? "h-3" : "h-6")} />
      </div>

      {/* Labels */}
      {!isSmall && (
        <>
          <div className="absolute top-8 right-2 bg-slate-800 text-[6px] text-slate-400 px-1 rounded">
            CARRUSEL
          </div>
          <div className="absolute top-20 right-2 bg-slate-800 text-[6px] text-slate-400 px-1 rounded">
            VIDEO
          </div>
          <div className="absolute bottom-4 right-2 bg-slate-800 text-[6px] text-slate-400 px-1 rounded">
            INFO X2
          </div>
        </>
      )}
    </div>
  )
}

// Category badge colors
const categoryBadgeColors: Record<string, string> = {
  Informativo: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Eventos: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Promocional: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Minimalista: "bg-purple-500/20 text-purple-400 border-purple-500/30",
}

export default function TemplateEditorPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todas las Plantillas")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTemplateId, setActiveTemplateId] = useState("clasica")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("admin")
    window.location.href = "/login"
  }

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "Todas las Plantillas": templates.length,
    }
    templates.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1
    })
    return counts
  }, [])

  // Filter templates based on category and search
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory =
        selectedCategory === "Todas las Plantillas" || t.category === selectedCategory
      const matchesSearch =
        searchQuery === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const activeTemplate = templates.find((t) => t.id === activeTemplateId)

  const handleApplyTemplate = (templateId: string) => {
    setActiveTemplateId(templateId)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">TOTEM</h1>
              <p className="text-xs text-muted-foreground">Editor de Plantillas</p>
            </div>
          </Link>

          {/* Title */}
          <div className="ml-6 border-l border-border pl-6">
            <h2 className="text-sm font-medium text-foreground">
              Editor de Plantillas TOTEM{" "}
              <span className="text-muted-foreground font-normal">
                Seleccione una plantilla para cambiar el diseño del totem.
              </span>
            </h2>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            {templates.length} plantillas
          </span>

          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Eye className="w-4 h-4" />
            Vista Previa del Totem
          </Button>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-56 border-r border-border bg-card flex flex-col">
          {/* Categories */}
          <div className="p-4 flex-1">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Categorías
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Filtra por tipo de plantilla</p>
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
                      {category}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        selectedCategory === category
                          ? "bg-blue-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {categoryCounts[category] || 0}
                    </span>
                  </button>
                )
              )}
            </nav>
          </div>

          {/* Active Template Preview */}
          <div className="p-4 border-t border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Plantilla Activa
            </h3>
            {activeTemplate && (
              <Card className="p-3 bg-muted/30 border-border">
                <div className="flex gap-3">
                  <TemplatePreview color={activeTemplate.color} size="small" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {activeTemplate.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {activeTemplate.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activeTemplate.features.slice(0, 2).map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {activeTemplate.features.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        >
                          {activeTemplate.features[2]}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}
            <p className="text-xs text-blue-400 mt-3 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Aplicada en el totem
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Plantillas Disponibles</h2>
              <p className="text-sm text-muted-foreground">
                {filteredTemplates.length} resultados
                {selectedCategory !== "Todas las Plantillas" && ` en "${selectedCategory}"`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar plantilla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 bg-muted border-border"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Copy className="w-4 h-4" />
                Duplicar activa
              </Button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredTemplates.map((template) => {
              const isActive = template.id === activeTemplateId
              return (
                <Card
                  key={template.id}
                  className={cn(
                    "p-4 bg-card border-border transition-all",
                    isActive && "ring-2 ring-emerald-500 border-emerald-500"
                  )}
                >
                  {/* Badge */}
                  <div className="mb-3 h-6">
                    {isActive && (
                      <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
                        <Check className="w-3 h-3 mr-1" />
                        Activa
                      </Badge>
                    )}
                    {template.isNew && !isActive && (
                      <Badge className="bg-cyan-500 text-white hover:bg-cyan-600">Nuevo</Badge>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="flex justify-center mb-4">
                    <TemplatePreview color={template.color} />
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium text-foreground truncate">{template.name}</h3>
                      <Badge
                        variant="outline"
                        className={cn("text-xs shrink-0", categoryBadgeColors[template.category])}
                      >
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="text-xs bg-muted/50 text-muted-foreground border-border"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      {isActive ? (
                        <Button
                          variant="outline"
                          className="flex-1 gap-2 bg-muted text-muted-foreground"
                          disabled
                        >
                          <Check className="w-4 h-4" />
                          Aplicada
                        </Button>
                      ) : (
                        <Button
                          className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleApplyTemplate(template.id)}
                        >
                          Aplicar Plantilla
                        </Button>
                      )}
                      <Button variant="outline" size="icon" className="shrink-0">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
