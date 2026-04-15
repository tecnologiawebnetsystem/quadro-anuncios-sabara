"use client"

import { cn } from "@/lib/utils"

interface SkipLinkProps {
  href?: string
  children?: React.ReactNode
  className?: string
}

export function SkipLink({ 
  href = "#main-content", 
  children = "Pular para o conteúdo principal",
  className 
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:absolute focus:z-50 focus:top-4 focus:left-4",
        "focus:px-4 focus:py-2 focus:rounded-lg",
        "focus:bg-primary focus:text-primary-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "transition-all",
        className
      )}
    >
      {children}
    </a>
  )
}

// Componente para marcar o conteúdo principal
export function MainContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <main 
      id="main-content" 
      tabIndex={-1}
      className={cn("outline-none", className)}
      role="main"
      aria-label="Conteúdo principal"
    >
      {children}
    </main>
  )
}

// Componente para região navegável
export function NavigationRegion({ 
  children, 
  label = "Navegação principal",
  className 
}: { 
  children: React.ReactNode
  label?: string
  className?: string 
}) {
  return (
    <nav 
      aria-label={label}
      className={className}
      role="navigation"
    >
      {children}
    </nav>
  )
}

// Componente para anúncios de screen reader
export function ScreenReaderAnnouncement({ 
  message,
  politeness = "polite" 
}: { 
  message: string
  politeness?: "polite" | "assertive"
}) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

// Hook para anúncios dinâmicos
export function useAnnounce() {
  const announce = (message: string, politeness: "polite" | "assertive" = "polite") => {
    const el = document.createElement("div")
    el.setAttribute("role", "status")
    el.setAttribute("aria-live", politeness)
    el.setAttribute("aria-atomic", "true")
    el.className = "sr-only"
    el.textContent = message
    document.body.appendChild(el)
    
    setTimeout(() => {
      document.body.removeChild(el)
    }, 1000)
  }
  
  return { announce }
}

// Componente de campo de formulário acessível
export function AccessibleField({
  id,
  label,
  required,
  error,
  hint,
  children
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-hidden="true">*</span>
        )}
        {required && <span className="sr-only">(obrigatório)</span>}
      </label>
      
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      
      <div aria-describedby={describedBy} aria-invalid={!!error}>
        {children}
      </div>
      
      {error && (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
