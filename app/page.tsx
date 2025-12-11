"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth/allowlist"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard")
    } else {
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#CC0000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-mono text-sm">Carregando sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#CC0000_1px,transparent_1px),linear-gradient(to_bottom,#CC0000_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Animated borders */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#CC0000] to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#CC0000] to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#CC0000] to-transparent animate-pulse" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#CC0000] to-transparent animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#CC0000] to-[#600000] rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/30 relative overflow-hidden">
            <Image
              src="/logo_synapse.png"
              alt="Synapse Logo"
              width={96}
              height={96}
              className="object-contain opacity-90 mix-blend-screen"
            />
          </div>
        </div>

        {/* Main logo/title */}
        <div className="mb-12">
          <div className="inline-block mb-6 px-6 py-2 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded">
            <span className="text-[#CC0000] text-sm font-mono uppercase tracking-widest">Sistema Operacional v1.0</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 font-mono tracking-tighter">
            SYNAPSE
            <span className="text-[#CC0000]">PRO</span>
          </h1>
          <p className="text-xl text-gray-400 font-mono mb-3">Centro de Comando de Alta Performance Mental</p>
          <p className="text-sm text-gray-600 font-mono">Gamificação Militar · Controle Neuroquímico · IA Tática</p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
            <div className="text-3xl mb-3">⬢</div>
            <h3 className="text-white font-mono font-bold mb-2">QG Operacional</h3>
            <p className="text-gray-500 text-sm font-mono">Dashboard HUD com missões e gamificação</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
            <div className="text-3xl mb-3">◈</div>
            <h3 className="text-white font-mono font-bold mb-2">IA Comandante</h3>
            <p className="text-gray-500 text-sm font-mono">Assistente militar focado em execução</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
            <div className="text-3xl mb-3">◉</div>
            <h3 className="text-white font-mono font-bold mb-2">Modo Foco</h3>
            <p className="text-gray-500 text-sm font-mono">Pomodoro com protocolo de missão</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-[#CC0000] hover:bg-[#AA0000] text-white font-mono uppercase tracking-wider text-base px-8"
          >
            <Link href="/acesso">Acessar Sistema</Link>
          </Button>
        </div>

        {/* System status */}
        <div className="mt-12">
          <div className="inline-flex items-center gap-2 text-xs text-gray-600 font-mono">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>TODOS OS SISTEMAS OPERACIONAIS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
