"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Smartphone, Check, X, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  getCurrentSubscription,
  sendLocalNotification
} from "@/lib/services/push-notifications"
import { toast } from "sonner"

interface GerenciarNotificacoesProps {
  publicadorId?: string
  publicadorNome?: string
  className?: string
}

export function GerenciarNotificacoes({ publicadorId, publicadorNome, className }: GerenciarNotificacoesProps) {
  const [suportado, setSuportado] = useState(false)
  const [permissao, setPermissao] = useState<NotificationPermission>('default')
  const [inscrito, setInscrito] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [processando, setProcessando] = useState(false)
  
  useEffect(() => {
    async function verificarStatus() {
      const suporte = isPushSupported()
      setSuportado(suporte)
      
      if (suporte) {
        const perm = await getNotificationPermission()
        setPermissao(perm)
        
        const subscription = await getCurrentSubscription()
        setInscrito(!!subscription)
      }
      
      setCarregando(false)
    }
    
    verificarStatus()
  }, [])
  
  const handleToggleNotificacoes = async () => {
    setProcessando(true)
    
    try {
      if (inscrito) {
        // Cancelar inscricao
        const success = await unsubscribeFromPush()
        if (success) {
          setInscrito(false)
          toast.success('Notificacoes desativadas')
        }
      } else {
        // Pedir permissao se necessario
        if (permissao === 'default') {
          const granted = await requestNotificationPermission()
          setPermissao(granted ? 'granted' : 'denied')
          
          if (!granted) {
            toast.error('Permissao negada', {
              description: 'Habilite as notificacoes nas configuracoes do navegador'
            })
            return
          }
        }
        
        if (permissao === 'denied') {
          toast.error('Notificacoes bloqueadas', {
            description: 'Habilite nas configuracoes do navegador'
          })
          return
        }
        
        // Inscrever
        const subscription = await subscribeToPush(publicadorId, publicadorNome)
        if (subscription) {
          setInscrito(true)
          toast.success('Notificacoes ativadas!', {
            description: 'Voce recebera avisos de novas designacoes'
          })
          
          // Enviar notificacao de teste
          await sendLocalNotification('InfoFlow', {
            body: 'Notificacoes ativadas com sucesso!',
            tag: 'test-notification'
          })
        }
      }
    } catch (error) {
      console.error('[Notificacoes] Erro:', error)
      toast.error('Erro ao configurar notificacoes')
    } finally {
      setProcessando(false)
    }
  }
  
  const handleTestarNotificacao = async () => {
    const success = await sendLocalNotification('Teste InfoFlow', {
      body: 'Esta e uma notificacao de teste. Tudo funcionando!',
      tag: 'test-notification'
    })
    
    if (success) {
      toast.success('Notificacao de teste enviada!')
    } else {
      toast.error('Erro ao enviar notificacao')
    }
  }
  
  if (carregando) {
    return (
      <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (!suportado) {
    return (
      <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-zinc-500">
            <BellOff className="h-5 w-5" />
            <p className="text-sm">Notificacoes nao suportadas neste navegador</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-5 w-5 text-primary" />
          Notificacoes
        </CardTitle>
        <CardDescription>
          Receba avisos sobre suas designacoes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              inscrito ? "bg-green-600/20" : "bg-zinc-700/50"
            )}>
              {inscrito ? (
                <Bell className="h-4 w-4 text-green-400" />
              ) : (
                <BellOff className="h-4 w-4 text-zinc-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {inscrito ? 'Ativadas' : 'Desativadas'}
              </p>
              <p className="text-xs text-zinc-500">
                {permissao === 'denied' ? 'Bloqueadas pelo navegador' : 
                 inscrito ? 'Voce recebera notificacoes' : 'Clique para ativar'}
              </p>
            </div>
          </div>
          
          <Switch
            checked={inscrito}
            onCheckedChange={handleToggleNotificacoes}
            disabled={processando || permissao === 'denied'}
          />
        </div>
        
        {/* Botao de teste */}
        {inscrito && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestarNotificacao}
            className="w-full border-zinc-700"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Enviar notificacao de teste
          </Button>
        )}
        
        {/* Aviso de permissao negada */}
        {permissao === 'denied' && (
          <div className="p-3 rounded-lg bg-amber-600/10 border border-amber-600/20">
            <p className="text-xs text-amber-400">
              As notificacoes foram bloqueadas. Para reativar, acesse as configuracoes do navegador e permita notificacoes para este site.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente simplificado para header/sidebar
export function NotificacaoToggle({ className }: { className?: string }) {
  const [inscrito, setInscrito] = useState(false)
  const [processando, setProcessando] = useState(false)
  
  useEffect(() => {
    async function verificar() {
      if (isPushSupported()) {
        const subscription = await getCurrentSubscription()
        setInscrito(!!subscription)
      }
    }
    verificar()
  }, [])
  
  const handleToggle = async () => {
    if (!isPushSupported()) return
    
    setProcessando(true)
    try {
      if (inscrito) {
        await unsubscribeFromPush()
        setInscrito(false)
      } else {
        const granted = await requestNotificationPermission()
        if (granted) {
          const subscription = await subscribeToPush()
          setInscrito(!!subscription)
        }
      }
    } finally {
      setProcessando(false)
    }
  }
  
  if (!isPushSupported()) return null
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={processando}
      className={cn("relative", className)}
      title={inscrito ? 'Desativar notificacoes' : 'Ativar notificacoes'}
    >
      {processando ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : inscrito ? (
        <Bell className="h-4 w-4 text-green-400" />
      ) : (
        <BellOff className="h-4 w-4 text-zinc-500" />
      )}
    </Button>
  )
}
