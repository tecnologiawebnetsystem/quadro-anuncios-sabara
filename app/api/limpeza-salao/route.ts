import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get("mes")
    
    // Busca por intervalo de datas do mês para capturar semanas transbordadas
    // (ex: 28/06–04/07 salva com mes=julho mas exibida em junho)
    let query = supabase
      .from("limpeza_salao")
      .select("*")
      .order("data_inicio", { ascending: true })

    if (mes) {
      // Calcular primeiro e último dia do mês solicitado
      // Inclui 7 dias antes do início para capturar semanas que começam no mês anterior
      // Ex: Semana 1 de maio pode ter data_inicio em 26/04 (domingo)
      const [mesNome, anoStr] = mes.split("-")
      const mesesPt: Record<string, number> = {
        janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
        julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
      }
      const ano = parseInt(anoStr)
      const mesIdx = mesesPt[mesNome.toLowerCase()] ?? 0
      
      // Range: 7 dias antes do início do mês até o último dia do mês
      const inicioRange = new Date(ano, mesIdx, -6) // 25 do mês anterior
      const fimRange = new Date(ano, mesIdx + 1, 0)  // último dia do mês

      const toStr = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

      query = query
        .gte("data_inicio", toStr(inicioRange))
        .lte("data_inicio", toStr(fimRange))
    }

    const { data, error } = await query
    
    if (error) {
      console.error("Erro ao buscar limpeza:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Deduplicar por data_inicio: se houver dois registros com a mesma data de início,
    // manter apenas o que tiver mais informações (grupo preenchido), ou o mais recente
    const vistos = new Map<string, typeof data[0]>()
    for (const item of (data || [])) {
      const chave = item.data_inicio
      if (!vistos.has(chave)) {
        vistos.set(chave, item)
      } else {
        // Preferir o registro que tem grupo_id preenchido
        const existente = vistos.get(chave)!
        if (!existente.grupo_id && item.grupo_id) {
          vistos.set(chave, item)
        }
      }
    }
    const deduplicado = Array.from(vistos.values()).sort((a, b) => a.data_inicio.localeCompare(b.data_inicio))
    
    return NextResponse.json(deduplicado)
  } catch (error) {
    console.error("Erro ao buscar limpeza:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { mes, semana, data_inicio, data_fim, grupo_id, grupo_nome, limpeza_semanal_grupo_id, limpeza_semanal_grupo_nome } = body
    
    // Buscar todos os registros com essa data de início (pode haver duplicatas antigas)
    const { data: existingList } = await supabase
      .from("limpeza_salao")
      .select("*")
      .eq("data_inicio", data_inicio)
      .order("updated_at", { ascending: false })

    const registroAtual = existingList?.[0] ?? null
    const existing = registroAtual ? { id: registroAtual.id } : null

    // Apagar duplicatas — manter apenas o primeiro (mais recente)
    if (existingList && existingList.length > 1) {
      const idsParaApagar = existingList.slice(1).map((r: { id: string }) => r.id)
      await supabase
        .from("limpeza_salao")
        .delete()
        .in("id", idsParaApagar)
    }

    if (existing) {
      // Merge: só atualiza o campo que veio preenchido; preserva o que já está no banco
      const novoGrupoId = grupo_id !== null ? grupo_id : (registroAtual?.grupo_id ?? null)
      const novoGrupoNome = grupo_id !== null ? grupo_nome : (registroAtual?.grupo_nome ?? null)
      const novaLimpezaSemanalId = limpeza_semanal_grupo_id !== undefined ? limpeza_semanal_grupo_id : (registroAtual?.limpeza_semanal_grupo_id ?? null)
      const novaLimpezaSemanalNome = limpeza_semanal_grupo_id !== undefined ? limpeza_semanal_grupo_nome : (registroAtual?.limpeza_semanal_grupo_nome ?? null)

      const { data, error } = await supabase
        .from("limpeza_salao")
        .update({
          grupo_id: novoGrupoId,
          grupo_nome: novoGrupoNome,
          data_inicio,
          data_fim,
          limpeza_semanal_grupo_id: novaLimpezaSemanalId,
          limpeza_semanal_grupo_nome: novaLimpezaSemanalNome,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single()
      
      if (error) {
        console.error("Erro ao atualizar limpeza:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data)
    } else {
      // Inserir
      const { data, error } = await supabase
        .from("limpeza_salao")
        .insert({
          mes,
          semana,
          data_inicio,
          data_fim,
          grupo_id,
          grupo_nome,
          limpeza_semanal_grupo_id: limpeza_semanal_grupo_id ?? null,
          limpeza_semanal_grupo_nome: limpeza_semanal_grupo_nome ?? null,
        })
        .select()
        .single()
      
      if (error) {
        console.error("Erro ao inserir limpeza:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error("Erro ao salvar limpeza:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
