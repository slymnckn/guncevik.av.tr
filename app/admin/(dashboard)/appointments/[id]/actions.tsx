"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateAppointmentStatus, deleteAppointment } from "@/actions/appointment-actions"

export default function AppointmentActions({ appointment }: { appointment: any }) {
  const router = useRouter()
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [status, setStatus] = useState(appointment.status)
  const [notes, setNotes] = useState(appointment.notes || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleStatusUpdate(newStatus: string) {
    try {
      setIsSubmitting(true)
      setError(null)

      console.log(`Client: Randevu durumu güncelleniyor - ID: ${appointment.id}, Status: ${newStatus}`)
      await updateAppointmentStatus(appointment.id, newStatus, appointment.notes)

      console.log("Client: Randevu durumu güncellendi")

      // Sayfayı yenile
      router.refresh()
    } catch (err) {
      console.error("Client: Durum güncellenirken hata:", err)
      setError(err instanceof Error ? err.message : "Durum güncellenirken bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleNotesUpdate() {
    try {
      setIsSubmitting(true)
      setError(null)

      console.log(`Client: Randevu notları güncelleniyor - ID: ${appointment.id}`)
      await updateAppointmentStatus(appointment.id, status, notes)

      console.log("Client: Randevu notları güncellendi")
      setIsUpdateDialogOpen(false)

      // Sayfayı yenile
      router.refresh()
    } catch (err) {
      console.error("Client: Notlar güncellenirken hata:", err)
      setError(err instanceof Error ? err.message : "Notlar güncellenirken bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    try {
      setIsSubmitting(true)
      setError(null)

      console.log(`Client: Randevu siliniyor - ID: ${appointment.id}`)
      await deleteAppointment(appointment.id)

      console.log("Client: Randevu silindi")

      // Randevular sayfasına yönlendir
      router.push("/admin/appointments")
    } catch (err) {
      console.error("Client: Randevu silinirken hata:", err)
      setError(err instanceof Error ? err.message : "Randevu silinirken bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {appointment.status !== "confirmed" && (
          <button
            className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            onClick={() => handleStatusUpdate("confirmed")}
            disabled={isSubmitting}
          >
            Onayla
          </button>
        )}
        {appointment.status !== "completed" && (
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            onClick={() => handleStatusUpdate("completed")}
            disabled={isSubmitting}
          >
            Tamamlandı
          </button>
        )}
        {appointment.status !== "cancelled" && (
          <button
            className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            onClick={() => handleStatusUpdate("cancelled")}
            disabled={isSubmitting}
          >
            İptal Et
          </button>
        )}
        {appointment.status !== "pending" && (
          <button
            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
            onClick={() => handleStatusUpdate("pending")}
            disabled={isSubmitting}
          >
            Beklemede
          </button>
        )}
        <button
          className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
          onClick={() => setIsUpdateDialogOpen(true)}
          disabled={isSubmitting}
        >
          Not Ekle
        </button>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isSubmitting}
        >
          Sil
        </button>
      </div>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      {/* Not Ekleme/Düzenleme Dialog */}
      {isUpdateDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Not Ekle/Düzenle</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mb-4 h-40 w-full rounded border p-2"
              placeholder="Randevu ile ilgili notlarınızı buraya yazın..."
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsUpdateDialogOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-400"
                disabled={isSubmitting}
              >
                İptal
              </button>
              <button
                onClick={handleNotesUpdate}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          </div>
        </div>
      )}

      {/* Silme Onay Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-red-600">Randevu Silme Onayı</h3>
            <p className="mb-4">Bu randevuyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-400"
                disabled={isSubmitting}
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Siliniyor..." : "Sil"}
              </button>
            </div>
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
