import { createClient } from "@/lib/supabase/client"
import { format, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

export interface HistoricoDesignacao {
  publicador_id: string
  publicador_nome: string
  total_designacoes: number
  designacoes_por_tipo: Record<string, number>
  ultima_designacao?: string
  meses_analisados: number
}

export interface DesignacaoDetalhada {
  tipo: string
  funcao: string
  data: string
  detalhes?: string
}

export async function getHistoricoPublicador(
  publicadorId: string,
  mesesAnalisados: number = 6
): Promise<DesignacaoDetalhada[]> {
  const supabase = createClient()
  const dataInicio = format(subMonths(new Date(), mesesAnalisados), 'yyyy-MM-dd')
  const designacoes: DesignacaoDetalhada[] = []
  
  // Buscar nome do publicador
  const { data: publicador } = await supabase
    .from('publicadores')
    .select('nome')
    .eq('id', publicadorId)
    .single()
  
  if (!publicador) return []
  const nome = publicador.nome.toLowerCase()
  
  // Buscar em Equipe Técnica
  const { data: equipeTecnica } = await supabase
    .from('equipe_tecnica')
    .select('*')
    .gte('data', dataInicio)
    .order('data', { ascending: false })
  
  if (equipeTecnica) {
    equipeTecnica.forEach(e => {
      if (e.indicador1_nome?.toLowerCase().includes(nome)) {
        designacoes.push({
          tipo: 'Equipe Técnica',
          funcao: 'Indicador 1',
          data: e.data,
          detalhes: e.dia_semana === 'quinta' ? 'Meio de Semana' : 'Fim de Semana'
        })
      }
      if (e.indicador2_nome?.toLowerCase().includes(nome)) {
        designacoes.push({
          tipo: 'Equipe Técnica',
          funcao: 'Indicador 2',
          data: e.data,
          detalhes: e.dia_semana === 'quinta' ? 'Meio de Semana' : 'Fim de Semana'
        })
      }
      if (e.microvolante1_nome?.toLowerCase().includes(nome)) {
        designacoes.push({
          tipo: 'Equipe Técnica',
          funcao: 'Micro/Volante 1',
          data: e.data,
          detalhes: e.microvolante_palco === 1 ? 'Palco' : undefined
        })
      }
      if (e.microvolante2_nome?.toLowerCase().includes(nome)) {
        designacoes.push({
          tipo: 'Equipe Técnica',
          funcao: 'Micro/Volante 2',
          data: e.data,
          detalhes: e.microvolante_palco === 2 ? 'Palco' : undefined
        })
      }
      if (e.som_nome?.toLowerCase().includes(nome)) {
        designacoes.push({
          tipo: 'Equipe Técnica',
          funcao: 'Sonoplastia',
          data: e.data
        })
      }
    })
  }
  
  // Buscar em Vida e Ministério
  const { data: vidaMinisterio } = await supabase
    .from('vida_ministerio_designacoes')
    .select('*, vida_ministerio_semanas!inner(data_inicio)')
    .gte('vida_ministerio_semanas.data_inicio', dataInicio)
    .order('vida_ministerio_semanas(data_inicio)', { ascending: false })
  
  if (vidaMinisterio) {
    vidaMinisterio.forEach((vm: { nome_participante?: string; nome_ajudante?: string; parte?: string; vida_ministerio_semanas: { data_inicio: string } }) => {
      if (vm.nome_participante?.toLowerCase().includes(nome)) {
        designacoes.push({
          tipo: 'Vida e Ministério',
          funcao: 'Participante',
          data: vm.vida_ministerio_semanas.data_inicio,
          detalhes: vm.parte
        })
      }
      if (vm.nome_ajudante?.toLowerCase().includes(nome)) {
        designacoes.push({
          tipo: 'Vida e Ministério',
          funcao: 'Ajudante',
          data: vm.vida_ministerio_semanas.data_inicio,
          detalhes: vm.parte
        })
      }
    })
  }
  
  // Buscar em Sentinela
  const { data: sentinela } = await supabase
    .from('sentinela_estudos')
    .select('*')
    .gte('data_inicio', dataInicio)
    .order('data_inicio', { ascending: false })
  
  if (sentinela) {
    sentinela.forEach(s => {
      if (s.dirigente_nome?.toLowerCase().includes(nome)) {
        designacoes.push({
          tipo: 'Sentinela',
          funcao: 'Dirigente',
          data: s.data_inicio,
          detalhes: s.titulo
        })
      }
      if (s.leitor_nome?.toLowerCase().includes(nome)) {
        designacoes.push({
          tipo: 'Sentinela',
          funcao: 'Leitor',
          data: s.data_inicio,
          detalhes: s.titulo
        })
      }
    })
  }
  
  // Ordenar por data
  designacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  
  return designacoes
}

export async function getRelatorioEquilibrio(mesesAnalisados: number = 6): Promise<HistoricoDesignacao[]> {
  const supabase = createClient()
  const dataInicio = format(subMonths(new Date(), mesesAnalisados), 'yyyy-MM-dd')
  
  // Buscar todos os publicadores ativos
  const { data: publicadores } = await supabase
    .from('publicadores')
    .select('id, nome')
    .eq('ativo', true)
    .order('nome')
  
  if (!publicadores) return []
  
  const relatorio: HistoricoDesignacao[] = []
  
  for (const pub of publicadores) {
    const designacoes = await getHistoricoPublicador(pub.id, mesesAnalisados)
    
    const designacoesPorTipo: Record<string, number> = {}
    designacoes.forEach(d => {
      const key = `${d.tipo} - ${d.funcao}`
      designacoesPorTipo[key] = (designacoesPorTipo[key] || 0) + 1
    })
    
    relatorio.push({
      publicador_id: pub.id,
      publicador_nome: pub.nome,
      total_designacoes: designacoes.length,
      designacoes_por_tipo: designacoesPorTipo,
      ultima_designacao: designacoes[0]?.data,
      meses_analisados: mesesAnalisados
    })
  }
  
  // Ordenar por total de designações (menos para mais)
  relatorio.sort((a, b) => a.total_designacoes - b.total_designacoes)
  
  return relatorio
}

export async function getSugestaoProximaDesignacao(
  tipo: 'equipe_tecnica' | 'vida_ministerio' | 'sentinela',
  funcao: string,
  excluirIds?: string[]
): Promise<{ id: string; nome: string; ultima_designacao?: string; total: number }[]> {
  const supabase = createClient()
  
  // Buscar publicadores elegíveis
  const { data: publicadores } = await supabase
    .from('publicadores')
    .select('id, nome')
    .eq('ativo', true)
    .order('nome')
  
  if (!publicadores) return []
  
  const sugestoes: { id: string; nome: string; ultima_designacao?: string; total: number }[] = []
  
  for (const pub of publicadores) {
    if (excluirIds?.includes(pub.id)) continue
    
    const historico = await getHistoricoPublicador(pub.id, 3)
    const designacoesDoTipo = historico.filter(h => 
      h.tipo.toLowerCase().includes(tipo.replace('_', ' ')) && 
      h.funcao.toLowerCase().includes(funcao.toLowerCase())
    )
    
    sugestoes.push({
      id: pub.id,
      nome: pub.nome,
      ultima_designacao: designacoesDoTipo[0]?.data,
      total: designacoesDoTipo.length
    })
  }
  
  // Ordenar por menos designações recentes
  sugestoes.sort((a, b) => {
    // Primeiro por total (menos é melhor)
    if (a.total !== b.total) return a.total - b.total
    
    // Depois por última designação (mais antiga é melhor)
    if (!a.ultima_designacao) return -1
    if (!b.ultima_designacao) return 1
    return new Date(a.ultima_designacao).getTime() - new Date(b.ultima_designacao).getTime()
  })
  
  return sugestoes.slice(0, 10)
}

export function formatarDataDesignacao(data: string): string {
  try {
    return format(new Date(data), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return data
  }
}
