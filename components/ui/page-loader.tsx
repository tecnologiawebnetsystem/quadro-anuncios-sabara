"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface PageLoaderProps {
  /** Número de linhas de skeleton a exibir. Padrão: 5 */
  lines?: number
  /** Exibe cabeçalho skeleton (título + subtítulo). Padrão: true */
  showHeader?: boolean
  /** Exibe cards skeleton no topo. Padrão: false */
  showCards?: boolean
  /** Número de cards skeleton. Padrão: 3 */
  cardCount?: number
}

export function PageLoader({
  lines = 5,
  showHeader = true,
  showCards = false,
  cardCount = 3,
}: PageLoaderProps) {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {showHeader && (
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      )}

      {showCards && (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cardCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cardCount }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* Cabeçalho da tabela skeleton */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-border bg-muted/30">
          {[40, 28, 20].map((w, i) => (
            <Skeleton key={i} className={`h-3.5`} style={{ width: `${w}%` }} />
          ))}
        </div>
        {/* Linhas skeleton */}
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-border/50 last:border-0"
            style={{ opacity: 1 - i * (0.12) }}
          >
            <Skeleton className="h-4" style={{ width: "40%" }} />
            <Skeleton className="h-4" style={{ width: "28%" }} />
            <Skeleton className="h-4" style={{ width: "20%" }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Loading centralizado simples — para páginas com conteúdo não tabular */
export function CenteredLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-border" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-primary animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
    </div>
  )
}
