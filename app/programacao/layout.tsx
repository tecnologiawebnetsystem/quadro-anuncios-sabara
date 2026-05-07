import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Programação — Parque Sabará',
  description: 'Programação da congregação Parque Sabará — reuniões, serviço de campo e designações',
  manifest: '/manifest-programacao.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Programação',
    startupImage: [
      { url: '/icons/prog-icon-512x512.jpg' },
    ],
  },
  icons: {
    icon: [
      { url: '/icons/prog-icon-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/icons/prog-icon-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/icons/prog-icon-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/icons/prog-icon-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
  },
  openGraph: {
    title: 'Programação — Parque Sabará',
    description: 'Programação da congregação Parque Sabará',
    type: 'website',
    images: [{ url: '/icons/prog-icon-512x512.jpg' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#166534',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function ProgramacaoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
