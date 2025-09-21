"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { ActivityList } from "@/components/activity-list"
import { AddActivityForm } from "@/components/add-activity-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Activity {
  id: string
  title: string
  description: string | null
  category: string
  completed: boolean
  activity_date: string
  created_at: string
}

interface ActivityCalendarProps {
  activities: Activity[]
}

const categoryColors: Record<string, string> = {
  work: "bg-blue-500",
  personal: "bg-green-500",
  health: "bg-red-500",
  education: "bg-purple-500",
  hobby: "bg-yellow-500",
  social: "bg-pink-500",
  general: "bg-gray-500",
}

export function ActivityCalendar({ activities }: ActivityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Group activities by date
  const activitiesByDate = activities.reduce(
    (acc, activity) => {
      const date = activity.activity_date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(activity)
      return acc
    },
    {} as Record<string, Activity[]>,
  )

  // Get calendar days
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const current = new Date(startDate)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return formatDate(date) === formatDate(today)
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const selectedActivities = selectedDate ? activitiesByDate[selectedDate] || [] : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {currentDate.toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Hari Ini
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dateStr = formatDate(day)
                const dayActivities = activitiesByDate[dateStr] || []
                const isSelected = selectedDate === dateStr

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`
                      p-2 min-h-[60px] text-left border rounded-md transition-colors
                      ${isCurrentMonth(day) ? "bg-background" : "bg-muted/50 text-muted-foreground"}
                      ${isToday(day) ? "border-primary bg-primary/5" : "border-border"}
                      ${isSelected ? "bg-accent" : "hover:bg-accent/50"}
                    `}
                  >
                    <div className="text-sm font-medium">{day.getDate()}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayActivities.slice(0, 3).map((activity) => (
                        <div
                          key={activity.id}
                          className={`w-2 h-2 rounded-full ${categoryColors[activity.category] || categoryColors.general} ${
                            activity.completed ? "opacity-50" : ""
                          }`}
                        />
                      ))}
                      {dayActivities.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{dayActivities.length - 3}</div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Activities */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {selectedDate
                  ? new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })
                  : "Pilih Tanggal"}
              </CardTitle>
              {selectedDate && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Tambah
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Tambah Kegiatan</DialogTitle>
                    </DialogHeader>
                    <AddActivityForm defaultDate={selectedDate} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              selectedActivities.length > 0 ? (
                <ActivityList activities={selectedActivities} />
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Tidak ada kegiatan pada tanggal ini</p>
                </div>
              )
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>Klik pada tanggal di kalender untuk melihat kegiatan</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Kategori</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(categoryColors).map(([category, color]) => (
              <div key={category} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-sm capitalize">
                  {category === "work"
                    ? "Pekerjaan"
                    : category === "personal"
                      ? "Pribadi"
                      : category === "health"
                        ? "Kesehatan"
                        : category === "education"
                          ? "Pendidikan"
                          : category === "hobby"
                            ? "Hobi"
                            : category === "social"
                              ? "Sosial"
                              : "Umum"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
