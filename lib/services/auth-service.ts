import { createClient } from "@/lib/supabase/client"
import { logActivity } from "./activity-logger"

export interface Usuario {
  id: string
  email: string
  nome: string
  perfil: 'admin' | 'anciao' | 'publicador'
  publicador_id?: string
  ativo: boolean
  ultimo_login?: string
  created_at: string
}

export interface LoginResult {
  sucesso: boolean
  usuario?: Usuario
  erro?: string
  bloqueado?: boolean
  tentativasRestantes?: number
}

const MAX_TENTATIVAS = 5
const TEMPO_BLOQUEIO_MINUTOS = 15

// Hash simples para demonstração - em produção usar bcrypt via API
async function hashSenha(senha: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(senha + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  const senhaHash = await hashSenha(senha)
  return senhaHash === hash
}

export async function loginUsuario(email: string, senha: string): Promise<LoginResult> {
  const supabase = createClient()
  
  try {
    // Buscar usuário pelo email
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()
    
    if (error || !usuario) {
      return { sucesso: false, erro: 'Email ou senha incorretos' }
    }
    
    // Verificar se está bloqueado
    if (usuario.bloqueado_ate) {
      const bloqueadoAte = new Date(usuario.bloqueado_ate)
      if (bloqueadoAte > new Date()) {
        const minutosRestantes = Math.ceil((bloqueadoAte.getTime() - Date.now()) / 60000)
        return { 
          sucesso: false, 
          erro: `Conta bloqueada. Tente novamente em ${minutosRestantes} minuto(s)`,
          bloqueado: true
        }
      }
      // Desbloquear se o tempo passou
      await supabase
        .from('usuarios')
        .update({ bloqueado_ate: null, tentativas_login: 0 })
        .eq('id', usuario.id)
    }
    
    // Verificar se está ativo
    if (!usuario.ativo) {
      return { sucesso: false, erro: 'Conta desativada. Contate o administrador.' }
    }
    
    // Verificar senha
    const senhaValida = await verificarSenha(senha, usuario.senha_hash)
    
    if (!senhaValida) {
      const novasTentativas = (usuario.tentativas_login || 0) + 1
      
      if (novasTentativas >= MAX_TENTATIVAS) {
        // Bloquear conta
        const bloqueadoAte = new Date()
        bloqueadoAte.setMinutes(bloqueadoAte.getMinutes() + TEMPO_BLOQUEIO_MINUTOS)
        
        await supabase
          .from('usuarios')
          .update({ 
            tentativas_login: novasTentativas,
            bloqueado_ate: bloqueadoAte.toISOString()
          })
          .eq('id', usuario.id)
        
        await logActivity({
          tabela: 'usuarios',
          registro_id: usuario.id,
          acao: 'outro',
          dados_depois: { evento: 'conta_bloqueada', tentativas: novasTentativas },
          usuario_email: email,
          usuario_nome: usuario.nome,
          perfil: usuario.perfil
        })
        
        return { 
          sucesso: false, 
          erro: `Muitas tentativas. Conta bloqueada por ${TEMPO_BLOQUEIO_MINUTOS} minutos`,
          bloqueado: true,
          tentativasRestantes: 0
        }
      }
      
      await supabase
        .from('usuarios')
        .update({ tentativas_login: novasTentativas })
        .eq('id', usuario.id)
      
      return { 
        sucesso: false, 
        erro: 'Email ou senha incorretos',
        tentativasRestantes: MAX_TENTATIVAS - novasTentativas
      }
    }
    
    // Login bem-sucedido
    await supabase
      .from('usuarios')
      .update({ 
        tentativas_login: 0,
        bloqueado_ate: null,
        ultimo_login: new Date().toISOString()
      })
      .eq('id', usuario.id)
    
    await logActivity({
      tabela: 'usuarios',
      registro_id: usuario.id,
      acao: 'login',
      usuario_email: email,
      usuario_nome: usuario.nome,
      perfil: usuario.perfil
    })
    
    // Retornar dados do usuário (sem a senha)
    const { senha_hash, tentativas_login, bloqueado_ate, ...usuarioSeguro } = usuario
    
    return { 
      sucesso: true, 
      usuario: usuarioSeguro as Usuario
    }
  } catch (error) {
    console.error('[Auth] Erro no login:', error)
    return { sucesso: false, erro: 'Erro ao processar login. Tente novamente.' }
  }
}

export async function criarUsuario(dados: {
  email: string
  senha: string
  nome: string
  perfil: 'admin' | 'anciao' | 'publicador'
  publicador_id?: string
}): Promise<{ sucesso: boolean; usuario?: Usuario; erro?: string }> {
  const supabase = createClient()
  
  try {
    // Verificar se email já existe
    const { data: existente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', dados.email.toLowerCase().trim())
      .single()
    
    if (existente) {
      return { sucesso: false, erro: 'Este email já está cadastrado' }
    }
    
    // Hash da senha
    const senhaHash = await hashSenha(dados.senha)
    
    // Criar usuário
    const { data: novoUsuario, error } = await supabase
      .from('usuarios')
      .insert({
        email: dados.email.toLowerCase().trim(),
        senha_hash: senhaHash,
        nome: dados.nome,
        perfil: dados.perfil,
        publicador_id: dados.publicador_id || null,
        ativo: true,
        tentativas_login: 0
      })
      .select()
      .single()
    
    if (error) {
      console.error('[Auth] Erro ao criar usuário:', error)
      return { sucesso: false, erro: 'Erro ao criar usuário' }
    }
    
    await logActivity({
      tabela: 'usuarios',
      registro_id: novoUsuario.id,
      acao: 'criar',
      dados_depois: { email: dados.email, nome: dados.nome, perfil: dados.perfil },
      perfil: 'admin'
    })
    
    const { senha_hash, tentativas_login, bloqueado_ate, ...usuarioSeguro } = novoUsuario
    
    return { sucesso: true, usuario: usuarioSeguro as Usuario }
  } catch (error) {
    console.error('[Auth] Erro ao criar usuário:', error)
    return { sucesso: false, erro: 'Erro ao criar usuário' }
  }
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, email, nome, perfil, publicador_id, ativo, ultimo_login, created_at')
    .order('nome')
  
  if (error) {
    console.error('[Auth] Erro ao listar usuários:', error)
    return []
  }
  
  return data as Usuario[]
}

export async function atualizarUsuario(
  id: string, 
  dados: Partial<Pick<Usuario, 'nome' | 'perfil' | 'ativo' | 'publicador_id'>>
): Promise<{ sucesso: boolean; erro?: string }> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('usuarios')
    .update({ ...dados, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  if (error) {
    console.error('[Auth] Erro ao atualizar usuário:', error)
    return { sucesso: false, erro: 'Erro ao atualizar usuário' }
  }
  
  await logActivity({
    tabela: 'usuarios',
    registro_id: id,
    acao: 'editar',
    dados_depois: dados,
    perfil: 'admin'
  })
  
  return { sucesso: true }
}

export async function alterarSenha(
  id: string, 
  senhaAtual: string, 
  novaSenha: string
): Promise<{ sucesso: boolean; erro?: string }> {
  const supabase = createClient()
  
  // Buscar usuário
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('senha_hash')
    .eq('id', id)
    .single()
  
  if (!usuario) {
    return { sucesso: false, erro: 'Usuário não encontrado' }
  }
  
  // Verificar senha atual
  const senhaValida = await verificarSenha(senhaAtual, usuario.senha_hash)
  
  if (!senhaValida) {
    return { sucesso: false, erro: 'Senha atual incorreta' }
  }
  
  // Atualizar para nova senha
  const novoHash = await hashSenha(novaSenha)
  
  const { error } = await supabase
    .from('usuarios')
    .update({ senha_hash: novoHash, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  if (error) {
    return { sucesso: false, erro: 'Erro ao alterar senha' }
  }
  
  await logActivity({
    tabela: 'usuarios',
    registro_id: id,
    acao: 'editar',
    dados_depois: { evento: 'senha_alterada' },
    perfil: 'admin'
  })
  
  return { sucesso: true }
}

export async function resetarSenha(id: string, novaSenha: string): Promise<{ sucesso: boolean; erro?: string }> {
  const supabase = createClient()
  
  const novoHash = await hashSenha(novaSenha)
  
  const { error } = await supabase
    .from('usuarios')
    .update({ 
      senha_hash: novoHash, 
      tentativas_login: 0,
      bloqueado_ate: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
  
  if (error) {
    return { sucesso: false, erro: 'Erro ao resetar senha' }
  }
  
  await logActivity({
    tabela: 'usuarios',
    registro_id: id,
    acao: 'editar',
    dados_depois: { evento: 'senha_resetada' },
    perfil: 'admin'
  })
  
  return { sucesso: true }
}
