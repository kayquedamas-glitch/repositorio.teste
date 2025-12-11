"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PanicPage() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [count, setCount] = useState(4)
  const [cycles, setCycles] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) return prev - 1

        // Move to next phase
        if (phase === "inhale") {
          setPhase("hold")
          return 4
        } else if (phase === "hold") {
          setPhase("exhale")
          return 4
        } else {
          setPhase("inhale")
          setCycles((c) => c + 1)
          return 4
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phase])

  const startProtocol = () => {
    setIsActive(true)
    setPhase("inhale")
    setCount(4)
    setCycles(0)
    setStartTime(Date.now())
  }

  const endProtocol = async () => {
    if (startTime) {
      const durationSeconds = Math.floor((Date.now() - startTime) / 1000)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("panic_logs").insert({
          user_id: user.id,
          duration_seconds: durationSeconds,
          trigger_reason: null,
        })
      }
    }

    setIsActive(false)
    router.push("/dashboard")
  }

  const circleScale = phase === "inhale" ? "scale-150" : phase === "exhale" ? "scale-50" : "scale-100"

  return (
    <div className="min-h-screen bg-[#CC0000] flex flex-col items-center justify-center p-4 animate-pulse">
      <div className="text-center max-w-2xl">
        {!isActive ? (
          <>
            <div className="mb-8">
              <div className="text-white font-mono text-sm uppercase tracking-wider mb-4">PROTOCOLO DE EMERGÊNCIA</div>
              <h1 className="text-6xl font-bold text-white font-mono mb-4">PÂNICO DETECTADO</h1>
              <p className="text-white/80 font-mono text-lg mb-8">Respire. Você está no controle.</p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border-2 border-white/30 rounded-lg p-8 mb-8">
              <h2 className="text-white font-mono font-bold text-xl mb-4">EXERCÍCIO 4-4-4</h2>
              <ul className="space-y-3 text-white/90 font-mono text-sm text-left">
                <li className="flex items-start gap-2">
                  <span>1.</span>
                  <span>Inspire profundamente por 4 segundos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>2.</span>
                  <span>Segure a respiração por 4 segundos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>3.</span>
                  <span>Expire lentamente por 4 segundos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>4.</span>
                  <span>Repita até se sentir calmo</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={startProtocol}
              size="lg"
              className="bg-white text-[#CC0000] hover:bg-white/90 font-mono uppercase tracking-wider text-lg px-8 py-6"
            >
              Iniciar Protocolo
            </Button>
          </>
        ) : (
          <>
            <div className="mb-12">
              <div className="text-white font-mono text-sm uppercase tracking-wider mb-2">CICLO {cycles + 1}</div>
              <div className="text-white font-mono text-xl mb-8 uppercase">
                {phase === "inhale" ? "INSPIRE" : phase === "hold" ? "SEGURE" : "EXPIRE"}
              </div>
            </div>

            {/* Breathing Circle */}
            <div className="relative w-64 h-64 mx-auto mb-12">
              <div
                className={`absolute inset-0 bg-white rounded-full transition-transform duration-[4000ms] ease-in-out ${circleScale}`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[#CC0000] font-mono font-bold text-6xl z-10">{count}</div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={endProtocol}
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#CC0000] font-mono uppercase tracking-wider text-base px-8"
              >
                Finalizar ({cycles} ciclos completados)
              </Button>
              <p className="text-white/60 font-mono text-xs">Continue até se sentir melhor</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
