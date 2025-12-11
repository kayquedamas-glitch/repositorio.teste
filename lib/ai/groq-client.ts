// Cliente para comunicação com a API Groq via Cloudflare Worker
const GROQ_API_URL = "https://long-block-7f38.kayquedamas.workers.dev"
const GROQ_MODEL = "llama-3.1-8b-instant"

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export async function sendToGroq(messages: ChatMessage[], temperature = 0.7): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature,
      }),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data: GroqResponse = await response.json()

    if (!data.choices || !data.choices[0]) {
      throw new Error("Invalid API response")
    }

    return data.choices[0].message.content
  } catch (error) {
    console.error("[v0] Groq API Error:", error)
    throw new Error("Falha na comunicação com IA. Tente novamente.")
  }
}
