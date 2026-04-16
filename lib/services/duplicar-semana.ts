import { createClient } from "@/lib/supabase/client"
import { format, addDays, addWeeks, parseISO } from "date-fns"

export interface ResultadoDuplicacao {
  sucesso: boolean
  registrosCriados: number
  erros: string[]
}

export async function duplicarEquipeTecnica(
  dataOrigem: string,
  semanasFuturas: number = 1
): Promise<ResultadoDuplicacao> {
  const supabase = createClient()
  const erros: string[] = []
  let registrosCriados = 0
  
  try {
    // Buscar registro original
    const { data: original, error } = await supabase
      .from('equipe_tecnica')
      .select('*')
      .eq('data', dataOrigem)
      .single()
    
    if (error || !original) {
      return { sucesso: false, registrosCriados: 0, erros: ['Registro original nao encontrado'] }
    }
    
    // Criar copias para as proximas semanas
    for (let i = 1; i <= semanasFuturas; i++) {
      const novaData = format(addWeeks(parseISO(dataOrigem), i), 'yyyy-MM-dd')
      
      // Verificar se ja existe
      const { data: existente } = await supabase
        .from('equipe_tecnica')
        .select('id')
        .eq('data', novaData)
        .single()
      
      if (existente) {
        erros.push(`Ja existe registro para ${novaData}`)
        continue
      }
      
      // Criar copia
      const { error: insertError } = await supabase
        .from('equipe_tecnica')
        .insert({
          data: novaData,
          dia_semana: original.dia_semana,
          indicador1_nome: original.indicador1_nome,
          indicador2_nome: original.indicador2_nome,
          microvolante1_nome: original.microvolante1_nome,
          microvolante2_nome: original.microvolante2_nome,
          microvolante_palco: original.microvolante_palco,
          som_nome: original.som_nome
        })
      
      if (insertError) {
        erros.push(`Erro ao criar para ${novaData}: ${insertError.message}`)
      } else {
        registrosCriados++
      }
    }
    
    return {
      sucesso: registrosCriados > 0,
      registrosCriados,
      erros
    }
  } catch (error) {
    return { sucesso: false, registrosCriados: 0, erros: ['Erro inesperado'] }
  }
}

export async function duplicarLimpezaSemana(
  dataInicio: string,
  semanasFuturas: number = 1
): Promise<ResultadoDuplicacao> {
  const supabase = createClient()
  const erros: string[] = []
  let registrosCriados = 0
  
  try {
    // Buscar registro original
    const { data: original, error } = await supabase
      .from('limpeza_salao')
      .select('*')
      .eq('data_inicio', dataInicio)
      .single()
    
    if (error || !original) {
      return { sucesso: false, registrosCriados: 0, erros: ['Registro original nao encontrado'] }
    }
    
    for (let i = 1; i <= semanasFuturas; i++) {
      const novaDataInicio = format(addWeeks(parseISO(dataInicio), i), 'yyyy-MM-dd')
      const novaDataFim = format(addWeeks(parseISO(original.data_fim), i), 'yyyy-MM-dd')
      
      // Verificar se ja existe
      const { data: existente } = await supabase
        .from('limpeza_salao')
        .select('id')
        .eq('data_inicio', novaDataInicio)
        .single()
      
      if (existente) {
        erros.push(`Ja existe registro para semana de ${novaDataInicio}`)
        continue
      }
      
      const { error: insertError } = await supabase
        .from('limpeza_salao')
        .insert({
          data_inicio: novaDataInicio,
          data_fim: novaDataFim,
          grupo_nome: original.grupo_nome,
          semana: original.semana + i
        })
      
      if (insertError) {
        erros.push(`Erro ao criar para ${novaDataInicio}: ${insertError.message}`)
      } else {
        registrosCriados++
      }
    }
    
    return {
      sucesso: registrosCriados > 0,
      registrosCriados,
      erros
    }
  } catch (error) {
    return { sucesso: false, registrosCriados: 0, erros: ['Erro inesperado'] }
  }
}

export async function duplicarServicoCampo(semanasFuturas: number = 1): Promise<ResultadoDuplicacao> {
  // Para servico de campo, a estrutura e diferente (por dia da semana, nao por data)
  // Entao nao precisa duplicar, apenas manter os registros ativos
  return {
    sucesso: true,
    registrosCriados: 0,
    erros: ['Servico de campo nao requer duplicacao - e configurado por dia da semana']
  }
}

export async function preencherMesEquipeTecnica(mes: string): Promise<ResultadoDuplicacao> {
  const supabase = createClient()
  const erros: string[] = []
  let registrosCriados = 0
  
  try {
    const [ano, mesNum] = mes.split('-').map(Number)
    const ultimoDia = new Date(ano, mesNum, 0).getDate()
    
    // Buscar ultimo registro para usar como modelo
    const { data: ultimoRegistro } = await supabase
      .from('equipe_tecnica')
      .select('*')
      .order('data', { ascending: false })
      .limit(1)
      .single()
    
    for (let dia = 1; dia <= ultimoDia; dia++) {
      const data = new Date(ano, mesNum - 1, dia)
      const diaSemana = data.getDay()
      
      // Apenas quinta (4) e domingo (0)
      if (diaSemana !== 4 && diaSemana !== 0) continue
      
      const dataStr = format(data, 'yyyy-MM-dd')
      const nomeDia = diaSemana === 4 ? 'quinta' : 'domingo'
      
      // Verificar se ja existe
      const { data: existente } = await supabase
        .from('equipe_tecnica')
        .select('id')
        .eq('data', dataStr)
        .single()
      
      if (existente) continue
      
      // Criar registro vazio ou copiar do ultimo
      const { error: insertError } = await supabase
        .from('equipe_tecnica')
        .insert({
          data: dataStr,
          dia_semana: nomeDia,
          indicador1_nome: null,
          indicador2_nome: null,
          microvolante1_nome: null,
          microvolante2_nome: null,
          microvolante_palco: null,
          som_nome: null
        })
      
      if (insertError) {
        erros.push(`Erro ao criar para ${dataStr}`)
      } else {
        registrosCriados++
      }
    }
    
    return {
      sucesso: registrosCriados > 0 || erros.length === 0,
      registrosCriados,
      erros
    }
  } catch (error) {
    return { sucesso: false, registrosCriados: 0, erros: ['Erro inesperado'] }
  }
}
