import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, BarChart3, Shield, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">FitScore</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/formulario" className="text-muted-foreground hover:text-foreground transition-colors">
                Avaliação
              </Link>
              <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Button asChild size="sm">
                <Link href="/auth/login">Entrar</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Sistema Profissional de Avaliação
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Avaliação <span className="text-primary">FitScore</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Sistema inteligente de avaliação de compatibilidade cultural e técnica para processos seletivos. Descubra
              o nível de alinhamento dos candidatos com os valores e cultura da sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/formulario">
                  Iniciar Avaliação <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/admin">Ver Dashboard</Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Avaliação Completa</CardTitle>
                <CardDescription>10 perguntas estratégicas divididas em Performance, Energia e Cultura</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Dashboard Inteligente</CardTitle>
                <CardDescription>
                  Visualize resultados, filtre candidatos e acompanhe métricas em tempo real
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Processamento Seguro</CardTitle>
                <CardDescription>Notificações automáticas e relatórios programados com total segurança</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Classificações FitScore</CardTitle>
              <CardDescription>Entenda como interpretamos os resultados da avaliação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800">Fit Altíssimo</h3>
                  <p className="text-sm text-green-600 mt-1">80 pontos ou mais</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800">Fit Aprovado</h3>
                  <p className="text-sm text-blue-600 mt-1">60-79 pontos</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-yellow-800">Fit Questionável</h3>
                  <p className="text-sm text-yellow-600 mt-1">40-59 pontos</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
                  <CheckCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-red-800">Fora do Perfil</h3>
                  <p className="text-sm text-red-600 mt-1">Menos de 40 pontos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
