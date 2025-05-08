"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

interface AccordionFAQProps {
  items: FAQItem[]
}

export function AccordionFAQ({ items }: AccordionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <button
            className="flex justify-between items-center w-full p-4 text-left font-semibold focus:outline-none"
            onClick={() => toggleItem(index)}
          >
            <span>{item.question}</span>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${openIndex === index ? "transform rotate-180" : ""}`}
            />
          </button>
          <div
            className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? "max-h-96 pb-4" : "max-h-0"
            }`}
          >
            <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
