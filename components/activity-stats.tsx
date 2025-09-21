import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Target, TrendingUp } from "lucide-react"

interface Activity {
  id: string
  title: string
  completed: boolean
  category: string
  activity_date: string
}

interface ActivityStatsProps {
  activities: Activity[]
}

export function ActivityStats({ activities }: ActivityStatsProps) {
  const totalActivities = activities.length
  const completedActivities = activities.filter((activity) => activity.completed).length
  const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0

  // Group by category
  const categoryCounts = activities.reduce(
    (acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategory = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "Belum ada"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Kegiatan</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalActivities}</div>
          <p className="text-xs text-muted-foreground">Minggu ini</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Selesai</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedActivities}</div>
          <p className="text-xs text-muted-foreground">Kegiatan selesai</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tingkat Penyelesaian</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <p className="text-xs text-muted-foreground">Dari total kegiatan</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kategori Utama</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{topCategory}</div>
          <p className="text-xs text-muted-foreground">Paling sering</p>
        </CardContent>
      </Card>
    </div>
  )
}
