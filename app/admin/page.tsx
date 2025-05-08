import { redirect } from "next/navigation"

export default function AdminPage() {
  // Ana admin sayfasına gelen kullanıcıyı dashboard'a yönlendir
  redirect("/admin/dashboard")
}
