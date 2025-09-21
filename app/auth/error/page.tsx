import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-balance">Daily Activity Log</h1>
        </div>

        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Terjadi Kesalahan</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {params?.error ? (
              <p className="text-sm text-muted-foreground">Error: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Terjadi kesalahan yang tidak diketahui.</p>
            )}
            <Button asChild className="w-full">
              <Link href="/auth/login">Kembali ke Halaman Masuk</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
