import type { Metadata } from "next"
import { CategoryForm } from "@/components/admin/blog/category-form"

export const metadata: Metadata = {
  title: "Yeni Kategori | GÜN ÇEVİK Hukuk Bürosu",
  description: "Yeni kategori ekleme sayfası",
}

export default function NewCategoryPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Yeni Kategori</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <CategoryForm />
      </div>
    </div>
  )
}
