import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Lógica Extra Criativa: Analytics e Insights em Tempo Real
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Obter analytics abrangentes
    const { data: evaluations, error } = await supabase
      .from("evaluations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    const insights = generateRealTimeInsights(evaluations || [])

    return NextResponse.json({
      success: true,
      insights,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao gerar insights em tempo real:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

function generateRealTimeInsights(evaluations: any[]) {
  if (evaluations.length === 0) {
    return {
      totalEvaluations: 0,
      trends: [],
      recommendations: ["Aguardando primeiras avaliações para gerar insights"],
      alerts: [],
    }
  }

  const now = new Date()
  const last24h = evaluations.filter((e) => new Date(e.created_at) > new Date(now.getTime() - 24 * 60 * 60 * 1000))
  const last7days = evaluations.filter(
    (e) => new Date(e.created_at) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
  )

  // Calcular tendências
  const avgScore = Math.round(evaluations.reduce((sum, e) => sum + e.fit_score, 0) / evaluations.length)
  const avgScore24h =
    last24h.length > 0 ? Math.round(last24h.reduce((sum, e) => sum + e.fit_score, 0) / last24h.length) : 0
  const avgScore7d =
    last7days.length > 0 ? Math.round(last7days.reduce((sum, e) => sum + e.fit_score, 0) / last7days.length) : 0

  // Análise de performance
  const performanceScores = evaluations.map((e) =>
    Math.round(((e.performance_experience + e.performance_deliveries + e.performance_skills) / 3) * 20),
  )
  const energyScores = evaluations.map((e) =>
    Math.round(((e.energy_availability + e.energy_deadlines + e.energy_pressure) / 3) * 20),
  )
  const cultureScores = evaluations.map((e) =>
    Math.round(((e.culture_values + e.culture_collaboration + e.culture_innovation) / 3) * 20),
  )

  const avgPerformance = Math.round(performanceScores.reduce((sum, s) => sum + s, 0) / performanceScores.length)
  const avgEnergy = Math.round(energyScores.reduce((sum, s) => sum + s, 0) / energyScores.length)
  const avgCulture = Math.round(cultureScores.reduce((sum, s) => sum + s, 0) / cultureScores.length)

  // Distribuição de classificação
  const classifications = evaluations.reduce(
    (acc, e) => {
      acc[e.fit_classification] = (acc[e.fit_classification] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Gerar insights
  const trends = []
  const recommendations = []
  const alerts = []

  // Análise de tendências
  if (avgScore24h > avgScore) {
    trends.push(`📈 Melhoria na qualidade: Score médio subiu ${avgScore24h - avgScore} pontos nas últimas 24h`)
  } else if (avgScore24h < avgScore - 5) {
    trends.push(`📉 Queda na qualidade: Score médio caiu ${avgScore - avgScore24h} pontos nas últimas 24h`)
    alerts.push("Investigar possível problema na atração de candidatos qualificados")
  }

  if (last24h.length > 5) {
    trends.push(`🚀 Alto volume: ${last24h.length} avaliações nas últimas 24h`)
  }

  // Insights de performance
  const strongestArea =
    avgPerformance >= avgEnergy && avgPerformance >= avgCulture
      ? "Performance"
      : avgEnergy >= avgCulture
        ? "Energia"
        : "Cultura"
  const weakestArea =
    avgPerformance <= avgEnergy && avgPerformance <= avgCulture
      ? "Performance"
      : avgEnergy <= avgCulture
        ? "Energia"
        : "Cultura"

  trends.push(`💪 Área mais forte: ${strongestArea} (${Math.max(avgPerformance, avgEnergy, avgCulture)}/100)`)
  trends.push(`🎯 Área para desenvolvimento: ${weakestArea} (${Math.min(avgPerformance, avgEnergy, avgCulture)}/100)`)

  // Recomendações
  const approvalRate =
    (((classifications["Fit Altíssimo"] || 0) + (classifications["Fit Aprovado"] || 0)) / evaluations.length) * 100

  if (approvalRate > 70) {
    recommendations.push("Excelente taxa de aprovação! Considere aumentar os critérios para maior seletividade")
  } else if (approvalRate < 30) {
    recommendations.push("Taxa de aprovação baixa. Revisar critérios ou melhorar atração de candidatos")
    alerts.push("Taxa de aprovação abaixo de 30% - ação necessária")
  }

  if (avgCulture < 60) {
    recommendations.push("Focar em comunicação dos valores da LEGAL durante atração de candidatos")
  }

  if (avgPerformance > 80 && avgEnergy < 60) {
    recommendations.push("Candidatos tecnicamente qualificados mas com baixa energia - revisar processo de seleção")
  }

  // Insights baseados em tempo
  const hourlyDistribution = evaluations.reduce(
    (acc, e) => {
      const hour = new Date(e.created_at).getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )

  const peakHour = Object.entries(hourlyDistribution).sort(([, a], [, b]) => b - a)[0]

  if (peakHour) {
    trends.push(`⏰ Horário de pico: ${peakHour[0]}h com ${peakHour[1]} avaliações`)
  }

  return {
    totalEvaluations: evaluations.length,
    averageScore: avgScore,
    averageScore24h: avgScore24h,
    averageScore7d: avgScore7d,
    approvalRate: Math.round(approvalRate),
    areaScores: {
      performance: avgPerformance,
      energy: avgEnergy,
      culture: avgCulture,
    },
    classifications,
    trends,
    recommendations,
    alerts,
    lastUpdated: new Date().toISOString(),
  }
}
