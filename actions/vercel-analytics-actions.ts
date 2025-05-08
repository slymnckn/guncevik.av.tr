"use server"

import { unstable_cache } from "next/cache"

export type TimeRange = "day" | "week" | "month" | "year"

export interface VercelAnalyticsData {
  pageviews: {
    value: number
    change: number
  }
  visitors: {
    value: number
    change: number
  }
  bounceRate: {
    value: number
    change: number
  }
  duration: {
    value: number
    change: number
  }
  browsers: Array<{ browser: string; visitors: number }>
  topPages: Array<{ page: string; pageviews: number }>
  timeseriesPageviews: Array<{ date: string; value: number }>
  timeseriesVisitors: Array<{ date: string; value: number }>
  devices: Array<{ device: string; visitors: number }>
  countries: Array<{ country: string; visitors: number }>
}

const getVercelTimeRange = (timeRange: TimeRange): string => {
  switch (timeRange) {
    case "day":
      return "24h"
    case "week":
      return "7d"
    case "month":
      return "30d"
    case "year":
      return "90d" // Vercel doesn't have a full year option, so we use 90 days
    default:
      return "7d"
  }
}

export const getVercelAnalytics = unstable_cache(
  async (timeRange: TimeRange = "week"): Promise<VercelAnalyticsData> => {
    try {
      const vercelTimeframe = getVercelTimeRange(timeRange)

      // Use the API route to fetch data from Vercel
      const response = await fetch(`/api/analytics?timeframe=${vercelTimeframe}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (!response.ok) {
        console.error("Failed to fetch analytics data:", await response.text())
        return getDefaultAnalyticsData()
      }

      const data = await response.json()
      return transformVercelData(data)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      return getDefaultAnalyticsData()
    }
  },
  ["vercel-analytics"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["analytics"],
  },
)

const transformVercelData = (data: any): VercelAnalyticsData => {
  // Transform the data from Vercel's format to our format
  return {
    pageviews: {
      value: data.pageviews?.value || 0,
      change: data.pageviews?.change || 0,
    },
    visitors: {
      value: data.uniques?.value || 0,
      change: data.uniques?.change || 0,
    },
    bounceRate: {
      value: data.bounceRate?.value || 0,
      change: data.bounceRate?.change || 0,
    },
    duration: {
      value: data.avgSessionDuration?.value || 0,
      change: data.avgSessionDuration?.change || 0,
    },
    browsers:
      data.browsers?.map((item: any) => ({
        browser: item.browser,
        visitors: item.value,
      })) || [],
    topPages:
      data.topPages?.map((item: any) => ({
        page: item.path,
        pageviews: item.pageviews,
      })) || [],
    timeseriesPageviews:
      data.pageviewsTimeseries?.map((item: any) => ({
        date: formatDate(item.timestamp),
        value: item.value,
      })) || [],
    timeseriesVisitors:
      data.uniquesTimeseries?.map((item: any) => ({
        date: formatDate(item.timestamp),
        value: item.value,
      })) || [],
    devices:
      data.devices?.map((item: any) => ({
        device: item.device,
        visitors: item.value,
      })) || [],
    countries:
      data.countries?.map((item: any) => ({
        country: item.country,
        visitors: item.value,
      })) || [],
  }
}

const getDefaultAnalyticsData = (): VercelAnalyticsData => {
  return {
    pageviews: { value: 0, change: 0 },
    visitors: { value: 0, change: 0 },
    bounceRate: { value: 0, change: 0 },
    duration: { value: 0, change: 0 },
    browsers: [],
    topPages: [],
    timeseriesPageviews: [],
    timeseriesVisitors: [],
    devices: [],
    countries: [],
  }
}

// Helper function to format dates from timestamps
function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })
}
