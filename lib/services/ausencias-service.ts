import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"

export interface Ausencia {
  id: string
  publicador_id: string
  publicador_nome?: string
  data_inicio: string
  data_fim: string
  motivo?: string
  criado_por?: string
  created_at: string
}

export async function listarAusencias(filtros?: {
  publicadorId?: string
  dataInicio?: string
  dataFim?: string
  ativas?: boolean
}): Promise<Ausencia[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('ausencias')
    .select(`
      *,
      publicadores!inner(nome)
    `)
    .order('data_inicio', { ascending: false })
  
  if (filtros?.publicadorId) {
    query = query.eq('publicador_id', filtros.publicadorId)
  }
  
  if (filtros?.dataInicio) {
    query = query.gte('data_fim', filtros.dataInicio)
  }
  
  if (filtros?.dataFim) {
    query = query.lte('data_inicio', filtros.dataFim)
  }
  
  if (filtros?.ativas) {
    const hoje = format(new Date(), 'yyyy-MM-dd')
    query = query.gte('data_fim', hoje)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('[Ausencias] Erro ao listar:', error)
    return []
  }
  
  return data.map((a: { id: string; publicador_id: string; data_inicio: string; data_fim: string; motivo?: string; criado_por?: string; created_at: string; publicadores: { nome: string } }) => ({
    id: a.id,
    publicador_id: a.publicador_id,
    publicador_nome: a.publicadores?.nome,
    data_inicio: a.data_inicio,
    data_fim: a.data_fim,
    motivo: a.motivo,
    criado_por: a.criado_por,
    created_at: a.created_at
  }))
}

export async function criarAusencia(dados: {
  publicador_id: string
  data_inicio: string
  data_fim: string
  motivo?: string
  criado_por?: string
}): Promise<{ sucesso: boolean; ausencia?: Ausencia; erro?: string }> {
  const supabase = createClient()
  
  // Validar datas
  if (new Date(dados.data_fim) < new Date(dados.data_inicio)) {
    return { sucesso: false, erro: 'Data final deve ser igual ou posterior a data inicial' }
  }
  
  const { data, error } = await supabase
    .from('ausencias')
    .insert({
      publicador_id: dados.publicador_id,
      data_inicio: dados.data_inicio,
      data_fim: dados.data_fim,
      motivo: dados.motivo,
      criado_por: dados.criado_por
    })
    .select()
    .single()
  
  if (error) {
    console.error('[Ausencias] Erro ao criar:', error)
    return { sucesso: false, erro: 'Erro ao registrar ausencia' }
  }
  
  return { sucesso: true, ausencia: data }
}

export async function excluirAusencia(id: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('ausencias')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('[Ausencias] Erro ao excluir:', error)
    return false
  }
  
  return true
}

export async function verificarAusencia(publicadorId: string, data: string): Promise<Ausencia | null> {
  const supabase = createClient()
  
  const { data: ausencias } = await supabase
    .from('ausencias')
    .select('*')
    .eq('publicador_id', publicadorId)
    .lte('data_inicio', data)
    .gte('data_fim', data)
    .limit(1)
  
  return ausencias?.[0] || null
}

export async function getPublicadoresAusentes(data: string): Promise<{ id: string; nome: string; motivo?: string }[]> {
  const supabase = createClient()
  
  const { data: ausencias, error } = await supabase
    .from('ausencias')
    .select(`
      publicador_id,
      motivo,
      publicadores!inner(id, nome)
    `)
    .lte('data_inicio', data)
    .gte('data_fim', data)
  
  if (error || !ausencias) return []
  
  return ausencias.map((a: { publicador_id: string; motivo?: string; publicadores: { id: string; nome: string } }) => ({
    id: a.publicadores.id,
    nome: a.publicadores.nome,
    motivo: a.motivo
  }))
}
