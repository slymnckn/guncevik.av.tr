"use client"

import { useState } from "react"

export function AppointmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    success?: boolean
    message?: string
  }>({})

  async function handleSubmit(formData: FormData) {
    try {
      setIsSubmitting(true)
      //   const result = await createAppointment(formData) // Assuming createAppointment is defined elsewhere

      //   if (result.success) {
      setFormStatus({
        success: true,
        message: "Randevu talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.",
      })
      // Formu sıfırla
      const form = document.getElementById("appointment-form") as HTMLFormElement
      form?.reset()
      //   } else {
      //     setFormStatus({
      //       success: false,
      //       message: result.message || "Randevu oluşturulurken bir hata oluştu.",
      //     });
      //   }
    } catch (error) {
      console.error("Randevu oluşturma hatası:", error)
      setFormStatus({
        success: false,
        message: error instanceof Error ? error.message : "Randevu oluşturulurken bir hata oluştu.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <form id="appointment-form" action={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            İsim Soyisim *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-posta *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefon *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Konu
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
            Randevu Tarihi *
          </label>
          <input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            min={today}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">
            Randevu Saati *
          </label>
          <select
            id="appointmentTime"
            name="appointmentTime"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Saat Seçin</option>
            <option value="09:00">09:00</option>
            <option value="09:30">09:30</option>
            <option value="10:00">10:00</option>
            <option value="10:30">10:30</option>
            <option value="11:00">11:00</option>
            <option value="11:30">11:30</option>
            <option value="13:00">13:00</option>
            <option value="13:30">13:30</option>
            <option value="14:00">14:00</option>
            <option value="14:30">14:30</option>
            <option value="15:00">15:00</option>
            <option value="15:30">15:30</option>
            <option value="16:00">16:00</option>
            <option value="16:30">16:30</option>
            <option value="17:00">17:00</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>

      {formStatus.message && (
        <div
          className={`p-3 rounded-md ${formStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
        >
          {formStatus.message}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
        >
          {isSubmitting ? "Gönderiliyor..." : "Randevu Oluştur"}
        </button>
      </div>
    </form>
  )
}
