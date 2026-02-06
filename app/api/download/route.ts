import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    // Get the file path from the query parameter
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get("path")
    const inline = searchParams.get("inline") === "true"

    if (!filePath) {
      return new NextResponse("File path is required", { status: 400 })
    }

    // Initialize Supabase client
    const supabase = await createServerSupabaseClient()

    // Download the file from Supabase Storage
    const { data, error } = await supabase.storage.from("consultation-files").download(filePath)

    if (error) {
      console.error("Error downloading file:", error)
      return new NextResponse("Error downloading file", { status: 500 })
    }

    if (!data) {
      return new NextResponse("File not found", { status: 404 })
    }

    // Extract file name from the path
    const fileName = filePath.split("/").pop() || "downloaded-file"

    // Set appropriate headers for the download
    return new NextResponse(data, {
      headers: {
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${fileName}"`,
        "Content-Type": data.type || "application/octet-stream",
      },
    })
  } catch (error) {
    console.error("Download API error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
