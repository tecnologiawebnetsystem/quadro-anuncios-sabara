'use client'

import { useEffect, useState } from 'react'
import { Download, X, Share } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function ChatPwaProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner]         = useState(false)
  const [isIos, setIsIos]                   = useState(false)
  const [isInstalled, setIsInstalled]       = useState(false)

  useEffect(() => {
    // Registra o service worker exclusivo do chat
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/chat-sw.js', { scope: '/chat' }).catch(() => {})
    }

    // Detecta se já está instalado como PWA
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    if (standalone) { setIsInstalled(true); return }

    // Detecta iOS (Safari não dispara beforeinstallprompt)
    const ua = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua)
    setIsIos(ios)

    // Banner já dispensado?
    const dismissed = sessionStorage.getItem('jw-pwa-dismissed')
    if (dismissed) return

    if (ios) {
      // No iOS mostra banner de instrução após 2 segundos
      const t = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(t)
    }

    // Android / Chrome: captura o evento de instalação
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShowBanner(true), 2000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setShowBanner(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    sessionStorage.setItem('jw-pwa-dismissed', '1')
  }

  if (!showBanner || isInstalled) return null

  // ── Banner iOS (instrução manual) ────────────────────────────────────────
  if (isIos) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-6 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-sm rounded-2xl border border-blue-500/30 bg-[#0a0f1e]/95 backdrop-blur-md shadow-2xl shadow-blue-900/40 p-4"
          style={{ boxShadow: '0 0 40px rgba(30,58,110,0.6)' }}
        >
          {/* Seta para baixo apontando para a barra Safari */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{ borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '12px solid #1e3a6e' }} />

          <div className="flex items-start gap-3">
            {/* Ícone do app */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/chat-icon-192x192.jpg" alt="JW Assistente" className="h-12 w-12 rounded-xl flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight">Instalar JW Assistente</p>
              <p className="text-xs text-blue-300 mt-0.5 leading-relaxed">
                Toque em{' '}
                <span className="inline-flex items-center gap-0.5 font-semibold text-white">
                  <Share className="h-3 w-3" /> Compartilhar
                </span>{' '}
                e depois em{' '}
                <span className="font-semibold text-white">&ldquo;Adicionar à Tela de Início&rdquo;</span>
              </p>
            </div>

            <button onClick={handleDismiss} className="text-blue-400 hover:text-white flex-shrink-0 mt-0.5">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Banner Android / Chrome ───────────────────────────────────────────────
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-6 pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-sm rounded-2xl border border-blue-500/30 bg-[#0a0f1e]/95 backdrop-blur-md shadow-2xl p-4"
        style={{ boxShadow: '0 0 40px rgba(30,58,110,0.6)' }}
      >
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/chat-icon-192x192.jpg" alt="JW Assistente" className="h-12 w-12 rounded-xl flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-tight">JW Assistente</p>
            <p className="text-xs text-blue-300 leading-relaxed mt-0.5">
              Instale o app e acesse offline
            </p>
          </div>

          <button onClick={handleDismiss} className="text-blue-400 hover:text-white flex-shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Botão de instalar */}
        <button
          onClick={handleInstall}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white text-sm font-semibold"
        >
          <Download className="h-4 w-4" />
          Adicionar à tela inicial
        </button>

        <p className="text-center text-[10px] text-blue-400/60 mt-2">
          Funciona offline depois de instalado
        </p>
      </div>
    </div>
  )
}
