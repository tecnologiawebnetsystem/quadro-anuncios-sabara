import { createClient } from "@/lib/supabase/client"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export interface DesignacaoEncontrada {
  id: string
  tipo: 'equipe_tecnica' | 'vida_ministerio' | 'limpeza' | 'campo' | 'discurso' | 'reuniao_publica'
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

  // ─── Equipe Técnica ──────────────────────────────────────────────────────────
  const { data: equipeTecnica } = await supabase
    .from('equipe_tecnica')
    .select('*')
    .gte('data', hoje)
    .order('data', { ascending: true })

  if (equipeTecnica) {
    equipeTecnica.forEach(e => {
      const verificar = (campo: string | null, funcaoNome: string) => {
        if (campo && campo.toLowerCase().includes(nomeNormalizado)) {
          designacoes.push({
            id: `equipe-${e.id}-${funcaoNome}`,
            tipo: 'equipe_tecnica',
            data: e.data,
            dataFormatada: format(parseISO(e.data), "EEEE, d 'de' MMMM", { locale: ptBR }),
            funcao: funcaoNome,
            detalhes: e.dia_semana === 'quinta'
              ? 'Reunião de Meio de Semana'
              : 'Reunião de Fim de Semana',
          })
        }
      }

      verificar(e.indicador1_nome,    'Indicador 1')
      verificar(e.indicador2_nome,    'Indicador 2')
      verificar(e.microvolante1_nome, 'Micro/Volante 1')
      verificar(e.microvolante2_nome, 'Micro/Volante 2')
      verificar(e.som_nome,           'Sonoplastia')
    })
  }

  // ─── Vida e Ministério (tabela correta: vida_ministerio_partes) ───────────────
  const { data: partes } = await supabase
    .from('vida_ministerio_partes')
    .select('*, vida_ministerio_semanas!inner(data_inicio, data_fim)')
    .gte('vida_ministerio_semanas.data_fim', hoje)
    .order('vida_ministerio_semanas(data_inicio)', { ascending: true })

  if (partes) {
    partes.forEach((p: {
      id: string
      titulo?: string | null
      secao?: string | null
      participante_nome?: string | null
      ajudante_nome?: string | null
      leitor_nome?: string | null
      oracao_final_nome?: string | null
      vida_ministerio_semanas: { data_inicio: string }
    }) => {
      const dataInicio = p.vida_ministerio_semanas.data_inicio
      const dataFmt = format(parseISO(dataInicio), "EEEE, d 'de' MMMM", { locale: ptBR })
      const detalhe = p.titulo || p.secao || undefined

      const verificar = (campo: string | null | undefined, funcaoNome: string) => {
        if (campo && campo.toLowerCase().includes(nomeNormalizado)) {
          designacoes.push({
            id: `vm-${p.id}-${funcaoNome}`,
            tipo: 'vida_ministerio',
            data: dataInicio,
            dataFormatada: dataFmt,
            funcao: funcaoNome,
            detalhes: detalhe,
          })
        }
      }

      verificar(p.participante_nome,  'Participante')
      verificar(p.ajudante_nome,      'Ajudante')
      verificar(p.leitor_nome,        'Leitor')
      verificar(p.oracao_final_nome,  'Oração Final')
    })
  }

  // ─── Limpeza do Salão ────────────────────────────────────────────────────────
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
          detalhes: `Grupo ${l.grupo_nome}`,
        })
      }
    })
  }

  // ─── Serviço de Campo ────────────────────────────────────────────────────────
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
          detalhes: `${c.periodo === 'manha' ? 'Manhã' : 'Tarde'} — ${c.horario}`,
        })
      }
    })
  }

  // ─── Discursos Públicos ───────────────────────────────────────────────────────
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
          detalhes: d.tema || undefined,
        })
      }
    })
  }

  // ─── Reunião Pública — Presidente & Leitor de A Sentinela ─────────────────────
  // Os campos dirigente/leitor do estudo de A Sentinela ficam em
  // reuniao_publica_designacoes, NÃO em sentinela_estudos.
  const { data: reunioesPublicas } = await supabase
    .from('reuniao_publica_designacoes')
    .select('*')
    .gte('data', hoje)
    .order('data', { ascending: true })

  if (reunioesPublicas) {
    reunioesPublicas.forEach(r => {
      const dataFmt = format(parseISO(r.data), "EEEE, d 'de' MMMM", { locale: ptBR })

      const verificar = (campo: string | null, funcaoNome: string) => {
        if (campo && campo.toLowerCase().includes(nomeNormalizado)) {
          designacoes.push({
            id: `reuniao-publica-${r.id}-${funcaoNome}`,
            tipo: 'reuniao_publica',
            data: r.data,
            dataFormatada: dataFmt,
            funcao: funcaoNome,
            detalhes: 'Reunião de Fim de Semana',
          })
        }
      }

      verificar(r.presidente_nome,       'Presidente de Conferência')
      verificar(r.leitor_sentinela_nome, 'Leitor — A Sentinela')
    })
  }

  // ─── Ordenar por data ────────────────────────────────────────────────────────
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
