import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function GET(request: NextRequest) {
  try {
    // URL'den path parametresini al
    const path = request.nextUrl.searchParams.get("path")

    if (!path) {
      return NextResponse.json({ message: "Path parametresi gereklidir", success: false }, { status: 400 })
    }

    // Belirtilen yolu yeniden doğrula
    revalidatePath(path)

    return NextResponse.json({ message: `${path} yolu başarıyla yeniden doğrulandı`, success: true }, { status: 200 })
  } catch (error) {
    console.error("Yeniden doğrulama hatası:", error)
    return NextResponse.json(
      { message: "Yeniden doğrulama sırasında bir hata oluştu", success: false },
      { status: 500 },
    )
  }
}
