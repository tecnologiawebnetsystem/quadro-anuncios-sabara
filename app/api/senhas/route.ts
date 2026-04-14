import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Senhas padrão caso não existam no banco
const SENHAS_PADRAO = {
  senha_administrador: "080754",
  senha_anciao: "123456",
}

// GET - Busca as senhas do banco de dados
export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("configuracoes")
    .select("chave, valor")
    .in("chave", ["senha_administrador", "senha_anciao"])
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Monta objeto com as senhas
  const senhas: Record<string, string> = {}
  
  // Define os valores padrão
  senhas.administrador = SENHAS_PADRAO.senha_administrador
  senhas.anciao = SENHAS_PADRAO.senha_anciao
  
  // Sobrescreve com valores do banco se existirem
  for (const item of data || []) {
    if (item.chave === "senha_administrador" && item.valor?.senha) {
      senhas.administrador = item.valor.senha
    }
    if (item.chave === "senha_anciao" && item.valor?.senha) {
      senhas.anciao = item.valor.senha
    }
  }
  
  return NextResponse.json(senhas)
}

// PUT - Atualiza uma senha
export async function PUT(request: Request) {
  const body = await request.json()
  const { perfil, novaSenha, senhaAtual } = body
  
  if (!perfil || !novaSenha) {
    return NextResponse.json({ error: "Perfil e nova senha são obrigatórios" }, { status: 400 })
  }
  
  // Valida que a senha tem 6 dígitos numéricos
  if (!/^\d{6}$/.test(novaSenha)) {
    return NextResponse.json({ error: "A senha deve ter exatamente 6 dígitos numéricos" }, { status: 400 })
  }
  
  const chave = `senha_${perfil}`
  const supabase = await createClient()
  
  // Busca a configuração atual
  const { data: configAtual } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("chave", chave)
    .single()
  
  // Verifica a senha atual
  const senhaAtualDB = configAtual?.valor?.senha || SENHAS_PADRAO[chave as keyof typeof SENHAS_PADRAO]
  
  if (senhaAtual && senhaAtual !== senhaAtualDB) {
    return NextResponse.json({ error: "Senha atual incorreta" }, { status: 401 })
  }
  
  // Se a configuração existe, atualiza
  if (configAtual) {
    const { error } = await supabase
      .from("configuracoes")
      .update({ 
        valor: { senha: novaSenha },
        updated_at: new Date().toISOString()
      })
      .eq("chave", chave)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    // Se não existe, cria
    const descricao = perfil === "administrador" 
      ? "Senha de acesso do perfil Administrador" 
      : "Senha de acesso do perfil Ancião"
    
    const { error } = await supabase
      .from("configuracoes")
      .insert({ 
        chave,
        valor: { senha: novaSenha },
        descricao
      })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
  
  return NextResponse.json({ success: true, message: "Senha atualizada com sucesso" })
}
