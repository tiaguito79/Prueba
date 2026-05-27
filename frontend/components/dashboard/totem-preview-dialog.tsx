"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Play, Pause, Monitor } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface InfoBloque {
  titulo: string
  contenido: string
}

interface TotemPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateId: string | null
  templateName: string
  imagePreviews: Array<string | null>
  videoPreviews: Array<string | null>
  totemName?: string
  infoBloques?: InfoBloque[]
}

export function TotemPreviewDialog({
  open,
  onOpenChange,
  templateId,
  templateName,
  imagePreviews,
  videoPreviews,
  totemName = "Tótem",
  infoBloques,
}: TotemPreviewDialogProps) {
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState<Record<number, boolean>>({})

  const validImages = imagePreviews.filter(Boolean) as string[]
  const validVideos = videoPreviews.filter(Boolean) as string[]

  useEffect(() => {
    setCarouselIndex(0)
    setVideoPlaying({})
  }, [open])

  useEffect(() => {
    if (!open || validImages.length <= 1) return
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % validImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [open, validImages.length])

  const goPrev = useCallback(() => {
    setCarouselIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
  }, [validImages.length])

  const goNext = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % validImages.length)
  }, [validImages.length])

  const toggleVideo = (index: number, videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return
    if (videoEl.paused) {
      videoEl.play()
      setVideoPlaying((p) => ({ ...p, [index]: true }))
    } else {
      videoEl.pause()
      setVideoPlaying((p) => ({ ...p, [index]: false }))
    }
  }

  const now = new Date()
  const timeStr = now.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })
  const dateStr = now.toLocaleDateString("es-BO", { weekday: "long", day: "numeric", month: "long" })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[460px] w-full p-0 bg-transparent border-none shadow-none gap-0 overflow-visible"
      >
        <DialogTitle className="sr-only">Vista previa del tótem</DialogTitle>
        <DialogDescription className="sr-only">
          Simulación de cómo se verá el contenido en el dispositivo tótem
        </DialogDescription>

        <button
          onClick={() => onOpenChange(false)}
          className="absolute -top-3 -right-3 z-50 w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Totem device frame */}
        <div className="flex flex-col items-center">
          {/* Top bezel */}
          <div className="w-[340px] h-3 bg-gradient-to-b from-zinc-700 to-zinc-800 rounded-t-2xl" />

          {/* Screen area */}
          <div className="w-[340px] bg-zinc-800 px-[6px] pb-[6px]">
            <div className="w-full h-[540px] bg-slate-950 rounded-sm overflow-hidden flex flex-col relative">
              {/* Status bar */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50 shrink-0">
                <span className="text-[10px] text-slate-400 font-medium">{timeStr}</span>
                <div className="flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] text-cyan-400 font-semibold tracking-wide">TOTEM</span>
                </div>
                <span className="text-[10px] text-slate-400 capitalize">{dateStr}</span>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {renderTemplateContent(
                  templateId,
                  validImages,
                  validVideos,
                  carouselIndex,
                  goPrev,
                  goNext,
                  videoPlaying,
                  toggleVideo,
                  infoBloques
                )}
              </div>

            </div>
          </div>

          {/* Bottom bezel */}
          <div className="w-[340px] h-4 bg-gradient-to-b from-zinc-800 to-zinc-700 rounded-b-2xl" />

          {/* Stand */}
          <div className="w-[120px] h-16 bg-gradient-to-b from-zinc-700 via-zinc-600 to-zinc-700 rounded-b-lg relative">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-zinc-500/50" />
          </div>
          <div className="w-[180px] h-3 bg-gradient-to-b from-zinc-600 to-zinc-700 rounded-full shadow-lg" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function renderTemplateContent(
  templateId: string | null,
  images: string[],
  videos: string[],
  carouselIndex: number,
  goPrev: () => void,
  goNext: () => void,
  videoPlaying: Record<number, boolean>,
  toggleVideo: (index: number, el: HTMLVideoElement | null) => void,
  infoBloques?: InfoBloque[]
) {
  switch (templateId) {
    case "directorio":
      return <DirectorioLayout videos={videos} videoPlaying={videoPlaying} toggleVideo={toggleVideo} infoBloques={infoBloques} />
    case "promocional":
      return <PromocionalLayout images={images} videos={videos} videoPlaying={videoPlaying} toggleVideo={toggleVideo} infoBloques={infoBloques} />
    case "minimal":
      return <MinimalLayout images={images} carouselIndex={carouselIndex} goPrev={goPrev} goNext={goNext} infoBloques={infoBloques} />
    case "eventos":
      return <EventosLayout images={images} videos={videos} carouselIndex={carouselIndex} goPrev={goPrev} goNext={goNext} videoPlaying={videoPlaying} toggleVideo={toggleVideo} infoBloques={infoBloques} />
    case "corporativa":
      return <CorporativaLayout images={images} videos={videos} carouselIndex={carouselIndex} goPrev={goPrev} goNext={goNext} videoPlaying={videoPlaying} toggleVideo={toggleVideo} infoBloques={infoBloques} />
    default:
      return <ClasicaLayout images={images} videos={videos} carouselIndex={carouselIndex} goPrev={goPrev} goNext={goNext} videoPlaying={videoPlaying} toggleVideo={toggleVideo} infoBloques={infoBloques} />
  }
}

function ImageCarousel({
  images,
  index,
  onPrev,
  onNext,
  height = "h-[200px]",
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
        <span className="text-slate-600 text-xs">Sin imágenes</span>
      </div>
    )
  }

  return (
    <div className={cn("relative group overflow-hidden", height)}>
      <img
        src={images[index % images.length]}
        alt=""
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === index % images.length ? "bg-cyan-400 w-3" : "bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function VideoPlayer({
  src,
  index,
  playing,
  onToggle,
  height = "h-[160px]",
}: {
  src: string
  index: number
  playing: boolean
  onToggle: (index: number, el: HTMLVideoElement | null) => void
  height?: string
}) {
  return (
    <div
      className={cn("relative group cursor-pointer overflow-hidden bg-black", height)}
      onClick={(e) => {
        const video = (e.currentTarget as HTMLElement).querySelector("video")
        onToggle(index, video)
      }}
    >
      <video
        src={src}
        className="w-full h-full object-cover"
        muted
        playsInline
        loop
      />
      <div className={cn(
        "absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity",
        playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
      )}>
        {playing ? (
          <Pause className="w-8 h-8 text-white drop-shadow-lg" />
        ) : (
          <Play className="w-8 h-8 text-white drop-shadow-lg" />
        )}
      </div>
    </div>
  )
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-3 py-2">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <div className="text-[11px] text-slate-300 leading-relaxed">{children}</div>
    </div>
  )
}

/* ======================== Template Layouts ======================== */

function CustomInfoBlocks({ infoBloques }: { infoBloques?: InfoBloque[] }) {
  if (!infoBloques || infoBloques.length === 0) {
    return (
      <>
        <InfoBlock title="Horarios de atención">
          <p>Lun - Vie: 08:00 - 18:00</p>
          <p>Sáb: 09:00 - 13:00</p>
        </InfoBlock>
        <InfoBlock title="Avisos">
          <p>Bienvenido a nuestras instalaciones. Consulte el directorio para más información.</p>
        </InfoBlock>
      </>
    )
  }
  return (
    <>
      {infoBloques.map((b, i) => (
        <InfoBlock key={i} title={b.titulo}>
          {b.contenido.split("\n").map((line, j) => (
            <p key={j}>{line}</p>
          ))}
        </InfoBlock>
      ))}
    </>
  )
}

function ClasicaLayout({
  images, videos, carouselIndex, goPrev, goNext, videoPlaying, toggleVideo, infoBloques,
}: {
  images: string[]; videos: string[]; carouselIndex: number; goPrev: () => void; goNext: () => void; videoPlaying: Record<number, boolean>; toggleVideo: (i: number, el: HTMLVideoElement | null) => void; infoBloques?: InfoBloque[]
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <ImageCarousel images={images} index={carouselIndex} onPrev={goPrev} onNext={goNext} height="h-[200px]" />
      {videos[0] && (
        <VideoPlayer src={videos[0]} index={0} playing={!!videoPlaying[0]} onToggle={toggleVideo} height="h-[140px]" />
      )}
      <CustomInfoBlocks infoBloques={infoBloques} />
    </div>
  )
}

function EventosLayout({
  images, videos, carouselIndex, goPrev, goNext, videoPlaying, toggleVideo, infoBloques,
}: {
  images: string[]; videos: string[]; carouselIndex: number; goPrev: () => void; goNext: () => void; videoPlaying: Record<number, boolean>; toggleVideo: (i: number, el: HTMLVideoElement | null) => void; infoBloques?: InfoBloque[]
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <ImageCarousel images={images} index={carouselIndex} onPrev={goPrev} onNext={goNext} height="h-[180px]" />
      <CustomInfoBlocks infoBloques={infoBloques} />
      {videos[0] && (
        <VideoPlayer src={videos[0]} index={0} playing={!!videoPlaying[0]} onToggle={toggleVideo} height="h-[100px]" />
      )}
      {videos[1] && (
        <VideoPlayer src={videos[1]} index={1} playing={!!videoPlaying[1]} onToggle={toggleVideo} height="h-[100px]" />
      )}
    </div>
  )
}

function PromocionalLayout({
  images, videos, videoPlaying, toggleVideo, infoBloques,
}: {
  images: string[]; videos: string[]; videoPlaying: Record<number, boolean>; toggleVideo: (i: number, el: HTMLVideoElement | null) => void; infoBloques?: InfoBloque[]
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {images[0] && (
        <div className="relative h-[220px]">
          <img src={images[0]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-semibold drop-shadow-lg">Oferta Especial</p>
            <p className="text-slate-200 text-[10px] drop-shadow">Aprovecha la promoción por tiempo limitado</p>
          </div>
        </div>
      )}
      {images[1] && (
        <div className="h-[120px]">
          <img src={images[1]} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {videos[0] && (
        <VideoPlayer src={videos[0]} index={0} playing={!!videoPlaying[0]} onToggle={toggleVideo} height="h-[120px]" />
      )}
      <CustomInfoBlocks infoBloques={infoBloques} />
    </div>
  )
}

function MinimalLayout({
  images, carouselIndex, goPrev, goNext, infoBloques,
}: {
  images: string[]; carouselIndex: number; goPrev: () => void; goNext: () => void; infoBloques?: InfoBloque[]
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <ImageCarousel images={images} index={carouselIndex} onPrev={goPrev} onNext={goNext} height="h-[260px]" />
      <CustomInfoBlocks infoBloques={infoBloques} />
    </div>
  )
}

function CorporativaLayout({
  images, videos, carouselIndex, goPrev, goNext, videoPlaying, toggleVideo, infoBloques,
}: {
  images: string[]; videos: string[]; carouselIndex: number; goPrev: () => void; goNext: () => void; videoPlaying: Record<number, boolean>; toggleVideo: (i: number, el: HTMLVideoElement | null) => void; infoBloques?: InfoBloque[]
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <ImageCarousel images={images} index={carouselIndex} onPrev={goPrev} onNext={goNext} height="h-[180px]" />
      {videos.length > 0 && (
        <div className="grid grid-cols-2 gap-[2px]">
          {videos.map((v, i) => (
            <VideoPlayer key={i} src={v} index={i} playing={!!videoPlaying[i]} onToggle={toggleVideo} height="h-[100px]" />
          ))}
        </div>
      )}
      <CustomInfoBlocks infoBloques={infoBloques} />
    </div>
  )
}

function DirectorioLayout({
  videos, videoPlaying, toggleVideo, infoBloques,
}: {
  videos: string[]; videoPlaying: Record<number, boolean>; toggleVideo: (i: number, el: HTMLVideoElement | null) => void; infoBloques?: InfoBloque[]
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="px-3 py-4 bg-gradient-to-br from-blue-900/30 to-purple-900/20 flex flex-col items-center">
        <p className="text-slate-200 text-sm font-semibold mb-1">Directorio de Servicios</p>
        <p className="text-slate-400 text-[10px]">Ubicaciones y contactos</p>
      </div>
      {videos[0] && (
        <VideoPlayer src={videos[0]} index={0} playing={!!videoPlaying[0]} onToggle={toggleVideo} height="h-[200px]" />
      )}
      <CustomInfoBlocks infoBloques={infoBloques} />
    </div>
  )
}
