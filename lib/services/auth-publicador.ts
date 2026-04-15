"use server"

import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export interface PublicadorAuth {
  id: string
  nome: string
  senha_cadastrada: boolean
}

// Gerar token único para cadastro de senha
export async function gerarTokenCadastro(publicadorId: string): Promise<{ token: string; url: string } | null> {
  const supabase = await createClient()
  
  const token = uuidv4()
  const expiraEm = new Date()
  expiraEm.setHours(expiraEm.getHours() + 48) // Token válido por 48 horas
  
  const { error } = await supabase
    .from("publicadores")
    .update({
      token_cadastro: token,
      token_expira_em: expiraEm.toISOString()
    })
    .eq("id", publicadorId)
  
  if (error) {
    console.error("Erro ao gerar token:", error)
    return null
  }
  
  // Retorna o token e a URL base (o domínio será adicionado no cliente)
  return {
    token,
    url: `/cadastrar-senha/${token}`
  }
}

// Validar token e retornar dados do publicador
export async function validarToken(token: string): Promise<{ valido: boolean; publicador?: { id: string; nome: string } }> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("publicadores")
    .select("id, nome, token_expira_em")
    .eq("token_cadastro", token)
    .single()
  
  if (error || !data) {
    return { valido: false }
  }
  
  // Verificar se o token expirou
  if (data.token_expira_em && new Date(data.token_expira_em) < new Date()) {
    return { valido: false }
  }
  
  return {
    valido: true,
    publicador: {
      id: data.id,
      nome: data.nome
    }
  }
}

// Cadastrar senha do publicador
export async function cadastrarSenhaPublicador(
  token: string, 
  senha: string
): Promise<{ sucesso: boolean; mensagem: string }> {
  const supabase = await createClient()
  
  // Validar token primeiro
  const { valido, publicador } = await validarToken(token)
  
  if (!valido || !publicador) {
    return { sucesso: false, mensagem: "Token inválido ou expirado. Solicite um novo link ao ancião." }
  }
  
  // Validar senha
  if (senha.length < 4) {
    return { sucesso: false, mensagem: "A senha deve ter pelo menos 4 caracteres." }
  }
  
  // Hash da senha
  const senhaHash = await bcrypt.hash(senha, 10)
  
  // Atualizar publicador
  const { error } = await supabase
    .from("publicadores")
    .update({
      senha_hash: senhaHash,
      senha_cadastrada_em: new Date().toISOString(),
      token_cadastro: null,
      token_expira_em: null
    })
    .eq("id", publicador.id)
  
  if (error) {
    console.error("Erro ao cadastrar senha:", error)
    return { sucesso: false, mensagem: "Erro ao cadastrar senha. Tente novamente." }
  }
  
  return { sucesso: true, mensagem: "Senha cadastrada com sucesso!" }
}

// Login do publicador na consulta
export async function loginPublicador(
  publicadorId: string, 
  senha: string
): Promise<{ sucesso: boolean; publicador?: PublicadorAuth; mensagem?: string }> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("publicadores")
    .select("id, nome, senha_hash")
    .eq("id", publicadorId)
    .single()
  
  if (error || !data) {
    return { sucesso: false, mensagem: "Publicador não encontrado." }
  }
  
  if (!data.senha_hash) {
    return { sucesso: false, mensagem: "Você ainda não cadastrou sua senha. Solicite o link ao ancião." }
  }
  
  // Verificar senha
  const senhaCorreta = await bcrypt.compare(senha, data.senha_hash)
  
  if (!senhaCorreta) {
    return { sucesso: false, mensagem: "Senha incorreta." }
  }
  
  return {
    sucesso: true,
    publicador: {
      id: data.id,
      nome: data.nome,
      senha_cadastrada: true
    }
  }
}

// Buscar publicadores para o combo de seleção
export async function buscarPublicadoresParaLogin(): Promise<{ id: string; nome: string; senha_cadastrada: boolean }[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("publicadores")
    .select("id, nome, senha_hash")
    .order("nome")
  
  if (error || !data) {
    return []
  }
  
  return data.map(p => ({
    id: p.id,
    nome: p.nome,
    senha_cadastrada: !!p.senha_hash
  }))
}

// Verificar se publicador tem senha cadastrada
export async function verificarSenhaCadastrada(publicadorId: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("publicadores")
    .select("senha_hash")
    .eq("id", publicadorId)
    .single()
  
  if (error || !data) {
    return false
  }
  
  return !!data.senha_hash
}

// Resetar senha do publicador (para admin/ancião)
export async function resetarSenhaPublicador(publicadorId: string): Promise<{ sucesso: boolean; mensagem: string }> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("publicadores")
    .update({
      senha_hash: null,
      senha_cadastrada_em: null,
      token_cadastro: null,
      token_expira_em: null
    })
    .eq("id", publicadorId)
  
  if (error) {
    return { sucesso: false, mensagem: "Erro ao resetar senha." }
  }
  
  return { sucesso: true, mensagem: "Senha resetada. O publicador precisará cadastrar uma nova senha." }
}
