"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Calendar,
  LogOut,
  RefreshCw,
  ChevronLeft,
  Users,
  Wrench,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SyncProvider, useSync } from "@/lib/contexts/sync-context"
import { AppIcon } from "@/components/ui/app-icon"

const bottomNavItems = [
  { title: "Início", href: "/consulta", icon: Home },
  { title: "Reuniões", href: "/consulta/reunioes/vida-ministerio", icon: Calendar },
  { title: "Equipe", href: "/consulta/equipe-tecnica", icon: Wrench },
  { title: "Campo", href: "/consulta/servico-campo", icon: MapPin },
  { title: "Grupos", href: "/consulta/grupos", icon: Users },
]

function SyncButton({ compact = false }: { compact?: boolean }) {
  const { isSyncing, lastSync, triggerSync } = useSync()
  
  const formatLastSync = () => {
    if (!lastSync) return null
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastSync.getTime()) / 1000)
    if (diff < 60) return "agora"
    if (diff < 3600) return `${Math.floor(diff / 60)}min`
    return lastSync.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  if (compact) {
    return (
      <button
        onClick={triggerSync}
        disabled={isSyncing}
        className={cn(
          "p-2 rounded-lg transition-all",
          isSyncing 
            ? "bg-sky-600/20 text-sky-400" 
            : "text-sky-300/70 hover:text-sky-200 hover:bg-sky-600/20"
        )}
        title="Atualizar dados"
      >
        <RefreshCw className={cn("w-5 h-5", isSyncing && "animate-spin")} />
      </button>
    )
  }

  return (
    <button
      onClick={triggerSync}
      disabled={isSyncing}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
        isSyncing 
          ? "bg-sky-600/20 text-sky-400" 
          : "text-sky-300/70 hover:text-sky-200 hover:bg-sky-600/20"
      )}
      title="Atualizar dados"
    >
      <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
      <span className="hidden sm:inline">
        {isSyncing ? "Atualizando..." : "Atualizar"}
      </span>
      {lastSync && !isSyncing && (
        <span className="text-xs text-sky-400/50">
          ({formatLastSync()})
        </span>
      )}
    </button>
  )
}

function ConsultaLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === "/consulta"

  const isActive = (href: string) => {
    if (href === "/consulta") return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0f2550 0%, #1a3a6e 40%, #1e4080 100%)" }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f2550]/95 backdrop-blur-sm border-b border-sky-700/40">
        <div className="flex items-center justify-between px-4 py-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            {!isHomePage && (
              <Link 
                href="/consulta" 
                className="p-2 -ml-2 text-sky-300/70 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}
            <Link href="/consulta" className="flex items-center gap-2">
              <AppIcon size={32} className="rounded-lg shadow-md shadow-orange-900/30 flex-shrink-0" />
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-white leading-tight">
                  Quadro de <span className="text-amber-400">Anúncios</span>
                </h1>
                <p className="text-[10px] text-sky-300/50 leading-tight">Congregação Pq. Sabará</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-1">
            <SyncButton compact />
            <Link 
              href="/" 
              className="p-2 text-sky-300/60 hover:text-amber-400 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20 md:pb-8">
        <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f2550]/95 backdrop-blur-sm border-t border-sky-700/40">
        <div className="flex items-center justify-around py-2 px-2">
          {bottomNavItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]",
                  active 
                    ? "text-amber-400 bg-amber-500/10" 
                    : "text-sky-300/60 hover:text-sky-200"
                )}
              >
                <item.icon className={cn("w-5 h-5", active && "text-amber-400")} />
                <span className="text-[10px] font-medium">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default function ConsultaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SyncProvider>
      <ConsultaLayoutContent>{children}</ConsultaLayoutContent>
    </SyncProvider>
  )
}
