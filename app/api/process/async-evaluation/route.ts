import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { evaluationId } = await request.json()

    // Processamento assíncrono da avaliação
    const { data: evaluation, error: fetchError } = await supabase
      .from("evaluations")
      .select("*")
      .eq("id", evaluationId)
      .single()

    if (fetchError || !evaluation) {
      throw new Error("Avaliação não encontrada")
    }

    // Simular processamento assíncrono
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Enviar notificação assíncrona
    const notificationResult = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/notifications/candidate-result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evaluationId }),
    })

    // Registrar log de processamento
    const { error: logError } = await supabase.from("notification_logs").insert({
      evaluation_id: evaluationId,
      notification_type: "async_processing",
      recipient_email: evaluation.candidate_email,
      status: "completed",
      sent_at: new Date().toISOString(),
    })

    if (logError) {
      console.error("Erro ao registrar log:", logError)
    }

    return NextResponse.json({
      success: true,
      message: "Processamento assíncrono concluído",
      evaluationId,
      processedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error("Erro no processamento assíncrono:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
