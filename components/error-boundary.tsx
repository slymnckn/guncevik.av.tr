"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Hata loglaması yapılabilir
    console.error("Error boundary caught an error:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Özel fallback UI
      return (
        this.props.fallback || (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-700 mb-2">Bir şeyler yanlış gitti</h3>
            <p className="text-red-600 mb-4">
              Bu bileşen yüklenirken bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
            </p>
            <Button onClick={() => this.setState({ hasError: false })}>Yeniden Dene</Button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
