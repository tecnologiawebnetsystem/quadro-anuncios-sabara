"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Grupo {
  id: string
  numero: number
  nome: string
  local: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface PublicadorGrupo {
  id: string
  nome: string
  grupo_id: string | null
  is_lider: boolean
  is_auxiliar: boolean
  ativo: boolean
  criado_em: string
  atualizado_em: string
  // Campos adicionais
  anciao?: boolean
  servo_ministerial?: boolean
  pioneiro_regular?: boolean
  pioneiro_auxiliar?: boolean
  telefone?: string
  email?: string
  endereco?: string
  data_nascimento?: string
  data_batismo?: string
  observacoes?: string
}

// ========== GRUPOS ==========

export async function getGrupos() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("grupos")
    .select("*")
    .order("numero", { ascending: true })
  
  if (error) {
    console.error("Erro ao buscar grupos:", error)
    return []
  }
  
  return data as Grupo[]
}

export async function getGrupoById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("grupos")
    .select("*")
    .eq("id", id)
    .single()
  
  if (error) {
    console.error("Erro ao buscar grupo:", error)
    return null
  }
  
  return data as Grupo
}

export async function createGrupo(dados: { numero: number; nome: string; local?: string }) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("grupos")
    .insert({
      numero: dados.numero,
      nome: dados.nome,
      local: dados.local || null,
    })
    .select()
    .single()
  
  if (error) {
    console.error("Erro ao criar grupo:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath("/admin/grupo-estudos")
  return { success: true, data }
}

export async function updateGrupo(id: string, dados: { numero?: number; nome?: string; local?: string }) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("grupos")
    .update({
      ...dados,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()
  
  if (error) {
    console.error("Erro ao atualizar grupo:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath("/admin/grupo-estudos")
  return { success: true, data }
}

export async function deleteGrupo(id: string) {
  const supabase = await createClient()
  
  // Primeiro, remove os publicadores do grupo
  await supabase
    .from("publicadores")
    .update({ grupo_id: null })
    .eq("grupo_id", id)
  
  const { error } = await supabase
    .from("grupos")
    .delete()
    .eq("id", id)
  
  if (error) {
    console.error("Erro ao excluir grupo:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath("/admin/grupo-estudos")
  return { success: true }
}

// ========== PUBLICADORES ==========

export async function getPublicadores() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("publicadores")
    .select("*")
    .order("nome", { ascending: true })
  
  if (error) {
    console.error("Erro ao buscar publicadores:", error)
    return []
  }
  
  return data as PublicadorGrupo[]
}

export async function getPublicadoresByGrupo(grupoId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("publicadores")
    .select("*")
    .eq("grupo_id", grupoId)
    .order("is_lider", { ascending: false })
    .order("is_auxiliar", { ascending: false })
    .order("nome", { ascending: true })
  
  if (error) {
    console.error("Erro ao buscar publicadores do grupo:", error)
    return []
  }
  
  return data as PublicadorGrupo[]
}

export async function getPublicadoresSemGrupo() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("publicadores")
    .select("*")
    .is("grupo_id", null)
    .order("nome", { ascending: true })
  
  if (error) {
    console.error("Erro ao buscar publicadores sem grupo:", error)
    return []
  }
  
  return data as PublicadorGrupo[]
}

export async function createPublicador(dados: { 
  nome: string
  grupo_id?: string | null
  is_lider?: boolean
  is_auxiliar?: boolean
  anciao?: boolean
  servo_ministerial?: boolean
  pioneiro_regular?: boolean
  pioneiro_auxiliar?: boolean
  telefone?: string
  email?: string
  endereco?: string
  data_nascimento?: string
  data_batismo?: string
  observacoes?: string
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("publicadores")
    .insert({
      nome: dados.nome,
      grupo_id: dados.grupo_id || null,
      is_lider: dados.is_lider || dados.anciao || false,
      is_auxiliar: dados.is_auxiliar || dados.servo_ministerial || false,
      anciao: dados.anciao || dados.is_lider || false,
      servo_ministerial: dados.servo_ministerial || dados.is_auxiliar || false,
      pioneiro_regular: dados.pioneiro_regular || false,
      pioneiro_auxiliar: dados.pioneiro_auxiliar || false,
      telefone: dados.telefone || null,
      email: dados.email || null,
      endereco: dados.endereco || null,
      data_nascimento: dados.data_nascimento || null,
      data_batismo: dados.data_batismo || null,
      observacoes: dados.observacoes || null,
    })
    .select()
    .single()
  
  if (error) {
    console.error("Erro ao criar publicador:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath("/admin/grupo-estudos")
  revalidatePath("/admin/publicadores")
  return { success: true, data }
}

export async function updatePublicador(id: string, dados: { 
  nome?: string
  grupo_id?: string | null
  is_lider?: boolean
  is_auxiliar?: boolean
  ativo?: boolean
  anciao?: boolean
  servo_ministerial?: boolean
  pioneiro_regular?: boolean
  pioneiro_auxiliar?: boolean
  telefone?: string
  email?: string
  endereco?: string
  data_nascimento?: string
  data_batismo?: string
  observacoes?: string
}) {
  const supabase = await createClient()
  
  // Sincronizar campos antigos com novos
  const dadosAtualizados: Record<string, unknown> = {
    ...dados,
    atualizado_em: new Date().toISOString(),
  }
  
  // Se is_lider foi definido, sincronizar com anciao
  if (dados.is_lider !== undefined) {
    dadosAtualizados.anciao = dados.is_lider
    dadosAtualizados.is_lider = dados.is_lider
  }
  // Se anciao foi definido, sincronizar com is_lider
  if (dados.anciao !== undefined) {
    dadosAtualizados.is_lider = dados.anciao
    dadosAtualizados.anciao = dados.anciao
  }
  // Se is_auxiliar foi definido, sincronizar com servo_ministerial
  if (dados.is_auxiliar !== undefined) {
    dadosAtualizados.servo_ministerial = dados.is_auxiliar
    dadosAtualizados.is_auxiliar = dados.is_auxiliar
  }
  // Se servo_ministerial foi definido, sincronizar com is_auxiliar
  if (dados.servo_ministerial !== undefined) {
    dadosAtualizados.is_auxiliar = dados.servo_ministerial
    dadosAtualizados.servo_ministerial = dados.servo_ministerial
  }
  
  const { data, error } = await supabase
    .from("publicadores")
    .update(dadosAtualizados)
    .eq("id", id)
    .select()
    .single()
  
  if (error) {
    console.error("Erro ao atualizar publicador:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath("/admin/grupo-estudos")
  revalidatePath("/admin/publicadores")
  return { success: true, data }
}

export async function movePublicador(publicadorId: string, novoGrupoId: string | null) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("publicadores")
    .update({
      grupo_id: novoGrupoId,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", publicadorId)
    .select()
    .single()
  
  if (error) {
    console.error("Erro ao mover publicador:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath("/admin/grupo-estudos")
  revalidatePath("/admin/publicadores")
  return { success: true, data }
}

export async function deletePublicador(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("publicadores")
    .delete()
    .eq("id", id)
  
  if (error) {
    console.error("Erro ao excluir publicador:", error)
    return { success: false, error: error.message }
  }
  
  revalidatePath("/admin/grupo-estudos")
  revalidatePath("/admin/publicadores")
  return { success: true }
}

// ========== SEED INICIAL ==========

export async function seedGruposEPublicadores() {
  const supabase = await createClient()
  
  // Verificar se já existem grupos
  const { data: gruposExistentes } = await supabase
    .from("grupos")
    .select("id")
    .limit(1)
  
  if (gruposExistentes && gruposExistentes.length > 0) {
    return { success: true, message: "Dados já existem" }
  }
  
  // Criar os 6 grupos
  const grupos = [
    { numero: 1, nome: "Grupo 1", local: "Salão do Reino" },
    { numero: 2, nome: "Grupo 2", local: "Casa Irineu" },
    { numero: 3, nome: "Grupo 3", local: "Casa Guido" },
    { numero: 4, nome: "Grupo 4", local: "Casa Vagner" },
    { numero: 5, nome: "Grupo 5", local: "Casa Reinaldo" },
    { numero: 6, nome: "Grupo 6", local: "Casa Flávio" },
  ]
  
  const { data: gruposCriados, error: erroGrupos } = await supabase
    .from("grupos")
    .insert(grupos)
    .select()
  
  if (erroGrupos) {
    console.error("Erro ao criar grupos:", erroGrupos)
    return { success: false, error: erroGrupos.message }
  }
  
  // Mapear IDs dos grupos
  const grupoMap: Record<number, string> = {}
  gruposCriados?.forEach((g) => {
    grupoMap[g.numero] = g.id
  })
  
  // Criar publicadores
  const publicadores = [
    // Grupo 1
    { nome: "Antônio V.", grupo_numero: 1, is_lider: true },
    { nome: "Áquila V.", grupo_numero: 1 },
    { nome: "Érica V.", grupo_numero: 1 },
    { nome: "Eliana V.", grupo_numero: 1 },
    { nome: "Ricardo", grupo_numero: 1 },
    { nome: "Natália", grupo_numero: 1 },
    { nome: "Allan", grupo_numero: 1 },
    { nome: "Marcelo", grupo_numero: 1 },
    { nome: "Carolina", grupo_numero: 1 },
    { nome: "Edna Melo", grupo_numero: 1 },
    { nome: "Edson Oliv.", grupo_numero: 1 },
    { nome: "Ide Silva", grupo_numero: 1 },
    { nome: "Lucia Helena", grupo_numero: 1 },
    { nome: "M. Pedra", grupo_numero: 1 },
    { nome: "Renan", grupo_numero: 1 },
    { nome: "Scarlett", grupo_numero: 1 },
    { nome: "Sérgio", grupo_numero: 1 },
    { nome: "Tânia", grupo_numero: 1 },
    
    // Grupo 2
    { nome: "Cristian", grupo_numero: 2, is_lider: true },
    { nome: "Cláudio", grupo_numero: 2 },
    { nome: "Rafaela", grupo_numero: 2 },
    { nome: "Jocilene", grupo_numero: 2 },
    { nome: "Roberto", grupo_numero: 2 },
    { nome: "Diego", grupo_numero: 2 },
    { nome: "Adeyne", grupo_numero: 2 },
    { nome: "Irineu", grupo_numero: 2 },
    { nome: "Ângela", grupo_numero: 2 },
    { nome: "Igor", grupo_numero: 2 },
    { nome: "Kennedy", grupo_numero: 2 },
    { nome: "Pâmela", grupo_numero: 2 },
    { nome: "Kenny", grupo_numero: 2 },
    { nome: "Adilson", grupo_numero: 2 },
    { nome: "Graça", grupo_numero: 2 },
    { nome: "Vanderlei", grupo_numero: 2 },
    { nome: "Vera", grupo_numero: 2 },
    { nome: "Thiciane", grupo_numero: 2 },
    { nome: "Gisleine", grupo_numero: 2 },
    { nome: "Heitor", grupo_numero: 2 },
    { nome: "Daniela A.", grupo_numero: 2 },
    
    // Grupo 3
    { nome: "Guido", grupo_numero: 3, is_lider: true },
    { nome: "Wesley", grupo_numero: 3 },
    { nome: "Francisca", grupo_numero: 3 },
    { nome: "Lucas", grupo_numero: 3 },
    { nome: "Paulo", grupo_numero: 3 },
    { nome: "Leyene", grupo_numero: 3 },
    { nome: "Adriano", grupo_numero: 3 },
    { nome: "Conceição", grupo_numero: 3 },
    { nome: "Adriele", grupo_numero: 3 },
    { nome: "Nicole", grupo_numero: 3 },
    { nome: "Mateus", grupo_numero: 3 },
    { nome: "Kauan", grupo_numero: 3 },
    { nome: "Enzo", grupo_numero: 3 },
    { nome: "Victor", grupo_numero: 3 },
    { nome: "Rafael", grupo_numero: 3 },
    { nome: "Sisteliany", grupo_numero: 3 },
    { nome: "Kaylan", grupo_numero: 3 },
    { nome: "Jaqueline", grupo_numero: 3 },
    { nome: "M. Sebastiana", grupo_numero: 3 },
    { nome: "Elisabete S.", grupo_numero: 3 },
    
    // Grupo 4
    { nome: "Marcos", grupo_numero: 4, is_lider: true },
    { nome: "Alessandro", grupo_numero: 4 },
    { nome: "Adriana", grupo_numero: 4 },
    { nome: "Renata", grupo_numero: 4 },
    { nome: "Vagner", grupo_numero: 4 },
    { nome: "Lucia", grupo_numero: 4 },
    { nome: "Caique", grupo_numero: 4 },
    { nome: "Caroline", grupo_numero: 4 },
    { nome: "Geraldo J.", grupo_numero: 4 },
    { nome: "Mércia", grupo_numero: 4 },
    { nome: "Matheus", grupo_numero: 4 },
    { nome: "Clarice", grupo_numero: 4 },
    { nome: "Benedita", grupo_numero: 4 },
    { nome: "Joana", grupo_numero: 4 },
    { nome: "Vera Lucia", grupo_numero: 4 },
    { nome: "Claudinei", grupo_numero: 4 },
    { nome: "Edwirges", grupo_numero: 4 },
    { nome: "Cidinha", grupo_numero: 4 },
    
    // Grupo 5
    { nome: "Reinaldo", grupo_numero: 5, is_lider: true },
    { nome: "Junior", grupo_numero: 5 },
    { nome: "Heluana", grupo_numero: 5 },
    { nome: "Gisseli", grupo_numero: 5 },
    { nome: "Guilherme", grupo_numero: 5 },
    { nome: "Clayton", grupo_numero: 5 },
    { nome: "Dione", grupo_numero: 5 },
    { nome: "Ana Lucia", grupo_numero: 5 },
    { nome: "Daniella", grupo_numero: 5 },
    { nome: "Moacir", grupo_numero: 5 },
    { nome: "Maria", grupo_numero: 5 },
    { nome: "Lucas R.", grupo_numero: 5 },
    { nome: "Isabelle", grupo_numero: 5 },
    { nome: "Berenice", grupo_numero: 5 },
    { nome: "João Felipe", grupo_numero: 5 },
    { nome: "Claudete", grupo_numero: 5 },
    { nome: "Sueli", grupo_numero: 5 },
    { nome: "Kleber", grupo_numero: 5 },
    { nome: "Pâmela R.", grupo_numero: 5 },
    
    // Grupo 6
    { nome: "Flávio", grupo_numero: 6, is_lider: true },
    { nome: "Francion Rod.", grupo_numero: 6 },
    { nome: "Ana Lucia F.", grupo_numero: 6 },
    { nome: "Vanessa Rod.", grupo_numero: 6 },
    { nome: "Heraldo", grupo_numero: 6 },
    { nome: "Marciana", grupo_numero: 6 },
    { nome: "Tarcisio", grupo_numero: 6 },
    { nome: "Teresa", grupo_numero: 6 },
    { nome: "Juliana", grupo_numero: 6 },
    { nome: "Pedro", grupo_numero: 6 },
    { nome: "Marina", grupo_numero: 6 },
    { nome: "Willian B.", grupo_numero: 6 },
    { nome: "Suellen B.", grupo_numero: 6 },
    { nome: "Elizabete M.", grupo_numero: 6 },
    { nome: "Maria Ap.", grupo_numero: 6 },
    { nome: "Vanilse", grupo_numero: 6 },
  ]
  
  const publicadoresParaInserir = publicadores.map((p) => ({
    nome: p.nome,
    grupo_id: grupoMap[p.grupo_numero],
    is_lider: p.is_lider || false,
    is_auxiliar: false,
  }))
  
  const { error: erroPublicadores } = await supabase
    .from("publicadores")
    .insert(publicadoresParaInserir)
  
  if (erroPublicadores) {
    console.error("Erro ao criar publicadores:", erroPublicadores)
    return { success: false, error: erroPublicadores.message }
  }
  
  revalidatePath("/admin/grupo-estudos")
  return { success: true, message: "Dados criados com sucesso" }
}
