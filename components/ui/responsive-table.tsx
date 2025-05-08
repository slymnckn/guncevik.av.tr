import type React from "react"
import { cn } from "@/lib/utils"

interface Column {
  header: string
  accessor: string
  cell?: (value: any, row: any) => React.ReactNode
  className?: string
}

interface ResponsiveTableProps {
  columns: Column[]
  data: any[]
  className?: string
  emptyMessage?: string
}

export function ResponsiveTable({ columns, data, className, emptyMessage = "Veri bulunamadı" }: ResponsiveTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn("overflow-hidden rounded-lg shadow-md", className)}>
      {/* Masaüstü görünümü */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white",
                      column.className,
                    )}
                  >
                    {column.cell ? column.cell(row[column.accessor], row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil görünümü */}
      <div className="md:hidden">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="py-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{column.header}</div>
                <div className={cn("mt-1 text-sm text-gray-900 dark:text-white", column.className)}>
                  {column.cell ? column.cell(row[column.accessor], row) : row[column.accessor]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
