"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

interface LevelUpToastProps {
  show: boolean
  level: number
  rank: string
  onClose: () => void
}

export function LevelUpToast({ show, level, rank, onClose }: LevelUpToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)

      // Fire confetti
      const duration = 3000
      const end = Date.now() + duration

      const colors = ["#CC0000", "#FF0000", "#AA0000"]
      ;(function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      })()

      // Auto close after 5 seconds
      const timeout = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-[#0a0a0a] border-2 border-[#CC0000] rounded-lg p-6 shadow-2xl min-w-[300px] animate-pulse">
        <div className="text-center">
          <div className="text-4xl mb-3">{"\u2605"}</div>
          <h3 className="text-[#CC0000] font-mono font-bold text-2xl mb-2">NÍVEL AVANÇADO!</h3>
          <p className="text-white font-mono text-lg mb-1">Nível {level}</p>
          <p className="text-gray-400 font-mono text-sm">Patente: {rank}</p>
        </div>
      </div>
    </div>
  )
}
