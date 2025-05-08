import type React from "react"
import * as LucideIcons from "lucide-react"

// İkon adını alıp ilgili Lucide ikonunu döndüren yardımcı fonksiyon
export function getIconComponent(iconName: string): React.ReactNode {
  // Eğer iconName boşsa veya undefined ise varsayılan ikon döndür
  if (!iconName) {
    return <LucideIcons.Briefcase className="h-8 w-8" />
  }

  // İlk harfi büyük, geri kalanı küçük harf yaparak standartlaştır
  // Örneğin: "briefcase" -> "Briefcase", "BRIEFCASE" -> "Briefcase"
  const standardizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase()

  // Lucide ikonları içinde bu isimde bir ikon var mı kontrol et
  const IconComponent = (LucideIcons as any)[standardizedName] || (LucideIcons as any)[iconName]

  // Eğer ikon bulunduysa render et, bulunamadıysa varsayılan ikon döndür
  if (IconComponent) {
    return <IconComponent className="h-8 w-8" />
  }

  // Hiçbir eşleşme bulunamazsa, konsola hata yazdır ve varsayılan ikon döndür
  console.warn(`Icon not found: ${iconName}. Using default icon instead.`)
  return <LucideIcons.Briefcase className="h-8 w-8" />
}
