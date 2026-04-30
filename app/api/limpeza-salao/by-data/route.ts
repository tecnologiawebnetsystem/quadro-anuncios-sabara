import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/limpeza-salao/by-data?data_inicio=2026-06-28
// Retorna o registro de limpeza para uma data de início específica
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const data_inicio = searchParams.get("data_inicio")

    if (!data_inicio) {
      return NextResponse.json({ error: "Parâmetro data_inicio obrigatório" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("limpeza_salao")
      .select("*")
      .eq("data_inicio", data_inicio)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
