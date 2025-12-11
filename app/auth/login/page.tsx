"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Falha na autenticação")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Boot sequence animation overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#CC0000] to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#CC0000] to-transparent animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Military header */}
        <div className="mb-8 text-center">
          <div className="inline-block mb-4 px-4 py-1 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded">
            <span className="text-[#CC0000] text-xs font-mono uppercase tracking-wider">Sistema de Acesso</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 font-mono">SYNAPSE PRO</h1>
          <p className="text-gray-400 text-sm font-mono">Centro de Comando Operacional</p>
        </div>

        {/* Login card */}
        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-mono text-sm">
                Email Operacional
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="operador@synapse.mil"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#111] border-[#333] text-white placeholder:text-gray-600 focus:border-[#CC0000] focus:ring-[#CC0000] font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-mono text-sm">
                Código de Acesso
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#111] border-[#333] text-white placeholder:text-gray-600 focus:border-[#CC0000] focus:ring-[#CC0000] font-mono"
              />
            </div>

            {error && (
              <div className="bg-[#CC0000]/10 border border-[#CC0000] rounded p-3">
                <p className="text-[#CC0000] text-sm font-mono">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#CC0000] hover:bg-[#AA0000] text-white font-mono uppercase tracking-wider transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">Autenticando...</span>
                </span>
              ) : (
                "Iniciar Sessão"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm font-mono">
              Novo operador?{" "}
              <Link href="/auth/signup" className="text-[#CC0000] hover:underline">
                Registrar-se
              </Link>
            </p>
          </div>
        </div>

        {/* System status footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-600 font-mono">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>SISTEMA ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  )
}
