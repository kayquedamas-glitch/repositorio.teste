"use client"

import { getSession } from "./allowlist"
import { createClient } from "@/lib/supabase/client"

let cachedUserId: string | null = null
let cachedUserEmail: string | null = null

export async function getCurrentUserId(): Promise<string | null> {
  // Check cache first
  if (cachedUserId && cachedUserEmail) {
    return cachedUserId
  }

  const session = getSession()
  if (!session) return null

  const supabase = createClient()

  // Try to find or create profile based on email
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("email", session.email)
    .single()

  if (existingProfile) {
    cachedUserId = existingProfile.id
    cachedUserEmail = existingProfile.email
    return existingProfile.id
  }

  // Create a new profile if doesn't exist
  const newUserId = crypto.randomUUID()
  const { error } = await supabase.from("profiles").insert({
    id: newUserId,
    email: session.email,
    display_name: session.user,
    rank: "Recruta",
    level: 1,
    xp: 0,
  })

  if (!error) {
    cachedUserId = newUserId
    cachedUserEmail = session.email
    return newUserId
  }

  return null
}

export function clearUserCache() {
  cachedUserId = null
  cachedUserEmail = null
}
