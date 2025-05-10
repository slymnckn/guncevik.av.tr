import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Edit, Plus, Eye } from "lucide-react"
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Blog Yazıları</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Yeni Yazı</span>
            <span className="sm:hidden">Yeni</span>
          </Button>
        </Link>
      </div>

      {/* Masaüstü görünümü */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted border-b">
              <th className="p-3 text-left font-medium">Başlık</th>
              <th className="p-3 text-left font-medium">Kategori</th>
              <th className="p-3 text-left font-medium">Durum</th>
              <th className="p-3 text-left font-medium">Yayın Tarihi</th>
              <th className="p-3 text-left font-medium">Görüntülenme</th>
              <th className="p-3 text-center font-medium">İşlemler</th>
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
                    <Link href={`/makaleler/${post.slug}`} target="_blank">
                      <Button variant="outline" size="icon" aria-label="Blog yazısını görüntüle">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
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

      {/* Mobil görünümü */}
      <div className="md:hidden space-y-4">
        {posts?.map((post) => (
          <div key={post.id} className="bg-white rounded-lg border shadow-sm p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{post.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs ${post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
              >
                {post.published ? "Yayında" : "Taslak"}
              </span>
            </div>

            <div className="space-y-1 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Kategori:</span>
                <span>{post.blog_categories?.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Yayın Tarihi:</span>
                <span>{post.published_at ? formatDate(post.published_at) : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Görüntülenme:</span>
                <span>{post.view_count || 0}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Link href={`/makaleler/${post.slug}`} target="_blank">
                <Button variant="ghost" size="sm" className="h-8">
                  <Eye className="h-4 w-4 mr-1" />
                  Görüntüle
                </Button>
              </Link>
              <Link href={`/admin/blog/edit/${post.id}`}>
                <Button variant="outline" size="sm" className="h-8">
                  <Edit className="h-4 w-4 mr-1" />
                  Düzenle
                </Button>
              </Link>
              <DeleteBlogModal blogId={post.id} blogTitle={post.title} />
            </div>
          </div>
        ))}

        {!posts || posts.length === 0 ? (
          <div className="bg-white rounded-lg border p-6 text-center text-muted-foreground">
            Henüz blog yazısı bulunmuyor.
          </div>
        ) : null}
      </div>
    </div>
  )
}
