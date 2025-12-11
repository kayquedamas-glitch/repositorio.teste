"use client"

import { createBrowserClient } from "@/lib/supabase/client"
import { useEffect, useState, useRef } from "react"
import { getCurrentUserId } from "@/lib/auth/user-helper"
import { sendToGroq } from "@/lib/ai/groq-client"
import { getAgent, type AgentType } from "@/lib/ai/agents"
import type { ChatMessage as GroqMessage } from "@/lib/ai/groq-client"
import { Send, Loader2 } from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  agent_type?: string
  created_at: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<AgentType>("comandante")
  const [chatHistory, setChatHistory] = useState<GroqMessage[]>([])
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [typewriterText, setTypewriterText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createBrowserClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, typewriterText])

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    const userId = await getCurrentUserId()
    if (!userId) return

    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(50)

    if (data && data.length > 0) {
      setMessages(data)
    } else {
      showWelcomeMessage()
    }
  }

  const showWelcomeMessage = () => {
    const agent = getAgent(currentAgent)
    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: agent.welcome,
      agent_type: currentAgent,
      created_at: new Date().toISOString(),
    }
    setMessages([welcomeMessage])
    setQuickReplies(agent.initialButtons)
    setChatHistory([{ role: "system", content: agent.prompt }])
  }

  const switchAgent = (newAgent: AgentType) => {
    setCurrentAgent(newAgent)
    setMessages([])
    setQuickReplies([])
    setChatHistory([])

    const agent = getAgent(newAgent)
    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: agent.welcome,
      agent_type: newAgent,
      created_at: new Date().toISOString(),
    }
    setMessages([welcomeMessage])
    setQuickReplies(agent.initialButtons)
    setChatHistory([{ role: "system", content: agent.prompt }])
  }

  const extractQuickReplies = (content: string): string[] => {
    const buttonRegex = /<<(.+?)>>/g
    const buttons: string[] = []
    let match

    while ((match = buttonRegex.exec(content)) !== null) {
      buttons.push(match[1])
    }

    return buttons
  }

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()
    if (!textToSend || isLoading) return

    setIsLoading(true)
    setQuickReplies([])

    const userId = await getCurrentUserId()
    if (!userId) {
      setIsLoading(false)
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: textToSend,
      created_at: new Date().toISOString(),
    }

    await supabase.from("chat_messages").insert({
      user_id: userId,
      role: "user",
      content: textToSend,
      agent_type: currentAgent,
    })

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    const updatedHistory: GroqMessage[] = [...chatHistory, { role: "user", content: textToSend }]

    try {
      const aiResponse = await sendToGroq(updatedHistory)
      const buttons = extractQuickReplies(aiResponse)

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponse,
        agent_type: currentAgent,
        created_at: new Date().toISOString(),
      }

      await supabase.from("chat_messages").insert({
        user_id: userId,
        role: "assistant",
        content: aiResponse,
        agent_type: currentAgent,
      })

      // Typewriter effect
      setIsTyping(true)
      const cleanContent = aiResponse.replace(/<<(.+?)>>/g, "").trim()
      let currentIndex = 0
      setTypewriterText("")

      const interval = setInterval(() => {
        if (currentIndex < cleanContent.length) {
          setTypewriterText((prev) => prev + cleanContent[currentIndex])
          currentIndex++
        } else {
          setIsTyping(false)
          clearInterval(interval)
          setMessages((prev) => [...prev, assistantMessage])
          setTypewriterText("")
          setQuickReplies(buttons)
        }
      }, 15)

      setChatHistory([...updatedHistory, { role: "assistant", content: aiResponse }])
    } catch (error) {
      console.error("[v0] Groq API Error:", error)

      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Falha na comunicação com IA. Verifique sua conexão e tente novamente.",
        agent_type: currentAgent,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  const agent = getAgent(currentAgent)

  const agentButtons: Array<{ type: AgentType; label: string; color: string }> = [
    { type: "comandante", label: "Comandante", color: "bg-red-600" },
    { type: "general", label: "General", color: "bg-green-600" },
    { type: "tatico", label: "Tático", color: "bg-cyan-600" },
    { type: "diagnostico", label: "Diagnóstico", color: "bg-blue-600" },
    { type: "panico", label: "Pânico", color: "bg-yellow-600" },
  ]

  return (
    <div className="chat-area">
      {/* Agent Selector Header */}
      <div className="bg-[#0a0a0a] border-b border-[#222] p-4 sticky top-0 z-20">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {agentButtons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => switchAgent(btn.type)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                currentAgent === btn.type
                  ? `${btn.color} text-white shadow-lg scale-105`
                  : "bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        <div id="messagesContainer">
          {messages.length === 0 && !isTyping ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-3xl font-bold">S</span>
                </div>
                <h2 className="text-white font-bold text-xl mb-2">Synapse PRO</h2>
                <p className="text-gray-400 text-sm max-w-md">
                  Sistema de Inteligência Artificial pronto para auxiliar
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={message.role === "user" ? "chat-message-user" : "chat-message-ia"}>
                  {message.role === "assistant" && (
                    <div className="mb-1 text-xs font-bold text-gray-500 uppercase">
                      {message.agent_type === "panico"
                        ? "🚨 Protocolo Pânico"
                        : message.agent_type === "diagnostico"
                          ? "🧠 Psicólogo IA"
                          : message.agent_type === "general"
                            ? "⭐ General"
                            : message.agent_type === "tatico"
                              ? "⚙️ Tático"
                              : "🎯 Comandante"}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content.replace(/<<(.+?)>>/g, "")}</div>
                </div>
              ))}

              {/* Typewriter effect */}
              {isTyping && typewriterText && (
                <div className="chat-message-ia">
                  <div className="mb-1 text-xs font-bold text-gray-500 uppercase">
                    {currentAgent === "panico"
                      ? "🚨 Protocolo Pânico"
                      : currentAgent === "diagnostico"
                        ? "🧠 Psicólogo IA"
                        : currentAgent === "general"
                          ? "⭐ General"
                          : currentAgent === "tatico"
                            ? "⚙️ Tático"
                            : "🎯 Comandante"}
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {typewriterText}
                    <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Loading */}
              {isLoading && !isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-zinc-900 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                    <span className="text-sm text-gray-400">Processando...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Quick Replies */}
      {quickReplies.length > 0 && !isLoading && !isTyping && (
        <div className="px-4 pb-4">
          <div className="quick-reply-container max-w-2xl mx-auto">
            {quickReplies.map((option, index) => (
              <button key={index} onClick={() => handleSendMessage(option)} className="cyber-btn">
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="chat-input-container">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="w-full max-w-3xl mx-auto"
        >
          <div id="textInputWrapper">
            <input
              id="chatInput"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-600"
            />
            <button
              id="sendBtn"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile bottom spacing */}
      <div className="h-20 md:hidden" />
    </div>
  )
}
