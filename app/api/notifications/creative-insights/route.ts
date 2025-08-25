import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const managerEmail = "example@example.com" // Assumindo que managerEmail deve ser declarado aqui

    const { error: logError } = await supabase.from("notification_logs").insert({
      evaluation_id: null,
      notification_type: "creative_insights", // Usando tipo dedicado em vez de manager_report
      recipient_email: managerEmail,
      status: "sent",
      sent_at: new Date().toISOString(),
    })

    if (logError) {
      console.error("Erro ao registrar notificação de insights criativos:", logError)
    }

  } catch (error) {
    console.error("Erro ao gerar insights criativos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
