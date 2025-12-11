import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="inline-block mb-4 px-4 py-1 bg-green-500/10 border border-green-500/30 rounded">
            <span className="text-green-500 text-xs font-mono uppercase tracking-wider">Registro Bem-Sucedido</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 font-mono">Protocolo Iniciado</h1>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-8 shadow-2xl">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2 font-mono">Verificação Necessária</h2>
            <p className="text-gray-400 text-sm font-mono leading-relaxed">
              Um link de confirmação foi enviado para seu email operacional. Verifique sua caixa de entrada e clique no
              link para ativar sua conta.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-[#CC0000] hover:bg-[#AA0000] text-white font-mono uppercase tracking-wider"
            >
              <Link href="/auth/login">Ir para Login</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-600 text-xs font-mono">Não recebeu o email? Verifique sua pasta de spam.</p>
        </div>
      </div>
    </div>
  )
}
