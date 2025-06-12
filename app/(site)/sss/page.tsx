// SiteWrapper bileşenini kaldırıp, doğrudan içeriği döndürelim
// import SiteWrapper from "@/components/site-wrapper" satırını kaldırın

import { AccordionFAQ } from "@/components/accordion-faq"

export const metadata = {
  title: "Sık Sorulan Sorular | GÜN ÇEVİK Hukuk Bürosu",
  description: "GÜN ÇEVİK Hukuk Bürosu hakkında sık sorulan sorular ve yanıtları.",
}

export default function FaqPage() {
  const faqItems = [
    {
      question: "Hukuki danışmanlık hizmetiniz nasıl işliyor?",
      answer:
        "Hukuki danışmanlık hizmetimiz, müvekkillerimizin karşılaştıkları hukuki sorunlara çözüm bulmak amacıyla sunduğumuz profesyonel bir hizmettir. İlk görüşmede sorununuzu dinliyor, gerekli bilgi ve belgeleri inceliyor ve size en uygun hukuki stratejiyi sunuyoruz. Danışmanlık hizmetimiz kapsamında sözlü veya yazılı hukuki görüş sunabilir, gerekli hukuki belgeleri hazırlayabilir ve süreç boyunca size rehberlik edebiliriz.",
    },
    {
      question: "Hangi hukuk alanlarında hizmet veriyorsunuz?",
      answer:
        "Büromuz başta ticaret hukuku, iş hukuku, sigorta hukuku, aile hukuku, gayrimenkul hukuku, miras hukuku, icra iflas hukuku ve ceza hukuku olmak üzere geniş bir yelpazede hukuki hizmet sunmaktadır. Her alanda uzmanlaşmış avukatlarımız ile müvekkillerimizin farklı hukuki ihtiyaçlarına cevap verebilmekteyiz.",
    },
    {
      question: "Dava sürecinde neler yapmalıyım?",
      answer:
        "Dava sürecinde öncelikle avukatınızın talep ettiği tüm bilgi ve belgeleri eksiksiz ve zamanında sağlamanız önemlidir. Davanızla ilgili gelişmeleri düzenli olarak takip etmeli ve avukatınızla iletişim halinde olmalısınız. Mahkeme celplerine zamanında yanıt vermeli ve duruşma tarihlerini takip etmelisiniz. Avukatınızın hukuki tavsiyelerine uymanız, davanızın olumlu sonuçlanma ihtimalini artıracaktır.",
    },
    {
      question: "Avukatlık ücretleri nasıl belirleniyor?",
      answer:
        "Avukatlık ücretlerimiz, Türkiye Barolar Birliği'nin her yıl yayınladığı Avukatlık Asgari Ücret Tarifesi'ni temel almakla birlikte, işin niteliği, karmaşıklığı, gerektirdiği emek ve zaman gibi faktörlere göre belirlenmektedir. Ücretlendirme konusunda şeffaflık ilkesini benimsiyoruz ve hizmet başlangıcında detaylı bir ücret bilgilendirmesi yapıyoruz. Sabit ücret, saat ücreti veya başarı primi gibi farklı ücretlendirme modelleri sunabilmekteyiz.",
    },
    {
      question: "Davamın ne kadar süreceğini öngörebilir misiniz?",
      answer:
        "Dava süreleri, davanın türüne, karmaşıklığına, mahkemelerin iş yüküne ve tarafların tutumuna göre değişiklik gösterebilmektedir. İlk değerlendirmede size tahmini bir süre verebiliriz, ancak bu süre dava sürecinde yaşanabilecek gelişmelere bağlı olarak değişebilir. Büromuz, davalarınızın en hızlı ve etkili şekilde sonuçlanması için gerekli tüm adımları atmaktadır.",
    },
    {
      question: "Büronuzla nasıl iletişime geçebilirim?",
      answer:
        "Büromuzla telefon, e-posta veya web sitemizdeki iletişim formu aracılığıyla iletişime geçebilirsiniz. Acil durumlar için 7/24 ulaşabileceğiniz bir telefon hattımız bulunmaktadır. Randevu alarak ofisimizi ziyaret edebilir veya online görüşme talep edebilirsiniz. İletişim bilgilerimiz web sitemizin iletişim sayfasında yer almaktadır.",
    },
    {
      question: "Online hukuki danışmanlık hizmeti veriyor musunuz?",
      answer:
        "Evet, büromuz teknolojik gelişmeleri yakından takip etmekte ve müvekkillerimize online hukuki danışmanlık hizmeti sunmaktadır. Video konferans yöntemiyle görüşmeler yapabilir, elektronik ortamda belge alışverişi sağlayabilir ve dijital platformlar üzerinden hukuki süreçlerinizi yönetebiliriz. Bu hizmetimiz, özellikle farklı şehirlerde veya ülkelerde bulunan müvekkillerimiz için büyük kolaylık sağlamaktadır.",
    },
    {
      question: "Şirketimiz için sürekli hukuki danışmanlık hizmeti alabilir miyiz?",
      answer:
        "Evet, şirketlere özel sürekli hukuki danışmanlık hizmetimiz bulunmaktadır. Bu hizmet kapsamında, şirketinizin günlük hukuki ihtiyaçlarını karşılıyor, sözleşmelerinizi inceliyor, hukuki risklerinizi değerlendiriyor ve gerektiğinde hukuki görüş sunuyoruz. Ayrıca, şirket içi eğitimler düzenleyerek çalışanlarınızın hukuki farkındalığını artırabiliyoruz. Sürekli danışmanlık hizmetimiz, şirketinizin büyüklüğüne ve ihtiyaçlarına göre özelleştirilebilmektedir.",
    },
    {
      question: "Hukuki işlemler için hangi belgeleri hazırlamalıyım?",
      answer:
        "Hukuki işlemin türüne göre gerekli belgeler değişiklik göstermektedir. Genel olarak kimlik belgesi, ilgili sözleşmeler, yazışmalar, faturalar, dekontlar, tapu ve ruhsat gibi resmi belgeler, fotoğraflar ve varsa tanık bilgileri gerekebilir. İlk görüşmede avukatınız, sizden hangi belgeleri hazırlamanız gerektiğini detaylı olarak açıklayacaktır. Belgelerin düzenli ve eksiksiz olması, hukuki sürecin daha hızlı ve etkili ilerlemesini sağlayacaktır.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Sıkça Sorulan Sorular</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center">
          Hukuki süreçler ve hizmetlerimiz hakkında en çok sorulan soruların cevaplarını burada bulabilirsiniz.
        </p>

        <AccordionFAQ items={faqItems} />

        <div className="mt-12 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Başka Sorularınız mı Var?</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Burada cevabını bulamadığınız sorularınız için bizimle iletişime geçebilirsiniz. Size en kısa sürede yanıt
            vereceğiz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/iletisim"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium text-center"
            >
              İletişime Geçin
            </a>
            <a
              href="tel:+905536671658"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-md font-medium text-center flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Bizi Arayın
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
