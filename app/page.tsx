import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, CheckCircle, BarChart3 } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">Daily Activity Log</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Daftar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            Catat Kegiatan Harian Anda dengan <span className="text-primary">Mudah</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Kelola dan pantau aktivitas harian Anda dengan aplikasi yang sederhana namun powerful. Tingkatkan
            produktivitas dan capai tujuan Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Mulai Gratis</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sudah Punya Akun?</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Mudah Digunakan</CardTitle>
              <CardDescription>Interface yang intuitif dan mudah dipahami untuk semua kalangan</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Statistik Lengkap</CardTitle>
              <CardDescription>Pantau progress dan tingkat penyelesaian kegiatan Anda</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Kalender Terintegrasi</CardTitle>
              <CardDescription>Lihat semua kegiatan dalam tampilan kalender yang praktis</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card border border-border rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4 text-balance">Siap Meningkatkan Produktivitas?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna yang sudah merasakan manfaat mencatat kegiatan harian dengan aplikasi
            kami.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Daftar Sekarang - Gratis!</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">Daily Activity Log</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 Daily Activity Log. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
