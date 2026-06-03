"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  CheckCircle,
  Loader2,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const MAX_USUARIO = 30
const MIN_CONTRASENA = 6
const MAX_CONTRASENA = 50
const MAX_CORREO = 60

export default function LoginPage() {
  const router = useRouter()

  const [usuario, setUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errores, setErrores] = useState({ usuario: "", contrasena: "" })
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitResult, setSubmitResult] = useState<"error" | "success" | null>(null)

  const [showRecovery, setShowRecovery] = useState(false)
  const [correo, setCorreo] = useState("")
  const [recoveryError, setRecoveryError] = useState("")
  const [recoverySuccess, setRecoverySuccess] = useState("")
  const [recoveryLoading, setRecoveryLoading] = useState(false)

  const validar = () => {
    const e = { usuario: "", contrasena: "" }
    let ok = true

    if (!usuario.trim()) {
      e.usuario = "El usuario no puede estar vacío."
      ok = false
    } else if (usuario.trim().length > MAX_USUARIO) {
      e.usuario = `Máximo ${MAX_USUARIO} caracteres.`
      ok = false
    }

    if (!contrasena) {
      e.contrasena = "La contraseña no puede estar vacía."
      ok = false
    } else if (contrasena.length < MIN_CONTRASENA) {
      e.contrasena = `Mínimo ${MIN_CONTRASENA} caracteres.`
      ok = false
    } else if (contrasena.length > MAX_CONTRASENA) {
      e.contrasena = `Máximo ${MAX_CONTRASENA} caracteres.`
      ok = false
    }

    setErrores(e)
    return ok
  }

  const handleLogin = async () => {
    setApiError("")
    setSubmitResult(null)
    if (!validar()) return

    setLoading(true)
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ usuario: usuario.trim(), contrasena }),
      })

      const data = await response.json()

      if (!response.ok) {
        setSubmitResult("error")
        setApiError(data.message || "Credenciales inválidas.")
        return
      }

      setSubmitResult("success")
      localStorage.setItem("token", data.token)
      localStorage.setItem("admin", JSON.stringify(data.admin))

      const raw = process.env.NEXT_PUBLIC_AFTER_LOGIN_URL?.trim()
      const url = raw && raw.length > 0 ? raw : "/dashboard"

      setLoading(false)
      await new Promise((r) => setTimeout(r, 480))
      if (url.startsWith("/")) {
        router.replace(url)
      } else {
        window.location.replace(url)
      }
    } catch {
      setSubmitResult("error")
      setApiError("No se pudo conectar con el servidor. Intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  const validarRecovery = () => {
    if (!correo.trim()) {
      setRecoveryError("El correo no puede estar vacío.")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo.trim())) {
      setRecoveryError("Ingresá un correo electrónico válido.")
      return false
    }
    return true
  }

  const handleRecoverySubmit = async () => {
    setRecoveryError("")
    setRecoverySuccess("")
    if (!validarRecovery()) return

    setRecoveryLoading(true)
    try {
      const response = await fetch("/api/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correo.trim().toLowerCase() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setRecoveryError(data.message || "Ocurrió un error. Intentá más tarde.")
        return
      }

      setRecoverySuccess(data.message)
    } catch {
      setRecoveryError("No se pudo conectar con el servidor.")
    } finally {
      setRecoveryLoading(false)
    }
  }

  const handleRecoveryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRecoverySubmit()
  }

  const handleOpenRecovery = () => {
    setCorreo("")
    setRecoveryError("")
    setRecoverySuccess("")
    setRecoveryLoading(false)
    setShowRecovery(true)
  }

  return (
    <>
      <Card className="w-full max-w-[420px] border-white/[0.08] bg-gradient-to-b from-slate-900/80 to-slate-950 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center px-8 py-10">
          {/* Logo */}
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-xl font-bold text-white shadow-lg shadow-blue-500/25">
            T
          </div>

          {/* Title */}
          <h1 className="mb-1.5 text-center text-xl font-semibold tracking-tight text-white">
            Panel de Administración{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              TOTEM
            </span>
          </h1>
          <p className="mb-8 text-center text-sm text-slate-400">
            Inicia sesión para administrar los totems.
          </p>

          {/* API Error Banner */}
          {apiError && (
            <div className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/25 bg-red-500/[0.08] px-4 py-2.5 text-center text-xs text-red-400">
              <AlertCircle className="size-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Username */}
          <div className="mb-4 w-full space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-slate-400">
              Usuario
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                type="text"
                placeholder="Ingresa tu usuario"
                value={usuario}
                maxLength={MAX_USUARIO}
                onChange={(e) => {
                  setUsuario(e.target.value)
                  if (errores.usuario) setErrores((prev) => ({ ...prev, usuario: "" }))
                }}
                onKeyDown={handleKeyDown}
                className={`h-11 rounded-lg border-white/10 bg-white/[0.03] pl-10 text-sm text-white placeholder:text-slate-500 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20 ${
                  errores.usuario ? "border-red-500/50" : ""
                }`}
              />
            </div>
            {errores.usuario && (
              <p className="flex items-center gap-1.5 text-[11px] text-red-400">
                <AlertCircle className="size-3.5" />
                {errores.usuario}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-5 w-full space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider text-slate-400">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                maxLength={MAX_CONTRASENA}
                onChange={(e) => {
                  setContrasena(e.target.value)
                  if (errores.contrasena) setErrores((prev) => ({ ...prev, contrasena: "" }))
                }}
                onKeyDown={handleKeyDown}
                className={`h-11 rounded-lg border-white/10 bg-white/[0.03] pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20 ${
                  errores.contrasena ? "border-red-500/50" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errores.contrasena && (
              <p className="flex items-center gap-1.5 text-[11px] text-red-400">
                <AlertCircle className="size-3.5" />
                {errores.contrasena}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="mb-3 h-11 w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-600 hover:to-indigo-600 hover:shadow-blue-500/30 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              "Ingresar →"
            )}
          </Button>

          {/* Recovery Link */}
          <button
            type="button"
            onClick={handleOpenRecovery}
            className="mb-6 text-xs text-slate-400 transition-colors hover:text-blue-400"
          >
            Recuperar contraseña
          </button>

          {/* Footer */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="size-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            Sistema activo · TOTEM Management Platform
          </div>
        </CardContent>
      </Card>

      {/* Recovery Modal */}
      <Dialog open={showRecovery} onOpenChange={setShowRecovery}>
        <DialogContent className="max-w-[400px] border-white/[0.08] bg-gradient-to-b from-slate-900 to-slate-950 text-white sm:rounded-2xl">
          <DialogHeader className="items-center text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-lg font-bold text-white">
              T
            </div>
            <DialogTitle className="text-lg text-white">
              Recuperar{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                contraseña
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Ingresá tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider text-slate-400">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                <Input
                  type="email"
                  placeholder="Ingresá tu correo"
                  value={correo}
                  maxLength={MAX_CORREO}
                  autoFocus
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CORREO) {
                      setCorreo(e.target.value)
                      if (recoveryError) setRecoveryError("")
                    }
                  }}
                  onKeyDown={handleRecoveryKeyDown}
                  className={`h-11 rounded-lg border-white/10 bg-white/[0.03] pl-10 text-sm text-white placeholder:text-slate-500 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20 ${
                    recoveryError ? "border-red-500/50" : ""
                  }`}
                />
              </div>
            </div>

            {recoveryError && (
              <p className="flex items-center gap-1.5 text-[11px] text-red-400">
                <AlertCircle className="size-3.5" />
                {recoveryError}
              </p>
            )}

            {recoverySuccess && (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-2.5 text-center text-xs text-emerald-400">
                <CheckCircle className="size-4 shrink-0" />
                <span>{recoverySuccess}</span>
              </div>
            )}

            {!recoverySuccess ? (
              <Button
                type="button"
                onClick={handleRecoverySubmit}
                disabled={recoveryLoading}
                className="h-11 w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-600 hover:to-indigo-600 disabled:opacity-60"
              >
                {recoveryLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar enlace →"
                )}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRecovery(false)}
                className="h-11 w-full rounded-xl border-white/10 bg-slate-800/50 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Volver al login
              </Button>
            )}

            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-500">
              <span className="size-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              Sistema activo · TOTEM Management Platform
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
