'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Lock, MessageSquare, Calendar, Smartphone, CheckCircle } from 'lucide-react'

type PWAType = 'login' | 'chat' | 'programacao'

interface PWAOption {
  id: PWAType
  name: string
  shortName: string
  description: string
  manifest: string
  sw: string
  startUrl: string
  color: string
  bgColor: string
  icon: React.ReactNode
  features: string[]
}

const pwas: PWAOption[] = [
  {
    id: 'login',
    name: 'InfoFlow Acesso',
    shortName: 'IF Acesso',
    description: 'Acesse o sistema com seu perfil: Administrador, Ancião ou Consulta.',
    manifest: '/manifest-login.json',
    sw: '/sw.js',
    startUrl: '/login',
    color: '#1e3a6e',
    bgColor: '#0d1b2a',
    icon: <Lock className="w-8 h-8 text-white" />,
    features: ['Login Administrador', 'Login Ancião', 'Modo Consulta', 'Acesso seguro'],
  },
  {
    id: 'chat',
    name: 'InfoFlow Chat',
    shortName: 'IF Chat',
    description: 'Chat inteligente para perguntas, partes da reunião e serviço de campo.',
    manifest: '/manifest-chat.json',
    sw: '/sw-chat.js',
    startUrl: '/chat',
    color: '#1e3a6e',
    bgColor: '#0a0f1e',
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    features: ['Chat de Perguntas', 'Criar Partes — Quinta', 'Serviço de Campo', 'Assistente IA'],
  },
  {
    id: 'programacao',
    name: 'InfoFlow Programação',
    shortName: 'IF Programação',
    description: 'Consulte a programação completa da congregação Parque Sabará.',
    manifest: '/manifest-programacao.json',
    sw: '/sw-programacao.js',
    startUrl: '/consulta',
    color: '#166534',
    bgColor: '#0d1f0f',
    icon: <Calendar className="w-8 h-8 text-white" />,
    features: ['Vida e Ministério', 'Serviço de Campo', 'Reuniões Públicas', 'Designações'],
  },
]

function PWACard({ pwa }: { pwa: PWAOption }) {
  const [installed, setInstalled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [supported, setSupported] = useState(true)
  const deferredPromptRef = useRef<Event | null>(null)
  const linkRef = useRef<HTMLLinkElement | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setSupported(false)
      return
    }

    // Injeta o manifest dinamicamente ao focar no card
    const injectManifest = () => {
      // Remove manifest anterior se existir
      const existing = document.querySelector(`link[data-pwa="${pwa.id}"]`)
      if (existing) existing.remove()

      const link = document.createElement('link')
      link.rel = 'manifest'
      link.href = pwa.manifest
      link.setAttribute('data-pwa', pwa.id)
      document.head.appendChild(link)
      linkRef.current = link
    }

    const handler = (e: Event) => {
      e.preventDefault()
      deferredPromptRef.current = e
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      if (linkRef.current) linkRef.current.remove()
    }
  }, [pwa.id, pwa.manifest])

  const handleInstall = async () => {
    setLoading(true)

    try {
      // Atualiza o manifest para este PWA
      const existingManifests = document.querySelectorAll('link[rel="manifest"]')
      existingManifests.forEach((el) => el.remove())

      const link = document.createElement('link')
      link.rel = 'manifest'
      link.href = pwa.manifest
      document.head.appendChild(link)

      // Registra o service worker correto
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register(pwa.sw, { scope: '/' })
      }

      // Tenta usar o prompt nativo
      if (deferredPromptRef.current) {
        const prompt = deferredPromptRef.current as BeforeInstallPromptEvent
        await prompt.prompt()
        const { outcome } = await prompt.userChoice
        if (outcome === 'accepted') {
          setInstalled(true)
        }
        deferredPromptRef.current = null
      } else {
        // iOS / sem prompt: mostra instrucoes
        window.open(pwa.startUrl, '_blank')
      }
    } catch (err) {
      // fallback: abrir direto
      window.open(pwa.startUrl, '_blank')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      style={{ background: pwa.bgColor }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-5"
        style={{ background: `${pwa.color}cc` }}
      >
        <div
          className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg"
          style={{ background: pwa.color }}
        >
          {pwa.icon}
        </div>
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">{pwa.name}</h2>
          <span className="text-white/60 text-sm">{pwa.shortName}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 px-6 py-5 flex-1">
        <p className="text-white/80 text-sm leading-relaxed">{pwa.description}</p>

        <ul className="flex flex-col gap-2">
          {pwa.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-white/70 text-sm">
              <CheckCircle className="w-4 h-4 shrink-0" style={{ color: pwa.color === '#166534' ? '#4ade80' : '#60a5fa' }} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        {installed ? (
          <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600/20 text-green-400 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Instalado com sucesso
          </div>
        ) : (
          <button
            onClick={handleInstall}
            disabled={loading || !supported}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all active:scale-95 disabled:opacity-50"
            style={{ background: pwa.color }}
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {loading ? 'Instalando...' : supported ? 'Instalar App' : 'Abrir no Navegador'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function InstalarPage() {
  return (
    <main className="min-h-screen bg-[#080c14] flex flex-col items-center px-4 py-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 mb-10 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1e3a6e] shadow-xl">
          <Smartphone className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight text-balance">
          Instalar InfoFlow
        </h1>
        <p className="text-white/50 text-sm max-w-xs leading-relaxed text-pretty">
          Escolha qual versão do app deseja instalar na tela inicial do seu celular.
        </p>
      </div>

      {/* Cards */}
      <div className="w-full max-w-md flex flex-col gap-5">
        {pwas.map((pwa) => (
          <PWACard key={pwa.id} pwa={pwa} />
        ))}
      </div>

      {/* iOS hint */}
      <div className="mt-10 max-w-md w-full rounded-xl bg-white/5 border border-white/10 px-5 py-4">
        <p className="text-white/40 text-xs leading-relaxed text-center">
          <strong className="text-white/60">iOS (iPhone/iPad):</strong> Abra o link no Safari, toque em{' '}
          <strong className="text-white/60">Compartilhar</strong> e selecione{' '}
          <strong className="text-white/60">&quot;Adicionar à Tela de Início&quot;</strong>.
          <br />
          <strong className="text-white/60">Android:</strong> Toque em{' '}
          <strong className="text-white/60">&quot;Instalar App&quot;</strong> acima ou use o menu do navegador.
        </p>
      </div>
    </main>
  )
}

// Tipo para o evento nativo
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  }
}
