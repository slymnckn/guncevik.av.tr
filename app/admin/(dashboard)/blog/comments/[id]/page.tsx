import { createServerSupabaseClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"

interface PageProps {
  params: {
    id: string
  }
}

export const dynamic = "force-dynamic"

export default async function CommentDetailPage({ params }: PageProps) {
  await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { data: comment, error } = await supabase
    .from("blog_comments")
    .select(`
      *,
      blog_posts(id, title, slug),
      parent:parent_id(id, name, content)
    `)
    .eq("id", params.id)
    .single()

  if (error || !comment) {
    console.error("Yorum alınırken hata:", error)
    notFound()
  }

  // Get replies to this comment
  const { data: replies } = await supabase
    .from("blog_comments")
    .select("*")
    .eq("parent_id", comment.id)
    .order("created_at", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/blog/comments" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Yorumlara Dön
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Yorum Detayı</CardTitle>
              <div className="flex space-x-2">
                {comment.status !== "approved" && (
                  <Link href={`/admin/blog/comments/approve/${comment.id}`}>
                    <Button size="sm" variant="outline" className="text-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Onayla
                    </Button>
                  </Link>
                )}
                {comment.status !== "rejected" && (
                  <Link href={`/admin/blog/comments/reject/${comment.id}`}>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reddet
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">İsim</h3>
                <p>{comment.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">E-posta</h3>
                <p>{comment.email}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Blog Yazısı</h3>
              <Link
                href={`/makaleler/${comment.blog_posts?.slug}`}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                {comment.blog_posts?.title}
              </Link>
            </div>

            {comment.parent && (
              <div className="border-l-4 border-gray-200 pl-4 py-2">
                <h3 className="text-sm font-medium text-gray-500">Yanıt Verilen Yorum</h3>
                <p className="font-medium">{comment.parent.name}</p>
                <p className="text-gray-700">{comment.parent.content}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Yorum</h3>
              <div className="mt-1 p-4 bg-gray-50 rounded-md">
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Durum</h3>
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
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Oluşturulma Tarihi</h3>
                <p>{formatDateTime(comment.created_at)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Güncelleme Tarihi</h3>
                <p>{formatDateTime(comment.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {replies && replies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Yanıtlar ({replies.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {replies.map((reply) => (
                  <div key={reply.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{reply.name}</p>
                        <p className="text-sm text-gray-500">{reply.email}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reply.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : reply.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {reply.status === "approved"
                          ? "Onaylandı"
                          : reply.status === "rejected"
                            ? "Reddedildi"
                            : "Bekliyor"}
                      </span>
                    </div>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <p className="whitespace-pre-wrap">{reply.content}</p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">{formatDateTime(reply.created_at)}</div>
                    <div className="mt-2 flex space-x-2">
                      <Link href={`/admin/blog/comments/${reply.id}`}>
                        <Button size="sm" variant="ghost">
                          Detay
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
