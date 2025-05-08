import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the timeframe from the query parameters
    const timeframe = request.nextUrl.searchParams.get("timeframe") || "7d"

    // Check if we have a Vercel API token
    const vercelApiToken = process.env.VERCEL_API_TOKEN
    if (!vercelApiToken) {
      return NextResponse.json({ error: "Vercel API token is not configured" }, { status: 500 })
    }

    // Get the site ID or URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || "guncevik.av.tr"

    // Fetch analytics data from Vercel
    const response = await fetch(
      `https://api.vercel.com/v9/web-analytics/stats?siteSlug=${encodeURIComponent(siteUrl)}&from=${getFromDate(timeframe)}`,
      {
        headers: {
          Authorization: `Bearer ${vercelApiToken}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Vercel Analytics API error:", errorText)
      return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in analytics API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to calculate the from date based on timeframe
function getFromDate(timeframe: string): string {
  const now = new Date()
  const fromDate = new Date()

  switch (timeframe) {
    case "24h":
      fromDate.setDate(now.getDate() - 1)
      break
    case "7d":
      fromDate.setDate(now.getDate() - 7)
      break
    case "30d":
      fromDate.setDate(now.getDate() - 30)
      break
    case "90d":
      fromDate.setDate(now.getDate() - 90)
      break
    default:
      fromDate.setDate(now.getDate() - 7)
  }

  return fromDate.toISOString()
}
