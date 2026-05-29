"use client"

import { useEffect, useState } from "react"
import { Monitor, MonitorOff, Wrench, Upload, HelpCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
  iconBgColor: string
  iconColor: string
}

function StatCard({ icon, value, label, iconBgColor, iconColor }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-4 bg-card border-border border">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card className="flex items-center gap-4 p-4 bg-card border-border border">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="w-10 h-7" />
        <Skeleton className="w-24 h-4" />
      </div>
    </Card>
  )
}

export function StatsCards({ totems = [], isLoading = false }: { totems: any[]; isLoading?: boolean }) {
  const [faqCount, setFaqCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchFaqCounts() {
      let total = 0
      for (const totem of totems) {
        try {
          if (!totem.id) continue
          const res = await fetch(`/api/faqs/totem/${totem.id}`)
          if (res.ok) {
            const data = await res.json()
            if (data?.hasFaq === false) continue
            if (data && !data.error && (data.items?.length > 0 || data._id)) total += 1
          }
        } catch {
          // skip
        }
      }
      if (!cancelled) setFaqCount(total)
    }

    if (totems.length > 0) {
      fetchFaqCounts()
    } else {
      setFaqCount(0)
    }

    return () => { cancelled = true }
  }, [totems])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const stats = [
    {
      icon: <Monitor className="w-6 h-6" />,
      value: totems.filter(t => t.estado === "Activo").length,
      label: "Tótems Activos",
      iconBgColor: "bg-emerald-500/20",
      iconColor: "text-emerald-500",
    },
    {
      icon: <MonitorOff className="w-6 h-6" />,
      value: totems.filter(t => t.estado === "Inactivo").length,
      label: "Tótems Inactivos",
      iconBgColor: "bg-slate-500/20",
      iconColor: "text-slate-400",
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      value: totems.filter(t => t.estado === "En Mantenimiento").length,
      label: "En Mantenimiento",
      iconBgColor: "bg-amber-500/20",
      iconColor: "text-amber-500",
    },
    {
      icon: <Upload className="w-6 h-6" />,
      value: totems.reduce((acc: number, t: any) => acc + (t.contenido || 0), 0),
      label: "Contenidos Subidos",
      iconBgColor: "bg-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      value: faqCount,
      label: "FAQs Activas",
      iconBgColor: "bg-purple-500/20",
      iconColor: "text-purple-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
