import { redirect } from "next/navigation"

export default function HomePage() {
  // Ana sayfayı admin paneline yönlendir
  redirect("/admin/dashboard")
}
