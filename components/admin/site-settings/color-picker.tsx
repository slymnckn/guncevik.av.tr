"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  id: string
  name: string
  defaultValue?: string
}

export function ColorPicker({ id, name, defaultValue = "#000000" }: ColorPickerProps) {
  const [color, setColor] = useState(defaultValue)

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-md border cursor-pointer overflow-hidden" style={{ backgroundColor: color }}>
        <input
          type="color"
          id={id}
          name={name}
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 -ml-1 -mt-1 cursor-pointer opacity-0"
        />
      </div>
      <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="font-mono" />
    </div>
  )
}
