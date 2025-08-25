import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get all candidates with FitScore >= 80 from the last 12 hours
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()

    const { data: approvedCandidates, error: queryError } = await supabase
      .from("evaluations")
      .select("*")
      .gte("fit_score", 80)
      .gte("created_at", twelveHoursAgo)
      .order("fit_score", { ascending: false })

    if (queryError) {
      throw queryError
    }

    if (!approvedCandidates || approvedCandidates.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No new approved candidates in the last 12 hours",
        count: 0,
      })
    }

    // Generate report
    const report = generateApprovedCandidatesReport(approvedCandidates)

    // Log notification to admin
    const { error: logError } = await supabase.from("notification_logs").insert({
      notification_type: "approved_candidates_report",
      recipient_email: "admin@legal.com", // In production, get from admin settings
      status: "sent",
      sent_at: new Date().toISOString(),
    })

    if (logError) {
      console.error("Error logging report notification:", logError)
    }

    // In production, send actual email to admin
    console.log("[v0] Approved candidates report generated:", report)

    return NextResponse.json({
      success: true,
      message: "Report generated and sent successfully",
      count: approvedCandidates.length,
      reportPreview: report,
    })
  } catch (error) {
    console.error("Error generating approved candidates report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateApprovedCandidatesReport(candidates: any[]) {
  const totalCandidates = candidates.length
  const averageScore = Math.round(candidates.reduce((sum, c) => sum + c.fit_score, 0) / totalCandidates)
  const topCandidate = candidates[0]

  return {
    to: "admin@legal.com",
    subject: `Relatório de Candidatos Aprovados - ${totalCandidates} novos candidatos`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1F2937; margin-bottom: 10px;">LEGAL - Relatório de Candidatos</h1>
          <div style="width: 80px; height: 4px; background: #10B981; margin: 0 auto;"></div>
        </div>
        
        <div style="background: #F0FDF4; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #10B981;">
          <h2 style="color: #166534; margin-bottom: 15px;">📊 Resumo Executivo</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div style="text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #10B981;">${totalCandidates}</div>
              <div style="color: #166534; font-weight: 600;">Candidatos Aprovados</div>
              <div style="color: #4B5563; font-size: 14px;">Últimas 12 horas</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #10B981;">${averageScore}</div>
              <div style="color: #166534; font-weight: 600;">Score Médio</div>
              <div style="color: #4B5563; font-size: 14px;">FitScore ≥ 80</div>
            </div>
          </div>
        </div>

        ${
          topCandidate
            ? `
        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #F59E0B;">
          <h3 style="color: #92400E; margin-bottom: 15px;">🏆 Destaque do Período</h3>
          <div style="background: white; padding: 15px; border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: bold; color: #1F2937; font-size: 18px;">${topCandidate.candidate_name}</div>
                <div style="color: #6B7280;">${topCandidate.candidate_email}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 24px; font-weight: bold; color: #10B981;">${topCandidate.fit_score}</div>
                <div style="color: #10B981; font-weight: 600;">Fit Altíssimo</div>
              </div>
            </div>
          </div>
        </div>
        `
            : ""
        }
        
        <div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
          <div style="background: #F9FAFB; padding: 15px; border-bottom: 1px solid #E5E7EB;">
            <h3 style="color: #1F2937; margin: 0;">Lista Completa de Candidatos Aprovados</h3>
          </div>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #F3F4F6;">
                  <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600; border-bottom: 1px solid #E5E7EB;">Nome</th>
                  <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600; border-bottom: 1px solid #E5E7EB;">E-mail</th>
                  <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600; border-bottom: 1px solid #E5E7EB;">FitScore</th>
                  <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600; border-bottom: 1px solid #E5E7EB;">Data</th>
                </tr>
              </thead>
              <tbody>
                ${candidates
                  .map(
                    (candidate, index) => `
                  <tr style="border-bottom: 1px solid #F3F4F6; ${index % 2 === 0 ? "background: #FAFAFA;" : ""}">
                    <td style="padding: 12px; color: #1F2937; font-weight: 500;">${candidate.candidate_name}</td>
                    <td style="padding: 12px; color: #6B7280;">${candidate.candidate_email}</td>
                    <td style="padding: 12px; text-align: center;">
                      <span style="background: #D1FAE5; color: #065F46; padding: 4px 8px; border-radius: 4px; font-weight: 600;">
                        ${candidate.fit_score}
                      </span>
                    </td>
                    <td style="padding: 12px; text-align: center; color: #6B7280; font-size: 14px;">
                      ${new Date(candidate.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin-top: 25px;">
          <h3 style="color: #1E40AF; margin-bottom: 15px;">💡 Próximos Passos Recomendados</h3>
          <ul style="color: #4B5563; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li>Priorizar contato com candidatos de FitScore ≥ 90</li>
            <li>Agendar entrevistas técnicas para os top performers</li>
            <li>Revisar perfis detalhados no dashboard administrativo</li>
            <li>Considerar processo acelerado para candidatos excepcionais</li>
          </ul>
        </div>
        
        <div style="text-align: center; color: #6B7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <p>Relatório gerado automaticamente pelo Sistema FitScore</p>
          <p>© 2024 LEGAL. Todos os direitos reservados.</p>
        </div>
      </div>
    `,
  }
}
