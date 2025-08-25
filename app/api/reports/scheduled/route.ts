import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Simular processamento assíncrono de relatórios
    console.log("🔄 Iniciando processamento assíncrono de relatórios...")
    
    // Obter avaliações das últimas 24h
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: recentEvaluations, error: fetchError } = await supabase
      .from("evaluations")
      .select("*")
      .gte("created_at", yesterday)
      .order("created_at", { ascending: false })

    if (fetchError) throw fetchError

    // Processamento assíncrono em background
    const processReports = async () => {
      try {
        // Simular tempo de processamento
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Gerar relatório consolidado
        const totalEvaluations = recentEvaluations?.length || 0
        const avgScore = recentEvaluations && recentEvaluations.length > 0
          ? Math.round(recentEvaluations.reduce((sum, e) => sum + e.fit_score, 0) / totalEvaluations)
          : 0

        // Registrar relatório processado
        const { error: logError } = await supabase.from("notification_logs").insert({
          evaluation_id: null,
          notification_type: "scheduled_report",
          recipient_email: "admin@legal.com",
          status: "completed",
          sent_at: new Date().toISOString(),
        })

        if (logError) {
          console.error("Erro ao registrar relatório:", logError)
        }

        console.log("✅ Relatório programado processado com sucesso")
        console.log(`📊 Total: ${totalEvaluations} avaliações, Score médio: ${avgScore}`)
        
      } catch (error) {
        console.error("❌ Erro no processamento assíncrono:", error)
      }
    }

    // Executar processamento em background (não bloquear a resposta)
    processReports()

    return NextResponse.json({
      success: true,
      message: "Processamento assíncrono de relatórios iniciado",
      evaluationsCount: recentEvaluations?.length || 0,
      startedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error("Erro ao iniciar processamento assíncrono:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// Endpoint para verificar status do processamento
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Obter logs de processamento recentes
    const { data: logs, error } = await supabase
      .from("notification_logs")
      .select("*")
      .eq("notification_type", "scheduled_report")
      .order("sent_at", { ascending: false })
      .limit(5)

    if (error) throw error

    return NextResponse.json({
      success: true,
      processingStatus: "active",
      lastProcessed: logs?.[0]?.sent_at || null,
      totalProcessed: logs?.length || 0,
      logs: logs || [],
    })

  } catch (error) {
    console.error("Erro ao verificar status:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
