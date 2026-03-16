import { generateText, Output } from "ai"
import { z } from "zod"

// Schema para Vida e Ministério
const VidaMinisterioSchema = z.object({
  tipo: z.literal("vida_ministerio"),
  dataInicio: z.string().nullable().describe("Data de início da semana no formato YYYY-MM-DD"),
  dataFim: z.string().nullable().describe("Data de fim da semana no formato YYYY-MM-DD"),
  leituraSemanal: z.string().nullable().describe("Leitura bíblica da semana, ex: DEUTERONÔMIO 1-2"),
  canticoInicial: z.number().nullable().describe("Número do cântico inicial"),
  canticoInicialNome: z.string().nullable().describe("Nome do cântico inicial"),
  canticoMeio: z.number().nullable().describe("Número do cântico do meio"),
  canticoMeioNome: z.string().nullable().describe("Nome do cântico do meio"),
  canticoFinal: z.number().nullable().describe("Número do cântico final"),
  canticoFinalNome: z.string().nullable().describe("Nome do cântico final"),
  partes: z.array(z.object({
    secao: z.string().describe("Seção: TESOUROS DA PALAVRA DE DEUS, FAÇA SEU MELHOR NO MINISTÉRIO, ou NOSSA VIDA CRISTÃ"),
    titulo: z.string().describe("Título da parte"),
    tempo: z.string().nullable().describe("Tempo em minutos, ex: 10 min"),
    ordem: z.number().describe("Ordem da parte na reunião")
  }))
})

// Schema para Estudo de A Sentinela
const SentinelaSchema = z.object({
  tipo: z.literal("sentinela"),
  dataInicio: z.string().nullable().describe("Data de início do estudo no formato YYYY-MM-DD"),
  dataFim: z.string().nullable().describe("Data de fim do estudo no formato YYYY-MM-DD"),
  titulo: z.string().describe("Título do artigo de estudo"),
  textoTema: z.string().nullable().describe("Texto tema/versículo base do estudo"),
  canticoInicial: z.number().nullable().describe("Número do cântico inicial"),
  canticoInicialNome: z.string().nullable().describe("Nome do cântico inicial"),
  canticoFinal: z.number().nullable().describe("Número do cântico final"),
  canticoFinalNome: z.string().nullable().describe("Nome do cântico final"),
  objetivo: z.string().nullable().describe("Objetivo do estudo"),
  paragrafos: z.array(z.object({
    numero: z.string().describe("Número do parágrafo, pode ser '1', '2, 3', etc"),
    textoBase: z.string().nullable().describe("Texto bíblico base"),
    pergunta: z.string().describe("Pergunta do parágrafo"),
    resposta: z.string().nullable().describe("Resposta/resumo do parágrafo"),
    ordem: z.number().describe("Ordem do parágrafo")
  }))
})

// Schema unificado
const ReuniaoSchema = z.discriminatedUnion("tipo", [
  VidaMinisterioSchema,
  SentinelaSchema
])

export async function POST(req: Request) {
  try {
    const { texto } = await req.json()

    if (!texto || typeof texto !== "string") {
      return Response.json({ error: "Texto não fornecido" }, { status: 400 })
    }

    const currentYear = new Date().getFullYear()

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      output: Output.object({ schema: ReuniaoSchema }),
      prompt: `Você é um assistente especializado em extrair informações de reuniões das Testemunhas de Jeová.

Analise o texto a seguir e extraia as informações da reunião. O texto pode ser de duas fontes:

1. **Reunião de Vida e Ministério Cristão (quinta-feira)**: 
   - Tem seções: "TESOUROS DA PALAVRA DE DEUS", "FAÇA SEU MELHOR NO MINISTÉRIO", "NOSSA VIDA CRISTÃ"
   - Inclui cânticos inicial, do meio e final
   - Cada parte tem título e tempo em minutos

2. **Estudo de A Sentinela (fim de semana)**:
   - Tem título do artigo, texto tema (versículo)
   - Parágrafos com perguntas
   - Cânticos inicial e final

REGRAS IMPORTANTES:
- Se encontrar datas como "3-9 de março", converta para formato YYYY-MM-DD usando o ano ${currentYear}
- Se a data tiver apenas o mês/dia, assuma o ano ${currentYear}
- Se não encontrar alguma informação, use null
- Extraia TODAS as partes encontradas no texto
- Para os cânticos, extraia tanto o número quanto o nome se disponíveis
- Para Vida e Ministério, identifique a seção de cada parte (TESOUROS, MINISTÉRIO ou VIDA CRISTÃ)
- Para Sentinela, extraia todos os parágrafos com suas perguntas

TEXTO PARA ANALISAR:
${texto}

Retorne os dados estruturados conforme o schema.`
    })

    return Response.json({ 
      success: true, 
      dados: result.object 
    })

  } catch (error) {
    console.error("Erro ao processar texto:", error)
    return Response.json({ 
      error: "Erro ao processar o texto. Tente novamente." 
    }, { status: 500 })
  }
}
