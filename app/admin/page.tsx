import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

async function SignOutButton() {
  async function signOut() {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <form action={signOut}>
      <Button variant="outline" size="sm" type="submit">
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </form>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("admin_profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-border/60 shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">FS</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard FitScore</h1>
                  <p className="text-muted-foreground font-medium">Sistema de Avaliação LEGAL</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pl-13">
                Bem-vindo,{" "}
                <span className="font-semibold text-foreground">{profile?.full_name || data.user.email}</span>
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">LEGAL</div>
                <div className="text-xs text-muted-foreground">Sistema de Avaliação</div>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <AdminDashboard />
      </div>
    </div>
  )
}
