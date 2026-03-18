import { generateText } from "ai"
// @ts-expect-error pdf-parse não tem tipos
import pdf from "pdf-parse"

// Configurar timeout maior para processamento de PDFs grandes
export const maxDuration = 120 // 120 segundos

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "Arquivo PDF não fornecido" }, { status: 400 })
    }

    // Verificar tamanho do arquivo (máx 5MB para PDFs de texto)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ 
        error: "O arquivo PDF é muito grande. Máximo permitido: 5MB" 
      }, { status: 400 })
    }

    // Converter File para Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extrair texto do PDF
    let pdfData
    try {
      pdfData = await pdf(buffer)
    } catch {
      return Response.json({ 
        error: "Erro ao ler o arquivo PDF. Verifique se é um PDF válido." 
      }, { status: 400 })
    }

    const texto = pdfData.text

    if (!texto || texto.trim().length < 100) {
      return Response.json({ 
        error: "O PDF parece estar vazio ou não contém texto legível." 
      }, { status: 400 })
    }

    // Limitar o texto para evitar timeout (primeiros 40000 caracteres)
    const textoLimitado = texto.slice(0, 40000)

    const currentYear = new Date().getFullYear()

    // Usar IA para extrair os estudos - prompt otimizado e mais curto
    const result = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Extraia os estudos da Sentinela do texto abaixo. Ano: ${currentYear}.

FORMATO DE SAÍDA (JSON puro, sem markdown):
{
  "estudos": [
    {
      "dataInicio": "YYYY-MM-DD",
      "dataFim": "YYYY-MM-DD",
      "titulo": "Titulo",
      "textoTema": "Versiculo tema",
      "canticoInicial": 1,
      "canticoFinal": 2,
      "objetivo": "Objetivo",
      "paragrafos": [
        {"numero": "1", "textoBase": "Texto do paragrafo", "pergunta": "Pergunta?", "resposta": null, "ordem": 1}
      ]
    }
  ]
}

REGRAS:
- Extraia TODOS os estudos e TODOS os paragrafos de cada estudo
- Converta datas como "3-9 de marco" para YYYY-MM-DD
- Paragrafos combinados: mantenha como "4, 5" ou "10-12"
- textoBase: texto completo do paragrafo
- pergunta: pergunta correspondente ao paragrafo

TEXTO:
${textoLimitado}`,
      maxTokens: 12000
    })

    // Parse o JSON da resposta
    let dados
    try {
      let jsonText = result.text.trim()
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.slice(7)
      }
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.slice(3)
      }
      if (jsonText.endsWith("```")) {
        jsonText = jsonText.slice(0, -3)
      }
      jsonText = jsonText.trim()
      
      dados = JSON.parse(jsonText)
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError)
      console.error("Texto recebido:", result.text)
      return Response.json({ 
        erro: "Erro ao interpretar a resposta da IA. O PDF pode ser muito grande ou estar em formato não suportado." 
      }, { status: 500 })
    }

    if (!dados.estudos || !Array.isArray(dados.estudos)) {
      return Response.json({ 
        erro: "Não foi possível identificar estudos no PDF." 
      }, { status: 500 })
    }

    return Response.json({ 
      estudos: dados.estudos,
      totalEstudos: dados.estudos.length,
      totalParagrafos: dados.estudos.reduce((acc: number, e: { paragrafos?: unknown[] }) => acc + (e.paragrafos?.length || 0), 0)
    })

  } catch (error) {
    console.error("Erro ao processar PDF:", error)
    return Response.json({ 
      erro: "Erro ao processar o PDF. Verifique se o arquivo está correto e tente novamente." 
    }, { status: 500 })
  }
}
