import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get("mes")
    
    let query = supabase
      .from("limpeza_salao")
      .select("*")
      .order("semana", { ascending: true })
    
    if (mes) {
      query = query.eq("mes", mes)
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
    
    // Verificar se já existe uma designação para esta data de início
    // Usar data_inicio como chave de deduplicação para evitar duplicatas entre meses
    const { data: existing } = await supabase
      .from("limpeza_salao")
      .select("id")
      .eq("data_inicio", data_inicio)
      .maybeSingle()
    
    // Também apagar outros registros duplicados com a mesma data_inicio, se houver
    if (existing) {
      await supabase
        .from("limpeza_salao")
        .delete()
        .eq("data_inicio", data_inicio)
        .neq("id", existing.id)
    }
    
    if (existing) {
      // Atualizar
      const { data, error } = await supabase
        .from("limpeza_salao")
        .update({
          grupo_id,
          grupo_nome,
          data_inicio,
          data_fim,
          limpeza_semanal_grupo_id: limpeza_semanal_grupo_id ?? null,
          limpeza_semanal_grupo_nome: limpeza_semanal_grupo_nome ?? null,
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
