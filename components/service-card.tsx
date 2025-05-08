import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface ServiceCardProps {
  service: {
    id: string | number
    title: string
    description: string
    slug?: string
    icon?: string
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl">{service.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-base text-gray-600 dark:text-gray-300">{service.description}</CardDescription>
      </CardContent>
      {service.slug && (
        <CardFooter>
          <Link href={`/hizmetlerimiz/${service.slug}`} passHref>
            <Button variant="outline" className="w-full">
              Detaylı Bilgi <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
