"use client"

interface QuickRepliesProps {
  options: string[]
  onSelect: (option: string) => void
}

export function QuickReplies({ options, onSelect }: QuickRepliesProps) {
  if (options.length === 0) return null

  return (
    <div className="quick-reply-container">
      {options.map((option, index) => (
        <button key={index} onClick={() => onSelect(option)} className="cyber-btn">
          {option}
        </button>
      ))}
    </div>
  )
}
