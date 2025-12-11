"use client"

const API_URL = "https://sheetdb.io/api/v1/eplcagfbxnfje"
const APP_SECRET = "SYNAPSE_Protocol_v1_SECURE_HASH_2025_KEY"
const SESSION_KEY = "synapse_session_v2"

export interface SessionData {
  user: string
  email: string
  token: string
  loginDate: number
}

export async function validateEmail(email: string): Promise<{ success: boolean; nome?: string; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/search?email=${encodeURIComponent(email.toLowerCase())}`)

    if (!response.ok) {
      throw new Error("Erro na comunicação com o servidor")
    }

    const data = await response.json()

    if (data.length > 0) {
      return {
        success: true,
        nome: data[0].nome || "Membro",
      }
    } else {
      return {
        success: false,
        error: "E-mail não encontrado na base de membros",
      }
    }
  } catch (error) {
    console.error("Allowlist validation error:", error)
    return {
      success: false,
      error: "Erro ao validar acesso. Tente novamente.",
    }
  }
}

export function createSession(email: string, nome: string): void {
  const tokenSeguro = btoa(email + APP_SECRET)
  const sessionData: SessionData = {
    user: nome,
    email: email,
    token: tokenSeguro,
    loginDate: Date.now(),
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
}

export function getSession(): SessionData | null {
  if (typeof window === "undefined") return null

  try {
    const sessionStr = localStorage.getItem(SESSION_KEY)
    if (!sessionStr) return null

    const session: SessionData = JSON.parse(sessionStr)

    // Validate token
    const expectedToken = btoa(session.email + APP_SECRET)
    if (session.token !== expectedToken) {
      clearSession()
      return null
    }

    return session
  } catch (error) {
    console.error("Session error:", error)
    clearSession()
    return null
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}
