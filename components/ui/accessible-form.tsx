import React, { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  ariaLabel?: string
  ariaDescribedBy?: string
}

const AccessibleForm = forwardRef<HTMLFormElement, FormProps>(
  ({ children, className, ariaLabel, ariaDescribedBy, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn("space-y-4", className)}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        {children}
      </form>
    )
  },
)

AccessibleForm.displayName = "AccessibleForm"

interface FormFieldProps {
  children: React.ReactNode
  label: string
  htmlFor: string
  error?: string
  description?: string
  required?: boolean
  className?: string
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, label, htmlFor, error, description, required, className }, ref) => {
    const fieldId = `field-${htmlFor}`
    const descriptionId = description ? `${fieldId}-description` : undefined
    const errorId = error ? `${fieldId}-error` : undefined

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <div className="flex justify-between">
          <label htmlFor={htmlFor} className="text-sm font-medium">
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {error && (
            <span id={errorId} className="text-sm text-red-500">
              {error}
            </span>
          )}
        </div>
        {React.cloneElement(children as React.ReactElement, {
          id: htmlFor,
          "aria-invalid": error ? "true" : "false",
          "aria-describedby": cn(descriptionId, errorId),
          "aria-required": required,
        })}
        {description && (
          <p id={descriptionId} className="text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
    )
  },
)

FormField.displayName = "FormField"

export { AccessibleForm, FormField }
