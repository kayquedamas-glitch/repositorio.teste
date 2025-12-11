"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { getCurrentUserId } from "@/lib/auth/user-helper"

interface MissionItemProps {
  mission: {
    id: string
    title: string
    description?: string
    status: string
    priority: string
    xp_reward: number
    completed_at?: string
  }
  onUpdate: () => void
}

export function MissionItem({ mission, onUpdate }: MissionItemProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const supabase = createClient()

  const handleComplete = async () => {
    setIsCompleting(true)

    const userId = await getCurrentUserId()
    if (!userId) return

    // Update mission status
    const { error: missionError } = await supabase
      .from("missions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", mission.id)

    if (!missionError) {
      // Update user profile XP
      const { data: profile } = await supabase.from("profiles").select("xp, level").eq("id", userId).single()

      if (profile) {
        const newXp = profile.xp + mission.xp_reward
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
          .eq("id", userId)
      }

      onUpdate()
    }

    setIsCompleting(false)
  }

  const handleDelete = async () => {
    const { error } = await supabase.from("missions").delete().eq("id", mission.id)

    if (!error) {
      onUpdate()
    }
  }

  const priorityColors = {
    low: "text-gray-500 border-gray-500/30",
    normal: "text-blue-400 border-blue-400/30",
    high: "text-yellow-500 border-yellow-500/30",
    critical: "text-[#CC0000] border-[#CC0000]/30",
  }

  const priorityColor = priorityColors[mission.priority as keyof typeof priorityColors] || priorityColors.normal

  const isCompleted = mission.status === "completed"

  return (
    <div
      className={`bg-[#0a0a0a] border rounded-lg p-4 transition-all ${
        isCompleted ? "border-green-500/30 opacity-60" : "border-[#222] hover:border-[#333]"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleComplete}
          disabled={isCompleted || isCompleting}
          className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
            isCompleted ? "bg-green-500 border-green-500" : "border-[#CC0000] hover:bg-[#CC0000]/10"
          }`}
        >
          {isCompleted && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-mono font-bold text-sm ${isCompleted ? "line-through text-gray-600" : "text-white"}`}>
              {mission.title}
            </h3>
            <span className={`text-xs font-mono px-2 py-0.5 border rounded ${priorityColor}`}>
              {mission.priority.toUpperCase()}
            </span>
          </div>

          {mission.description && (
            <p className={`text-sm font-mono mb-2 ${isCompleted ? "text-gray-700" : "text-gray-400"}`}>
              {mission.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={isCompleted ? "text-green-500" : "text-[#CC0000]"}>+{mission.xp_reward} XP</span>
              {isCompleted && mission.completed_at && (
                <span className="text-gray-600">
                  • Concluída em {new Date(mission.completed_at).toLocaleDateString()}
                </span>
              )}
            </div>

            {!isCompleted && (
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-[#CC0000] h-auto p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
