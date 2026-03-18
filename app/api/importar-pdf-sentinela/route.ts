import { generateText } from "ai"
// @ts-expect-error pdf-parse não tem tipos
import pdf from "pdf-parse"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "Arquivo PDF não fornecido" }, { status: 400 })
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

    const currentYear = new Date().getFullYear()

    // Usar IA para extrair TODOS os estudos do mês
    const result = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Você é um assistente especializado em extrair informações dos estudos de A Sentinela das Testemunhas de Jeová.

O texto a seguir é de um PDF que contém TODOS os estudos de A Sentinela de um mês inteiro (geralmente 4-5 estudos).

Sua tarefa é identificar e extrair CADA estudo separadamente, com TODOS os seus parágrafos.

ESTRUTURA DE CADA ESTUDO:
- Data da semana (ex: "3-9 de março")
- Título do artigo
- Texto tema (versículo)
- Cântico inicial (ou "do meio") e cântico final
- Objetivo do estudo
- Parágrafos numerados (geralmente 15-22 por estudo)
- Perguntas correspondentes a cada parágrafo

REGRAS IMPORTANTES:
1. Identifique CADA estudo separadamente - geralmente há 4-5 estudos por mês
2. Converta datas como "3-9 de março" para formato YYYY-MM-DD usando o ano ${currentYear}
3. Para CADA estudo, extraia TODOS os parágrafos (do primeiro ao último)
4. O campo "textoBase" deve conter o texto COMPLETO do parágrafo
5. Parágrafos podem ter números combinados como "4, 5" ou "10-12"
6. As perguntas geralmente aparecem no final de cada artigo
7. NÃO pule nenhum estudo nem nenhum parágrafo

TEXTO DO PDF:
${texto}

Retorne APENAS um JSON válido (sem markdown, sem \`\`\`) no seguinte formato:

{
  "estudos": [
    {
      "dataInicio": "YYYY-MM-DD",
      "dataFim": "YYYY-MM-DD",
      "titulo": "Título do Artigo 1",
      "textoTema": "Versículo tema",
      "canticoInicial": 123,
      "canticoInicialNome": "Nome do Cântico",
      "canticoFinal": 456,
      "canticoFinalNome": "Nome do Cântico",
      "objetivo": "Objetivo do estudo",
      "paragrafos": [
        {"numero": "1", "textoBase": "Texto completo do parágrafo 1...", "pergunta": "Pergunta 1?", "resposta": null, "ordem": 1},
        {"numero": "2", "textoBase": "Texto completo do parágrafo 2...", "pergunta": "Pergunta 2?", "resposta": null, "ordem": 2}
      ]
    },
    {
      "dataInicio": "YYYY-MM-DD",
      "dataFim": "YYYY-MM-DD",
      "titulo": "Título do Artigo 2",
      ...
    }
  ]
}

Extraia TODOS os estudos encontrados no PDF, cada um com TODOS os seus parágrafos.`,
      maxTokens: 16000
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
