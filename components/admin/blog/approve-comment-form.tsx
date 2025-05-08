"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface ApproveCommentFormProps {
  comment: any
}

export function ApproveCommentForm({ comment }: ApproveCommentFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleApprove = async () => {
    setLoading(true)

    try {
      const { error } = await supabase
        .from("blog_comments")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq("id", comment.id)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Yorum onaylandı",
        description: "Yorum başarıyla onaylandı ve yayınlandı.",
      })

      router.push("/admin/blog/comments")
      router.refresh()
    } catch (error: any) {
      console.error("Yorum onaylanırken hata:", error)
      toast({
        title: "Hata",
        description: error.message || "Yorum onaylanırken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yorumu Onayla</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">İsim</h3>
          <p>{comment.name}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">E-posta</h3>
          <p>{comment.email}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Blog Yazısı</h3>
          <p>{comment.blog_posts?.title}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Yorum</h3>
          <div className="mt-1 p-4 bg-gray-50 rounded-md">
            <p className="whitespace-pre-wrap">{comment.content}</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Bu yorumu onaylamak istediğinizden emin misiniz? Onaylanan yorumlar site ziyaretçileri tarafından
                görülebilir.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/admin/blog/comments">
          <Button variant="outline">İptal</Button>
        </Link>
        <Button onClick={handleApprove} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              İşleniyor...
            </>
          ) : (
            "Yorumu Onayla"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
