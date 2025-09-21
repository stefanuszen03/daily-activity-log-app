"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Filter, X } from "lucide-react"

const categories = [
  { value: "all", label: "Semua Kategori" },
  { value: "work", label: "Pekerjaan" },
  { value: "personal", label: "Pribadi" },
  { value: "health", label: "Kesehatan" },
  { value: "education", label: "Pendidikan" },
  { value: "hobby", label: "Hobi" },
  { value: "social", label: "Sosial" },
  { value: "general", label: "Umum" },
]

const completionOptions = [
  { value: "all", label: "Semua Status" },
  { value: "true", label: "Selesai" },
  { value: "false", label: "Belum Selesai" },
]

export function ActivityFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentDate = searchParams.get("date") || ""
  const currentCategory = searchParams.get("category") || "all"
  const currentCompleted = searchParams.get("completed") || "all"

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all" || value === "") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/activities?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/activities")
  }

  const hasActiveFilters = currentDate || currentCategory !== "all" || currentCompleted !== "all"

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filter Kegiatan</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
              <X className="h-4 w-4 mr-1" />
              Hapus Filter
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-filter">Tanggal</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="date-filter"
                type="date"
                value={currentDate}
                onChange={(e) => updateFilter("date", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-filter">Kategori</Label>
            <Select value={currentCategory} onValueChange={(value) => updateFilter("category", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={currentCompleted} onValueChange={(value) => updateFilter("completed", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {completionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
