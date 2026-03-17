// Layout do Admin - InfoFlow v2
"use client"

import dynamic from "next/dynamic"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

// Dynamic import para evitar hydration mismatch com IDs do Radix UI
const AdminSidebar = dynamic(
  () => import("@/components/admin/admin-sidebar").then(mod => ({ default: mod.AdminSidebar })),
  { ssr: false }
)

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
