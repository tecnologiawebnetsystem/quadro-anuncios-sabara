"use client"

// Menu simplificado - InfoFlow v2
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  BookMarked,
  FileText,
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
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Publicadores",
    icon: Users,
    href: "/admin/publicadores",
  },
  {
    title: "Grupo de Estudos",
    icon: BookOpen,
    href: "/admin/grupo-estudos",
  },
  {
    title: "Reuniões",
    icon: Calendar,
    href: "/admin/reunioes",
  },
  {
    title: "Equipe Técnica",
    icon: Wrench,
    href: "/admin/equipe-tecnica",
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
  {
    title: "Reuniões Públicas",
    icon: Mic,
    href: "/admin/reunioes-publicas",
  },
  {
    title: "Vida e Ministério",
    icon: BookMarked,
    href: "/admin/vida-ministerio",
  },
  {
    title: "Estudo Sentinela",
    icon: FileText,
    href: "/admin/sentinela",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

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
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)}
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

// Menu atualizado: InfoFlow v2 - todos os módulos sincronizados com banco de dados
