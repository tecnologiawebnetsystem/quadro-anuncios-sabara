import { generateText } from "ai"
import { gateway } from "@ai-sdk/gateway"
// @ts-expect-error pdf-parse não tem tipos
import pdf from "pdf-parse"

// Configurar timeout maior para processamento de PDFs grandes
export const maxDuration = 120

// Criar provider com timeout aumentado
const model = gateway("openai/gpt-4o-mini", {
  fetch: async (url, options) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 90000)
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "Arquivo PDF nao fornecido" }, { status: 400 })
    }

    // Verificar tamanho do arquivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ 
        error: "O arquivo PDF e muito grande. Maximo permitido: 5MB" 
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
        error: "Erro ao ler o arquivo PDF. Verifique se e um PDF valido." 
      }, { status: 400 })
    }

    const texto = pdfData.text

    if (!texto || texto.trim().length < 100) {
      return Response.json({ 
        error: "O PDF parece estar vazio ou nao contem texto legivel." 
      }, { status: 400 })
    }

    // Limitar o texto para evitar timeout (primeiros 15000 caracteres)
    const textoLimitado = texto.slice(0, 15000)

    const currentYear = new Date().getFullYear()

    // Usar IA para extrair os estudos - prompt otimizado
    const result = await generateText({
      model,
      prompt: `Extraia os estudos da Sentinela do texto. Ano: ${currentYear}.

JSON (sem markdown):
{"estudos":[{"dataInicio":"YYYY-MM-DD","dataFim":"YYYY-MM-DD","titulo":"","textoTema":"","canticoInicial":1,"canticoFinal":2,"objetivo":"","paragrafos":[{"numero":"1","textoBase":"","pergunta":"","resposta":null,"ordem":1}]}]}

Regras: Extraia todos estudos e paragrafos. Datas como "3-9 marco" vira YYYY-MM-DD.

TEXTO:
${textoLimitado}`,
      maxTokens: 6000
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
    } catch {
      return Response.json({ 
        erro: "Erro ao interpretar a resposta. Tente um PDF menor ou use a opcao Colar Texto." 
      }, { status: 500 })
    }

    if (!dados.estudos || !Array.isArray(dados.estudos)) {
      return Response.json({ 
        erro: "Nao foi possivel identificar estudos no PDF." 
      }, { status: 500 })
    }

    return Response.json({ 
      estudos: dados.estudos,
      totalEstudos: dados.estudos.length,
      totalParagrafos: dados.estudos.reduce((acc: number, e: { paragrafos?: unknown[] }) => acc + (e.paragrafos?.length || 0), 0)
    })

  } catch (error) {
    console.error("Erro ao processar PDF:", error)
    
    // Verificar se é erro de timeout
    const errorMessage = error instanceof Error ? error.message : ""
    if (errorMessage.includes("timeout") || errorMessage.includes("Timeout")) {
      return Response.json({ 
        erro: "O processamento demorou muito. Tente um PDF menor ou use a opcao Colar Texto para importar um estudo por vez." 
      }, { status: 408 })
    }
    
    return Response.json({ 
      erro: "Erro ao processar o PDF. Tente novamente ou use a opcao Colar Texto." 
    }, { status: 500 })
  }
}
