"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  BookOpen, 
  Users, 
  Calendar,
  ChevronLeft,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Início",
    href: "/consulta",
    icon: Home,
  },
  {
    title: "Reuniões",
    href: "/consulta/reunioes",
    icon: Calendar,
    subItems: [
      { title: "Vida e Ministério", href: "/consulta/reunioes/vida-ministerio" },
      { title: "Estudo Sentinela", href: "/consulta/reunioes/sentinela" },
    ]
  },
  {
    title: "Grupos de Serviço",
    href: "/consulta/grupos",
    icon: Users,
  },
  {
    title: "Publicadores",
    href: "/consulta/publicadores",
    icon: BookOpen,
  },
]

export default function ConsultaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["Reuniões"])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === "/consulta") return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header Mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="w-5 h-5 text-zinc-400" />
            <span className="text-zinc-400 text-sm">Voltar</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Info<span className="text-red-500">Flow</span></h1>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-zinc-950/95 pt-16">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.title}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all",
                        isActive(item.href)
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <ChevronLeft className={cn(
                        "w-4 h-4 transition-transform",
                        expandedItems.includes(item.title) ? "-rotate-90" : "rotate-0"
                      )} />
                    </button>
                    {expandedItems.includes(item.title) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "block px-4 py-2 rounded-lg text-sm transition-all",
                              pathname.startsWith(sub.href)
                                ? "bg-blue-600/20 text-blue-400"
                                : "text-zinc-500 hover:bg-zinc-800/50 hover:text-white"
                            )}
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      isActive(item.href)
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}

      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-zinc-900/50 border-r border-zinc-800 p-4">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Voltar ao Início</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Info<span className="text-red-500">Flow</span></h1>
            <p className="text-sm text-zinc-500">Informações da Congregação</p>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <div key={item.title}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all",
                        isActive(item.href)
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <ChevronLeft className={cn(
                        "w-4 h-4 transition-transform",
                        expandedItems.includes(item.title) ? "-rotate-90" : "rotate-0"
                      )} />
                    </button>
                    {expandedItems.includes(item.title) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "block px-4 py-2 rounded-lg text-sm transition-all",
                              pathname.startsWith(sub.href)
                                ? "bg-blue-600/20 text-blue-400"
                                : "text-zinc-500 hover:bg-zinc-800/50 hover:text-white"
                            )}
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      isActive(item.href)
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-600 text-center">
              InfoFlow v1.0
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen pt-16 lg:pt-0">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
