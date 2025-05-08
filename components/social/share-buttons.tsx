"use client"

import { useState } from "react"
import { Facebook, Twitter, Linkedin, Mail, LinkIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "@/hooks/use-analytics"
import { cn } from "@/lib/utils"

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  className?: string
  variant?: "default" | "minimal" | "icon"
}

export function ShareButtons({ url, title, description = "", className = "", variant = "default" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const { trackEvent } = useAnalytics()

  // URL'yi kopyala
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      trackEvent("share", { category: "Social", label: "Copy Link" })
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Sosyal medyada paylaş
  const share = (platform: string) => {
    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
        break
    }

    trackEvent("share", { category: "Social", label: platform })

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer")
    }
  }

  if (variant === "icon") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <button
          onClick={() => share("facebook")}
          className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="Facebook'ta paylaş"
        >
          <Facebook className="h-4 w-4" />
        </button>
        <button
          onClick={() => share("twitter")}
          className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-400 transition-colors"
          aria-label="Twitter'da paylaş"
        >
          <Twitter className="h-4 w-4" />
        </button>
        <button
          onClick={() => share("linkedin")}
          className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 transition-colors"
          aria-label="LinkedIn'de paylaş"
        >
          <Linkedin className="h-4 w-4" />
        </button>
        <button
          onClick={() => share("email")}
          className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-500 transition-colors"
          aria-label="E-posta ile paylaş"
        >
          <Mail className="h-4 w-4" />
        </button>
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-500 transition-colors"
          aria-label="Bağlantıyı kopyala"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
        </button>
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <button
          onClick={() => share("facebook")}
          className="text-gray-500 hover:text-blue-600 transition-colors"
          aria-label="Facebook'ta paylaş"
        >
          <Facebook className="h-5 w-5" />
        </button>
        <button
          onClick={() => share("twitter")}
          className="text-gray-500 hover:text-blue-400 transition-colors"
          aria-label="Twitter'da paylaş"
        >
          <Twitter className="h-5 w-5" />
        </button>
        <button
          onClick={() => share("linkedin")}
          className="text-gray-500 hover:text-blue-700 transition-colors"
          aria-label="LinkedIn'de paylaş"
        >
          <Linkedin className="h-5 w-5" />
        </button>
        <button
          onClick={() => share("email")}
          className="text-gray-500 hover:text-blue-500 transition-colors"
          aria-label="E-posta ile paylaş"
        >
          <Mail className="h-5 w-5" />
        </button>
        <button
          onClick={copyToClipboard}
          className="text-gray-500 hover:text-blue-500 transition-colors"
          aria-label="Bağlantıyı kopyala"
        >
          {copied ? <Check className="h-5 w-5 text-green-500" /> : <LinkIcon className="h-5 w-5" />}
        </button>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <p className="font-medium text-gray-700">Bu içeriği paylaş:</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
          onClick={() => share("facebook")}
        >
          <Facebook className="h-4 w-4" />
          <span>Facebook</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-400 hover:border-blue-200"
          onClick={() => share("twitter")}
        >
          <Twitter className="h-4 w-4" />
          <span>Twitter</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
          onClick={() => share("linkedin")}
        >
          <Linkedin className="h-4 w-4" />
          <span>LinkedIn</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200"
          onClick={() => share("email")}
        >
          <Mail className="h-4 w-4" />
          <span>E-posta</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
          <span>{copied ? "Kopyalandı!" : "Bağlantıyı Kopyala"}</span>
        </Button>
      </div>
    </div>
  )
}
