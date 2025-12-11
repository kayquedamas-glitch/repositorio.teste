import type React from "react"
import { AuthGuard } from "@/components/auth-guard"

export default function PanicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#050505]">{children}</div>
    </AuthGuard>
  )
}
