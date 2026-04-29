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
    
    return NextResponse.json(data || [])
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
    
    // Verificar se já existe uma designação para esta semana
    const { data: existing } = await supabase
      .from("limpeza_salao")
      .select("id")
      .eq("mes", mes)
      .eq("semana", semana)
      .single()
    
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
