import { createServerSupabaseClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, Info, Mail, MessageSquare, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function NotificationsPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch notifications
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching notifications:", error)
  }

  // Mark all as read
  const markAllAsRead = async () => {
    "use server"
    const supabase = await createServerSupabaseClient()
    await supabase.from("notifications").update({ is_read: true }).eq("is_read", false)
  }

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "contact":
        return <Mail className="h-4 w-4" />
      case "consultation":
        return <MessageSquare className="h-4 w-4" />
      case "appointment":
        return <Calendar className="h-4 w-4" />
      case "system":
        return <Info className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  // Get alert variant based on notification type
  const getAlertVariant = (type: string, isRead: boolean) => {
    if (isRead) return "default"

    switch (type) {
      case "contact":
        return "info"
      case "consultation":
        return "warning"
      case "appointment":
        return "success"
      case "system":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bildirimler</h1>
          <p className="text-muted-foreground">Sistem bildirimleri ve uyarıları</p>
        </div>
        <form action={markAllAsRead}>
          <Button type="submit" variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Tümünü Okundu İşaretle
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bildirimler</CardTitle>
          <CardDescription>Sistem tarafından oluşturulan bildirimler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <Alert
                  key={notification.id}
                  variant={getAlertVariant(notification.type, notification.is_read) as any}
                  className={notification.is_read ? "opacity-70" : ""}
                >
                  {getNotificationIcon(notification.type)}
                  <AlertTitle className="flex justify-between">
                    <span>{notification.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(notification.created_at), "d MMM yyyy, HH:mm", { locale: tr })}
                    </span>
                  </AlertTitle>
                  <AlertDescription className="flex justify-between items-end">
                    <span>{notification.message}</span>
                    {notification.link && (
                      <Link href={notification.link}>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          Görüntüle
                        </Button>
                      </Link>
                    )}
                  </AlertDescription>
                </Alert>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <p className="mt-2 text-muted-foreground">Henüz bildirim bulunmuyor.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
