export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 font-[Inter,system-ui,sans-serif] antialiased">
      {children}
    </div>
  )
}
