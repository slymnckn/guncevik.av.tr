"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { generateCSRFToken } from "@/lib/csrf"

interface CSRFFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

export function CSRFForm({ children, ...props }: CSRFFormProps) {
  const [csrfToken, setCsrfToken] = useState("")

  useEffect(() => {
    // Bileşen yüklendiğinde CSRF token oluştur
    const token = generateCSRFToken()
    setCsrfToken(token)

    // Token'ı session storage'a kaydet
    sessionStorage.setItem("csrfToken", token)
  }, [])

  return (
    <form {...props}>
      <input type="hidden" name="csrfToken" value={csrfToken} />
      {children}
    </form>
  )
}
