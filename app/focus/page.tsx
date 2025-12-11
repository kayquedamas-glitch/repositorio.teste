"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function FocusPage() {
  const [duration, setDuration] = useState(25)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      handleSessionComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const handleSessionComplete = async () => {
    setIsActive(false)

    if (sessionId) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Mark session as completed
      await supabase
        .from("focus_sessions")
        .update({
          completed: true,
          ended_at: new Date().toISOString(),
        })
        .eq("id", sessionId)

      // Award XP (5 XP per 5 minutes of focus)
      const xpReward = Math.floor(duration / 5) * 5

      const { data: profile } = await supabase.from("profiles").select("xp, level").eq("id", user.id).single()

      if (profile) {
        const newXp = profile.xp + xpReward
        const newLevel = Math.floor(newXp / 100) + 1

        let newRank = "Recruta"
        if (newLevel >= 100) newRank = "Lenda"
        else if (newLevel >= 75) newRank = "General"
        else if (newLevel >= 50) newRank = "Comandante"
        else if (newLevel >= 35) newRank = "Capitão"
        else if (newLevel >= 20) newRank = "Tenente"
        else if (newLevel >= 10) newRank = "Sargento"
        else if (newLevel >= 5) newRank = "Soldado"

        await supabase
          .from("profiles")
          .update({
            xp: newXp,
            level: newLevel,
            rank: newRank,
          })
          .eq("id", user.id)
      }
    }

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen()
      } catch (error) {
        console.error("Failed to exit fullscreen:", error)
      }
    }
    setIsFullscreen(false)

    alert(`MISSÃO COMPLETA! Você focou por ${duration} minutos.`)
  }

  const startFocus = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Create focus session
    const { data, error } = await supabase
      .from("focus_sessions")
      .insert({
        user_id: user.id,
        duration_minutes: duration,
        completed: false,
      })
      .select()
      .single()

    if (!error && data) {
      setSessionId(data.id)
      setTimeLeft(duration * 60)
      setIsActive(true)

      // Request fullscreen
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      })
    }
  }

  const abortMission = async () => {
    const confirmed = confirm("ATENÇÃO: Abortar missão resultará em falha. Continuar?")

    if (confirmed) {
      if (sessionId) {
        await supabase.from("focus_sessions").delete().eq("id", sessionId)
      }

      setIsActive(false)
      setTimeLeft(0)
      setSessionId(null)

      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen()
        } catch (error) {
          console.error("Failed to exit fullscreen:", error)
        }
      }
      setIsFullscreen(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (isActive) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <div className="text-center">
          {/* Timer Display */}
          <div className="mb-8">
            <div className="text-gray-500 font-mono text-sm uppercase tracking-wider mb-4">MISSÃO EM PROGRESSO</div>
            <div className="text-[12rem] font-mono font-bold text-[#CC0000] leading-none tabular-nums">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="w-full bg-[#222] h-4 rounded-full overflow-hidden">
              <div
                className="bg-[#CC0000] h-full transition-all duration-1000"
                style={{ width: `${((duration * 60 - timeLeft) / (duration * 60)) * 100}%` }}
              />
            </div>
          </div>

          {/* Abort button */}
          <Button
            onClick={abortMission}
            variant="outline"
            size="lg"
            className="bg-transparent border-2 border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white font-mono uppercase tracking-wider text-lg px-8"
          >
            ABORTAR MISSÃO
          </Button>

          <p className="text-gray-600 font-mono text-xs mt-4">Pressione ESC para sair do modo tela cheia</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white font-mono mb-2">Modo Foco</h1>
          <p className="text-gray-400 font-mono text-sm">Protocolo Pomodoro de Alta Performance</p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-8">
          {/* Duration Selection */}
          <div className="mb-8">
            <label className="block text-gray-300 font-mono text-sm mb-4">DURAÇÃO DA MISSÃO</label>
            <div className="grid grid-cols-4 gap-3">
              {[15, 25, 45, 60].map((min) => (
                <button
                  key={min}
                  onClick={() => setDuration(min)}
                  className={`px-6 py-4 rounded font-mono transition-all ${
                    duration === min
                      ? "bg-[#CC0000] text-white border-2 border-[#CC0000]"
                      : "bg-[#111] text-gray-400 border border-[#333] hover:border-[#CC0000]"
                  }`}
                >
                  <div className="text-2xl font-bold">{min}</div>
                  <div className="text-xs mt-1">MIN</div>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#111] border border-[#333] rounded-lg p-6 mb-8">
            <h3 className="text-white font-mono font-bold mb-3 flex items-center gap-2">
              <span className="text-[#CC0000]">◉</span>
              BRIEFING DA MISSÃO
            </h3>
            <ul className="space-y-2 text-sm font-mono text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-[#CC0000]">•</span>
                <span>Modo tela cheia será ativado automaticamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#CC0000]">•</span>
                <span>Todas as distrações serão eliminadas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#CC0000]">•</span>
                <span>Abortar missão resulta em falha (sem XP)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#CC0000]">•</span>
                <span>Completar missão recompensa: {Math.floor(duration / 5) * 5} XP</span>
              </li>
            </ul>
          </div>

          {/* Start Button */}
          <Button
            onClick={startFocus}
            size="lg"
            className="w-full bg-[#CC0000] hover:bg-[#AA0000] text-white font-mono uppercase tracking-wider text-lg py-6"
          >
            Iniciar Missão de Foco
          </Button>
        </div>

        {/* Recent Sessions */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/focus/history")}
            className="text-gray-500 hover:text-[#CC0000] font-mono text-sm underline transition-colors"
          >
            Ver Histórico de Sessões
          </button>
        </div>
      </div>
    </div>
  )
}
