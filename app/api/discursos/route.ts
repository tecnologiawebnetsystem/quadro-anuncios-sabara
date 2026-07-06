import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("discursos")
    .select("*")
    .order("numero", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { numero, titulo } = body

  if (!numero || !titulo) {
    return NextResponse.json({ error: "Campos obrigatórios: numero, titulo" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("discursos")
    .insert({ numero: parseInt(numero), titulo: titulo.trim() })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
