import { createClient } from "@/lib/supabase/client"

export type AcaoLog = 'criar' | 'editar' | 'excluir' | 'login' | 'logout' | 'outro'

export interface ActivityLogInput {
  tabela: string
  registro_id?: string
  acao: AcaoLog
  dados_antes?: Record<string, unknown>
  dados_depois?: Record<string, unknown>
  perfil?: string
  usuario_email?: string
  usuario_nome?: string
}

export async function logActivity(input: ActivityLogInput): Promise<void> {
  try {
    const supabase = createClient()
    
    // Tentar obter informações do navegador
    const user_agent = typeof window !== 'undefined' ? navigator.userAgent : undefined
    
    await supabase.from('activity_logs').insert({
      tabela: input.tabela,
      registro_id: input.registro_id,
      acao: input.acao,
      dados_antes: input.dados_antes,
      dados_depois: input.dados_depois,
      perfil: input.perfil,
      usuario_email: input.usuario_email,
      usuario_nome: input.usuario_nome,
      user_agent,
    })
  } catch (error) {
    // Log silenciosamente - não deve interromper operações
    console.error('[ActivityLogger] Erro ao registrar log:', error)
  }
}

export async function getActivityLogs(filters?: {
  tabela?: string
  acao?: AcaoLog
  perfil?: string
  dataInicio?: string
  dataFim?: string
  limite?: number
  offset?: number
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (filters?.tabela) {
    query = query.eq('tabela', filters.tabela)
  }
  
  if (filters?.acao) {
    query = query.eq('acao', filters.acao)
  }
  
  if (filters?.perfil) {
    query = query.eq('perfil', filters.perfil)
  }
  
  if (filters?.dataInicio) {
    query = query.gte('created_at', filters.dataInicio)
  }
  
  if (filters?.dataFim) {
    query = query.lte('created_at', filters.dataFim)
  }
  
  if (filters?.limite) {
    query = query.limit(filters.limite)
  }
  
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limite || 50) - 1)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('[ActivityLogger] Erro ao buscar logs:', error)
    return []
  }
  
  return data
}

export async function getActivityStats() {
  const supabase = createClient()
  
  // Buscar estatísticas dos últimos 30 dias
  const dataInicio = new Date()
  dataInicio.setDate(dataInicio.getDate() - 30)
  
  const { data, error } = await supabase
    .from('activity_logs')
    .select('acao, tabela, created_at')
    .gte('created_at', dataInicio.toISOString())
  
  if (error || !data) {
    return {
      totalAcoes: 0,
      porAcao: {},
      porTabela: {},
      porDia: {}
    }
  }
  
  const porAcao: Record<string, number> = {}
  const porTabela: Record<string, number> = {}
  const porDia: Record<string, number> = {}
  
  data.forEach(log => {
    porAcao[log.acao] = (porAcao[log.acao] || 0) + 1
    porTabela[log.tabela] = (porTabela[log.tabela] || 0) + 1
    
    const dia = log.created_at.split('T')[0]
    porDia[dia] = (porDia[dia] || 0) + 1
  })
  
  return {
    totalAcoes: data.length,
    porAcao,
    porTabela,
    porDia
  }
}
