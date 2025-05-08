"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function AppointmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    appointmentDate: "",
    appointmentTime: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Form verilerini kontrol et
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.appointmentDate ||
        !formData.appointmentTime
      ) {
        throw new Error("Lütfen tüm zorunlu alanları doldurun.")
      }

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Randevu oluşturulurken bir hata oluştu.")
      }

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        appointmentDate: "",
        appointmentTime: "",
        subject: "",
        message: "",
      })

      // 5 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Randevu oluşturulurken bir hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  const availableTimes = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Randevu Talebi</h2>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Soyad *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Ad Soyad" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-posta *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="E-posta"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Telefon"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointmentDate">Randevu Tarihi *</Label>
          <Input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            min={today}
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointmentTime">Randevu Saati *</Label>
          <Select
            value={formData.appointmentTime}
            onValueChange={(value) => handleSelectChange("appointmentTime", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Saat seçin" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Konu</Label>
          <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Konu" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mesaj</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Mesajınız"
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gönderiliyor...
          </>
        ) : (
          "Randevu Talep Et"
        )}
      </Button>

      {/* Başarı mesajını formun altına taşıdık */}
      {success && (
        <Alert className="mt-4">
          <AlertDescription>
            Randevu talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.
          </AlertDescription>
        </Alert>
      )}
    </form>
  )
}

export default AppointmentForm
