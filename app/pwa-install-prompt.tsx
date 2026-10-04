'use client'

import { useEffect, useState } from 'react'
import { Download, MonitorDown, Share2, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PwaInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [ios, setIos] = useState(false)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    if (standalone || sessionStorage.getItem('pwa-install-dismissed')) return

    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIos = /iphone|ipad|ipod/.test(userAgent) && !/crios|fxios/.test(userAgent)
    setIos(isIos)

    if (isIos) {
      const timer = window.setTimeout(() => setVisible(true), 1800)
      return () => window.clearTimeout(timer)
    }

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault()
      setPromptEvent(event as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  if (!visible) return null

  const dismiss = () => {
    sessionStorage.setItem('pwa-install-dismissed', '1')
    setVisible(false)
  }

  const install = async () => {
    if (!promptEvent) return
    await promptEvent.prompt()
    await promptEvent.userChoice
    setPromptEvent(null)
    setVisible(false)
  }

  return (
    <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-2xl border border-primary/20 bg-card p-4 text-card-foreground shadow-2xl md:inset-x-auto md:right-6 md:mx-0" aria-label="Instalar aplicativo">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MonitorDown className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Instalar no notebook</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {ios ? 'Toque em Compartilhar e escolha “Adicionar à Tela de Início”.' : 'Tenha acesso rápido ao Quadro de Anúncios, como um aplicativo.'}
          </p>
        </div>
        <button type="button" onClick={dismiss} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Fechar aviso de instalação">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      {!ios && (
        <button type="button" onClick={install} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          <Download className="size-4" aria-hidden="true" />
          Adicionar ao dispositivo
        </button>
      )}
      {ios && <Share2 className="sr-only" aria-hidden="true" />}
    </aside>
  )
}
