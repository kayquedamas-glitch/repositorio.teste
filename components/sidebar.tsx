"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { clearSession, getSession } from "@/lib/auth/allowlist"
import Image from "next/image"

interface SidebarProps {
  profile?: {
    rank: string
    level: number
    xp: number
  }
}

export function Sidebar({ profile }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [userName, setUserName] = useState("Operador")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const session = getSession()
    if (session) {
      setUserName(session.user)
      setUserEmail(session.email)
    }
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    clearSession()
    router.push("/acesso")
  }

  const navItems = [
    { href: "/dashboard", label: "QG Operacional", icon: "⬢" },
    { href: "/dashboard/stats", label: "Estatísticas", icon: "◈" },
    { href: "/chat", label: "Interface IA", icon: "◈" },
    { href: "/focus", label: "Modo Foco", icon: "◉" },
  ]

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-[#222] flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-[#222]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#CC0000]/10 border border-[#CC0000] rounded flex items-center justify-center relative overflow-hidden">
            <Image
              src="/logo_synapse.png"
              alt="Synapse Logo"
              width={40}
              height={40}
              className="object-contain opacity-90"
            />
          </div>
          <div>
            <h1 className="text-white font-mono font-bold text-lg leading-none">SYNAPSE</h1>
            <span className="text-[#CC0000] font-mono text-xs uppercase tracking-wider">PRO</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-500 text-xs font-mono">SISTEMA ONLINE</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded transition-all font-mono text-sm ${
                isActive
                  ? "bg-[#CC0000] text-white"
                  : "text-gray-400 hover:bg-[#111] hover:text-white border border-transparent hover:border-[#333]"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="uppercase tracking-wide">{item.label}</span>
            </Link>
          )
        })}

        {/* Panic Button - Special styling */}
        <Link
          href="/panic"
          className="flex items-center gap-3 px-4 py-3 rounded transition-all font-mono text-sm border-2 border-[#CC0000]/30 text-[#CC0000] hover:bg-[#CC0000]/10 hover:border-[#CC0000] mt-6"
        >
          <span className="text-lg">⚠</span>
          <span className="uppercase tracking-wide font-bold">Protocolo Pânico</span>
        </Link>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[#222]">
        <div className="bg-[#111] rounded p-4 mb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-full flex items-center justify-center">
              <span className="text-[#CC0000] font-mono text-sm">{userName[0] || "O"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-mono text-sm truncate">{userName}</p>
              <p className="text-gray-500 font-mono text-xs">{profile?.rank || "Recruta"}</p>
            </div>
          </div>
          {profile && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-500">NÍVEL {profile.level}</span>
                <span className="text-gray-400">{profile.xp % 100}/100 XP</span>
              </div>
              <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#CC0000] h-full transition-all duration-500"
                  style={{ width: `${profile.xp % 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="outline"
          className="w-full bg-transparent border-[#333] text-gray-400 hover:bg-[#111] hover:text-white hover:border-[#CC0000] font-mono text-xs uppercase tracking-wider"
        >
          {isLoggingOut ? "Desconectando..." : "Sair"}
        </Button>
      </div>
    </aside>
  )
}
