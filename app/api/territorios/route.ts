import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = request.nextUrl
    const status = searchParams.get("status")
    const id = searchParams.get("id")

    let query = supabase
      .from("territorios")
      .select("*")
      .order("numero", { ascending: true })

    if (id) {
      query = query.eq("id", id) as typeof query
    }
    if (status) {
      query = query.eq("status", status) as typeof query
    }

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar territórios:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      numero, nome, bairro, cidade, estado,
      descricao, latitude, longitude,
      foto_url, foto_pathname,
      status, ultimo_trabalho,
      publicador_responsavel, observacoes,
    } = body

    if (!numero || !nome) {
      return NextResponse.json({ error: "Número e nome são obrigatórios" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("territorios")
      .insert({
        numero,
        nome,
        bairro: bairro || null,
        cidade: cidade || "Taubaté",
        estado: estado || "SP",
        descricao: descricao || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        foto_url: foto_url || null,
        foto_pathname: foto_pathname || null,
        status: status || "disponivel",
        ultimo_trabalho: ultimo_trabalho || null,
        publicador_responsavel: publicador_responsavel || null,
        observacoes: observacoes || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar território:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...campos } = body

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("territorios")
      .update({ ...campos, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar território:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = request.nextUrl
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    const { error } = await supabase
      .from("territorios")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao excluir território:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
