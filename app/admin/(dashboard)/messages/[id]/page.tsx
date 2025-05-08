import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { StatusUpdateForm, DeleteButton } from "./actions"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Mesajı getir
  const { data: contact, error } = await supabase.from("contact_submissions").select("*").eq("id", params.id).single()

  if (error || !contact) {
    console.error("Error fetching contact:", error)
    notFound()
  }

  // İlgili bildirimleri okundu olarak işaretle
  try {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("reference_type", "contact_submission")
      .eq("reference_id", params.id)
  } catch (error) {
    console.error("Error updating notification status:", error)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/messages" className="text-gray-600 hover:text-gray-900 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          İletişim Mesajlarına Dön
        </Link>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mesaj Detayı</h1>
        <div className="flex items-center space-x-2">
          <StatusUpdateForm messageId={contact.id} currentStatus={contact.status} />
          <DeleteButton messageId={contact.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Gönderen</h2>
              <p className="mt-1 text-lg font-semibold text-gray-900">{contact.name}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">E-posta</h2>
              <p className="mt-1 text-lg text-gray-900">
                <a href={`mailto:${contact.email}`} className="text-primary hover:text-primary/80">
                  {contact.email}
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">Telefon</h2>
              <p className="mt-1 text-lg text-gray-900">
                {contact.phone ? (
                  <a href={`tel:${contact.phone}`} className="text-primary hover:text-primary/80">
                    {contact.phone}
                  </a>
                ) : (
                  <span className="text-gray-500 italic">Belirtilmemiş</span>
                )}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Konu: {contact.subject}</h2>
              <div className="text-sm text-gray-500">
                {format(new Date(contact.created_at), "d MMMM yyyy, HH:mm", { locale: tr })}
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-100">
              <div className="prose max-w-none">
                {contact.message.split("\n").map((paragraph, i) => (
                  <p key={i} className="mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
