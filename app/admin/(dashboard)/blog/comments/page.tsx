import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Eye } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

export const dynamic = "force-dynamic"

export default async function CommentsPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: comments, error } = await supabase
    .from("blog_comments")
    .select(`
      *,
      blog_posts(id, title, slug)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Yorumlar alınırken hata:", error)
    return <div>Yorumlar yüklenirken bir hata oluştu.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Yorumlar</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İsim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yorum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blog Yazısı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium">{comment.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="truncate">{comment.content}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/makaleler/${comment.blog_posts?.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:underline truncate block max-w-xs"
                    >
                      {comment.blog_posts?.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        comment.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : comment.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {comment.status === "approved"
                        ? "Onaylandı"
                        : comment.status === "rejected"
                          ? "Reddedildi"
                          : "Bekliyor"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(comment.created_at), "d MMMM yyyy", { locale: tr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2 justify-end">
                      <Link href={`/admin/blog/comments/${comment.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Görüntüle</span>
                        </Button>
                      </Link>
                      {comment.status !== "approved" && (
                        <Link href={`/admin/blog/comments/approve/${comment.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Onayla</span>
                          </Button>
                        </Link>
                      )}
                      {comment.status !== "rejected" && (
                        <Link href={`/admin/blog/comments/reject/${comment.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600">
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only">Reddet</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Henüz yorum bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
