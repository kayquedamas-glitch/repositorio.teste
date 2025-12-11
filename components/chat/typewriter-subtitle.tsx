"use client"

import { useEffect, useState } from "react"

interface TypewriterSubtitleProps {
  phrases: string[]
}

export function TypewriterSubtitle({ phrases }: TypewriterSubtitleProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (phrases.length === 0) return

    const currentPhrase = phrases[phraseIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (charIndex < currentPhrase.length) {
            setDisplayedText(currentPhrase.substring(0, charIndex + 1))
            setCharIndex(charIndex + 1)
          } else {
            // Pause before deleting
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          // Deleting
          if (charIndex > 0) {
            setDisplayedText(currentPhrase.substring(0, charIndex - 1))
            setCharIndex(charIndex - 1)
          } else {
            // Move to next phrase
            setIsDeleting(false)
            setPhraseIndex((phraseIndex + 1) % phrases.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, phraseIndex, phrases])

  return (
    <div className="text-center mb-6 p-4">
      <p className="text-gray-400 text-sm font-mono">
        <span className="text-[#CC0000] font-medium">{displayedText}</span>
        <span className="animate-pulse text-white">|</span>
      </p>
    </div>
  )
}
