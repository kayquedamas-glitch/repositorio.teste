// XP calculation utilities
export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1
}

export const calculateRank = (level: number): string => {
  if (level >= 100) return "Lenda"
  if (level >= 75) return "General"
  if (level >= 50) return "Comandante"
  if (level >= 35) return "Capitão"
  if (level >= 20) return "Tenente"
  if (level >= 10) return "Sargento"
  if (level >= 5) return "Soldado"
  return "Recruta"
}

export const getXPForNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP)
  return currentLevel * 100
}

export const getXPProgress = (currentXP: number): number => {
  return currentXP % 100
}

export const getMissionXPReward = (priority: string): number => {
  switch (priority) {
    case "critical":
      return 50
    case "high":
      return 30
    case "normal":
      return 15
    case "low":
      return 10
    default:
      return 15
  }
}

export const getFocusXPReward = (durationMinutes: number): number => {
  return Math.floor(durationMinutes / 5) * 5
}
