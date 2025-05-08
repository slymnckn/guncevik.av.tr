"use client"
import { Textarea } from "@/components/ui/textarea"

interface SimpleEditorProps {
  value: string
  onChange: (value: string) => void
}

export function SimpleEditor({ value, onChange }: SimpleEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[300px] font-mono text-sm"
      placeholder="İçeriği buraya yazın..."
    />
  )
}
