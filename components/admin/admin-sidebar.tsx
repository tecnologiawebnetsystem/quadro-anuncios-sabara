"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useId } from "react"
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BookOpen,
  Calendar,
  Wrench,
  Sparkles,
  MapPin,
  Mic,
  ChevronDown,
  Gem,
  BookMarked,
  UserCheck,
  Shield,
  Flag,
  Megaphone,
  Settings,
  Music,
  type LucideIcon
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { createClient } from "@/lib/supabase/client"

interface MenuItem {
  title: string
  icon: LucideIcon
  href: string
  color?: string
}

interface MenuGroup {
  title: string
  icon: LucideIcon
  color: string
  items: MenuItem[]
}

const mainItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-blue-400",
  },
  {
    title: "Quadro de Anúncios",
    icon: Megaphone,
    href: "/admin/anuncios",
    color: "text-amber-400",
  },
]

const menuGroups: MenuGroup[] = [
  {
    title: "Publicadores",
    icon: Users,
    color: "text-violet-400",
    items: [
      { title: "Todos", icon: Users, href: "/admin/publicadores", color: "text-violet-400" },
      { title: "Anciãos", icon: UserCheck, href: "/admin/publicadores/anciaos", color: "text-violet-400" },
      { title: "Servos", icon: Shield, href: "/admin/publicadores/servos-ministeriais", color: "text-violet-400" },
      { title: "Pioneiros", icon: Flag, href: "/admin/publicadores/pioneiros-regulares", color: "text-violet-400" },
    ]
  },
  {
    title: "Reuniões",
    icon: Calendar,
    color: "text-blue-400",
    items: [
      { title: "Vida e Ministério", icon: Gem, href: "/admin/vida-ministerio", color: "text-blue-400" },
      { title: "Sentinela", icon: BookMarked, href: "/admin/sentinela", color: "text-blue-400" },
      { title: "Reuniões Públicas", icon: Mic, href: "/admin/reunioes-publicas", color: "text-blue-400" },
      { title: "Equipe Técnica", icon: Wrench, href: "/admin/equipe-tecnica", color: "text-blue-400" },
    ]
  },
]

const orgItems: MenuItem[] = [
  { title: "Cânticos", icon: Music, href: "/admin/canticos", color: "text-purple-400" },
  { title: "Grupo de Estudos", icon: BookOpen, href: "/admin/grupo-estudos", color: "text-emerald-400" },
  { title: "Limpeza do Salão", icon: Sparkles, href: "/admin/limpeza-salao", color: "text-cyan-400" },
  { title: "Serviço de Campo", icon: MapPin, href: "/admin/servico-campo", color: "text-orange-400" },
]

const impressaoGroup: MenuGroup = {
  title: "Impressão",
  icon: ClipboardList,
  color: "text-amber-400",
  items: [
    { title: "Vida e Ministério", icon: Gem, href: "/admin/vida-ministerio", color: "text-amber-400" },
    { title: "Programação", icon: ClipboardList, href: "/admin/programacao-congregacao", color: "text-amber-400" },
    { title: "Grupo de Estudos", icon: BookOpen, href: "/admin/impressao/grupo-estudos", color: "text-amber-400" },
  ]
}

export function AdminSidebar() {
  const pathname = usePathname()
  const baseId = useId()
  const [openGroups, setOpenGroups] = useState<string[]>(["Publicadores", "Reuniões", "Impressão"])
  const [stats, setStats] = useState({
    totalPublicadores: 0,
    totalAnciaos: 0,
    totalServos: 0,
    totalPioneiros: 0,
  })

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()
      const { count: total } = await supabase.from("publicadores").select("*", { count: "exact", head: true }).eq("ativo", true)
      const { count: anciaos } = await supabase.from("publicadores").select("*", { count: "exact", head: true }).eq("ativo", true).eq("anciao", true)
      const { count: servos } = await supabase.from("publicadores").select("*", { count: "exact", head: true }).eq("ativo", true).eq("servo_ministerial", true)
      const { count: pioneiros } = await supabase.from("publicadores").select("*", { count: "exact", head: true }).eq("ativo", true).eq("pioneiro_regular", true)
      setStats({ totalPublicadores: total || 0, totalAnciaos: anciaos || 0, totalServos: servos || 0, totalPioneiros: pioneiros || 0 })
    }
    loadStats()
  }, [])

  const toggleGroup = (title: string) => {
    setOpenGroups(prev =>
      prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]
    )
  }

  const isItemActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const isGroupActive = (group: MenuGroup) => group.items.some(item => isItemActive(item.href))

  const getBadgeForItem = (href: string): number | undefined => {
    const badgeMap: Record<string, number> = {
      "/admin/publicadores": stats.totalPublicadores,
      "/admin/publicadores/anciaos": stats.totalAnciaos,
      "/admin/publicadores/servos-ministeriais": stats.totalServos,
      "/admin/publicadores/pioneiros-regulares": stats.totalPioneiros,
    }
    return badgeMap[href]
  }

  return (
    <Sidebar className="border-r border-sidebar-border">
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <ClipboardList className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              Info<span className="text-primary">Flow</span>
            </span>
            <span className="text-[11px] text-muted-foreground">Administração</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-3 gap-1">

        {/* Dashboard */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isItemActive(item.href)} className="h-9 rounded-lg">
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={cn("h-4 w-4 flex-shrink-0", item.color)} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-1 border-t border-sidebar-border/60" />

        {/* Grupos colapsáveis */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Gerenciamento
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu suppressHydrationWarning>
              {menuGroups.map((group) => (
                <Collapsible
                  key={group.title}
                  open={openGroups.includes(group.title)}
                  onOpenChange={() => toggleGroup(group.title)}
                >
                  <SidebarMenuItem suppressHydrationWarning>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={cn(
                          "h-9 w-full justify-between rounded-lg font-medium transition-all",
                          isGroupActive(group) && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <group.icon className={cn("h-4 w-4 flex-shrink-0", group.color)} />
                          <span>{group.title}</span>
                        </span>
                        <ChevronDown className={cn(
                          "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                          openGroups.includes(group.title) && "rotate-180"
                        )} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 border-l border-sidebar-border/60 pl-3 mt-0.5 space-y-0.5">
                        {group.items.map((item) => {
                          const badge = getBadgeForItem(item.href)
                          return (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isItemActive(item.href)}
                                className="h-8 rounded-md"
                              >
                                <Link href={item.href} className="flex items-center justify-between w-full">
                                  <span className="flex items-center gap-2">
                                    <item.icon className={cn("h-3.5 w-3.5 flex-shrink-0", item.color)} />
                                    <span className="text-sm">{item.title}</span>
                                  </span>
                                  {badge !== undefined && badge > 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="h-4 min-w-[1.1rem] px-1 text-[9px] bg-zinc-700/80 text-zinc-300 rounded-full"
                                    >
                                      {badge}
                                    </Badge>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-1 border-t border-sidebar-border/60" />

        {/* Organização */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Organização
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu suppressHydrationWarning>
              {/* Grupo Impressão colapsável */}
              <Collapsible
                open={openGroups.includes(impressaoGroup.title)}
                onOpenChange={() => toggleGroup(impressaoGroup.title)}
              >
                <SidebarMenuItem suppressHydrationWarning>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "h-9 w-full justify-between rounded-lg font-medium transition-all",
                        impressaoGroup.items.some(item => isItemActive(item.href)) && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <impressaoGroup.icon className={cn("h-4 w-4 flex-shrink-0", impressaoGroup.color)} />
                        <span>{impressaoGroup.title}</span>
                      </span>
                      <ChevronDown className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                        openGroups.includes(impressaoGroup.title) && "rotate-180"
                      )} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-4 border-l border-sidebar-border/60 pl-3 mt-0.5 space-y-0.5">
                      {impressaoGroup.items.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isItemActive(item.href)}
                            className="h-8 rounded-md"
                          >
                            <Link href={item.href} className="flex items-center gap-2">
                              <item.icon className={cn("h-3.5 w-3.5 flex-shrink-0", item.color)} />
                              <span className="text-sm">{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Demais itens de organização */}
              {orgItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isItemActive(item.href)} className="h-9 rounded-lg font-medium">
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={cn("h-4 w-4 flex-shrink-0", item.color)} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-1 border-t border-sidebar-border/60" />

        {/* Configurações */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isItemActive("/admin/configuracoes")} className="h-9 rounded-lg font-medium">
                  <Link href="/admin/configuracoes" className="flex items-center gap-3">
                    <Settings className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        <p className="text-[10px] text-muted-foreground/50 text-center">
          Congregação Pq. Sabará
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
