import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-balance">Daily Activity Log</h1>
        </div>

        <Card className="border-border">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl">Verifikasi Email</CardTitle>
            <CardDescription>Kami telah mengirim link verifikasi ke email Anda</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Silakan cek email Anda dan klik link verifikasi untuk mengaktifkan akun. Setelah verifikasi, Anda dapat
              masuk ke aplikasi.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Kembali ke Halaman Masuk</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
