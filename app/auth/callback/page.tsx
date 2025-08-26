"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("Confirmando seu acesso...")

  useEffect(() => {
    const supabase = createClient()

    async function handleOAuthCallback() {
      try {
        // Suporta tanto ?code= quanto fragmentos do hash (#access_token etc)
        const code = searchParams.get("code")
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          router.replace("/admin")
          return
        }
        // Fallback: se não houver code, tente atualizar sessão (caso o middleware já tenha setado)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          router.replace("/admin")
          return
        }
        setMessage("Link inválido ou expirado. Solicite um novo e-mail de confirmação.")
      } catch (err) {
        setMessage("Não foi possível confirmar seu acesso. Tente novamente.")
      }
    }

    void handleOAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}


