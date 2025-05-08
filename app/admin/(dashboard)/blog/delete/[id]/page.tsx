import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DeleteBlogPost } from "@/components/admin/blog/delete-blog-post"

export default function DeleteBlogPostPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Yazısı Sil</h1>
          <p className="text-muted-foreground">Blog yazısı #{params.id} silme işlemi</p>
        </div>
      </div>

      <DeleteBlogPost id={params.id} />
    </div>
  )
}
