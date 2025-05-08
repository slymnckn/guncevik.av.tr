"use client"

import { useState } from "react"
import { Bell } from "lucide-react"

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Yeni mesaj",
      message: "Yeni bir iletişim mesajı aldınız.",
      time: "5 dakika önce",
      read: false,
    },
    {
      id: 2,
      title: "Yeni danışmanlık talebi",
      message: "Yeni bir danışmanlık talebi aldınız.",
      time: "1 saat önce",
      read: false,
    },
    {
      id: 3,
      title: "Sistem güncellemesi",
      message: "Sistem başarıyla güncellendi.",
      time: "2 gün önce",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const toggleNotifications = () => {
    setIsOpen(!isOpen)
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-2 px-3 bg-gray-100 flex justify-between items-center">
            <span className="text-sm font-medium">Bildirimler</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800">
                Tümünü okundu işaretle
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`py-2 px-3 border-b border-gray-100 ${!notification.read ? "bg-blue-50" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{notification.title}</span>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                </div>
              ))
            ) : (
              <div className="py-4 px-3 text-center text-sm text-gray-500">Bildirim bulunmamaktadır.</div>
            )}
          </div>
          <div className="py-2 px-3 bg-gray-100 text-center">
            <a href="/admin/notifications" className="text-xs text-blue-600 hover:text-blue-800">
              Tüm bildirimleri görüntüle
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
