"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface SyncContextType {
  lastSync: Date | null
  isSyncing: boolean
  syncTrigger: number
  triggerSync: () => void
}

const SyncContext = createContext<SyncContextType | undefined>(undefined)

export function SyncProvider({ children }: { children: ReactNode }) {
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncTrigger, setSyncTrigger] = useState(0)

  const triggerSync = useCallback(() => {
    setIsSyncing(true)
    setSyncTrigger(prev => prev + 1)
    
    // Simula um tempo de sincronização para feedback visual
    setTimeout(() => {
      setLastSync(new Date())
      setIsSyncing(false)
    }, 1000)
  }, [])

  return (
    <SyncContext.Provider value={{ lastSync, isSyncing, syncTrigger, triggerSync }}>
      {children}
    </SyncContext.Provider>
  )
}

// Valores padrão para quando usado fora do SyncProvider
const defaultSyncContext: SyncContextType = {
  lastSync: null,
  isSyncing: false,
  syncTrigger: 0,
  triggerSync: () => {},
}

export function useSync() {
  const context = useContext(SyncContext)
  // Retorna valores padrão se usado fora do provider (não quebra a aplicação)
  return context ?? defaultSyncContext
}
