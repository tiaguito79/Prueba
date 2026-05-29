"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-6">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <Skeleton className="w-16 h-5" />
          <div className="flex gap-2 ml-2">
            <Skeleton className="w-24 h-8 rounded-md" />
            <Skeleton className="w-24 h-8 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-md" />
          <Skeleton className="w-28 h-9 rounded-md" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="w-10 h-7" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="px-6 pb-6">
        <div className="border border-border rounded-lg bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-32 h-9 rounded-md" />
          </div>
          <div className="p-4 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <Skeleton className="flex-1 h-5" />
                <Skeleton className="w-24 h-5" />
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-16 h-5" />
                <Skeleton className="w-20 h-8 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const didRun = useRef(false)

  useEffect(() => {
    if (didRun.current) return
    didRun.current = true

    const hash = window.location.hash.replace("#", "")

    if (hash) {
      const params = new URLSearchParams(hash)
      const token = params.get("token")
      const admin = params.get("admin")

      if (token) {
        localStorage.setItem("token", token)
      }

      if (admin) {
        localStorage.setItem("admin", decodeURIComponent(admin))
      }

      window.history.replaceState(null, "", window.location.pathname)
    }

    const tokenGuardado = localStorage.getItem("token")

    if (!tokenGuardado) {
      fetch("/api/auth/logout", { method: "POST" }).finally(() => {
        router.replace("/login")
      })
      return
    }

    fetch("/api/auth/verify", {
      credentials: "include",
      headers: { Authorization: `Bearer ${tokenGuardado}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("token")
          localStorage.removeItem("admin")
          fetch("/api/auth/logout", { method: "POST" }).finally(() => {
            router.replace("/login")
          })
        } else {
          setChecking(false)
        }
      })
      .catch(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("admin")
        fetch("/api/auth/logout", { method: "POST" }).finally(() => {
          router.replace("/login")
        })
      })
  }, [router])

  if (checking) {
    return <PageSkeleton />
  }

  return <>{children}</>
}
