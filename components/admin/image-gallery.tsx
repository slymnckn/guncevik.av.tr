"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ImageIcon, Upload, Search, X } from "lucide-react"

interface ImageGalleryProps {
  onSelect: (url: string, path: string) => void
  bucketName?: string
}

export function ImageGallery({ onSelect, bucketName = "blog-images" }: ImageGalleryProps) {
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("gallery")
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadImages()
    }
  }, [open])

  const loadImages = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.storage.from(bucketName).list()

      if (error) {
        throw error
      }

      // Sadece resim dosyalarını filtrele
      const imageFiles =
        data?.filter(
          (file) =>
            !file.id.includes("/") &&
            (file.name.endsWith(".jpg") ||
              file.name.endsWith(".jpeg") ||
              file.name.endsWith(".png") ||
              file.name.endsWith(".gif") ||
              file.name.endsWith(".webp")),
        ) || []

      // Her resim için URL oluştur
      const imagesWithUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const { data: urlData } = await supabase.storage.from(bucketName).getPublicUrl(file.name)
          return {
            ...file,
            url: urlData.publicUrl,
          }
        }),
      )

      setImages(imagesWithUrls)
    } catch (error) {
      console.error("Resimler yüklenirken hata:", error)
      toast({
        title: "Hata",
        description: "Resimler yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${i}.${fileExt}`

        const { error } = await supabase.storage.from(bucketName).upload(fileName, file)

        if (error) {
          throw error
        }
      }

      toast({
        title: "Başarılı",
        description: "Resimler başarıyla yüklendi",
      })

      // Resimleri yeniden yükle
      await loadImages()

      // Galeri sekmesine geç
      setActiveTab("gallery")
    } catch (error) {
      console.error("Resim yüklenirken hata:", error)
      toast({
        title: "Hata",
        description: "Resim yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSelect = (image) => {
    onSelect(image.url, image.name)
    setOpen(false)
  }

  const filteredImages = images.filter((image) => image.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <ImageIcon className="mr-2 h-4 w-4" />
          Galeri'den Seç
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Resim Galerisi</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery">Galeri</TabsTrigger>
            <TabsTrigger value="upload">Yükle</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Resim ara..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex h-[400px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-1">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-md border hover:border-primary transition-colors"
                    onClick={() => handleSelect(image)}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[400px] flex-col items-center justify-center text-center">
                <ImageIcon className="mb-2 h-12 w-12 text-gray-400" />
                <h3 className="mb-1 text-lg font-medium">Resim bulunamadı</h3>
                <p className="text-sm text-gray-500">
                  {searchTerm ? `"${searchTerm}" için sonuç bulunamadı` : "Henüz resim yüklenmemiş"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-md p-8">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Resim Yükle</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Resim dosyalarını sürükleyip bırakın veya dosya seçin
              </p>
              <label htmlFor="image-upload">
                <div className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
                  {uploading ? "Yükleniyor..." : "Dosya Seç"}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
