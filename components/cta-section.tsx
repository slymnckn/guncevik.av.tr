"use client"

import Link from "next/link"

export function CTASection() {
  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Hukuki Danışmanlık İçin Bize Ulaşın</h2>
        <p className="mb-6">
          Hukuki sorunlarınız için profesyonel destek almak ister misiniz? Deneyimli ekibimiz yanınızda.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/iletisim"
            className="bg-white text-gray-900 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            İletişime Geçin
          </Link>
          <Link
            href="/randevu"
            className="bg-primary border border-primary text-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-primary transition-colors"
          >
            Randevu Alın
          </Link>
        </div>
      </div>
    </div>
  )
}
