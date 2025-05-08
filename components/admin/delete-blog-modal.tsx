"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Trash2 } from "lucide-react"
import { deleteBlogPost } from "@/actions/blog-actions"
import { useToast } from "@/hooks/use-toast"

interface DeleteBlogModalProps {
  blogId: string
  blogTitle: string
}

export function DeleteBlogModal({ blogId, blogTitle }: DeleteBlogModalProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteBlogPost(blogId)

      if (result.success) {
        toast({
          title: "Blog yazısı silindi",
          description: "Blog yazısı başarıyla silindi.",
          variant: "default",
        })
        setOpen(false)
      } else {
        toast({
          title: "Hata",
          description: result.error || "Blog yazısı silinirken bir hata oluştu.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Blog yazısı silinirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button variant="destructive" size="icon" onClick={() => setOpen(true)} aria-label="Blog yazısını sil">
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Blog Yazısını Sil</DialogTitle>
            <DialogDescription>
              &quot;{blogTitle}&quot; başlıklı blog yazısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
              İptal
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                "Sil"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
