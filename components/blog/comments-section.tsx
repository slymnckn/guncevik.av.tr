"use client"

import { useState, useEffect } from "react"
import { CommentForm } from "./comment-form"
import { useToast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"
import { MessageSquare, RefreshCw } from "lucide-react"
import type { Comment } from "@/lib/types/comments"

interface CommentsSectionProps {
  postId: string
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments/${postId}`)

      if (!response.ok) {
        throw new Error("Yorumlar yüklenirken bir hata oluştu")
      }

      const data = await response.json()
      setComments(data.comments || [])
    } catch (error: any) {
      console.error("Yorumlar yüklenirken hata:", error)
      toast({
        title: "Hata",
        description: error.message || "Yorumlar yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const refreshComments = async () => {
    setRefreshing(true)
    await fetchComments()
    setRefreshing(false)
  }

  const renderComment = (comment: Comment) => (
    <div key={comment.id} className="border-b border-gray-100 last:border-0 py-4">
      <div className="flex justify-between items-start">
        <div className="font-medium">{comment.name}</div>
        <div className="text-sm text-gray-500">{formatDate(comment.created_at)}</div>
      </div>
      <div className="mt-2 text-gray-700">{comment.content}</div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 pl-6 border-l-2 border-gray-100 space-y-4">{comment.replies.map(renderComment)}</div>
      )}
    </div>
  )

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Yorumlar
        </h2>
        <button
          onClick={refreshComments}
          disabled={refreshing}
          className="text-sm text-gray-500 flex items-center hover:text-gray-700 transition-colors"
          aria-label="Yorumları yenile"
        >
          <RefreshCw className={`mr-1 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Yorum Yap</h3>
        <CommentForm postId={postId} onSuccess={refreshComments} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="py-8 text-center text-gray-500">Yorumlar yükleniyor...</div>
        ) : comments.length > 0 ? (
          <div className="space-y-0 divide-y divide-gray-100">{comments.map(renderComment)}</div>
        ) : (
          <div className="py-8 text-center text-gray-500">Henüz yorum yapılmamış. İlk yorumu siz yapın!</div>
        )}
      </div>
    </div>
  )
}
