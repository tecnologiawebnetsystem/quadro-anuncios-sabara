"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Tipos
export interface Mes {
  id: string
  mes: number
  ano: number
  cor_tema: string
}

export interface Estudo {
  id: string
  mes_id: string
  numero_estudo: number
  data_inicio: string
  data_fim: string
  cantico_inicial: number
  cantico_inicial_nome: string | null
  cantico_final: number
  cantico_final_nome: string | null
  titulo: string
  texto_tema: string | null
  objetivo: string | null
  imagem_capa: string | null
}

export interface Paragrafo {
  id: string
  estudo_id: string
  numero: string
  texto_base: string | null
  pergunta: string
  resposta: string | null
  imagem: string | null
  imagem_legenda: string | null
  imagem_descricao: string | null
  ordem: number
}

export interface Recapitulacao {
  id: string
  estudo_id: string
  pergunta: string
  resposta: string | null
  ordem: number
}

// Buscar meses disponíveis
export async function buscarMeses(): Promise<Mes[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_meses")
    .select("*")
    .order("ano", { ascending: false })
    .order("mes", { ascending: false })
  
  if (error) {
    console.error("Erro ao buscar meses:", error)
    return []
  }
  return data || []
}

// Buscar estudos de um mês
export async function buscarEstudosPorMes(mesId: string): Promise<Estudo[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_estudos")
    .select("*")
    .eq("mes_id", mesId)
    .order("numero_estudo", { ascending: true })
  
  if (error) {
    console.error("Erro ao buscar estudos:", error)
    return []
  }
  return data || []
}

// Buscar estudo por ID
export async function buscarEstudoPorId(estudoId: string): Promise<Estudo | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_estudos")
    .select("*")
    .eq("id", estudoId)
    .single()
  
  if (error) {
    console.error("Erro ao buscar estudo:", error)
    return null
  }
  return data
}

// Buscar parágrafos de um estudo
export async function buscarParagrafos(estudoId: string): Promise<Paragrafo[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_paragrafos")
    .select("*")
    .eq("estudo_id", estudoId)
    .order("ordem", { ascending: true })
  
  if (error) {
    console.error("Erro ao buscar parágrafos:", error)
    return []
  }
  return data || []
}

// Buscar perguntas de recapitulação
export async function buscarRecapitulacao(estudoId: string): Promise<Recapitulacao[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_recapitulacao")
    .select("*")
    .eq("estudo_id", estudoId)
    .order("ordem", { ascending: true })
  
  if (error) {
    console.error("Erro ao buscar recapitulação:", error)
    return []
  }
  return data || []
}

// Salvar progresso de leitura
export async function salvarProgresso(estudoId: string, usuarioId: string, paragrafoId: string) {
  const supabase = await createClient()
  
  // Verificar se já existe progresso
  const { data: existente } = await supabase
    .from("sentinela_progresso")
    .select("*")
    .eq("estudo_id", estudoId)
    .eq("usuario_id", usuarioId)
    .single()
  
  if (existente) {
    // Atualizar progresso existente
    const paragrafosLidos = existente.paragrafos_lidos || []
    if (!paragrafosLidos.includes(paragrafoId)) {
      paragrafosLidos.push(paragrafoId)
    }
    
    await supabase
      .from("sentinela_progresso")
      .update({ 
        paragrafos_lidos: paragrafosLidos,
        ultima_leitura: new Date().toISOString()
      })
      .eq("id", existente.id)
  } else {
    // Criar novo progresso
    await supabase
      .from("sentinela_progresso")
      .insert({
        estudo_id: estudoId,
        usuario_id: usuarioId,
        paragrafos_lidos: [paragrafoId]
      })
  }
}

// Buscar progresso
export async function buscarProgresso(estudoId: string, usuarioId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_progresso")
    .select("*")
    .eq("estudo_id", estudoId)
    .eq("usuario_id", usuarioId)
    .single()
  
  if (error) return null
  return data
}

// Marcar como concluído
export async function marcarConcluido(estudoId: string, usuarioId: string, concluido: boolean) {
  const supabase = await createClient()
  
  const { data: existente } = await supabase
    .from("sentinela_progresso")
    .select("*")
    .eq("estudo_id", estudoId)
    .eq("usuario_id", usuarioId)
    .single()
  
  if (existente) {
    await supabase
      .from("sentinela_progresso")
      .update({ concluido })
      .eq("id", existente.id)
  } else {
    await supabase
      .from("sentinela_progresso")
      .insert({
        estudo_id: estudoId,
        usuario_id: usuarioId,
        concluido
      })
  }
}

// Adicionar favorito
export async function adicionarFavorito(estudoId: string, usuarioId: string, paragrafoId?: string) {
  const supabase = await createClient()
  await supabase
    .from("sentinela_favoritos")
    .insert({
      estudo_id: estudoId,
      usuario_id: usuarioId,
      paragrafo_id: paragrafoId || null
    })
}

// Remover favorito
export async function removerFavorito(estudoId: string, usuarioId: string, paragrafoId?: string) {
  const supabase = await createClient()
  let query = supabase
    .from("sentinela_favoritos")
    .delete()
    .eq("estudo_id", estudoId)
    .eq("usuario_id", usuarioId)
  
  if (paragrafoId) {
    query = query.eq("paragrafo_id", paragrafoId)
  } else {
    query = query.is("paragrafo_id", null)
  }
  
  await query
}

// Buscar favoritos
export async function buscarFavoritos(usuarioId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_favoritos")
    .select("*, sentinela_estudos(*)")
    .eq("usuario_id", usuarioId)
    .order("criado_em", { ascending: false })
  
  if (error) return []
  return data || []
}

// Registrar histórico
export async function registrarHistorico(estudoId: string, usuarioId: string) {
  const supabase = await createClient()
  await supabase
    .from("sentinela_historico")
    .insert({
      estudo_id: estudoId,
      usuario_id: usuarioId
    })
}

// Buscar histórico
export async function buscarHistorico(usuarioId: string, limite: number = 10) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_historico")
    .select("*, sentinela_estudos(*)")
    .eq("usuario_id", usuarioId)
    .order("acessado_em", { ascending: false })
    .limit(limite)
  
  if (error) return []
  return data || []
}

// Inserir mês
export async function inserirMes(mes: number, ano: number, corTema: string = "#3b82f6") {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_meses")
    .insert({ mes, ano, cor_tema: corTema })
    .select()
    .single()
  
  if (error) {
    console.error("Erro ao inserir mês:", error)
    return null
  }
  revalidatePath("/admin/sentinela")
  return data
}

// Inserir estudo
export async function inserirEstudo(estudo: Omit<Estudo, "id">) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_estudos")
    .insert(estudo)
    .select()
    .single()
  
  if (error) {
    console.error("Erro ao inserir estudo:", error)
    return null
  }
  return data
}

// Inserir parágrafo
export async function inserirParagrafo(paragrafo: Omit<Paragrafo, "id">) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_paragrafos")
    .insert(paragrafo)
    .select()
    .single()
  
  if (error) {
    console.error("Erro ao inserir parágrafo:", error)
    return null
  }
  return data
}

// Inserir recapitulação
export async function inserirRecapitulacao(recapitulacao: Omit<Recapitulacao, "id">) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("sentinela_recapitulacao")
    .insert(recapitulacao)
    .select()
    .single()
  
  if (error) {
    console.error("Erro ao inserir recapitulação:", error)
    return null
  }
  return data
}

// Verificar se estudo é favorito
export async function verificarFavorito(estudoId: string, usuarioId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("sentinela_favoritos")
    .select("id")
    .eq("estudo_id", estudoId)
    .eq("usuario_id", usuarioId)
    .is("paragrafo_id", null)
    .single()
  
  return !!data
}
