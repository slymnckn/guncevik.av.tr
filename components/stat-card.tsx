import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: ReactNode
  value: string
  label: string
  className?: string
}

export function StatCard({ icon, value, label, className }: StatCardProps) {
  return (
    <div className={cn("bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all hover:shadow-lg", className)}>
      <div className="flex items-center mb-4">
        <div className="bg-primary/10 p-3 rounded-full mr-4">{icon}</div>
        <div>
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-gray-600 dark:text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
