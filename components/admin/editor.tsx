"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createEditor, type Descendant, Element as SlateElement, Editor, Transforms } from "slate"
import { Slate, Editable, withReact, useSlate } from "slate-react"
import { withHistory } from "slate-history"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Code } from "lucide-react"
import { cn } from "@/lib/utils"

// Slate için geçerli boş değer
const INITIAL_VALUE: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
]

interface EditorProps {
  value: any
  onChange: (value: any) => void
  placeholder?: string
  className?: string
}

// Toolbar butonu bileşeni
const ToolbarButton = ({ icon, isActive, onMouseDown, tooltip }) => {
  return (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="icon"
      className="h-8 w-8"
      onMouseDown={onMouseDown}
      title={tooltip}
      aria-label={tooltip}
    >
      {icon}
    </Button>
  )
}

// Format kontrolü için yardımcı fonksiyonlar
const isBlockActive = (editor, format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    }),
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

// Blok değiştirme
const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = ["numbered-list", "bulleted-list"].includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && ["numbered-list", "bulleted-list"].includes(n.type),
    split: true,
  })

  const newProperties: Partial<SlateElement> = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  }

  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

// İşaret değiştirme
const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

// Toolbar bileşeni
const Toolbar = () => {
  const editor = useSlate()

  return (
    <div className="flex items-center border-b p-2 gap-1 flex-wrap">
      <ToolbarButton
        icon={<Bold size={18} />}
        isActive={isMarkActive(editor, "bold")}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleMark(editor, "bold")
        }}
        tooltip="Kalın"
      />
      <ToolbarButton
        icon={<Italic size={18} />}
        isActive={isMarkActive(editor, "italic")}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleMark(editor, "italic")
        }}
        tooltip="İtalik"
      />
      <ToolbarButton
        icon={<Underline size={18} />}
        isActive={isMarkActive(editor, "underline")}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleMark(editor, "underline")
        }}
        tooltip="Altı Çizili"
      />
      <div className="border-l mx-1 h-6" />
      <ToolbarButton
        icon={<Heading1 size={18} />}
        isActive={isBlockActive(editor, "heading-one")}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleBlock(editor, "heading-one")
        }}
        tooltip="Başlık 1"
      />
      <ToolbarButton
        icon={<Heading2 size={18} />}
        isActive={isBlockActive(editor, "heading-two")}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleBlock(editor, "heading-two")
        }}
        tooltip="Başlık 2"
      />
      <div className="border-l mx-1 h-6" />
      <ToolbarButton
        icon={<List size={18} />}
        isActive={isBlockActive(editor, "bulleted-list")}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleBlock(editor, "bulleted-list")
        }}
        tooltip="Madde İşaretli Liste"
      />
      <ToolbarButton
        icon={<ListOrdered size={18} />}
        isActive={isBlockActive(editor, "numbered-list")}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleBlock(editor, "numbered-list")
        }}
        tooltip="Numaralı Liste"
      />
      <div className="border-l mx-1 h-6" />
      <ToolbarButton
        icon={<Code size={18} />}
        isActive={isMarkActive(editor, "code")}
        onMouseDown={(e) => {
          e.preventDefault()
          toggleMark(editor, "code")
        }}
        tooltip="Kod"
      />
    </div>
  )
}

// Özel editör oluşturma
const withCustomFeatures = (editor) => {
  const { isInline, isVoid } = editor

  editor.isInline = (element) => {
    return ["link"].includes(element.type) ? true : isInline(element)
  }

  editor.isVoid = (element) => {
    return ["image"].includes(element.type) ? true : isVoid(element)
  }

  return editor
}

export function EditorComponent({ value, onChange, placeholder = "İçerik yazın...", className }: EditorProps) {
  // Editör state'i
  const editor = useMemo(() => withCustomFeatures(withHistory(withReact(createEditor()))), [])
  const [editorValue, setEditorValue] = useState<Descendant[]>(INITIAL_VALUE)

  // Değeri kontrol et ve geçerli bir değer sağla
  useEffect(() => {
    try {
      let validValue = INITIAL_VALUE

      if (value) {
        if (Array.isArray(value)) {
          validValue = value
        } else if (typeof value === "string") {
          try {
            const parsed = JSON.parse(value)
            if (Array.isArray(parsed) && parsed.length > 0) {
              validValue = parsed
            } else {
              // Düz metni Slate formatına dönüştür
              validValue = [
                {
                  type: "paragraph",
                  children: [{ text: value }],
                },
              ]
            }
          } catch (e) {
            // Düz metni Slate formatına dönüştür
            validValue = [
              {
                type: "paragraph",
                children: [{ text: value }],
              },
            ]
          }
        }
      }

      setEditorValue(validValue)
    } catch (error) {
      console.error("Editor değeri ayarlanırken hata oluştu:", error)
      setEditorValue(INITIAL_VALUE)
    }
  }, [value])

  // Render elementi
  const renderElement = useCallback(({ attributes, children, element }) => {
    switch (element.type) {
      case "paragraph":
        return <p {...attributes}>{children}</p>
      case "heading-one":
        return (
          <h1 className="text-2xl font-bold my-2" {...attributes}>
            {children}
          </h1>
        )
      case "heading-two":
        return (
          <h2 className="text-xl font-bold my-2" {...attributes}>
            {children}
          </h2>
        )
      case "block-quote":
        return (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic" {...attributes}>
            {children}
          </blockquote>
        )
      case "bulleted-list":
        return (
          <ul className="list-disc pl-5" {...attributes}>
            {children}
          </ul>
        )
      case "numbered-list":
        return (
          <ol className="list-decimal pl-5" {...attributes}>
            {children}
          </ol>
        )
      case "list-item":
        return <li {...attributes}>{children}</li>
      case "link":
        return (
          <a href={element.url} className="text-blue-500 underline" {...attributes}>
            {children}
          </a>
        )
      default:
        return <p {...attributes}>{children}</p>
    }
  }, [])

  // Render leaf
  const renderLeaf = useCallback(({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }

    if (leaf.italic) {
      children = <em>{children}</em>
    }

    if (leaf.underline) {
      children = <u>{children}</u>
    }

    if (leaf.code) {
      children = <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm">{children}</code>
    }

    return <span {...attributes}>{children}</span>
  }, [])

  // Değişiklik olduğunda
  const handleChange = (newValue) => {
    setEditorValue(newValue)
    onChange(newValue)
  }

  // Otomatik kaydetme
  useEffect(() => {
    const interval = setInterval(() => {
      // Burada otomatik kaydetme işlemi yapılabilir
      // localStorage.setItem('editor-content', JSON.stringify(editorValue));
    }, 10000) // 10 saniyede bir

    return () => clearInterval(interval)
  }, [editorValue])

  return (
    <div className={cn("border rounded-md overflow-hidden", className)}>
      <Slate editor={editor} value={editorValue} onChange={handleChange}>
        <Toolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          spellCheck
          className="min-h-[200px] p-4 focus:outline-none"
          onKeyDown={(event) => {
            // Kısayol tuşları
            if (!event.ctrlKey) return

            switch (event.key) {
              case "b": {
                event.preventDefault()
                toggleMark(editor, "bold")
                break
              }
              case "i": {
                event.preventDefault()
                toggleMark(editor, "italic")
                break
              }
              case "u": {
                event.preventDefault()
                toggleMark(editor, "underline")
                break
              }
            }
          }}
        />
      </Slate>
    </div>
  )
}
