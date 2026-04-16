import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"

export interface Conflito {
  id: string
  publicador_nome: string
  data: string
  funcoes: {
    tipo: string
    funcao: string
    detalhes?: string
  }[]
}

export async function verificarConflitosNaData(data: string): Promise<Conflito[]> {
  const supabase = createClient()
  const conflitos: Conflito[] = []
  const designacoesPorPessoa: Record<string, Conflito['funcoes']> = {}
  
  // Buscar Equipe Técnica
  const { data: equipeTecnica } = await supabase
    .from('equipe_tecnica')
    .select('*')
    .eq('data', data)
  
  if (equipeTecnica) {
    equipeTecnica.forEach(e => {
      const adicionarDesignacao = (nome: string | null, funcao: string) => {
        if (!nome) return
        if (!designacoesPorPessoa[nome]) designacoesPorPessoa[nome] = []
        designacoesPorPessoa[nome].push({
          tipo: 'Equipe Técnica',
          funcao,
          detalhes: e.dia_semana === 'quinta' ? 'Meio de Semana' : 'Fim de Semana'
        })
      }
      
      adicionarDesignacao(e.indicador1_nome, 'Indicador 1')
      adicionarDesignacao(e.indicador2_nome, 'Indicador 2')
      adicionarDesignacao(e.microvolante1_nome, 'Micro/Volante 1')
      adicionarDesignacao(e.microvolante2_nome, 'Micro/Volante 2')
      adicionarDesignacao(e.som_nome, 'Sonoplastia')
    })
  }
  
  // Buscar Vida e Ministério (se for quinta)
  const dataObj = new Date(data)
  if (dataObj.getDay() === 4) { // Quinta-feira
    const { data: vidaMinisterio } = await supabase
      .from('vida_ministerio_designacoes')
      .select('*, vida_ministerio_semanas!inner(data_inicio, data_fim)')
      .lte('vida_ministerio_semanas.data_inicio', data)
      .gte('vida_ministerio_semanas.data_fim', data)
    
    if (vidaMinisterio) {
      vidaMinisterio.forEach((vm: { nome_participante?: string; nome_ajudante?: string; parte?: string }) => {
        const adicionarDesignacao = (nome: string | null | undefined, funcao: string) => {
          if (!nome) return
          if (!designacoesPorPessoa[nome]) designacoesPorPessoa[nome] = []
          designacoesPorPessoa[nome].push({
            tipo: 'Vida e Ministério',
            funcao,
            detalhes: vm.parte || undefined
          })
        }
        
        adicionarDesignacao(vm.nome_participante, 'Participante')
        adicionarDesignacao(vm.nome_ajudante, 'Ajudante')
      })
    }
  }
  
  // Buscar Discursos (se for domingo)
  if (dataObj.getDay() === 0) { // Domingo
    const { data: discursos } = await supabase
      .from('discursos_publicos')
      .select('*')
      .eq('data', data)
    
    if (discursos) {
      discursos.forEach(d => {
        if (d.orador_nome) {
          if (!designacoesPorPessoa[d.orador_nome]) designacoesPorPessoa[d.orador_nome] = []
          designacoesPorPessoa[d.orador_nome].push({
            tipo: 'Discurso Público',
            funcao: 'Orador',
            detalhes: d.tema || undefined
          })
        }
      })
    }
    
    // Buscar Sentinela
    const { data: sentinela } = await supabase
      .from('sentinela_estudos')
      .select('*')
      .lte('data_inicio', data)
      .gte('data_fim', data)
    
    if (sentinela) {
      sentinela.forEach(s => {
        const adicionarDesignacao = (nome: string | null, funcao: string) => {
          if (!nome) return
          if (!designacoesPorPessoa[nome]) designacoesPorPessoa[nome] = []
          designacoesPorPessoa[nome].push({
            tipo: 'Sentinela',
            funcao,
            detalhes: s.titulo || undefined
          })
        }
        
        adicionarDesignacao(s.dirigente_nome, 'Dirigente')
        adicionarDesignacao(s.leitor_nome, 'Leitor')
      })
    }
  }
  
  // Identificar conflitos (mais de uma designação no mesmo dia)
  Object.entries(designacoesPorPessoa).forEach(([nome, funcoes]) => {
    if (funcoes.length > 1) {
      conflitos.push({
        id: `${nome}-${data}`,
        publicador_nome: nome,
        data,
        funcoes
      })
    }
  })
  
  return conflitos
}

export async function verificarConflitosNoMes(mes: string): Promise<Conflito[]> {
  const supabase = createClient()
  const [ano, mesNum] = mes.split('-').map(Number)
  
  // Gerar todas as datas do mês
  const ultimoDia = new Date(ano, mesNum, 0).getDate()
  const datas: string[] = []
  
  for (let dia = 1; dia <= ultimoDia; dia++) {
    datas.push(format(new Date(ano, mesNum - 1, dia), 'yyyy-MM-dd'))
  }
  
  // Verificar conflitos em cada data de reunião (quinta e domingo)
  const conflitos: Conflito[] = []
  
  for (const data of datas) {
    const dataObj = new Date(data)
    const diaSemana = dataObj.getDay()
    
    // Apenas verificar quintas (4) e domingos (0)
    if (diaSemana === 4 || diaSemana === 0) {
      const conflitosData = await verificarConflitosNaData(data)
      conflitos.push(...conflitosData)
    }
  }
  
  return conflitos
}

export async function verificarAusencias(
  publicadorId: string,
  data: string
): Promise<{ ausente: boolean; motivo?: string }> {
  const supabase = createClient()
  
  const { data: ausencias } = await supabase
    .from('ausencias')
    .select('*')
    .eq('publicador_id', publicadorId)
    .lte('data_inicio', data)
    .gte('data_fim', data)
    .limit(1)
  
  if (ausencias && ausencias.length > 0) {
    return {
      ausente: true,
      motivo: ausencias[0].motivo || 'Ausência registrada'
    }
  }
  
  return { ausente: false }
}

export async function verificarConflitoComAusencias(data: string): Promise<{
  conflitos: Conflito[]
  ausentes: { nome: string; motivo?: string; designacoes: string[] }[]
}> {
  const supabase = createClient()
  const conflitos = await verificarConflitosNaData(data)
  
  // Buscar ausências para a data
  const { data: ausencias } = await supabase
    .from('ausencias')
    .select('*, publicadores!inner(nome)')
    .lte('data_inicio', data)
    .gte('data_fim', data)
  
  const ausentes: { nome: string; motivo?: string; designacoes: string[] }[] = []
  
  if (ausencias) {
    for (const ausencia of ausencias) {
      const nomePublicador = (ausencia.publicadores as unknown as { nome: string }).nome
      
      // Verificar se tem designações na data
      const designacoesAusente: string[] = []
      
      // Verificar em equipe técnica
      const { data: equipe } = await supabase
        .from('equipe_tecnica')
        .select('*')
        .eq('data', data)
      
      if (equipe) {
        equipe.forEach(e => {
          if (e.indicador1_nome === nomePublicador) designacoesAusente.push('Indicador 1')
          if (e.indicador2_nome === nomePublicador) designacoesAusente.push('Indicador 2')
          if (e.microvolante1_nome === nomePublicador) designacoesAusente.push('Micro/Volante 1')
          if (e.microvolante2_nome === nomePublicador) designacoesAusente.push('Micro/Volante 2')
          if (e.som_nome === nomePublicador) designacoesAusente.push('Sonoplastia')
        })
      }
      
      if (designacoesAusente.length > 0) {
        ausentes.push({
          nome: nomePublicador,
          motivo: ausencia.motivo,
          designacoes: designacoesAusente
        })
      }
    }
  }
  
  return { conflitos, ausentes }
}
