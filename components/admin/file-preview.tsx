"use client"

import { useState } from "react"
import { FileIcon, Download, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

type FilePreviewProps = {
  file: {
    id: string
    file_name: string
    file_path: string
    file_type: string
    file_size: number
  }
}

export function FilePreview({ file }: FilePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Dosya türüne göre önizleme göster
  const isImage = file.file_type.startsWith("image/")
  const isPdf = file.file_type === "application/pdf"
  const canPreview = isImage || isPdf

  // Dosya boyutunu formatla
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
        <div className="flex items-center">
          <FileIcon className="h-5 w-5 mr-3 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">{file.file_name}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.file_size)} • {file.file_type}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {canPreview && (
            <button
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="text-gray-500 hover:text-gray-700 p-1"
              aria-label={isPreviewOpen ? "Önizlemeyi kapat" : "Önizle"}
            >
              {isPreviewOpen ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}

          <a
            href={`/api/download?path=${encodeURIComponent(file.file_path)}`}
            className="text-primary hover:text-primary/80 p-1"
            aria-label="İndir"
          >
            <Download className="h-5 w-5" />
          </a>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="p-4">
          {isImage && (
            <div className="flex justify-center">
              <Image
                src={`/api/download?path=${encodeURIComponent(file.file_path)}`}
                alt={file.file_name}
                width={600}
                height={400}
                className="max-w-full h-auto object-contain max-h-[500px]"
              />
            </div>
          )}

          {isPdf && (
            <div className="flex justify-center">
              <iframe
                src={`/api/download?path=${encodeURIComponent(file.file_path)}&inline=true`}
                className="w-full h-[500px] border-0"
                title={file.file_name}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
