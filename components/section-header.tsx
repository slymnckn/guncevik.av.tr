import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ title, subtitle, centered = true, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8", centered && "text-center", className)}>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      {subtitle && (
        <p className={cn("text-gray-600 dark:text-gray-300", centered && "max-w-2xl mx-auto")}>{subtitle}</p>
      )}
    </div>
  )
}

export default SectionHeader
