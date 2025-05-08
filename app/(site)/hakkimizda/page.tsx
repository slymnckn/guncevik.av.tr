import { SectionHeader } from "@/components/section-header"
import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "Hakkımızda | GÜN ÇEVİK Hukuk Bürosu",
  description: "GÜN ÇEVİK Hukuk Bürosu hakkında bilgi edinin. Uzman avukatlarımız ve hukuki yaklaşımımız.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 text-white rounded-lg p-8 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">GÜN ÇEVİK Hukuk Bürosu</h1>
          <p className="text-lg text-gray-300">Hukuki sorunlarınıza profesyonel çözümler sunuyoruz</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <SectionHeader
            title="Biz Kimiz?"
            subtitle="GÜN ÇEVİK Hukuk Bürosu, İzmir'de kurulmuş, alanında uzman avukatlardan oluşan bir hukuk bürosudur."
          />
          <div className="prose dark:prose-invert max-w-none mt-6">
            <p>
              Kurulduğumuz günden bu yana, müvekkillerimize en yüksek kalitede hukuki hizmet sunmayı ve karşılaştıkları
              hukuki sorunlara etkili çözümler üretmeyi hedefledik. Büromuz, ticaret hukuku, sigorta hukuku, iş hukuku,
              ceza hukuku, gayrimenkul hukuku, aile hukuku, miras hukuku, icra ve iflas hukuku ve tüketici hukuku gibi
              birçok alanda uzmanlaşmış avukatlardan oluşmaktadır.
            </p>
            <p>
              Müvekkillerimizin hukuki ihtiyaçlarını en iyi şekilde karşılamak için, her davaya özel yaklaşım
              geliştiriyor ve en güncel hukuki gelişmeleri takip ediyoruz. Amacımız, müvekkillerimizin haklarını en iyi
              şekilde korumak ve onlara hukuki süreçlerde rehberlik etmektir.
            </p>
          </div>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/minimalist-justice.png"
            alt="GÜN ÇEVİK Hukuk Bürosu - Adalet ve Hukuk"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Kurucularımız</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-80 mb-4">
                <Image
                  src="/irfan-cevik.jpeg"
                  alt="Avukat İrfan Çevik"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2">Av. İRFAN ÇEVİK</h3>
                <p className="text-sm text-primary mb-2">Kurucu Ortak</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Dokuz Eylül Üniversitesi Hukuk Fakültesinden 2017 yılında mezun olmuştur. 2019 yılında İzmir Barosuna
                  kayıtlı avukat olarak çalışmaya başlamıştır. GÜN ÇEVİK Hukuk Bürosunun kurucu ortaklarından olup,
                  Tazminat Hukuku, İş ve Sosyal Güvenlik Hukuku, Sigorta Hukuku, Ticaret ve Şirketler Hukuku, Kişisel
                  Verilerin Korunması, Fikri ve Sınai Haklar, İcra ve İflas Hukuku, İmar Hukuku Ceza Hukuku alanlarında
                  bireysel ve kurumsal hizmet vermektedir.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-80 mb-4">
                <Image
                  src="/ayse-gokce-cevik.jpeg"
                  alt="Avukat Ayşe Gökçen Gün Çevik"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2">Av. AYŞE GÖKÇEN GÜN ÇEVİK</h3>
                <p className="text-sm text-primary mb-2">Kurucu Ortak</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Dokuz Eylül Üniversitesi Hukuk Fakültesinden 2018 yılında mezun olmuştur. 2019 yılında İzmir Barosuna
                  kayıtlı avukat olarak çalışmaya başlamıştır. GÜN ÇEVİK Hukuk Bürosunun kurucu ortaklarından olup Aile
                  Hukuku, Miras hukuku, Gayrimenkul Hukuku, Kira Hukuku, Borçlar Hukuku, İcra ve İflas Hukuku, İdare ve
                  Vergi Hukuku, Spor Hukuku alanlarında bireysel ve kurumsal hizmet vermektedir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Değerlerimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold mb-2">Dürüstlük</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Müvekkillerimize karşı her zaman şeffaf ve dürüst davranıyor, gerçekçi beklentiler sunuyoruz.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2">Uzmanlık</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Her alanda uzmanlaşmış avukatlarımızla en güncel hukuki bilgi ve deneyimi sunuyoruz.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold mb-2">Müvekkil Odaklılık</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Müvekkillerimizin ihtiyaçlarını ön planda tutuyor, her davaya özel çözümler üretiyoruz.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg mb-16">
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
    </div>
  )
}
