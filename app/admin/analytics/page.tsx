"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, BarChart3 } from "lucide-react"
import Link from "next/link"

interface Insights {
  totalEvaluations: number
  averageScore: number
  averageScore24h: number
  averageScore7d: number
  approvalRate: number
  areaScores: {
    performance: number
    energy: number
    culture: number
  }
  classifications: Record<string, number>
  trends: string[]
  recommendations: string[]
  alerts: string[]
  lastUpdated: string
}

export default function AnalyticsPage() {
  const [insights, setInsights] = useState<Insights | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/analytics/real-time-insights")
      if (!response.ok) throw new Error("Failed to fetch insights")

      const data = await response.json()
      setInsights(data.insights)
    } catch (err) {
      console.error("Error fetching insights:", err)
      setError("Erro ao carregar insights. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const generateReport = async () => {
    try {
      const response = await fetch("/api/reports/approved-candidates", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        alert(`Relatório gerado com sucesso! ${data.count} candidatos aprovados encontrados.`)
      }
    } catch (err) {
      console.error("Error generating report:", err)
      alert("Erro ao gerar relatório.")
    }
  }

  useEffect(() => {
    fetchInsights()
    // Atualização automática a cada 5 minutos
    const interval = setInterval(fetchInsights, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !insights) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Erro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchInsights} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
              <p className="text-gray-600 mt-1">Análise em tempo real do sistema FitScore</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={generateReport} variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
              <Button onClick={fetchInsights} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              <Button asChild>
                <Link href="/admin">Voltar ao Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Alertas */}
        {insights.alerts.length > 0 && (
          <div className="mb-6">
            {insights.alerts.map((alert, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">Alerta:</span>
                  <span className="text-red-700">{alert}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{insights.totalEvaluations}</div>
                <div className="text-gray-600 mt-1">Total de Avaliações</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{insights.averageScore}</div>
                <div className="text-gray-600 mt-1">Score Médio Geral</div>
                {insights.averageScore24h !== insights.averageScore && (
                  <div
                    className={`text-sm mt-1 ${insights.averageScore24h > insights.averageScore ? "text-green-600" : "text-red-600"}`}
                  >
                    24h: {insights.averageScore24h} ({insights.averageScore24h > insights.averageScore ? "+" : ""}
                    {insights.averageScore24h - insights.averageScore})
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{insights.approvalRate}%</div>
                <div className="text-gray-600 mt-1">Taxa de Aprovação</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {insights.classifications["Fit Altíssimo"] || 0}
                </div>
                <div className="text-gray-600 mt-1">Fit Altíssimo</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pontuações por Área */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Performance por Área</CardTitle>
            <CardDescription>Análise detalhada das três dimensões avaliadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">{insights.areaScores.performance}/100</div>
                <div className="text-gray-700 font-medium">Performance</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${insights.areaScores.performance}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">{insights.areaScores.energy}/100</div>
                <div className="text-gray-700 font-medium">Energia</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${insights.areaScores.energy}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">{insights.areaScores.culture}/100</div>
                <div className="text-gray-700 font-medium">Cultura</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${insights.areaScores.culture}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tendências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tendências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.trends.map((trend, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-600 text-sm">{trend}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recomendações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="text-yellow-800 text-sm">{recommendation}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Última atualização: {new Date(insights.lastUpdated).toLocaleString("pt-BR")}
        </div>
      </div>
    </div>
  )
}
