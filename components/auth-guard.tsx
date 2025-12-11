"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth/allowlist"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Allow public routes
    const publicRoutes = ["/", "/acesso", "/auth/login", "/auth/signup"]
    if (publicRoutes.includes(pathname)) {
      setIsChecking(false)
      return
    }

    // Check authentication
    if (!isAuthenticated()) {
      router.push("/acesso")
    } else {
      setIsChecking(false)
    }
  }, [pathname, router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#CC0000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-mono text-sm">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
