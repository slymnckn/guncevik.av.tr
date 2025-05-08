"use client"

import type React from "react"

import { useRef } from "react"
import type { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { SimpleEditor } from "@/components/admin/simple-editor"
import { TagSelector } from "@/components/admin/blog/tag-selector"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import type { BlogCategory } from "@/lib/types"

export const blogFormSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  slug: z.string().min(1, "Slug zorunludur"),
  excerpt: z.string().min(1, "Özet zorunludur"),
  content: z.string().min(1, "İçerik zorunludur"),
  category_id: z.string().min(1, "Kategori zorunludur"),
  meta_description: z.string().optional(),
  published: z.boolean().default(false),
  tags: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
      }),
    )
    .default([]),
  image: z.any().optional(),
})

export type BlogFormValues = z.infer<typeof blogFormSchema>

interface BlogFormFieldsProps {
  form: ReturnType<typeof useForm<BlogFormValues>>
  categories: BlogCategory[]
  imagePreview: string | null
  loading: boolean
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function BlogFormFields({
  form,
  categories,
  imagePreview,
  loading,
  onTitleChange,
  handleImageChange,
}: BlogFormFieldsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Debug için kategorileri konsola yazdır
  console.log("Categories in form fields:", categories)

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Başlık</FormLabel>
            <FormControl>
              <Input {...field} onChange={onTitleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="excerpt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Özet</FormLabel>
            <FormControl>
              <Textarea {...field} rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kategori</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-category" disabled>
                    Kategori bulunamadı
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Etiketler</FormLabel>
            <FormControl>
              <TagSelector selectedTags={field.value} onChange={(tags) => field.onChange(tags)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Görsel</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  {...field}
                  aria-label="Blog görseli yükle"
                />
                {imagePreview && (
                  <div className="relative w-full h-48 mt-2 border rounded-md overflow-hidden">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Blog görseli önizleme"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>İçerik</FormLabel>
            <FormControl>
              <SimpleEditor value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="meta_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Açıklama (SEO)</FormLabel>
            <FormControl>
              <Textarea {...field} rows={2} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="published"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Yayınla</FormLabel>
              <p className="text-sm text-gray-500">Bu yazıyı hemen yayınlamak için etkinleştirin.</p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Kaydediliyor...
          </>
        ) : (
          "Kaydet"
        )}
      </Button>
    </>
  )
}
