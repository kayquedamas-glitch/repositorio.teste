"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { RankProgression } from "@/components/gamification/rank-progression"

interface Profile {
  rank: string
  level: number
  xp: number
  created_at: string
}

interface Stats {
  totalMissions: number
  completedMissions: number
  activeMissions: number
  totalXP: number
  completionRate: number
  averageXPPerMission: number
  daysActive: number
}

export default function StatsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Load profile
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (profileData) {
      setProfile(profileData)

      // Load missions
      const { data: missions } = await supabase.from("missions").select("*").eq("user_id", user.id)

      if (missions) {
        const completed = missions.filter((m) => m.status === "completed")
        const active = missions.filter((m) => m.status === "active")

        const daysActive = Math.floor((Date.now() - new Date(profileData.created_at).getTime()) / (1000 * 60 * 60 * 24))

        setStats({
          totalMissions: missions.length,
          completedMissions: completed.length,
          activeMissions: active.length,
          totalXP: profileData.xp,
          completionRate: missions.length > 0 ? Math.round((completed.length / missions.length) * 100) : 0,
          averageXPPerMission: completed.length > 0 ? Math.round(profileData.xp / completed.length) : 0,
          daysActive: daysActive > 0 ? daysActive : 1,
        })
      }
    }
  }

  if (!profile || !stats) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#CC0000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-mono text-sm">Carregando estatísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-mono mb-2">Estatísticas Operacionais</h1>
        <p className="text-gray-400 font-mono text-sm">Análise Completa de Performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-mono text-xs uppercase">Total de Missões</span>
            <span className="text-2xl">◈</span>
          </div>
          <div className="text-4xl font-bold text-white font-mono mb-2">{stats.totalMissions}</div>
          <div className="text-sm font-mono text-gray-500">
            {stats.completedMissions} concluídas · {stats.activeMissions} ativas
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-mono text-xs uppercase">Taxa de Conclusão</span>
            <span className="text-2xl">◉</span>
          </div>
          <div className="text-4xl font-bold text-green-500 font-mono mb-2">{stats.completionRate}%</div>
          <div className="w-full bg-[#222] h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full transition-all" style={{ width: `${stats.completionRate}%` }} />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-mono text-xs uppercase">XP Médio/Missão</span>
            <span className="text-2xl">⬢</span>
          </div>
          <div className="text-4xl font-bold text-[#CC0000] font-mono mb-2">{stats.averageXPPerMission}</div>
          <div className="text-sm font-mono text-gray-500">{stats.totalXP} XP total acumulado</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
          <h2 className="text-white font-mono font-bold text-lg mb-4">Performance Diária</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-mono text-sm">Dias Ativos</span>
              <span className="text-white font-mono font-bold">{stats.daysActive}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-mono text-sm">Missões/Dia</span>
              <span className="text-white font-mono font-bold">
                {(stats.completedMissions / stats.daysActive).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-mono text-sm">XP/Dia</span>
              <span className="text-white font-mono font-bold">{Math.round(stats.totalXP / stats.daysActive)}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
          <h2 className="text-white font-mono font-bold text-lg mb-4">Status Atual</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-mono text-sm">Nível</span>
              <span className="text-[#CC0000] font-mono font-bold text-xl">{profile.level}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-mono text-sm">Patente</span>
              <span className="text-[#CC0000] font-mono font-bold">{profile.rank}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-mono text-sm">Progresso</span>
              <span className="text-white font-mono font-bold">{profile.xp % 100}/100 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rank Progression */}
      <RankProgression currentRank={profile.rank} currentLevel={profile.level} />
    </div>
  )
}
