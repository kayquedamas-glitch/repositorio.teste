"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "QG", icon: "⬢" },
    { href: "/chat", label: "Chat", icon: "◈" },
    { href: "/focus", label: "Foco", icon: "◉" },
    { href: "/panic", label: "Pânico", icon: "⚠" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#222] z-50 md:hidden">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const isPanic = item.href === "/panic"

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded transition-all ${
                isPanic
                  ? "text-[#CC0000] border border-[#CC0000]/30"
                  : isActive
                    ? "bg-[#CC0000] text-white"
                    : "text-gray-400"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-mono uppercase tracking-wide">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
