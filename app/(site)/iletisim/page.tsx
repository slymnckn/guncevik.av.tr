import type { Metadata } from "next"
import ContactForm from "@/components/contact-form"
import { ErrorBoundary } from "@/components/error-boundary"
import { Mail, Phone, Clock, MapPin, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "İletişim | GÜN ÇEVİK Hukuk Bürosu",
  description: "GÜN ÇEVİK Hukuk Bürosu ile iletişime geçin. Adres, telefon ve e-posta bilgilerimiz.",
}

export default function ContactPage() {
  return (
    <>
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-2">İletişim</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Hukuki danışmanlık için bizimle iletişime geçin. Size en kısa sürede dönüş yapacağız.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* İletişim Bilgileri */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <MapPin className="mr-2 text-primary h-6 w-6" />
                Adres
              </h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Çınar, 5003/2 Sk. No:3 D:202 <br />
                Gümüş Plaza Optimus 35090 Bornova İzmir
              </p>
              <a
                href="https://maps.google.com/?q=Çınar+5003/2+Sk.+No:3+D:202+Gümüş+Plaza+Optimus+35090+Bornova+İzmir"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4 mr-1" /> Google Maps'te Görüntüle
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Phone className="mr-2 text-primary h-6 w-6" />
                İletişim
              </h2>
              <div className="space-y-4">
                <p className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-gray-600 dark:text-gray-400" />
                  <a href="tel:+905536671658" className="text-gray-700 dark:text-gray-300 hover:text-primary">
                    +90 553 667 16 58
                  </a>
                </p>
                <p className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-gray-600 dark:text-gray-400" />
                  <a href="tel:+905428250639" className="text-gray-700 dark:text-gray-300 hover:text-primary">
                    +90 542 825 06 39
                  </a>
                </p>
                <p className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 mt-0.5 text-gray-600 dark:text-gray-400" />
                  <a
                    href="mailto:guncevikhukuk@gmail.com"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary"
                  >
                    guncevikhukuk@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Clock className="mr-2 text-primary h-6 w-6" />
                Çalışma Saatleri
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Pazartesi – Cuma</p>
                  <p className="text-gray-700 dark:text-gray-300">09:00 – 18:00</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Cumartesi – Pazar</p>
                  <p className="text-gray-700 dark:text-gray-300">Kapalı</p>
                </div>
              </div>
            </div>
          </div>

          {/* İletişim Formu ve Harita */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* İletişim Formu */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Bize Mesaj Gönderin</h2>
              <ErrorBoundary>
                <ContactForm />
              </ErrorBoundary>
            </div>

            {/* Harita */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Konum</h2>
              <div className="h-[400px] w-full rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3125.5!2d27.22!3d38.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDI3JzM2LjAiTiAyN8KwMTMnMTIuMCJF!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="GÜN ÇEVİK Hukuk Bürosu Konum"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
