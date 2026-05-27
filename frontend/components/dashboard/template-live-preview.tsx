"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Monitor, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface TemplateLivePreviewProps {
  templateId: string
  templateName: string
  carouselSpeed?: number
  enabledModules?: Record<string, boolean>
}

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop",
]

export function TemplateLivePreview({
  templateId,
  templateName,
  carouselSpeed = 4,
  enabledModules,
}: TemplateLivePreviewProps) {
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    setCarouselIndex(0)
  }, [templateId])

  useEffect(() => {
    const speed = Math.max(1, carouselSpeed) * 1000
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % PLACEHOLDER_IMAGES.length)
    }, speed)
    return () => clearInterval(interval)
  }, [carouselSpeed])

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(interval)
  }, [])

  const goPrev = useCallback(() => {
    setCarouselIndex((prev) => (prev - 1 + PLACEHOLDER_IMAGES.length) % PLACEHOLDER_IMAGES.length)
  }, [])

  const goNext = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % PLACEHOLDER_IMAGES.length)
  }, [])

  const timeStr = time.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })
  const dateStr = time.toLocaleDateString("es-BO", { weekday: "long", day: "numeric", month: "long" })

  const isModuleEnabled = (mod: string) => {
    if (!enabledModules) return true
    return enabledModules[mod] !== false
  }

  const previewContent = (
    <div className="flex flex-col items-center">
      <div className="w-[260px] h-2.5 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-t-xl" />
      <div className="w-[260px] bg-zinc-800 px-[4px] pb-[4px]">
        <div className="w-full h-[420px] bg-slate-950 rounded-sm overflow-hidden flex flex-col relative">
          <div className="flex items-center justify-between px-2 py-1 bg-slate-900/80 border-b border-slate-800/50 shrink-0">
            <span className="text-[8px] text-slate-400 font-medium">{timeStr}</span>
            <div className="flex items-center gap-0.5">
              <Monitor className="w-2.5 h-2.5 text-cyan-400" />
              <span className="text-[8px] text-cyan-400 font-semibold">TOTEM</span>
            </div>
            <span className="text-[8px] text-slate-400 capitalize">{dateStr}</span>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {renderContent(templateId, PLACEHOLDER_IMAGES, carouselIndex, goPrev, goNext, isModuleEnabled)}
          </div>
        </div>
      </div>
      <div className="w-[260px] h-3 bg-gradient-to-b from-zinc-800 to-zinc-700 rounded-b-xl" />
      <div className="w-[90px] h-12 bg-gradient-to-b from-zinc-700 via-zinc-600 to-zinc-700 rounded-b-lg relative">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-zinc-500/50" />
      </div>
      <div className="w-[140px] h-2 bg-gradient-to-b from-zinc-600 to-zinc-700 rounded-full shadow-lg" />
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-3">
      {previewContent}

      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => setFullscreen(true)}
      >
        <Maximize2 className="w-3.5 h-3.5" />
        Pantalla completa
      </Button>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent
          showCloseButton
          className="max-w-[500px] w-full p-8 bg-slate-900/95 border-slate-700 flex items-center justify-center"
        >
          <DialogTitle className="sr-only">Preview de {templateName}</DialogTitle>
          <DialogDescription className="sr-only">Vista completa del tótem</DialogDescription>

          <div className="flex flex-col items-center">
            <div className="w-[340px] h-3 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-t-2xl" />
            <div className="w-[340px] bg-zinc-800 px-[6px] pb-[6px]">
              <div className="w-full h-[540px] bg-slate-950 rounded-sm overflow-hidden flex flex-col relative">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800/50 shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium">{timeStr}</span>
                  <div className="flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] text-cyan-400 font-semibold">TOTEM</span>
                  </div>
                  <span className="text-[10px] text-slate-400 capitalize">{dateStr}</span>
                </div>
                <div className="flex-1 overflow-hidden flex flex-col">
                  {renderContent(templateId, PLACEHOLDER_IMAGES, carouselIndex, goPrev, goNext, isModuleEnabled)}
                </div>
              </div>
            </div>
            <div className="w-[340px] h-4 bg-gradient-to-b from-zinc-800 to-zinc-700 rounded-b-2xl" />
            <div className="w-[120px] h-16 bg-gradient-to-b from-zinc-700 via-zinc-600 to-zinc-700 rounded-b-lg relative">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-zinc-500/50" />
            </div>
            <div className="w-[180px] h-3 bg-gradient-to-b from-zinc-600 to-zinc-700 rounded-full shadow-lg" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ======================== Shared sub-components ======================== */

function ImageCarousel({
  images,
  index,
  onPrev,
  onNext,
  height = "h-[160px]",
}: {
  images: string[]
  index: number
  onPrev: () => void
  onNext: () => void
  height?: string
}) {
  if (images.length === 0) {
    return (
      <div className={cn("bg-slate-800/50 flex items-center justify-center", height)}>
        <span className="text-slate-600 text-[9px]">Sin imágenes</span>
      </div>
    )
  }

  return (
    <div className={cn("relative group overflow-hidden", height)}>
      <img
        src={images[index % images.length]}
        alt=""
        className="w-full h-full object-cover transition-opacity duration-700"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
          <div className="absolute bottom-1.5 inset-x-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 h-1 rounded-full transition-all",
                  i === index % images.length ? "bg-cyan-400 w-2" : "bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-2 py-1.5">
      <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-0.5">{title}</p>
      <div className="text-[9px] text-slate-300 leading-relaxed">{children}</div>
    </div>
  )
}

function VideoPlaceholder({ height = "h-[100px]" }: { height?: string }) {
  return (
    <div className={cn("relative bg-slate-900 flex items-center justify-center", height)}>
      <div className="flex flex-col items-center gap-1">
        <Play className="w-5 h-5 text-slate-500" />
        <span className="text-[8px] text-slate-600">Video</span>
      </div>
      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
    </div>
  )
}

/* ======================== Template Layouts ======================== */

function renderContent(
  templateId: string,
  images: string[],
  carouselIndex: number,
  goPrev: () => void,
  goNext: () => void,
  isEnabled: (mod: string) => boolean
) {
  switch (templateId) {
    case "directorio":
      return (
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="px-2 py-3 bg-gradient-to-br from-blue-900/30 to-purple-900/20 flex flex-col items-center">
            <p className="text-slate-200 text-[10px] font-semibold mb-0.5">Directorio de Servicios</p>
            <p className="text-slate-400 text-[8px]">Ubicaciones y contactos</p>
          </div>
          {isEnabled("video") && <VideoPlaceholder height="h-[140px]" />}
          {isEnabled("info") && (
            <InfoBlock title="Directorio">
              <div className="space-y-0.5">
                <p><span className="text-pink-400">Piso 1</span> — Recepción</p>
                <p><span className="text-pink-400">Piso 2</span> — Administración</p>
                <p><span className="text-pink-400">Piso 3</span> — Servicios</p>
                <p><span className="text-pink-400">Piso 4</span> — Soporte Técnico</p>
              </div>
            </InfoBlock>
          )}
        </div>
      )

    case "promocional":
      return (
        <div className="flex flex-col flex-1 overflow-y-auto">
          {isEnabled("carrusel") && images[0] && (
            <div className="relative h-[170px]">
              <img src={images[carouselIndex % images.length]} alt="" className="w-full h-full object-cover transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-[10px] font-semibold drop-shadow-lg">Oferta Especial</p>
                <p className="text-slate-200 text-[8px] drop-shadow">Promoción por tiempo limitado</p>
              </div>
            </div>
          )}
          {isEnabled("video") && <VideoPlaceholder height="h-[90px]" />}
          {isEnabled("info") && (
            <InfoBlock title="Promoción">
              <p>Descubre beneficios exclusivos y tecnología de punta.</p>
            </InfoBlock>
          )}
        </div>
      )

    case "minimal":
      return (
        <div className="flex flex-col flex-1 overflow-y-auto">
          {isEnabled("carrusel") && (
            <ImageCarousel images={images} index={carouselIndex} onPrev={goPrev} onNext={goNext} height="h-[200px]" />
          )}
          {isEnabled("info") && (
            <>
              <InfoBlock title="Información">
                <p>Diseño minimalista centrado en contenido visual.</p>
              </InfoBlock>
              <InfoBlock title="Agenda semanal">
                <div className="space-y-0.5">
                  <p><span className="text-teal-400">Lun</span> — Reunión de equipo</p>
                  <p><span className="text-teal-400">Mié</span> — Revisión de proyectos</p>
                  <p><span className="text-teal-400">Vie</span> — Cierre semanal</p>
                </div>
              </InfoBlock>
            </>
          )}
        </div>
      )

    case "eventos":
      return (
        <div className="flex flex-col flex-1 overflow-y-auto">
          {isEnabled("carrusel") && (
            <ImageCarousel images={images} index={carouselIndex} onPrev={goPrev} onNext={goNext} height="h-[140px]" />
          )}
          {isEnabled("eventos") && (
            <InfoBlock title="Agenda del día">
              <div className="space-y-0.5">
                <p><span className="text-cyan-400">10:00</span> — Taller de participación</p>
                <p><span className="text-cyan-400">12:00</span> — Feria de emprendedores</p>
                <p><span className="text-cyan-400">15:00</span> — Charla informativa</p>
              </div>
            </InfoBlock>
          )}
          {isEnabled("video") && <VideoPlaceholder height="h-[80px]" />}
          {isEnabled("calendario") && (
            <InfoBlock title="Calendario">
              <p>Próximo evento: Seminario de Innovación — Viernes</p>
            </InfoBlock>
          )}
        </div>
      )

    case "corporativa":
      return (
        <div className="flex flex-col flex-1 overflow-y-auto">
          {isEnabled("carrusel") && (
            <ImageCarousel images={images} index={carouselIndex} onPrev={goPrev} onNext={goNext} height="h-[140px]" />
          )}
          {isEnabled("video") && (
            <div className="grid grid-cols-2 gap-[2px]">
              <VideoPlaceholder height="h-[70px]" />
              <VideoPlaceholder height="h-[70px]" />
            </div>
          )}
          {isEnabled("info") && (
            <InfoBlock title="Institucional">
              <p>Contenido corporativo para comunicación interna.</p>
            </InfoBlock>
          )}
          {isEnabled("contacto") && (
            <InfoBlock title="Contacto">
              <p>info@empresa.com — +591 70000000</p>
            </InfoBlock>
          )}
        </div>
      )

    default: // clasica
      return (
        <div className="flex flex-col flex-1 overflow-y-auto">
          {isEnabled("carrusel") && (
            <ImageCarousel images={images} index={carouselIndex} onPrev={goPrev} onNext={goNext} height="h-[160px]" />
          )}
          {isEnabled("video") && <VideoPlaceholder height="h-[100px]" />}
          {isEnabled("info") && (
            <>
              <InfoBlock title="Horarios de atención">
                <p>Lun - Vie: 08:00 - 18:00</p>
                <p>Sáb: 09:00 - 13:00</p>
              </InfoBlock>
              <InfoBlock title="Avisos">
                <p>Bienvenido. Consulte el directorio para más información.</p>
              </InfoBlock>
            </>
          )}
        </div>
      )
  }
}
