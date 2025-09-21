import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { ActivityList } from "@/components/activity-list"
import { AddActivityForm } from "@/components/add-activity-form"
import { ActivityStats } from "@/components/activity-stats"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get today's activities
  const today = new Date().toISOString().split("T")[0]
  const { data: todayActivities } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .eq("activity_date", today)
    .order("created_at", { ascending: false })

  // Get activity stats for the current week
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const startOfWeekStr = startOfWeek.toISOString().split("T")[0]

  const { data: weekActivities } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .gte("activity_date", startOfWeekStr)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-balance">
              Selamat datang, {profile?.full_name || user.email?.split("@")[0]}
            </h1>
            <p className="text-muted-foreground">Catat dan kelola kegiatan harian Anda dengan mudah</p>
          </div>

          {/* Stats Section */}
          <ActivityStats activities={weekActivities || []} />

          {/* Add Activity Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tambah Kegiatan Baru</h2>
            <AddActivityForm />
          </div>

          {/* Today's Activities */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Kegiatan Hari Ini</h2>
            <ActivityList activities={todayActivities || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
