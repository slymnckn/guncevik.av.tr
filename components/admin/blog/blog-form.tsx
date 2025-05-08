"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { BlogFormFields, blogFormSchema, type BlogFormValues } from "./blog-form-fields"
import { slugify } from "@/lib/utils"
import type { BlogCategory } from "@/lib/types"

interface BlogFormProps {
  post?: any
  categories: BlogCategory[]
  initialTags?: string[]
}

export function BlogForm({ post, categories, initialTags = [] }: BlogFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  // Form başlangıç değerleri
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      category_id: post?.category_id || "",
      meta_description: post?.meta_description || "",
      published: post?.published || false,
      tags: [],
      image: undefined,
    },
  })

  // Debug için kategorileri konsola yazdır
  useEffect(() => {
    console.log("Categories received:", categories)
  }, [categories])

  // Mevcut resmi yükle
  useEffect(() => {
    const loadImage = async () => {
      if (post?.image_path) {
        try {
          const { data } = await supabase.storage.from("blog-images").getPublicUrl(post.image_path)
          if (data?.publicUrl) {
            setImagePreview(data.publicUrl)
          }
        } catch (error) {
          console.error("Resim yüklenirken hata:", error)
        }
      }
    }

    loadImage()
  }, [post, supabase])

  // Etiketleri yükle
  useEffect(() => {
    const loadTags = async () => {
      if (post?.id && initialTags?.length > 0) {
        const { data, error } = await supabase.from("blog_tags").select("id, name, slug").in("id", initialTags)

        if (error) {
          console.error("Etiketler yüklenirken hata oluştu:", error)
          return
        }

        form.setValue("tags", data || [])
      }
    }

    loadTags()
  }, [post, initialTags, supabase, form])

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("title", e.target.value)
    if (!post) {
      form.setValue("slug", slugify(e.target.value))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("image", file)

      // Resim önizleme
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (values: BlogFormValues) => {
    setLoading(true)

    // İşlem başladığında bildirim göster
    toast({
      title: "İşlem devam ediyor",
      description: "Blog yazısı kaydediliyor...",
      duration: 5000,
    })

    try {
      // Form verilerini oluştur
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("slug", values.slug)
      formData.append("excerpt", values.excerpt)
      formData.append("content", values.content)
      formData.append("category_id", values.category_id)
      formData.append("meta_title", values.title)
      formData.append("meta_description", values.meta_description || "")
      formData.append("published", values.published ? "true" : "false")

      // Resim varsa ekle
      if (values.image && values.image instanceof File) {
        formData.append("image", values.image)
      }

      let response

      if (post?.id) {
        // Mevcut blog yazısını güncelle
        response = await fetch(`/api/admin/blog/update/${post.id}`, {
          method: "POST",
          body: formData,
          credentials: "include", // Önemli: Çerezleri gönder
        })
      } else {
        // Yeni blog yazısı oluştur
        response = await fetch("/api/admin/blog/create", {
          method: "POST",
          body: formData,
          credentials: "include", // Önemli: Çerezleri gönder
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Blog yazısı kaydedilirken bir hata oluştu")
      }

      const result = await response.json()

      // Etiketleri güncelle
      if (result.data?.id) {
        const postId = result.data.id

        try {
          // Önce mevcut etiketleri sil
          const { error: deleteError } = await supabase.from("blog_post_tags").delete().eq("post_id", postId)

          if (deleteError) {
            console.error("Mevcut etiketler silinirken hata oluştu:", deleteError)
            toast({
              title: "Uyarı",
              description: "Etiketler güncellenirken bir sorun oluştu.",
              variant: "destructive",
            })
          }

          // Yeni etiketleri ekle
          if (values.tags.length > 0) {
            const tagRelations = values.tags.map((tag) => ({
              post_id: postId,
              tag_id: tag.id,
            }))

            const { error: tagError } = await supabase.from("blog_post_tags").insert(tagRelations)

            if (tagError) {
              console.error("Etiketler eklenirken hata oluştu:", tagError)
              toast({
                title: "Uyarı",
                description: "Etiketler eklenirken bir sorun oluştu, ancak blog yazısı kaydedildi.",
                variant: "destructive",
              })
            }
          }
        } catch (tagErr) {
          console.error("Etiket işlemleri sırasında hata:", tagErr)
          toast({
            title: "Uyarı",
            description: "Etiket işlemleri sırasında bir sorun oluştu, ancak blog yazısı kaydedildi.",
            variant: "destructive",
          })
        }
      }

      // Başarılı bildirim göster
      toast({
        title: "Başarılı",
        description: post?.id ? "Blog yazısı başarıyla güncellendi." : "Blog yazısı başarıyla oluşturuldu.",
        variant: "default",
      })

      router.push("/admin/blog")
      router.refresh()
    } catch (error: any) {
      console.error("Blog yazısı kaydedilirken hata oluştu:", error)

      // Hata bildirimi göster
      toast({
        title: "Hata",
        description: `Blog yazısı kaydedilirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BlogFormFields
          form={form}
          categories={categories}
          imagePreview={imagePreview}
          loading={loading}
          onTitleChange={onTitleChange}
          handleImageChange={handleImageChange}
        />
      </form>
    </Form>
  )
}
