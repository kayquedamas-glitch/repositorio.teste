"use client"

import { useEffect, useState } from "react"

interface XPAnimationProps {
  amount: number
  show: boolean
  onComplete: () => void
}

export function XPAnimation({ amount, show, onComplete }: XPAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)

      const timeout = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 300)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div
        className={`transition-all duration-500 ${
          isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-10"
        }`}
      >
        <div className="bg-[#CC0000] text-white font-mono font-bold text-4xl px-8 py-4 rounded-lg shadow-2xl border-2 border-white">
          +{amount} XP
        </div>
      </div>
    </div>
  )
}
