"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, Target } from "lucide-react"

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="bottom-nav md:hidden">
      <Link href="/chat" className={`nav-btn ${pathname === "/chat" ? "active" : ""}`}>
        <MessageSquare className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Chat</span>
      </Link>
      <Link href="/dashboard" className={`nav-btn ${pathname === "/dashboard" ? "active" : ""}`}>
        <Target className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Missões</span>
      </Link>
    </div>
  )
}
