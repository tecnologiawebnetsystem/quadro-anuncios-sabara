import { createClient } from "@/lib/supabase/client"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export interface DesignacaoEncontrada {
  id: string
  tipo: 'equipe_tecnica' | 'vida_ministerio' | 'limpeza' | 'campo' | 'discurso' | 'sentinela'
  data: string
  dataFormatada: string
  funcao: string
  detalhes?: string
}

export async function buscarDesignacoesPorNome(nome: string): Promise<DesignacaoEncontrada[]> {
  if (!nome || nome.trim().length < 2) return []
  
  const supabase = createClient()
  const nomeNormalizado = nome.trim().toLowerCase()
  const hoje = format(new Date(), 'yyyy-MM-dd')
  const designacoes: DesignacaoEncontrada[] = []
  
  // Buscar em Equipe Técnica
  const { data: equipeTecnica } = await supabase
    .from('equipe_tecnica')
    .select('*')
    .gte('data', hoje)
    .order('data', { ascending: true })
  
  if (equipeTecnica) {
    equipeTecnica.forEach(e => {
      const verificarFuncao = (campo: string | null, funcaoNome: string) => {
        if (campo && campo.toLowerCase().includes(nomeNormalizado)) {
          designacoes.push({
            id: `equipe-${e.id}-${funcaoNome}`,
            tipo: 'equipe_tecnica',
            data: e.data,
            dataFormatada: format(parseISO(e.data), "EEEE, d 'de' MMMM", { locale: ptBR }),
            funcao: funcaoNome,
            detalhes: e.dia_semana === 'quinta' ? 'Reunião de Meio de Semana' : 'Reunião de Fim de Semana'
          })
        }
      }
      
      verificarFuncao(e.indicador1_nome, 'Indicador 1')
      verificarFuncao(e.indicador2_nome, 'Indicador 2')
      verificarFuncao(e.microvolante1_nome, 'Micro/Volante 1')
      verificarFuncao(e.microvolante2_nome, 'Micro/Volante 2')
      verificarFuncao(e.som_nome, 'Sonoplastia')
    })
  }
  
  // Buscar em Vida e Ministério
  const { data: vidaMinisterio } = await supabase
    .from('vida_ministerio_designacoes')
    .select('*, vida_ministerio_semanas!inner(data_inicio, data_fim)')
    .gte('vida_ministerio_semanas.data_fim', hoje)
    .order('vida_ministerio_semanas(data_inicio)', { ascending: true })
  
  if (vidaMinisterio) {
    vidaMinisterio.forEach((vm: { id: string; nome_participante?: string; nome_ajudante?: string; parte?: string; vida_ministerio_semanas: { data_inicio: string } }) => {
      const verificarParticipante = (campo: string | null | undefined, funcaoNome: string) => {
        if (campo && campo.toLowerCase().includes(nomeNormalizado)) {
          designacoes.push({
            id: `vm-${vm.id}-${funcaoNome}`,
            tipo: 'vida_ministerio',
            data: vm.vida_ministerio_semanas.data_inicio,
            dataFormatada: format(parseISO(vm.vida_ministerio_semanas.data_inicio), "EEEE, d 'de' MMMM", { locale: ptBR }),
            funcao: funcaoNome,
            detalhes: vm.parte || undefined
          })
        }
      }
      
      verificarParticipante(vm.nome_participante, 'Participante')
      verificarParticipante(vm.nome_ajudante, 'Ajudante')
    })
  }
  
  // Buscar em Limpeza do Salão
  const { data: limpeza } = await supabase
    .from('limpeza_salao')
    .select('*')
    .gte('data_fim', hoje)
    .order('data_inicio', { ascending: true })
  
  if (limpeza) {
    limpeza.forEach(l => {
      if (l.grupo_nome && l.grupo_nome.toLowerCase().includes(nomeNormalizado)) {
        designacoes.push({
          id: `limpeza-${l.id}`,
          tipo: 'limpeza',
          data: l.data_inicio,
          dataFormatada: format(parseISO(l.data_inicio), "EEEE, d 'de' MMMM", { locale: ptBR }),
          funcao: 'Limpeza do Salão',
          detalhes: `Grupo ${l.grupo_nome}`
        })
      }
    })
  }
  
  // Buscar em Serviço de Campo
  const { data: campo } = await supabase
    .from('servico_campo_semana')
    .select('*')
    .eq('ativo', true)
  
  if (campo) {
    campo.forEach(c => {
      if (c.dirigente_nome && c.dirigente_nome.toLowerCase().includes(nomeNormalizado)) {
        designacoes.push({
          id: `campo-${c.id}`,
          tipo: 'campo',
          data: hoje,
          dataFormatada: `Todo(a) ${c.dia_semana}`,
          funcao: 'Dirigente de Campo',
          detalhes: `${c.periodo === 'manha' ? 'Manhã' : 'Tarde'} - ${c.horario}`
        })
      }
    })
  }
  
  // Buscar em Discursos Públicos
  const { data: discursos } = await supabase
    .from('discursos_publicos')
    .select('*')
    .gte('data', hoje)
    .order('data', { ascending: true })
  
  if (discursos) {
    discursos.forEach(d => {
      if (d.orador_nome && d.orador_nome.toLowerCase().includes(nomeNormalizado)) {
        designacoes.push({
          id: `discurso-${d.id}`,
          tipo: 'discurso',
          data: d.data,
          dataFormatada: format(parseISO(d.data), "EEEE, d 'de' MMMM", { locale: ptBR }),
          funcao: 'Orador',
          detalhes: d.tema || undefined
        })
      }
    })
  }
  
  // Buscar em Sentinela
  const { data: sentinela } = await supabase
    .from('sentinela_estudos')
    .select('*')
    .gte('data_fim', hoje)
    .order('data_inicio', { ascending: true })
  
  if (sentinela) {
    sentinela.forEach(s => {
      const verificarSentinela = (campo: string | null, funcaoNome: string) => {
        if (campo && campo.toLowerCase().includes(nomeNormalizado)) {
          designacoes.push({
            id: `sentinela-${s.id}-${funcaoNome}`,
            tipo: 'sentinela',
            data: s.data_inicio,
            dataFormatada: format(parseISO(s.data_inicio), "EEEE, d 'de' MMMM", { locale: ptBR }),
            funcao: funcaoNome,
            detalhes: s.titulo || undefined
          })
        }
      }
      
      verificarSentinela(s.dirigente_nome, 'Dirigente Sentinela')
      verificarSentinela(s.leitor_nome, 'Leitor Sentinela')
    })
  }
  
  // Ordenar por data
  designacoes.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
  
  return designacoes
}

export async function getPublicadoresParaBusca(): Promise<string[]> {
  const supabase = createClient()
  
  const { data } = await supabase
    .from('publicadores')
    .select('nome')
    .eq('ativo', true)
    .order('nome')
  
  return data?.map(p => p.nome) || []
}
