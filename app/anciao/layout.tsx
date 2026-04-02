"use client"

import dynamic from "next/dynamic"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

const AnciaoSidebar = dynamic(
  () => import("@/components/admin/anciao-sidebar").then(mod => ({ default: mod.AnciaoSidebar })),
  { ssr: false }
)

export default function AnciaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
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
