"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { updateAppointmentStatus, deleteAppointment } from "@/actions/appointment-actions"
import { Loader2 } from "lucide-react"

export default function AppointmentActions({ appointment }: { appointment: any }) {
  const router = useRouter()
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [status, setStatus] = useState(appointment.status)
  const [notes, setNotes] = useState(appointment.notes || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateStatus = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const result = await updateAppointmentStatus(appointment.id, status, notes)

      if (result.success) {
        setIsUpdateDialogOpen(false)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Durum güncellenirken bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      const result = await deleteAppointment(appointment.id)

      if (result.success) {
        setIsDeleteDialogOpen(false)
        router.push("/admin/appointments")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Randevu silinirken bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => setIsUpdateDialogOpen(true)}>
          Durumu Güncelle
        </Button>
        <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
          Sil
        </Button>
      </div>

      {/* Durum Güncelleme Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Randevu Durumunu Güncelle</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Durum</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Beklemede</SelectItem>
                  <SelectItem value="confirmed">Onaylandı</SelectItem>
                  <SelectItem value="cancelled">İptal Edildi</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notlar</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Randevu ile ilgili notlar"
                rows={4}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)} disabled={isSubmitting}>
              İptal
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Güncelleniyor...
                </>
              ) : (
                "Güncelle"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Silme Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Randevu Silme</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>Bu randevuyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Siliniyor...
                </>
              ) : (
                "Sil"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
