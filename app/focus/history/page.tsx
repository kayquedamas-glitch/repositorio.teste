"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface FocusSession {
  id: string
  duration_minutes: number
  completed: boolean
  started_at: string
  ended_at?: string
}

export default function FocusHistoryPage() {
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    totalMinutes: 0,
    completionRate: 0,
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("focus_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(20)

    if (data) {
      setSessions(data)

      const completed = data.filter((s) => s.completed)
      const totalMinutes = completed.reduce((sum, s) => sum + s.duration_minutes, 0)

      setStats({
        totalSessions: data.length,
        completedSessions: completed.length,
        totalMinutes,
        completionRate: data.length > 0 ? Math.round((completed.length / data.length) * 100) : 0,
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white font-mono mb-2">Histórico de Foco</h1>
            <p className="text-gray-400 font-mono text-sm">Registro de Todas as Sessões</p>
          </div>
          <Button
            onClick={() => router.push("/focus")}
            className="bg-[#CC0000] hover:bg-[#AA0000] text-white font-mono uppercase tracking-wider"
          >
            Nova Sessão
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
            <div className="text-gray-500 font-mono text-xs uppercase mb-2">Total</div>
            <div className="text-3xl font-bold text-white font-mono">{stats.totalSessions}</div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
            <div className="text-gray-500 font-mono text-xs uppercase mb-2">Completas</div>
            <div className="text-3xl font-bold text-green-500 font-mono">{stats.completedSessions}</div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
            <div className="text-gray-500 font-mono text-xs uppercase mb-2">Minutos</div>
            <div className="text-3xl font-bold text-[#CC0000] font-mono">{stats.totalMinutes}</div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
            <div className="text-gray-500 font-mono text-xs uppercase mb-2">Taxa</div>
            <div className="text-3xl font-bold text-white font-mono">{stats.completionRate}%</div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 font-mono mb-4">Nenhuma sessão registrada ainda.</p>
              <Button
                onClick={() => router.push("/focus")}
                className="bg-[#CC0000] hover:bg-[#AA0000] text-white font-mono uppercase tracking-wider"
              >
                Iniciar Primeira Sessão
              </Button>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`bg-[#0a0a0a] border rounded-lg p-4 ${
                  session.completed ? "border-green-500/30" : "border-[#CC0000]/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`font-mono font-bold ${session.completed ? "text-green-500" : "text-[#CC0000]"}`}
                      >
                        {session.completed ? "COMPLETA" : "ABORTADA"}
                      </span>
                      <span className="text-gray-500 font-mono text-sm">{session.duration_minutes} minutos</span>
                    </div>
                    <div className="text-gray-600 font-mono text-xs">
                      {new Date(session.started_at).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  {session.completed && (
                    <div className="text-right">
                      <div className="text-green-500 font-mono text-sm font-bold">
                        +{Math.floor(session.duration_minutes / 5) * 5} XP
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
