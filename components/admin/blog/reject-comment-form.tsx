"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface RejectCommentFormProps {
  comment: any
}

export function RejectCommentForm({ comment }: RejectCommentFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  const handleReject = async () => {
    setLoading(true)

    try {
      const { error } = await supabase
        .from("blog_comments")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .eq("id", comment.id)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Yorum reddedildi",
        description: "Yorum başarıyla reddedildi.",
      })

      router.push("/admin/blog/comments")
      router.refresh()
    } catch (error: any) {
      console.error("Yorum reddedilirken hata:", error)
      toast({
        title: "Hata",
        description: error.message || "Yorum reddedilirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yorumu Reddet</CardTitle>
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

        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Bu yorumu reddetmek istediğinizden emin misiniz? Reddedilen yorumlar site ziyaretçileri tarafından
                görüntülenemez.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/admin/blog/comments">
          <Button variant="outline">İptal</Button>
        </Link>
        <Button onClick={handleReject} disabled={loading} variant="destructive">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              İşleniyor...
            </>
          ) : (
            "Yorumu Reddet"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
