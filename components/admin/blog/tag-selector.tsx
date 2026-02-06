"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Tag {
  id: string
  name: string
  slug: string
}

interface TagSelectorProps {
  selectedTags: Tag[]
  onChange: (tags: Tag[]) => void
}

export function TagSelector({ selectedTags = [], onChange }: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("blog_tags").select("*").order("name")

      if (error) {
        console.error("Etiketler getirilirken hata oluştu:", error)
      } else {
        setTags(data || [])
      }
      setLoading(false)
    }

    fetchTags()
  }, [supabase])

  const handleSelect = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id)

    if (isSelected) {
      onChange(selectedTags.filter((t) => t.id !== tag.id))
    } else {
      onChange([...selectedTags, tag])
    }
  }

  const handleRemove = (tagId: string) => {
    onChange(selectedTags.filter((tag) => tag.id !== tagId))
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <span>Etiket seç...</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Etiket ara..." />
            <CommandList>
              <CommandEmpty>Etiket bulunamadı.</CommandEmpty>
              <CommandGroup>
                {loading ? (
                  <CommandItem disabled>Yükleniyor...</CommandItem>
                ) : (
                  tags.map((tag) => {
                    const isSelected = selectedTags.some((t) => t.id === tag.id)
                    return (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => handleSelect(tag)}
                        className="flex items-center justify-between"
                      >
                        <span>{tag.name}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </CommandItem>
                    )
                  })
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
            {tag.name}
            <button type="button" onClick={() => handleRemove(tag.id)} className="rounded-full hover:bg-gray-200 p-0.5">
              <X className="h-3 w-3" />
              <span className="sr-only">Kaldır</span>
            </button>
          </Badge>
        ))}
        {selectedTags.length === 0 && <span className="text-sm text-gray-500">Henüz etiket seçilmedi</span>}
      </div>
    </div>
  )
}
