import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Analytics em tempo real com processamento assíncrono
    const { data: evaluations, error } = await supabase
      .from("evaluations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    // Processamento assíncrono de insights
    const processInsights = async () => {
      try {
        // Simular processamento complexo
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Calcular métricas em tempo real
        const total = evaluations?.length || 0
        const avgScore = total > 0 
          ? Math.round(evaluations.reduce((sum, e) => sum + e.fit_score, 0) / total)
          : 0

        // Análise de tendências
        const last24h = evaluations?.filter(e => 
          new Date(e.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ) || []

        const trends = []
        if (last24h.length > 5) {
          trends.push("🚀 Alto volume de avaliações nas últimas 24h")
        }

        // Registrar analytics processados
        const { error: logError } = await supabase.from("notification_logs").insert({
          evaluation_id: null,
          notification_type: "real_time_analytics",
          recipient_email: "admin@legal.com",
          status: "processed",
          sent_at: new Date().toISOString(),
        })

        if (logError) {
          console.error("Erro ao registrar analytics:", logError)
        }

        console.log("📊 Analytics em tempo real processados:", { total, avgScore, trends })
        
      } catch (error) {
        console.error("❌ Erro no processamento de analytics:", error)
      }
    }

    // Executar processamento em background
    processInsights()

    // Retornar dados imediatamente (não bloquear)
    return NextResponse.json({
      success: true,
      realTimeData: {
        totalEvaluations: evaluations?.length || 0,
        lastUpdated: new Date().toISOString(),
        processingStatus: "active",
        message: "Analytics sendo processados em background"
      },
      evaluations: evaluations?.slice(0, 10) || [], // Últimas 10 avaliações
    })

  } catch (error) {
    console.error("Erro ao obter analytics em tempo real:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// Endpoint para iniciar processamento em lote
export async function POST() {
  try {
    const supabase = await createClient()
    
    console.log("🔄 Iniciando processamento em lote de analytics...")
    
    // Processamento assíncrono em lote
    const batchProcess = async () => {
      try {
        // Simular processamento em lote
        await new Promise(resolve => setTimeout(resolve, 5000))
        
        // Processar todas as avaliações
        const { data: allEvaluations, error } = await supabase
          .from("evaluations")
          .select("*")

        if (error) throw error

        // Análise completa
        const total = allEvaluations?.length || 0
        const classifications = allEvaluations?.reduce((acc, e) => {
          acc[e.fit_classification] = (acc[e.fit_classification] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}

        // Registrar processamento em lote
        const { error: logError } = await supabase.from("notification_logs").insert({
          evaluation_id: null,
          notification_type: "batch_analytics",
          recipient_email: "admin@legal.com",
          status: "completed",
          sent_at: new Date().toISOString(),
        })

        if (logError) {
          console.error("Erro ao registrar processamento em lote:", logError)
        }

        console.log("✅ Processamento em lote concluído:", { total, classifications })
        
      } catch (error) {
        console.error("❌ Erro no processamento em lote:", error)
      }
    }

    // Executar em background
    batchProcess()

    return NextResponse.json({
      success: true,
      message: "Processamento em lote iniciado",
      startedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error("Erro ao iniciar processamento em lote:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
