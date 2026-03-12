import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("publicadores")
      .select("id, nome, anciao, servo_ministerial, ativo")
      .eq("ativo", true)
      .order("nome", { ascending: true })
    
    if (error) {
      console.error("Erro ao buscar publicadores:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Erro na API de publicadores:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
