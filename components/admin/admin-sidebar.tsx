"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Settings,
  ChevronDown,
  ClipboardList,
  ShieldCheck,
  BookOpen,
  Calendar,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Anúncios",
    icon: Megaphone,
    href: "/admin/anuncios",
  },
  {
    title: "Publicadores",
    icon: Users,
    href: "/admin/publicadores",
    subItems: [
      { title: "Todos", href: "/admin/publicadores" },
      { title: "Anciãos", href: "/admin/publicadores/anciaos" },
      { title: "Servos Ministeriais", href: "/admin/publicadores/servos-ministeriais" },
      { title: "Pioneiros Regulares", href: "/admin/publicadores/pioneiros-regulares" },
      { title: "Pioneiros Auxiliares", href: "/admin/publicadores/pioneiros-auxiliares" },
    ],
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
    title: "Alçadas",
    icon: ShieldCheck,
    href: "/admin/alcadas",
    subItems: [
      { title: "Todas as Alçadas", href: "/admin/alcadas" },
      { title: "Alçada de Anciãos", href: "/admin/alcadas/anciaos" },
      { title: "Alçada de Servos", href: "/admin/alcadas/servos" },
      { title: "Alçada de Pioneiros", href: "/admin/alcadas/pioneiros" },
      { title: "Alçada de Publicadores", href: "/admin/alcadas/publicadores" },
    ],
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
              Quadro de Anúncios
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
              {menuItems.map((item) =>
                item.subItems ? (
                  <Collapsible key={item.title} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={pathname.startsWith(item.href)}
                          className="w-full justify-between"
                        >
                          <span className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </span>
                          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                              >
                                <Link href={subItem.href}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/configuracoes"}>
                  <Link href="/admin/configuracoes" className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-accent text-accent-foreground text-sm">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">
              Administrador
            </span>
            <span className="text-xs text-muted-foreground">admin@igreja.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
