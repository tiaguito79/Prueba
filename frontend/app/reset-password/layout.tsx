import "@/login/styles/login.css"
import LoginBodyTheme from "@/login/components/LoginBodyTheme"

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LoginBodyTheme>
      <div className="totem-login-container">{children}</div>
    </LoginBodyTheme>
  )
}
