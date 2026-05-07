import type { Metadata, Viewport } from 'next'
import ChatPwaProvider from './pwa-provider'

export const metadata: Metadata = {
  title: 'Chat Assistência — Parque Sabará',
  description: 'Chat inteligente — assistência para a congregação Parque Sabará: perguntas, roteiros de reunião e serviço de campo.',
  manifest: '/manifest-chat.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Chat Assistência',
    startupImage: [
      { url: '/icons/chat-icon-512x512.jpg' },
    ],
  },
  icons: {
    icon: [
      { url: '/icons/chat-icon-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/icons/chat-icon-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/icons/chat-icon-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/icons/chat-icon-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
  },
  openGraph: {
    title: 'Chat Assistência — Parque Sabará',
    description: 'Chat inteligente — assistência para a congregação Parque Sabará',
    type: 'website',
    images: [{ url: '/icons/chat-icon-512x512.jpg' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#1e3a6e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Metatags extras Apple PWA */}
      <ChatPwaProvider />
      {children}
    </>
  )
}
