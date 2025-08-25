import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const managerEmail = "example@example.com" // Assuming managerEmail is supposed to be declared here

    const { error: logError } = await supabase.from("notification_logs").insert({
      evaluation_id: null,
      notification_type: "creative_insights", // Using dedicated type instead of manager_report
      recipient_email: managerEmail,
      status: "sent",
      sent_at: new Date().toISOString(),
    })

    if (logError) {
      console.error("Error logging creative insights notification:", logError)
    }

  } catch (error) {
    console.error("Error generating creative insights:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
