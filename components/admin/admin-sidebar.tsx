"use client"

// Menu aprimorado - InfoFlow v3 com grupos organizados
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
  Settings,
  ChevronDown,
  Gem,
  BookMarked,
  UserCheck,
  Shield,
  Flag,
  Wand2,
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
  badge?: number
  badgeColor?: string
}

interface MenuGroup {
  title: string
  icon: LucideIcon
  items: MenuItem[]
}

const mainItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
]

const menuGroups: MenuGroup[] = [
  {
    title: "Publicadores",
    icon: Users,
    items: [
      { title: "Todos", icon: Users, href: "/admin/publicadores" },
      { title: "Anciãos", icon: UserCheck, href: "/admin/publicadores/anciaos" },
      { title: "Servos", icon: Shield, href: "/admin/publicadores/servos-ministeriais" },
      { title: "Pioneiros", icon: Flag, href: "/admin/publicadores/pioneiros-regulares" },
    ]
  },
  {
    title: "Reuniões",
    icon: Calendar,
    items: [
      { title: "Vida e Ministério", icon: Gem, href: "/admin/vida-ministerio" },
      { title: "Sentinela", icon: BookMarked, href: "/admin/sentinela" },
      { title: "Discursos", icon: Mic, href: "/admin/reunioes-publicas" },
      { title: "Equipe Técnica", icon: Wrench, href: "/admin/equipe-tecnica" },
    ]
  },
]

const singleItems: MenuItem[] = [
  {
    title: "Grupo de Estudos",
    icon: BookOpen,
    href: "/admin/grupo-estudos",
  },
  {
    title: "Limpeza do Salão",
    icon: Sparkles,
    href: "/admin/limpeza-salao",
  },
  {
    title: "Serviço de Campo",
    icon: MapPin,
    href: "/admin/servico-campo",
  },
]

const configItems: MenuItem[] = [
  {
    title: "Configurações",
    icon: Settings,
    href: "/admin/configuracoes",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const baseId = useId()
  const [openGroups, setOpenGroups] = useState<string[]>(["Publicadores", "Reunioes"])
  const [stats, setStats] = useState({
    totalPublicadores: 0,
    totalAnciaos: 0,
    totalServos: 0,
    totalPioneiros: 0,
  })

  // Carregar estatisticas para badges
  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()
      
      const { count: total } = await supabase
        .from("publicadores")
        .select("*", { count: "exact", head: true })
        .eq("ativo", true)
      
      const { count: anciaos } = await supabase
        .from("publicadores")
        .select("*", { count: "exact", head: true })
        .eq("ativo", true)
        .eq("anciao", true)
      
      const { count: servos } = await supabase
        .from("publicadores")
        .select("*", { count: "exact", head: true })
        .eq("ativo", true)
        .eq("servo_ministerial", true)
      
      const { count: pioneiros } = await supabase
        .from("publicadores")
        .select("*", { count: "exact", head: true })
        .eq("ativo", true)
        .eq("pioneiro_regular", true)
      
      setStats({
        totalPublicadores: total || 0,
        totalAnciaos: anciaos || 0,
        totalServos: servos || 0,
        totalPioneiros: pioneiros || 0,
      })
    }
    loadStats()
  }, [])

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title)
        : [...prev, title]
    )
  }

  const isItemActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const isGroupActive = (group: MenuGroup) => {
    return group.items.some(item => isItemActive(item.href))
  }

  // Adicionar badges dinamicos aos items
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
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <ClipboardList className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Info<span className="text-primary">Flow</span>
            </span>
            <span className="text-[10px] text-muted-foreground">Administração</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Main Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isItemActive(item.href)}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Grouped Items */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Gerenciamento
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu suppressHydrationWarning>
              {menuGroups.map((group, index) => (
                <Collapsible
                  key={group.title}
                  open={openGroups.includes(group.title)}
                  onOpenChange={() => toggleGroup(group.title)}
                >
                  <SidebarMenuItem suppressHydrationWarning>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        className={cn(
                          "w-full justify-between",
                          isGroupActive(group) && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <group.icon className="h-4 w-4" />
                          <span>{group.title}</span>
                        </span>
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          openGroups.includes(group.title) && "rotate-180"
                        )} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.items.map((item) => {
                          const badge = getBadgeForItem(item.href)
                          return (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton 
                                asChild 
                                isActive={isItemActive(item.href)}
                              >
                                <Link href={item.href} className="flex items-center justify-between w-full">
                                  <span className="flex items-center gap-2">
                                    <item.icon className="h-3.5 w-3.5" />
                                    <span className="text-sm">{item.title}</span>
                                  </span>
                                  {badge !== undefined && badge > 0 && (
                                    <Badge 
                                      variant="secondary" 
                                      className="h-5 min-w-5 px-1.5 text-[10px] bg-zinc-700 text-zinc-300"
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

        {/* Single Items */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Organização
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {singleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isItemActive(item.href)}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Config Items */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isItemActive(item.href)}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

// Menu atualizado: InfoFlow v3 - com grupos colapsaveis e badges de contagem
