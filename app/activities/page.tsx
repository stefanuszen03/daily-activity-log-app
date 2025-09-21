import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { ActivityCalendar } from "@/components/activity-calendar"
import { ActivityFilters } from "@/components/activity-filters"

interface SearchParams {
  date?: string
  category?: string
  completed?: string
}

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Build query based on filters
  let query = supabase.from("activities").select("*").eq("user_id", user.id)

  if (params.date) {
    query = query.eq("activity_date", params.date)
  }

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category)
  }

  if (params.completed) {
    query = query.eq("completed", params.completed === "true")
  }

  const { data: activities } = await query
    .order("activity_date", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-balance">Kelola Kegiatan</h1>
            <p className="text-muted-foreground">Lihat dan kelola semua kegiatan Anda</p>
          </div>

          {/* Filters */}
          <ActivityFilters />

          {/* Calendar View */}
          <ActivityCalendar activities={activities || []} />
        </div>
      </main>
    </div>
  )
}
