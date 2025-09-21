"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Trash2, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditActivityDialog } from "@/components/edit-activity-dialog"

interface Activity {
  id: string
  title: string
  description: string | null
  category: string
  completed: boolean
  activity_date: string
  created_at: string
}

interface ActivityListProps {
  activities: Activity[]
}

const categoryLabels: Record<string, string> = {
  work: "Pekerjaan",
  personal: "Pribadi",
  health: "Kesehatan",
  education: "Pendidikan",
  hobby: "Hobi",
  social: "Sosial",
  general: "Umum",
}

const categoryColors: Record<string, string> = {
  work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  personal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  health: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  education: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  hobby: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  social: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  general: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export function ActivityList({ activities }: ActivityListProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const router = useRouter()

  const handleToggleComplete = async (activityId: string, completed: boolean) => {
    setIsUpdating(activityId)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("activities").update({ completed: !completed }).eq("id", activityId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error updating activity:", error)
    } finally {
      setIsUpdating(null)
    }
  }

  const handleDelete = async (activityId: string) => {
    if (!confirm("Yakin ingin menghapus kegiatan ini?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("activities").delete().eq("id", activityId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting activity:", error)
    }
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Belum ada kegiatan hari ini.</p>
        <p className="text-sm mt-1">Tambahkan kegiatan pertama Anda di atas!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <Card key={activity.id} className={`transition-opacity ${activity.completed ? "opacity-75" : ""}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={activity.completed}
                onCheckedChange={() => handleToggleComplete(activity.id, activity.completed)}
                disabled={isUpdating === activity.id}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-medium ${activity.completed ? "line-through text-muted-foreground" : ""}`}>
                      {activity.title}
                    </h3>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        variant="secondary"
                        className={categoryColors[activity.category] || categoryColors.general}
                      >
                        {categoryLabels[activity.category] || activity.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <EditActivityDialog activity={activity}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </EditActivityDialog>
                      <DropdownMenuItem onClick={() => handleDelete(activity.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
