"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<any>({})
  const [supabaseStatus, setSupabaseStatus] = useState<any>({})
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    // Verificar variáveis de ambiente
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configurada" : "❌ Não configurada",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NODE_ENV: process.env.NODE_ENV,
    })

    // Testar conexão com Supabase
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      const supabase = createClient()
      
      // Testar conexão básica
      const { data, error } = await supabase.auth.getSession()
      
      setSupabaseStatus({
        connected: !error,
        error: error?.message,
        session: data?.session ? "✅ Ativa" : "❌ Nenhuma sessão",
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      setSupabaseStatus({
        connected: false,
        error: err instanceof Error ? err.message : "Erro desconhecido",
        session: "❌ Erro na conexão",
        timestamp: new Date().toISOString()
      })
    }
  }

  const testEmailSignup = async () => {
    try {
      const supabase = createClient()
      
      // Testar signup com email de teste
      const testEmail = `test-${Date.now()}@example.com`
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: "test123456",
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback`,
        },
      })

      setTestResult({
        success: !error,
        data,
        error: error?.message,
        testEmail,
        timestamp: new Date().toISOString()
      })

      // Limpar usuário de teste após alguns segundos
      setTimeout(() => {
        setTestResult(null)
      }, 10000)

    } catch (err) {
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : "Erro desconhecido",
        timestamp: new Date().toISOString()
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">🔍 Debug - Sistema de Autenticação</h1>
          <p className="text-gray-600 mt-2">Verificação de configurações e conexões</p>
        </div>

        {/* Variáveis de Ambiente */}
        <Card>
          <CardHeader>
            <CardTitle>🌐 Variáveis de Ambiente</CardTitle>
            <CardDescription>Configurações do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">{key}</span>
                  <Badge variant={value && value !== "❌ Não configurada" ? "default" : "destructive"}>
                    {value || "❌ Não definida"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status do Supabase */}
        <Card>
          <CardHeader>
            <CardTitle>🔗 Status do Supabase</CardTitle>
            <CardDescription>Conexão e autenticação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(supabaseStatus).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">{key}</span>
                  <Badge variant={key === "connected" ? (value ? "default" : "destructive") : "secondary"}>
                    {String(value)}
                  </Badge>
                </div>
              ))}
            </div>
            <Button onClick={testSupabaseConnection} className="mt-4">
              🔄 Testar Conexão
            </Button>
          </CardContent>
        </Card>

        {/* Teste de Email */}
        <Card>
          <CardHeader>
            <CardTitle>📧 Teste de Envio de Email</CardTitle>
            <CardDescription>Testar sistema de confirmação</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testEmailSignup} className="w-full">
              🧪 Testar Signup com Email
            </Button>
            
            {testResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Resultado do Teste:</h4>
                <pre className="text-xs bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Checklist de Verificação</CardTitle>
            <CardDescription>Passos para resolver problemas de email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline">1</Badge>
                <div>
                  <p className="font-medium">Verificar variáveis no Netlify</p>
                  <p className="text-sm text-gray-600">Site settings > Environment variables</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline">2</Badge>
                <div>
                  <p className="font-medium">Configurar URLs no Supabase</p>
                  <p className="text-sm text-gray-600">Authentication > Settings > Site URL e Redirect URLs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline">3</Badge>
                <div>
                  <p className="font-medium">Verificar templates de email</p>
                  <p className="text-sm text-gray-600">Authentication > Email Templates > Confirm signup</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline">4</Badge>
                <div>
                  <p className="font-medium">Fazer novo deploy</p>
                  <p className="text-sm text-gray-600">Após alterações, fazer push para o repositório</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
