"use client"

import { useState } from "react"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// İkon kategorileri
const categories = {
  "Hukuk ve İş": [
    "Scale",
    "Gavel",
    "Briefcase",
    "FileText",
    "FilePlus",
    "FileCheck",
    "FileX",
    "ClipboardList",
    "ClipboardCheck",
    "ClipboardSignature",
    "ScrollText",
    "Landmark",
    "Building",
    "Building2",
    "CircleDollarSign",
    "BadgeCheck",
    "BadgePlus",
    "Shield",
    "ShieldCheck",
    "ShieldAlert",
  ],
  İletişim: [
    "Mail",
    "Phone",
    "MessageSquare",
    "MessageCircle",
    "Send",
    "Share",
    "Link",
    "Globe",
    "AtSign",
    "Smartphone",
    "PhoneCall",
    "PhoneForwarded",
    "PhoneIncoming",
    "PhoneOutgoing",
  ],
  "Kullanıcı ve Kişiler": [
    "User",
    "UserCheck",
    "UserPlus",
    "Users",
    "UserCircle",
    "UserCog",
    "PersonStanding",
    "Contact",
    "ContactRound",
    "Group",
    "UserRound",
    "UserRoundPlus",
  ],
  "Arayüz ve Navigasyon": [
    "Home",
    "Settings",
    "Menu",
    "LayoutDashboard",
    "Search",
    "Bell",
    "Calendar",
    "Clock",
    "Eye",
    "EyeOff",
    "Filter",
    "SlidersHorizontal",
    "ChevronRight",
    "ChevronDown",
  ],
  Diğer: [
    "Heart",
    "Star",
    "Award",
    "Trophy",
    "Medal",
    "Bookmark",
    "BookOpen",
    "Book",
    "Lightbulb",
    "Zap",
    "Flame",
    "Target",
    "Sparkles",
    "Gem",
    "Diamond",
    "Crown",
  ],
}

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("Hukuk ve İş")

  // Tüm ikonları düz bir diziye çevirelim (arama için)
  const allIcons = Object.values(categories).flat()

  // Arama sonuçlarını filtreleyelim
  const filteredIcons = search
    ? allIcons.filter((icon) => icon.toLowerCase().includes(search.toLowerCase()))
    : categories[activeTab as keyof typeof categories] || []

  // Dinamik olarak Lucide ikonunu render eder
  const renderIcon = (iconName: string) => {
    // İlk harfi büyük, geri kalanı küçük harf yaparak standartlaştır
    const standardizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase()

    // Önce standartlaştırılmış isimle dene, olmazsa orijinal isimle dene
    const Icon = (LucideIcons as any)[standardizedName] || (LucideIcons as any)[iconName]

    return Icon ? <Icon className="h-5 w-5" /> : null
  }

  return (
    <div className="w-full space-y-4">
      <Input placeholder="İkon ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-2" />

      <Tabs defaultValue="Hukuk ve İş" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex flex-wrap h-auto">
          {Object.keys(categories).map((category) => (
            <TabsTrigger key={category} value={category} className="flex-grow">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-2">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {(search ? filteredIcons : categories[activeTab as keyof typeof categories]).map((iconName) => (
                <Button
                  key={iconName}
                  type="button" // Form göndermeyi engellemek için type="button" ekliyoruz
                  variant={value === iconName ? "default" : "outline"}
                  className="h-12 w-full flex flex-col items-center justify-center gap-1 p-1"
                  onClick={(e) => {
                    e.preventDefault() // Event'i durduruyoruz
                    onChange(iconName)
                  }}
                >
                  {renderIcon(iconName)}
                  <span className="text-[10px] truncate w-full text-center">{iconName}</span>
                </Button>
              ))}
            </div>

            {filteredIcons.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">İkon bulunamadı</div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-2 mt-2">
        <div className="font-medium">Seçilen İkon:</div>
        <div className="flex items-center gap-1.5">
          {renderIcon(value)}
          <span>{value}</span>
        </div>
      </div>
    </div>
  )
}
