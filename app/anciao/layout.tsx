"use client"

import dynamic from "next/dynamic"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { useIsMobile } from "@/hooks/use-mobile"

const AnciaoSidebar = dynamic(
  () => import("@/components/admin/anciao-sidebar").then(mod => ({ default: mod.AnciaoSidebar })),
  { ssr: false }
)

export default function AnciaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <AnciaoSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
