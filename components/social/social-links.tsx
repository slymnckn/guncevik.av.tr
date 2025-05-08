import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialLinksProps {
  className?: string
  variant?: "default" | "minimal" | "footer"
}

export function SocialLinks({ className = "", variant = "default" }: SocialLinksProps) {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/guncevikhukuk",
      icon: Facebook,
    },
    {
      name: "Twitter",
      url: "https://twitter.com/guncevikhukuk",
      icon: Twitter,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/guncevikhukuk",
      icon: Linkedin,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/guncevikhukuk",
      icon: Instagram,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/channel/guncevikhukuk",
      icon: Youtube,
    },
  ]

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center space-x-3", className)}>
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors"
            aria-label={link.name}
          >
            <link.icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    )
  }

  if (variant === "footer") {
    return (
      <div className={cn("flex items-center space-x-4", className)}>
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={link.name}
          >
            <link.icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-100 hover:bg-primary/10 text-gray-600 hover:text-primary p-2 rounded-full transition-colors"
          aria-label={link.name}
        >
          <link.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  )
}
