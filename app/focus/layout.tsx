import type React from "react"
import { SidebarSpotify } from "@/components/sidebar-spotify"
import { AuthGuard } from "@/components/auth-guard"

export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="app-layout">
        <SidebarSpotify />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </AuthGuard>
  )
}
