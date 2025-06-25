import { createServerSupabaseClient } from "@/lib/supabase/server"


export default async function TestBlogPage() {
  const supabase = createServerSupabaseClient()

  // Tüm blog yazılarını getir
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, published")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Blog Test Sayfası</h1>
        <div className="bg-red-100 p-4 rounded-lg mb-6">
          <p className="text-red-700">Hata: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Blog Test Sayfası</h1>
      <p className="mb-6">
        Bu sayfa, blog yazılarının doğru şekilde listelenip listelenmediğini test etmek için oluşturulmuştur.
      </p>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Tüm Blog Yazıları ({posts?.length || 0})</h2>
        {posts && posts.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{post.title}</h3>
                    <p className="text-sm text-gray-600">Slug: {post.slug}</p>
                    <p className="text-sm text-gray-600">Durum: {post.published ? "Yayında" : "Taslak"}</p>
                  </div>
                  <div>
                    <Link
                      href={`/makaleler/${post.slug}`}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/80 transition-colors"
                    >
                      Görüntüle
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Henüz blog yazısı bulunmamaktadır.</p>
        )}
      </div>

      <div className="bg-blue-100 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Hata Ayıklama Bilgileri</h2>
        <p className="mb-2">Blog detay sayfasına erişirken 404 hatası alıyorsanız, aşağıdaki adımları izleyin:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Tarayıcı önbelleğini temizleyin (Ctrl+Shift+Delete)</li>
          <li>
            <Link href="/api/revalidate?path=/makaleler" className="text-blue-600 hover:underline">
              Önbelleği temizle
            </Link>
          </li>
          <li>Sayfayı yenileyin</li>
          <li>Konsol hatalarını kontrol edin (F12 tuşuna basın)</li>
        </ol>
      </div>
    </div>
  )
}
