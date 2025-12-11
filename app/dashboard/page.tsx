"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { MissionItem } from "@/components/dashboard/mission-item"
import { AddMissionDialog } from "@/components/dashboard/add-mission-dialog"
import { getCurrentUserId } from "@/lib/auth/user-helper"

interface Mission {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  xp_reward: number
  completed_at?: string
  created_at: string
}

interface Profile {
  rank: string
  level: number
  xp: number
}

export default function DashboardPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("active")
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [filter])

  const loadData = async () => {
    const userId = await getCurrentUserId()
    if (!userId) return

    // Load profile
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (profileData) {
      setProfile(profileData)
    }

    // Load missions
    let query = supabase.from("missions").select("*").eq("user_id", userId).order("created_at", { ascending: false })

    if (filter !== "all") {
      query = query.eq("status", filter)
    }

    const { data: missionsData } = await query

    if (missionsData) {
      setMissions(missionsData)
    }
  }

  const activeMissions = missions.filter((m) => m.status === "active")
  const completedMissions = missions.filter((m) => m.status === "completed")

  const xpProgress = profile ? profile.xp % 100 : 0
  const completionRate = missions.length > 0 ? Math.round((completedMissions.length / missions.length) * 100) : 0

  return (
    <div className="min-h-screen bg-[#050505] p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white font-mono mb-2">QG Operacional</h1>
            <p className="text-gray-400 font-mono text-sm">Centro de Comando e Controle de Missões</p>
          </div>
          <AddMissionDialog onMissionAdded={loadData} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Level Card */}
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-mono text-xs uppercase">Nível</span>
              <span className="text-2xl">{"\u2B22"}</span>
            </div>
            <div className="text-3xl font-bold text-white font-mono mb-1">{profile?.level || 1}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#222] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#CC0000] h-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
              </div>
              <span className="text-xs text-gray-500 font-mono">{xpProgress}%</span>
            </div>
          </div>

          {/* Rank Card */}
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-mono text-xs uppercase">Patente</span>
              <span className="text-2xl">{"\u25C6"}</span>
            </div>
            <div className="text-2xl font-bold text-[#CC0000] font-mono">{profile?.rank || "Recruta"}</div>
            <p className="text-xs text-gray-500 font-mono mt-1">{profile?.xp || 0} XP Total</p>
          </div>

          {/* Active Missions Card */}
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-mono text-xs uppercase">Ativas</span>
              <span className="text-2xl">{"\u25A0"}</span>
            </div>
            <div className="text-3xl font-bold text-white font-mono mb-1">{activeMissions.length}</div>
            <p className="text-xs text-gray-500 font-mono">Missões em progresso</p>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 font-mono text-xs uppercase">Taxa</span>
              <span className="text-2xl">{"\u25C9"}</span>
            </div>
            <div className="text-3xl font-bold text-green-500 font-mono mb-1">{completionRate}%</div>
            <p className="text-xs text-gray-500 font-mono">{completedMissions.length} concluídas</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded font-mono text-sm uppercase tracking-wide transition-all ${
            filter === "all"
              ? "bg-[#CC0000] text-white"
              : "bg-[#111] text-gray-400 border border-[#333] hover:border-[#CC0000]"
          }`}
        >
          Todas ({missions.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded font-mono text-sm uppercase tracking-wide transition-all ${
            filter === "active"
              ? "bg-[#CC0000] text-white"
              : "bg-[#111] text-gray-400 border border-[#333] hover:border-[#CC0000]"
          }`}
        >
          Ativas ({activeMissions.length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded font-mono text-sm uppercase tracking-wide transition-all ${
            filter === "completed"
              ? "bg-[#CC0000] text-white"
              : "bg-[#111] text-gray-400 border border-[#333] hover:border-[#CC0000]"
          }`}
        >
          Concluídas ({completedMissions.length})
        </button>
      </div>

      {/* Missions List */}
      <div className="space-y-3">
        {missions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-[#CC0000] text-3xl">{"\u2B22"}</span>
            </div>
            <h3 className="text-white font-mono font-bold text-lg mb-2">Nenhuma Missão Encontrada</h3>
            <p className="text-gray-500 font-mono text-sm text-center max-w-md mb-6">
              {filter === "completed"
                ? "Você ainda não completou nenhuma missão. Comece agora!"
                : "Adicione sua primeira missão para começar sua jornada operacional."}
            </p>
            {filter !== "completed" && <AddMissionDialog onMissionAdded={loadData} />}
          </div>
        ) : (
          missions.map((mission) => <MissionItem key={mission.id} mission={mission} onUpdate={loadData} />)
        )}
      </div>
    </div>
  )
}
