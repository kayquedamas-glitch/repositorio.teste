"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { validateEmail, createSession } from "@/lib/auth/allowlist"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AcessoPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await validateEmail(email)

    if (result.success && result.nome) {
      createSession(email, result.nome)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } else {
      setError(result.error || "Acesso negado")
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Branding (Desktop only) */}
      <div className="hidden md:flex w-1/2 bg-[#050505] relative items-center justify-center overflow-hidden border-r border-white/5">
        <Image
          src="/polvo_synapse.png"
          alt="Synapse Background"
          fill
          className="object-cover opacity-80 mix-blend-luminosity scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-90" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CC0000] rounded-full blur-[180px] opacity-10 animate-pulse" />

        <div className="glass-card relative z-10 p-10 rounded-3xl max-w-sm text-center transform hover:scale-[1.02] transition-transform duration-500 backdrop-blur-md bg-white/5 border border-white/10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#CC0000] to-[#600000] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-red-900/30 relative overflow-hidden">
            <Image
              src="/logo_synapse.png"
              alt="Synapse Logo"
              fill
              className="object-cover opacity-80 mix-blend-screen"
            />
          </div>

          <h2 className="text-3xl font-black mb-3 tracking-tight text-white">Synapse PRO</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Acesse seu painel de controle neuroquímico e retome o comando da sua rotina.
          </p>

          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Sistema Online
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 bg-[#050505] bg-grid-pattern flex flex-col justify-center items-center p-8 relative">
        <Link
          href="/"
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-500 hover:text-[#CC0000] transition-colors group"
        >
          <div className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-[#CC0000] transition-colors bg-[#050505]">
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Voltar</span>
        </Link>

        <div className={`w-full max-w-md ${shake ? "animate-shake" : ""}`}>
          {/* Logo Mobile */}
          <div className="md:hidden text-center mb-8">
            <div className="w-12 h-12 bg-[#CC0000] rounded-xl mx-auto flex items-center justify-center shadow-red-glow relative overflow-hidden">
              <Image src="/logo_synapse.png" alt="Synapse Logo" width={48} height={48} className="object-contain" />
            </div>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Bem-vindo de volta</h1>
            <p className="text-gray-500 text-sm">Digite seu e-mail de compra para acessar.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                E-mail Corporativo / Pessoal
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 group-focus-within:text-[#CC0000] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#121212] border border-[#222] text-white text-sm rounded-xl py-6 pl-12 pr-4 outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] transition-all placeholder-gray-700 shadow-inner"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-xs font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#CC0000] hover:bg-red-600 text-white font-bold py-6 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-red-900/20 group flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Validando...</span>
                </>
              ) : (
                <>
                  <span>Acessar Painel</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-xs mb-4">Ainda não é membro?</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#333] bg-[#0A0A0A] hover:bg-[#111] hover:border-gray-500 text-white text-xs font-bold transition-all group"
            >
              <svg
                className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Criar Conta de Membro
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-800 uppercase tracking-widest font-bold">
              Synapse Security System © 2025
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }

        @keyframes shake {
          10%,
          90% {
            transform: translate3d(-1px, 0, 0);
          }
          20%,
          80% {
            transform: translate3d(2px, 0, 0);
          }
          30%,
          50%,
          70% {
            transform: translate3d(-4px, 0, 0);
          }
          40%,
          60% {
            transform: translate3d(4px, 0, 0);
          }
        }

        .animate-shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  )
}
