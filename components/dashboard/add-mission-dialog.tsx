"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getCurrentUserId } from "@/lib/auth/user-helper"

interface AddMissionDialogProps {
  onMissionAdded: () => void
}

export function AddMissionDialog({ onMissionAdded }: AddMissionDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "critical">("normal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const userId = await getCurrentUserId()
    if (!userId) return

    const xpReward = priority === "critical" ? 50 : priority === "high" ? 30 : priority === "normal" ? 15 : 10

    const { error } = await supabase.from("missions").insert({
      user_id: userId,
      title,
      description: description || null,
      priority,
      xp_reward: xpReward,
      status: "active",
    })

    if (!error) {
      setTitle("")
      setDescription("")
      setPriority("normal")
      setOpen(false)
      onMissionAdded()
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#CC0000] hover:bg-[#AA0000] text-white font-mono uppercase tracking-wider">
          + Nova Missão
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border-[#222] text-white">
        <DialogHeader>
          <DialogTitle className="font-mono text-xl">Adicionar Nova Missão</DialogTitle>
          <DialogDescription className="font-mono text-gray-400">
            Defina uma nova tarefa para executar. Prioridade determina recompensa XP.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-mono text-sm">
              Título da Missão
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Completar relatório de vendas"
              required
              className="bg-[#111] border-[#333] text-white placeholder:text-gray-600 focus:border-[#CC0000] font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-mono text-sm">
              Descrição (Opcional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais sobre a missão..."
              rows={3}
              className="bg-[#111] border-[#333] text-white placeholder:text-gray-600 focus:border-[#CC0000] font-mono resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-sm">Prioridade</Label>
            <div className="grid grid-cols-4 gap-2">
              {(["low", "normal", "high", "critical"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-2 rounded font-mono text-xs uppercase tracking-wide transition-all ${
                    priority === p
                      ? p === "critical"
                        ? "bg-[#CC0000] text-white"
                        : p === "high"
                          ? "bg-yellow-600 text-white"
                          : p === "normal"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-600 text-white"
                      : "bg-[#111] text-gray-400 border border-[#333]"
                  }`}
                >
                  {p === "low" ? "Baixa" : p === "normal" ? "Normal" : p === "high" ? "Alta" : "Crítica"}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 font-mono">XP: Baixa (10) · Normal (15) · Alta (30) · Crítica (50)</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 bg-transparent border-[#333] text-gray-400 hover:bg-[#111] font-mono"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#CC0000] hover:bg-[#AA0000] text-white font-mono"
            >
              {isSubmitting ? "Criando..." : "Criar Missão"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
