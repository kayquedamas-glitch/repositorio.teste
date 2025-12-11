"use client"

import { useState, useEffect } from "react"

interface MessageProps {
  role: "user" | "assistant"
  content: string
  agentType?: string
  showTypewriter?: boolean
}

export function Message({ role, content, agentType, showTypewriter = false }: MessageProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [isTyping, setIsTyping] = useState(showTypewriter)

  const buttonRegex = /<<(.+?)>>/g
  const cleanContent = content.replace(buttonRegex, "").trim()

  useEffect(() => {
    if (showTypewriter && role === "assistant") {
      let currentIndex = 0
      setDisplayedContent("")
      setIsTyping(true)

      const interval = setInterval(() => {
        if (currentIndex < cleanContent.length) {
          setDisplayedContent((prev) => prev + cleanContent[currentIndex])
          currentIndex++
        } else {
          setIsTyping(false)
          clearInterval(interval)
        }
      }, 15)

      return () => clearInterval(interval)
    } else {
      setDisplayedContent(cleanContent)
      setIsTyping(false)
    }
  }, [cleanContent, showTypewriter, role])

  if (role === "user") {
    return (
      <div className="chat-message-user">
        <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    )
  }

  const agentLabel = agentType
    ? agentType === "comandante"
      ? "🎯 Comandante"
      : agentType === "general"
        ? "⭐ General"
        : agentType === "tatico"
          ? "⚙️ Tático"
          : agentType === "diagnostico"
            ? "🧠 Psicólogo IA"
            : agentType === "panico"
              ? "🚨 Protocolo Pânico"
              : "Sistema"
    : "Sistema"

  return (
    <div className="chat-message-ia">
      <div className="mb-1 text-xs font-bold text-gray-500 uppercase">{agentLabel}</div>
      <div className="leading-relaxed whitespace-pre-wrap">
        {displayedContent}
        {isTyping && <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse" />}
      </div>
    </div>
  )
}
