"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  Palette,
  LogOut,
  Sun,
  Moon,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/editor-plantillas", label: "Plantillas", icon: Palette },
]

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [adminName, setAdminName] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin")
      if (raw) {
        const admin = JSON.parse(raw)
        setAdminName(admin.nombre || admin.usuario || "Admin")
      }
    } catch {
      setAdminName("Admin")
    }
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem("token")
    localStorage.removeItem("admin")
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // ignore
    }
    router.replace("/login")
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-base">T</span>
          </div>
          <span className="text-lg font-bold text-foreground hidden sm:inline">
            TOTEM
          </span>
        </Link>

        <nav className="flex items-center gap-1 ml-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link key={href} href={href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`gap-2 text-sm ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Right: Theme toggle + User menu */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Cambiar tema</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-sm">
              <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="hidden sm:inline text-foreground">
                {adminName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              {adminName}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-400 focus:text-red-400 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
