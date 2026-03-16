import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { texto } = await req.json()

    if (!texto || typeof texto !== "string") {
      return Response.json({ error: "Texto não fornecido" }, { status: 400 })
    }

    const currentYear = new Date().getFullYear()

    const result = await generateText({
      model: "openai/gpt-4o-mini",
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

Retorne APENAS um JSON válido (sem markdown, sem \`\`\`) no seguinte formato:

Para Vida e Ministério:
{
  "tipo": "vida_ministerio",
  "dataInicio": "YYYY-MM-DD",
  "dataFim": "YYYY-MM-DD",
  "leituraSemanal": "LIVRO X-Y",
  "canticoInicial": 123,
  "canticoInicialNome": "Nome do Cântico",
  "canticoMeio": 456,
  "canticoMeioNome": "Nome do Cântico",
  "canticoFinal": 789,
  "canticoFinalNome": "Nome do Cântico",
  "partes": [
    {"secao": "TESOUROS DA PALAVRA DE DEUS", "titulo": "Título", "tempo": "10 min", "ordem": 1},
    {"secao": "FAÇA SEU MELHOR NO MINISTÉRIO", "titulo": "Título", "tempo": "5 min", "ordem": 2},
    {"secao": "NOSSA VIDA CRISTÃ", "titulo": "Título", "tempo": "15 min", "ordem": 3}
  ]
}

Para Sentinela:
{
  "tipo": "sentinela",
  "dataInicio": "YYYY-MM-DD",
  "dataFim": "YYYY-MM-DD",
  "titulo": "Título do Artigo",
  "textoTema": "Versículo tema",
  "canticoInicial": 123,
  "canticoInicialNome": "Nome do Cântico",
  "canticoFinal": 456,
  "canticoFinalNome": "Nome do Cântico",
  "objetivo": "Objetivo do estudo",
  "paragrafos": [
    {"numero": "1", "textoBase": "Texto bíblico", "pergunta": "Pergunta?", "resposta": "Resposta", "ordem": 1}
  ]
}`
    })

    // Parse o JSON da resposta
    let dados
    try {
      // Remove possíveis marcadores de código markdown
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
        error: "Erro ao interpretar a resposta da IA. Tente novamente." 
      }, { status: 500 })
    }

    return Response.json({ 
      success: true, 
      dados 
    })

  } catch (error) {
    console.error("Erro ao processar texto:", error)
    return Response.json({ 
      error: "Erro ao processar o texto. Verifique se o formato está correto e tente novamente." 
    }, { status: 500 })
  }
}
