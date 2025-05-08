import { getReportData } from "@/actions/report-actions"
import { AnalyticsCharts } from "./analytics-charts"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ReportsPage() {
  // Varsayılan olarak son 30 günlük verileri getir
  const reportData = await getReportData("30days")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Raporlar</h1>
        <p className="text-muted-foreground">Site istatistikleri ve analiz raporları</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[800px] w-full" />}>
        <AnalyticsCharts initialData={reportData} />
      </Suspense>
    </div>
  )
}
