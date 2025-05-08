import Image from "next/image"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface TestimonialCardProps {
  name: string
  role?: string
  image?: string
  rating: number
  testimonial: string
  className?: string
}

export function TestimonialCard({ name, role, image, rating, testimonial, className }: TestimonialCardProps) {
  return (
    <div className={cn("bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all hover:shadow-lg", className)}>
      <div className="flex items-center mb-4">
        {image && (
          <div className="mr-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden">
              <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </div>
          </div>
        )}
        <div>
          <div className="font-bold">{name}</div>
          {role && <div className="text-gray-600 dark:text-gray-400 text-sm">{role}</div>}
        </div>
      </div>
      <div className="flex mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn("h-4 w-4", i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
        ))}
      </div>
      <p className="text-gray-600 dark:text-gray-300">{testimonial}</p>
    </div>
  )
}

export default TestimonialCard
