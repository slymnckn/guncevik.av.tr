import type React from "react"
import * as LucideIcons from "lucide-react"

// Standart ikon boyutları
type IconSize = "sm" | "md" | "lg" | "xl"

// Boyut değerlerini piksel cinsinden tanımlama
const sizeMap: Record<IconSize, number> = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
}

// İkon adını alıp ilgili Lucide ikonunu döndüren yardımcı fonksiyon
export function getIconComponent(iconName: string, size: IconSize = "lg"): React.ReactNode {
  // Eğer iconName boşsa veya undefined ise varsayılan ikon döndür
  if (!iconName) {
    return <LucideIcons.Briefcase className={`h-${sizeMap[size]} w-${sizeMap[size]}`} />
  }

  // Kebab-case (tire ile ayrılmış) ikon isimlerini camelCase'e dönüştür
  // Örneğin: "dollar-sign" -> "DollarSign"
  let formattedIconName = iconName
  if (iconName.includes("-")) {
    formattedIconName = iconName
      .split("-")
      .map((part, index) => {
        // Her kelimenin ilk harfini büyük yap
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      })
      .join("")
  } else {
    // Kebab-case olmayan isimleri standartlaştır
    // İlk harfi büyük, geri kalanı küçük harf yaparak standartlaştır
    formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase()
  }

  // Lucide ikonları içinde bu isimde bir ikon var mı kontrol et
  const IconComponent = (LucideIcons as any)[formattedIconName]

  // Eğer ikon bulunduysa render et, bulunamadıysa varsayılan ikon döndür
  if (IconComponent) {
    return <IconComponent className={`h-${sizeMap[size]} w-${sizeMap[size]}`} />
  }

  // Hiçbir eşleşme bulunamazsa, konsola hata yazdır ve varsayılan ikon döndür
  console.warn(`Icon not found: ${iconName}. Using default icon instead.`)
  return <LucideIcons.Briefcase className={`h-${sizeMap[size]} w-${sizeMap[size]}`} />
}

// Tüm mevcut Lucide ikonlarının listesini döndüren yardımcı fonksiyon
export function getAvailableIcons(): string[] {
  return Object.keys(LucideIcons)
    .filter((key) => typeof LucideIcons[key as keyof typeof LucideIcons] === "function" && key !== "default")
    .sort()
}

// İkon adını kebab-case'den camelCase'e dönüştüren yardımcı fonksiyon
export function standardizeIconName(iconName: string): string {
  if (!iconName) return "briefcase"

  if (iconName.includes("-")) {
    return iconName
      .split("-")
      .map((part, index) => {
        if (index === 0) return part.toLowerCase()
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      })
      .join("")
  }

  return iconName.toLowerCase()
}

// İkon adını camelCase'den kebab-case'e dönüştüren yardımcı fonksiyon
export function kebabCaseIconName(iconName: string): string {
  if (!iconName) return "briefcase"

  return iconName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}
