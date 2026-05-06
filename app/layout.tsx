import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { NavigationProgress } from '@/components/ui/navigation-progress'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: 'InfoFlow — Parque Sabará',
  description: 'Sistema de gerenciamento de informações da congregação Parque Sabará',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'InfoFlow',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/icons/icon-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/icons/icon-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/icons/icon-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
  },
  openGraph: {
    title: 'InfoFlow — Parque Sabará',
    description: 'Sistema de gerenciamento de informações da congregação Parque Sabará',
    url: 'https://info-flowapp.vercel.app',
    siteName: 'InfoFlow',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'InfoFlow — Parque Sabará',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InfoFlow — Parque Sabará',
    description: 'Sistema de gerenciamento de informações da congregação Parque Sabará',
    images: ['/og-image.jpg'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased bg-background`}>
        <ThemeProvider defaultTheme="dark" storageKey="infoflow-theme">
          <NavigationProgress />
          {children}
          <Toaster richColors position="top-right" />
          <Analytics />
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
              // Aplicar tema antes da renderização para evitar flash
              (function() {
                const theme = localStorage.getItem('infoflow-theme') || 'dark';
                if (theme === 'light' || (theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
