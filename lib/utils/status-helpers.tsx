export type StatusType = "new" | "in_progress" | "completed" | "archived" | string

export function getStatusColor(status: StatusType): string {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800"
    case "in_progress":
      return "bg-yellow-100 text-yellow-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "archived":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function getStatusName(status: StatusType): string {
  switch (status) {
    case "new":
      return "Yeni"
    case "in_progress":
      return "İşleme Alındı"
    case "completed":
      return "Tamamlandı"
    case "archived":
      return "Arşivlendi"
    default:
      return status
  }
}

export function getStatusBadgeClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "Bekliyor"
    case "confirmed":
      return "Onaylandı"
    case "cancelled":
      return "İptal Edildi"
    case "completed":
      return "Tamamlandı"
    default:
      return status
  }
}

export function getStatusBadge(status: StatusType): { color: string; label: string } {
  return {
    color: getStatusColor(status),
    label: getStatusName(status),
  }
}

interface StatusBadgeProps {
  status: string
  type?: "message" | "appointment"
}

export function StatusBadge({ status, type = "message" }: StatusBadgeProps) {
  const badgeClass = type === "message" ? getStatusColor(status as StatusType) : getStatusBadgeClass(status)
  const statusText = type === "message" ? getStatusName(status as StatusType) : getStatusText(status)

  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}>{statusText}</span>
}
