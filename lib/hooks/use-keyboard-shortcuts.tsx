"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  action: () => void
  description: string
}

export const defaultShortcuts: Omit<KeyboardShortcut, 'action'>[] = [
  { key: 'p', ctrl: true, description: 'Ir para Publicadores' },
  { key: 'e', ctrl: true, description: 'Ir para Equipe Tecnica' },
  { key: 'l', ctrl: true, description: 'Ir para Limpeza' },
  { key: 'd', ctrl: true, description: 'Ir para Dashboard' },
  { key: 'c', ctrl: true, description: 'Ir para Configuracoes' },
  { key: 'g', ctrl: true, description: 'Ir para Grupos' },
  { key: 's', ctrl: true, description: 'Ir para Servico de Campo' },
  { key: '/', ctrl: true, description: 'Abrir busca rapida' },
  { key: 'Escape', description: 'Fechar modal/dialog' },
]

export function useKeyboardShortcuts(basePath: string = '/admin') {
  const router = useRouter()
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignorar se estiver em input, textarea, ou contenteditable
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return
    }
    
    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey
    const alt = event.altKey
    const shift = event.shiftKey
    
    // Atalhos com Ctrl
    if (ctrl && !alt && !shift) {
      switch (key) {
        case 'p':
          event.preventDefault()
          router.push(`${basePath}/publicadores`)
          break
        case 'e':
          event.preventDefault()
          router.push(`${basePath}/equipe-tecnica`)
          break
        case 'l':
          event.preventDefault()
          router.push(`${basePath}/limpeza-salao`)
          break
        case 'd':
          event.preventDefault()
          router.push(basePath)
          break
        case 'c':
          event.preventDefault()
          router.push(`${basePath}/configuracoes`)
          break
        case 'g':
          event.preventDefault()
          router.push(`${basePath}/grupo-estudos`)
          break
        case 's':
          event.preventDefault()
          router.push(`${basePath}/servico-campo`)
          break
        case '/':
          event.preventDefault()
          // Disparar evento para abrir busca
          window.dispatchEvent(new CustomEvent('open-search'))
          break
      }
    }
  }, [router, basePath])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Hook para atalho especifico
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; alt?: boolean; shift?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }
      
      const pressedKey = event.key.toLowerCase()
      const ctrl = event.ctrlKey || event.metaKey
      const alt = event.altKey
      const shift = event.shiftKey
      
      if (
        pressedKey === key.toLowerCase() &&
        (!options.ctrl || ctrl) &&
        (!options.alt || alt) &&
        (!options.shift || shift)
      ) {
        event.preventDefault()
        callback()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, callback, options.ctrl, options.alt, options.shift])
}

// Componente para mostrar atalhos disponiveis
export function KeyboardShortcutsHelp() {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-white mb-3">Atalhos de Teclado</p>
      <div className="grid gap-2">
        {defaultShortcuts.map((shortcut, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">{shortcut.description}</span>
            <kbd className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300">
              {shortcut.ctrl && 'Ctrl + '}
              {shortcut.alt && 'Alt + '}
              {shortcut.shift && 'Shift + '}
              {shortcut.key.toUpperCase()}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  )
}
