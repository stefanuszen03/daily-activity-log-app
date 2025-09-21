"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

const categories = [
  { value: "work", label: "Pekerjaan" },
  { value: "personal", label: "Pribadi" },
  { value: "health", label: "Kesehatan" },
  { value: "education", label: "Pendidikan" },
  { value: "hobby", label: "Hobi" },
  { value: "social", label: "Sosial" },
  { value: "general", label: "Umum" },
]

interface AddActivityFormProps {
  defaultDate?: string
}

export function AddActivityForm({ defaultDate }: AddActivityFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("general")
  const [activityDate, setActivityDate] = useState(defaultDate || new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase.from("activities").insert({
        title: title.trim(),
        description: description.trim() || null,
        category,
        user_id: user.id,
        activity_date: activityDate,
      })

      if (error) throw error

      // Reset form
      setTitle("")
      setDescription("")
      setCategory("general")
      if (!defaultDate) {
        setActivityDate(new Date().toISOString().split("T")[0])
      }

      // Refresh the page to show new activity
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Judul Kegiatan</Label>
          <Input
            id="title"
            placeholder="Contoh: Olahraga pagi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="activityDate">Tanggal</Label>
        <Input
          id="activityDate"
          type="date"
          value={activityDate}
          onChange={(e) => setActivityDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi (Opsional)</Label>
        <Textarea
          id="description"
          placeholder="Tambahkan detail kegiatan..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
      <Button type="submit" disabled={isLoading || !title.trim()} className="w-full md:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        {isLoading ? "Menambahkan..." : "Tambah Kegiatan"}
      </Button>
    </form>
  )
}
