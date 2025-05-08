import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Edit, Plus } from "lucide-react"
import { DeleteBlogModal } from "@/components/admin/delete-blog-modal"

export default async function AdminBlogPage() {
  const supabase = createClient()

  // Blog yazılarını ve kategorilerini alalım
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select(`
      id,
      title,
      slug,
      published,
      published_at,
      created_at,
      view_count,
      blog_categories (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Blog yazıları alınırken hata oluştu:", error.message)
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Yazıları</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Yazı
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 text-left">Başlık</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-left">Durum</th>
              <th className="p-3 text-left">Yayın Tarihi</th>
              <th className="p-3 text-left">Görüntülenme</th>
              <th className="p-3 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((post) => (
              <tr key={post.id} className="border-b hover:bg-muted/50">
                <td className="p-3">{post.title}</td>
                <td className="p-3">{post.blog_categories?.name || "-"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {post.published ? "Yayında" : "Taslak"}
                  </span>
                </td>
                <td className="p-3">{post.published_at ? formatDate(post.published_at) : "-"}</td>
                <td className="p-3">{post.view_count || 0}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <Link href={`/admin/blog/edit/${post.id}`}>
                      <Button variant="outline" size="icon" aria-label="Blog yazısını düzenle">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteBlogModal blogId={post.id} blogTitle={post.title} />
                  </div>
                </td>
              </tr>
            ))}

            {!posts || posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-center text-muted-foreground">
                  Henüz blog yazısı bulunmuyor.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
