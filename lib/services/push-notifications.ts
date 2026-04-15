import { createClient } from "@/lib/supabase/client"

export interface PushSubscriptionData {
  endpoint: string
  p256dh: string
  auth: string
  publicador_id?: string
  publicador_nome?: string
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) return 'denied'
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isPushSupported()) return false
  
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export async function subscribeToPush(publicadorId?: string, publicadorNome?: string): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null
  
  try {
    const registration = await navigator.serviceWorker.ready
    
    // VAPID public key - em producao, usar variavel de ambiente
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
      'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    })
    
    // Salvar no banco de dados
    const supabase = createClient()
    const subscriptionJson = subscription.toJSON()
    
    await supabase.from('push_subscriptions').upsert({
      endpoint: subscription.endpoint,
      p256dh: subscriptionJson.keys?.p256dh || '',
      auth: subscriptionJson.keys?.auth || '',
      publicador_id: publicadorId || null,
      publicador_nome: publicadorNome || null,
      device_info: navigator.userAgent,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'endpoint'
    })
    
    return subscription
  } catch (error) {
    console.error('[Push] Erro ao inscrever:', error)
    return null
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) return false
  
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    
    if (subscription) {
      await subscription.unsubscribe()
      
      // Remover do banco de dados
      const supabase = createClient()
      await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint)
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('[Push] Erro ao cancelar inscricao:', error)
    return false
  }
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null
  
  try {
    const registration = await navigator.serviceWorker.ready
    return await registration.pushManager.getSubscription()
  } catch (error) {
    console.error('[Push] Erro ao obter inscricao:', error)
    return null
  }
}

export async function sendLocalNotification(title: string, options?: NotificationOptions): Promise<boolean> {
  if (!isPushSupported()) return false
  
  const permission = await getNotificationPermission()
  if (permission !== 'granted') return false
  
  try {
    const registration = await navigator.serviceWorker.ready
    await registration.showNotification(title, {
      icon: '/icons/icon-192x192.jpg',
      badge: '/icons/icon-192x192.jpg',
      vibrate: [200, 100, 200],
      ...options
    })
    return true
  } catch (error) {
    console.error('[Push] Erro ao enviar notificacao:', error)
    return false
  }
}

// Funcao para enviar notificacao quando houver mudanca de designacao
export async function notifyDesignacaoChange(
  tipo: 'nova' | 'alterada' | 'removida',
  designacao: {
    publicador_nome: string
    funcao: string
    data: string
  }
): Promise<void> {
  const titles = {
    nova: 'Nova Designacao',
    alterada: 'Designacao Alterada',
    removida: 'Designacao Removida'
  }
  
  const bodies = {
    nova: `${designacao.publicador_nome} foi designado(a) como ${designacao.funcao} em ${designacao.data}`,
    alterada: `A designacao de ${designacao.publicador_nome} como ${designacao.funcao} foi alterada`,
    removida: `A designacao de ${designacao.publicador_nome} como ${designacao.funcao} em ${designacao.data} foi removida`
  }
  
  await sendLocalNotification(titles[tipo], {
    body: bodies[tipo],
    tag: `designacao-${tipo}-${Date.now()}`,
    data: { url: '/consulta' }
  })
}
