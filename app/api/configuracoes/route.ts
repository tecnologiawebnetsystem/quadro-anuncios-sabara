import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .order("chave", { ascending: true })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { chave, valor } = body
  
  if (!chave || !valor) {
    return NextResponse.json({ error: "Chave e valor são obrigatórios" }, { status: 400 })
  }
  
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("configuracoes")
    .update({ 
      valor,
      updated_at: new Date().toISOString()
    })
    .eq("chave", chave)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
