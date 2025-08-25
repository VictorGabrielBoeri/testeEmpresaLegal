import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { evaluationId } = await request.json()

    if (!evaluationId) {
      return NextResponse.json({ error: "Evaluation ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get evaluation details
    const { data: evaluation, error: evalError } = await supabase
      .from("evaluations")
      .select("*")
      .eq("id", evaluationId)
      .single()

    if (evalError || !evaluation) {
      return NextResponse.json({ error: "Evaluation not found" }, { status: 404 })
    }

    // Simulate email notification (in production, integrate with email service)
    const emailContent = generateCandidateEmail(evaluation)

    // Log notification
    const { error: logError } = await supabase.from("notification_logs").insert({
      evaluation_id: evaluationId,
      notification_type: "candidate_result",
      recipient_email: evaluation.candidate_email,
      status: "sent",
      sent_at: new Date().toISOString(),
    })

    if (logError) {
      console.error("Error logging notification:", logError)
    }

    // In production, send actual email here
    console.log(`[v0] Email sent to ${evaluation.candidate_email}:`, emailContent)

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      emailPreview: emailContent,
    })
  } catch (error) {
    console.error("Error sending candidate notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateCandidateEmail(evaluation: any) {
  const getClassificationMessage = (classification: string, score: number) => {
    switch (classification) {
      case "Fit Altíssimo":
        return {
          title: "Parabéns! Você obteve um resultado excepcional!",
          message: `Com um FitScore de ${score}, você demonstrou excelente alinhamento com os valores e requisitos da LEGAL. Nossa equipe entrará em contato em breve para os próximos passos.`,
          color: "#10B981",
        }
      case "Fit Aprovado":
        return {
          title: "Ótimo resultado! Você foi aprovado na avaliação.",
          message: `Seu FitScore de ${score} indica um bom alinhamento com nosso perfil. Aguarde contato da nossa equipe para continuidade do processo.`,
          color: "#3B82F6",
        }
      case "Fit Questionável":
        return {
          title: "Resultado da sua avaliação FitScore",
          message: `Seu FitScore foi ${score}. Embora algumas áreas precisem de desenvolvimento, há potencial. Nossa equipe pode entrar em contato para feedback detalhado.`,
          color: "#F59E0B",
        }
      default:
        return {
          title: "Obrigado por participar da avaliação FitScore",
          message: `Seu FitScore foi ${score}. Infelizmente, neste momento seu perfil não está alinhado com nossas necessidades atuais, mas encorajamos você a se desenvolver e tentar novamente no futuro.`,
          color: "#EF4444",
        }
    }
  }

  const { title, message, color } = getClassificationMessage(evaluation.fit_classification, evaluation.fit_score)

  return {
    to: evaluation.candidate_email,
    subject: `Resultado da sua Avaliação FitScore - ${evaluation.fit_classification}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1F2937; margin-bottom: 10px;">LEGAL</h1>
          <div style="width: 60px; height: 4px; background: ${color}; margin: 0 auto;"></div>
        </div>
        
        <div style="background: #F9FAFB; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1F2937; margin-bottom: 15px;">${title}</h2>
          <p style="color: #4B5563; line-height: 1.6; margin-bottom: 20px;">Olá ${evaluation.candidate_name},</p>
          <p style="color: #4B5563; line-height: 1.6; margin-bottom: 20px;">${message}</p>
          
          <div style="background: white; padding: 20px; border-radius: 6px; text-align: center;">
            <div style="font-size: 48px; font-weight: bold; color: ${color}; margin-bottom: 10px;">
              ${evaluation.fit_score}
            </div>
            <div style="font-size: 18px; font-weight: 600; color: ${color};">
              ${evaluation.fit_classification}
            </div>
          </div>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #1E40AF; margin-bottom: 15px;">Detalhamento da Avaliação</h3>
          <div style="display: grid; gap: 10px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #4B5563;">Performance:</span>
              <span style="font-weight: 600; color: #1F2937;">
                ${Math.round(((evaluation.performance_experience + evaluation.performance_deliveries + evaluation.performance_skills) / 3) * 2)}/10
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #4B5563;">Energia:</span>
              <span style="font-weight: 600; color: #1F2937;">
                ${Math.round(((evaluation.energy_availability + evaluation.energy_deadlines + evaluation.energy_pressure) / 3) * 2)}/10
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #4B5563;">Cultura:</span>
              <span style="font-weight: 600; color: #1F2937;">
                ${Math.round(((evaluation.culture_values + evaluation.culture_collaboration + evaluation.culture_innovation) / 3) * 2)}/10
              </span>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; color: #6B7280; font-size: 14px;">
          <p>Este é um e-mail automático. Para dúvidas, entre em contato conosco.</p>
          <p style="margin-top: 20px;">© 2024 LEGAL. Todos os direitos reservados.</p>
        </div>
      </div>
    `,
  }
}
