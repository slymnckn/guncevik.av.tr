import Link from "next/link"

export default function ServiceNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Hizmet Bulunamadı</h1>
        <p className="text-lg mb-8">
          Aradığınız hizmet bulunamadı. Lütfen tüm hizmetlerimizi görmek için aşağıdaki bağlantıya tıklayın.
        </p>
        <Link
          href="/hizmetlerimiz"
          className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Tüm Hizmetlerimiz
        </Link>
      </div>
    </div>
  )
}
