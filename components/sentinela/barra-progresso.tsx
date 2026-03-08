"use client"

import { useMemo } from "react"

interface BarraProgressoProps {
  totalParagrafos: number
  paragrafosLidos: number
  className?: string
}

export function BarraProgresso({ 
  totalParagrafos, 
  paragrafosLidos,
  className = ""
}: BarraProgressoProps) {
  const porcentagem = useMemo(() => {
    if (totalParagrafos === 0) return 0
    return Math.round((paragrafosLidos / totalParagrafos) * 100)
  }, [totalParagrafos, paragrafosLidos])

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
        <span>Progresso de leitura</span>
        <span>{porcentagem}% ({paragrafosLidos}/{totalParagrafos})</span>
      </div>
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${porcentagem}%` }}
        />
      </div>
    </div>
  )
}
