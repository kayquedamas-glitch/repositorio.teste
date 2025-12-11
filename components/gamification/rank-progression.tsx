"use client"

interface RankProgressionProps {
  currentRank: string
  currentLevel: number
}

export function RankProgression({ currentRank, currentLevel }: RankProgressionProps) {
  const ranks = [
    { name: "Recruta", minLevel: 1, icon: "⚊" },
    { name: "Soldado", minLevel: 5, icon: "⚌" },
    { name: "Sargento", minLevel: 10, icon: "≡" },
    { name: "Tenente", minLevel: 20, icon: "⬒" },
    { name: "Capitão", minLevel: 35, icon: "◈" },
    { name: "Comandante", minLevel: 50, icon: "⬢" },
    { name: "General", minLevel: 75, icon: "✦" },
    { name: "Lenda", minLevel: 100, icon: "★" },
  ]

  return (
    <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
      <h2 className="text-white font-mono font-bold text-lg mb-4">Progressão de Patente</h2>

      <div className="space-y-3">
        {ranks.map((rank, index) => {
          const isUnlocked = currentLevel >= rank.minLevel
          const isCurrent = rank.name === currentRank
          const nextRank = ranks[index + 1]

          return (
            <div key={rank.name} className="flex items-center gap-3">
              {/* Icon */}
              <div
                className={`w-10 h-10 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                  isCurrent
                    ? "border-[#CC0000] bg-[#CC0000]/10"
                    : isUnlocked
                      ? "border-green-500 bg-green-500/10"
                      : "border-[#333] bg-[#111]"
                }`}
              >
                <span
                  className={`text-lg ${isCurrent ? "text-[#CC0000]" : isUnlocked ? "text-green-500" : "text-gray-600"}`}
                >
                  {rank.icon}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`font-mono font-bold text-sm ${isCurrent ? "text-[#CC0000]" : isUnlocked ? "text-white" : "text-gray-600"}`}
                  >
                    {rank.name}
                  </span>
                  {isCurrent && (
                    <span className="text-xs font-mono px-2 py-0.5 bg-[#CC0000] text-white rounded">ATUAL</span>
                  )}
                  {isUnlocked && !isCurrent && (
                    <span className="text-xs font-mono px-2 py-0.5 bg-green-500/20 text-green-500 rounded border border-green-500/30">
                      DESBLOQUEADA
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                  <span>Nível {rank.minLevel}+</span>
                  {!isUnlocked && <span>• Faltam {rank.minLevel - currentLevel} níveis</span>}
                  {isCurrent && nextRank && (
                    <span>
                      • Próxima: {nextRank.name} (Nv. {nextRank.minLevel})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
