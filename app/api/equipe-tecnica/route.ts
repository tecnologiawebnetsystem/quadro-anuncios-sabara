import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mes = searchParams.get("mes")
  const data = searchParams.get("data")
  
  const supabase = await createClient()
  
  let query = supabase
    .from("equipe_tecnica")
    .select("*")
    .order("data", { ascending: true })
  
  if (mes) {
    query = query.eq("mes", mes)
  }
  
  if (data) {
    query = query.eq("data", data)
  }
  
  const { data: result, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("equipe_tecnica")
    .upsert(body, { onConflict: "data,dia_semana" })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...updateData } = body
  
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("equipe_tecnica")
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
