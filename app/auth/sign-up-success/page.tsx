import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Conta Criada com Sucesso!</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Verifique seu e-mail
              </CardTitle>
              <CardDescription>Confirme sua conta para acessar o sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enviamos um e-mail de confirmação para o endereço fornecido. Clique no link do e-mail para ativar sua
                  conta administrativa.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Importante:</strong> Você precisa confirmar seu e-mail antes de poder acessar o dashboard
                    administrativo.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/auth/login">Ir para Login</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">Voltar ao Início</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
