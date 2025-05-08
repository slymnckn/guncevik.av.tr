"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Link2, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
}

export function ShareButtons({ url, title, description = "" }: ShareButtonsProps) {
  const { toast } = useToast()

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Bağlantı kopyalandı",
        description: "Bağlantı panoya kopyalandı",
      })
    } catch (error) {
      console.error("Bağlantı kopyalanırken hata:", error)
      toast({
        title: "Hata",
        description: "Bağlantı kopyalanırken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
        onClick={() => window.open(shareLinks.facebook, "_blank")}
        aria-label="Facebook'ta paylaş"
      >
        <Facebook className="h-4 w-4 mr-2" />
        <span className="sr-only md:not-sr-only md:inline-block">Facebook</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90"
        onClick={() => window.open(shareLinks.twitter, "_blank")}
        aria-label="Twitter'da paylaş"
      >
        <Twitter className="h-4 w-4 mr-2" />
        <span className="sr-only md:not-sr-only md:inline-block">Twitter</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90"
        onClick={() => window.open(shareLinks.linkedin, "_blank")}
        aria-label="LinkedIn'de paylaş"
      >
        <Linkedin className="h-4 w-4 mr-2" />
        <span className="sr-only md:not-sr-only md:inline-block">LinkedIn</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="bg-[#D44638] text-white hover:bg-[#D44638]/90"
        onClick={() => window.open(shareLinks.email, "_blank")}
        aria-label="E-posta ile paylaş"
      >
        <Mail className="h-4 w-4 mr-2" />
        <span className="sr-only md:not-sr-only md:inline-block">E-posta</span>
      </Button>

      <Button variant="outline" size="sm" onClick={copyToClipboard} aria-label="Bağlantıyı kopyala">
        <Link2 className="h-4 w-4 mr-2" />
        <span className="sr-only md:not-sr-only md:inline-block">Kopyala</span>
      </Button>
    </div>
  )
}
