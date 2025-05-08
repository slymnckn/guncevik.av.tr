"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateAppointmentStatus, deleteAppointment } from "@/actions/appointment-actions"
import { getStatusBadgeClass, getStatusText } from "@/lib/utils"

export default function AppointmentActions({ appointment }: { appointment: any }) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false)
  const [notes, setNotes] = useState(appointment.notes || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleStatusUpdate(status: string) {
    setIsUpdating(true)
    try {
      await updateAppointmentStatus(appointment.id, status, appointment.notes)
      alert(`Randevu durumu "${getStatusText(status)}" olarak güncellendi.`)
      router.refresh()
    } catch (error) {
      alert("Durum güncellenirken bir hata oluştu.")
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleNotesUpdate() {
    setIsUpdating(true)
    try {
      await updateAppointmentStatus(appointment.id, appointment.status, notes)
      alert("Randevu notları başarıyla güncellendi.")
      setIsNotesDialogOpen(false)
      router.refresh()
    } catch (error) {
      alert("Notlar güncellenirken bir hata oluştu.")
      console.error("Error updating notes:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deleteAppointment(appointment.id)
      alert("Randevu başarıyla silindi.")
      router.push("/admin/appointments")
    } catch (error) {
      alert("Randevu silinirken bir hata oluştu.")
      console.error("Error deleting appointment:", error)
      setIsDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
            appointment.status,
          )}`}
        >
          {getStatusText(appointment.status)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {appointment.status !== "confirmed" && (
          <button
            className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700"
            onClick={() => handleStatusUpdate("confirmed")}
            disabled={isUpdating}
          >
            Onayla
          </button>
        )}
        {appointment.status !== "completed" && (
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700"
            onClick={() => handleStatusUpdate("completed")}
            disabled={isUpdating}
          >
            Tamamlandı
          </button>
        )}
        {appointment.status !== "cancelled" && (
          <button
            className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700"
            onClick={() => handleStatusUpdate("cancelled")}
            disabled={isUpdating}
          >
            İptal Et
          </button>
        )}
        {appointment.status !== "pending" && (
          <button
            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-yellow-700"
            onClick={() => handleStatusUpdate("pending")}
            disabled={isUpdating}
          >
            Beklemede
          </button>
        )}
        <button
          className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-gray-700"
          onClick={() => setIsNotesDialogOpen(true)}
        >
          Not Ekle
        </button>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Sil
        </button>
      </div>

      {/* Not Ekleme/D��zenleme Dialog */}
      {isNotesDialogOpen && (
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
                onClick={() => setIsNotesDialogOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-400"
              >
                İptal
              </button>
              <button
                onClick={handleNotesUpdate}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                disabled={isUpdating}
              >
                {isUpdating ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
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
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
