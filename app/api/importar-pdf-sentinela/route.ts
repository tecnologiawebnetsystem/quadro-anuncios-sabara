// @ts-expect-error pdf-parse não tem tipos
import pdf from "pdf-parse"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "Arquivo PDF nao fornecido" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ 
        error: "Arquivo muito grande. Maximo 5MB." 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let pdfData
    try {
      pdfData = await pdf(buffer)
    } catch {
      return Response.json({ 
        error: "Erro ao ler PDF. Verifique se e valido." 
      }, { status: 400 })
    }

    const texto = pdfData.text
    if (!texto || texto.trim().length < 50) {
      return Response.json({ 
        error: "PDF vazio ou sem texto legivel." 
      }, { status: 400 })
    }

    // Retornar o texto extraído para o usuário usar na aba "Colar Texto"
    return Response.json({ 
      sucesso: true,
      texto: texto.trim(),
      totalCaracteres: texto.length,
      totalPaginas: pdfData.numpages || 1
    })

  } catch (error) {
    console.error("Erro PDF:", error)
    return Response.json({ 
      error: "Erro ao processar PDF." 
    }, { status: 500 })
  }
}
