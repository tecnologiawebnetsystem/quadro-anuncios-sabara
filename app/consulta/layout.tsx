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

// Itens do bottom navigation (mobile) - apenas os mais importantes
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
            ? "bg-blue-600/20 text-blue-400" 
            : "text-zinc-400 hover:text-blue-400 hover:bg-zinc-800/50"
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
          ? "bg-blue-600/20 text-blue-400" 
          : "text-zinc-400 hover:text-blue-400 hover:bg-zinc-800/50"
      )}
      title="Atualizar dados"
    >
      <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
      <span className="hidden sm:inline">
        {isSyncing ? "Atualizando..." : "Atualizar"}
      </span>
      {lastSync && !isSyncing && (
        <span className="text-xs text-zinc-600">
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
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header - Fixo no topo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="flex items-center justify-between px-4 py-3 max-w-5xl mx-auto">
          {/* Logo / Voltar */}
          <div className="flex items-center gap-2">
            {!isHomePage && (
              <Link 
                href="/consulta" 
                className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}
            <Link href="/consulta" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-red-600/50 flex items-center justify-center">
                <span className="text-xs font-bold text-white">I<span className="text-red-500">F</span></span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-white leading-tight">
                  Quadro de <span className="text-red-500">Anúncios</span>
                </h1>
                <p className="text-[10px] text-zinc-500 leading-tight">Congregação Pq. Sabará</p>
              </div>
            </Link>
          </div>
          
          {/* Ações */}
          <div className="flex items-center gap-1">
            <SyncButton compact />
            <Link 
              href="/" 
              className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Com padding para header e bottom nav */}
      <main className="pt-16 pb-20 md:pb-8">
        <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Apenas mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800">
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
                    ? "text-blue-400 bg-blue-600/10" 
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <item.icon className={cn("w-5 h-5", active && "text-blue-400")} />
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
