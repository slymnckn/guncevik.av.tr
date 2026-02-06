import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image src="/logo-gc.png" alt="GÜN ÇEVİK Hukuk Bürosu" width={120} height={120} className="h-16 w-auto" />
            </Link>
            <p className="text-gray-300 text-sm">
              İzmir'de uzman hukuk danışmanlığı ve avukatlık hizmetleri sunan GÜN ÇEVİK Hukuk Bürosu, müvekkillerinin
              haklarını korumak için özverili çalışmaktadır.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-gray-300 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz" className="text-gray-300 hover:text-white transition-colors">
                  Hizmetlerimiz
                </Link>
              </li>
              <li>
                <Link href="/makaleler" className="text-gray-300 hover:text-white transition-colors">
                  Makaleler
                </Link>
              </li>
              <li>
                <Link href="/sss" className="text-gray-300 hover:text-white transition-colors">
                  Sık Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-300 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Hizmetler */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/hizmetlerimiz/ticaret-ve-sirketler-hukuku"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Ticaret Hukuku
                </Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz/sigorta-hukuku" className="text-gray-300 hover:text-white transition-colors">
                  Sigorta Hukuku
                </Link>
              </li>
              <li>
                <Link
                  href="/hizmetlerimiz/is-ve-sosyal-guvenlik-hukuku"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  İş Hukuku
                </Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz/ceza-hukuku" className="text-gray-300 hover:text-white transition-colors">
                  Ceza Hukuku
                </Link>
              </li>
              <li>
                <Link href="/hizmetlerimiz/aile-hukuku" className="text-gray-300 hover:text-white transition-colors">
                  Aile Hukuku
                </Link>
              </li>
              <li>
                <Link
                  href="/hizmetlerimiz/gayrimenkul-ve-insaat-hukuku"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Gayrimenkul Hukuku
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">İletişim</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary shrink-0 mt-1" />
                <span>Çınar, 5003/2 Sk. No:3/5 D:202 Gümüş Plaza Optimus 35090 Bornova İzmir</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary shrink-0" />
                <Link href="tel:+905536671658" className="hover:text-primary transition-colors">
                  +90 553 667 16 58
                </Link>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary shrink-0" />
                <Link href="tel:+905428250639" className="hover:text-primary transition-colors">
                  +90 542 825 06 39
                </Link>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary shrink-0" />
                <Link href="mailto:guncevikhukuk@gmail.com" className="hover:text-primary transition-colors">
                  guncevikhukuk@gmail.com
                </Link>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-2 text-primary shrink-0 mt-1" />
                <div>
                  <div className="font-medium">Pazartesi – Cuma</div>
                  <div>09:00 – 18:00</div>
                  <div className="font-medium mt-1">Cumartesi – Pazar</div>
                  <div>Kapalı</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear} GÜN ÇEVİK Hukuk Bürosu. Tüm hakları saklıdır.</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-gray-500 text-xs">Powered by</span>
            <a
              href="https://www.broostech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src="/broos-tech.png"
                alt="Broos Tech"
                width={80}
                height={24}
                className="h-5 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
