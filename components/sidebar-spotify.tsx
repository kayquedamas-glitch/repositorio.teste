"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MessageSquare, Target, Focus, AlertCircle, BarChart3, LogOut, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

export function SidebarSpotify() {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const session = localStorage.getItem("synapse_session_v2")
    if (!session) return

    const { email } = JSON.parse(session)
    const { data } = await supabase.from("profiles").select("*").eq("email", email).single()

    if (data) setProfile(data)
  }

  const handleLogout = () => {
    localStorage.removeItem("synapse_session_v2")
    router.push("/acesso")
  }

  const menuItems = [
    { icon: MessageSquare, label: "Chat IA", href: "/chat", color: "text-blue-400" },
    { icon: Target, label: "Missões", href: "/dashboard", color: "text-green-400" },
    { icon: Focus, label: "Foco", href: "/focus", color: "text-purple-400" },
    { icon: AlertCircle, label: "Pânico", href: "/panic", color: "text-red-400", pulse: true },
    { icon: BarChart3, label: "Estatísticas", href: "/dashboard/stats", color: "text-yellow-400" },
  ]

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Synapse PRO</h1>
            <p className="text-xs text-gray-400">Sistema Inteligente</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                tool-item group
                ${isActive ? "active" : ""}
                ${item.pulse ? "animate-pulse-slow" : ""}
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-red-600" : item.color}`} />
              <span className="flex-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      {profile && (
        <div className="p-4 border-t border-white/5">
          <div className="bg-zinc-900 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{profile.email?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{profile.email}</p>
                <p className="text-xs text-gray-400">{profile.rank || "Recruta"}</p>
              </div>
            </div>

            {/* XP Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Nível {profile.level || 1}</span>
                <span className="text-red-500 font-semibold">{profile.xp || 0} XP</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${(profile.xp || 0) % 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar hidden md:flex">
        <NavContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div className="sidebar-overlay show md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="sidebar open md:hidden">
            <NavContent />
          </aside>
        </>
      )}
    </>
  )
}
