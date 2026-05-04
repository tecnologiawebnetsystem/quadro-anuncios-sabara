import { put, del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo fornecido" }, { status: 400 })
    }

    const tiposPermitidos = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!tiposPermitidos.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo não permitido. Use JPG, PNG, GIF ou WebP." },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo muito grande. Máximo 10MB." }, { status: 400 })
    }

    const timestamp = Date.now()
    const nomeArquivo = `territorios/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    const blob = await put(nomeArquivo, file, { access: "public" })

    return NextResponse.json({ url: blob.url, pathname: blob.pathname })
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: "URL obrigatória" }, { status: 400 })
    await del(url)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir foto:", error)
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 })
  }
}
