"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

type Column<T> = {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
}

type ResponsiveTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  keyField: string
  actions?: (item: T) => React.ReactNode
  onRowClick?: (item: T) => void
  isLoading?: boolean
  caption?: string
  emptyMessage?: string
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  actions,
  onRowClick,
  isLoading = false,
  caption,
  emptyMessage = "Veri bulunamadı.",
}: ResponsiveTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden" role="status" aria-live="polite">
        <div className="p-4 text-center text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden" role="status" aria-live="polite">
        <div className="p-4 text-center text-gray-500">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Masaüstü görünümü */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="table">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  scope="col"
                >
                  İşlemler
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr
                key={item[keyField]}
                className={`hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => e.key === "Enter" && onRowClick(item) : undefined}
                role={onRowClick ? "button" : undefined}
                aria-label={onRowClick ? `Satır detaylarını görüntüle: ${item[columns[0].key]}` : undefined}
              >
                {columns.map((column) => (
                  <td key={`${item[keyField]}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                {actions && (
                  <td
                    className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil görünümü */}
      <div className="md:hidden" role="region" aria-label="Mobil tablo görünümü">
        {data.map((item) => (
          <div key={item[keyField]} className="border-b last:border-b-0">
            <div
              className={`p-4 flex justify-between items-center ${onRowClick || columns.length > 2 ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (onRowClick) {
                  onRowClick(item)
                } else if (columns.length > 2) {
                  toggleRow(item[keyField])
                }
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (onRowClick) {
                    onRowClick(item)
                  } else if (columns.length > 2) {
                    toggleRow(item[keyField])
                  }
                }
              }}
              role="button"
              aria-expanded={expandedRows[item[keyField]]}
              aria-controls={`details-${item[keyField]}`}
            >
              <div>
                <div className="font-medium">{columns[0].render ? columns[0].render(item) : item[columns[0].key]}</div>
                {columns.length > 1 && (
                  <div className="text-sm text-gray-500">
                    {columns[1].render ? columns[1].render(item) : item[columns[1].key]}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                {actions && (
                  <div className="mr-2" onClick={(e) => e.stopPropagation()}>
                    {actions(item)}
                  </div>
                )}

                {columns.length > 2 &&
                  (expandedRows[item[keyField]] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  ))}
              </div>
            </div>

            {columns.length > 2 && expandedRows[item[keyField]] && (
              <div
                className="px-4 pb-4 space-y-2"
                id={`details-${item[keyField]}`}
                role="region"
                aria-label={`${item[columns[0].key]} detayları`}
              >
                {columns.slice(2).map((column) => (
                  <div key={`${item[keyField]}-${column.key}-mobile`}>
                    <span className="text-xs font-medium text-gray-500">{column.header}: </span>
                    <span className="text-sm">{column.render ? column.render(item) : item[column.key]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
