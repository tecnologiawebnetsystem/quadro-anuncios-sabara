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
   - Parágrafos numerados com texto completo e perguntas (geralmente entre 15-22 parágrafos)
   - Cânticos inicial (ou "do meio") e final
   - PERGUNTAS DE RECAPITULAÇÃO: No final do artigo, antes do último cântico, há perguntas de revisão/recapitulação que resumem os pontos principais. Extraia essas também!

REGRAS IMPORTANTES:
- Se encontrar datas como "3-9 de março", converta para formato YYYY-MM-DD usando o ano ${currentYear}
- Se a data tiver apenas o mês/dia, assuma o ano ${currentYear}
- Se não encontrar alguma informação, use null
- Extraia TODAS as partes encontradas no texto
- Para os cânticos, extraia tanto o número quanto o nome se disponíveis
- Para Vida e Ministério, identifique a seção de cada parte (TESOUROS, MINISTÉRIO ou VIDA CRISTÃ)
- IMPORTANTE: Para Sentinela, extraia ABSOLUTAMENTE TODOS os parágrafos (geralmente 15-22 parágrafos)
- Cada parágrafo da Sentinela tem: número(s), TEXTO COMPLETO do parágrafo (textoBase), e a pergunta correspondente
- Parágrafos podem ter números combinados como "4, 5" ou "10-12" - mantenha exatamente como está no texto
- O campo "textoBase" DEVE conter o TEXTO INTEGRAL do parágrafo como aparece na revista, palavra por palavra
- As perguntas geralmente aparecem no final do artigo, numeradas correspondendo aos parágrafos
- NÃO pule nenhum parágrafo - extraia todos do primeiro ao último
- PERGUNTAS DE RECAPITULAÇÃO: Extraia as perguntas de revisão que aparecem no final do artigo com o campo "recapitulacao": true

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
    {"numero": "1", "textoBase": "Copie aqui o TEXTO INTEGRAL do parágrafo 1, palavra por palavra, como está na revista...", "pergunta": "Pergunta correspondente ao parágrafo 1?", "resposta": null, "ordem": 1, "recapitulacao": false},
    {"numero": "2", "textoBase": "Copie aqui o TEXTO INTEGRAL do parágrafo 2...", "pergunta": "Pergunta correspondente ao parágrafo 2?", "resposta": null, "ordem": 2, "recapitulacao": false},
    {"numero": "3, 4", "textoBase": "Copie aqui o TEXTO INTEGRAL dos parágrafos 3 e 4...", "pergunta": "Pergunta para os parágrafos 3 e 4?", "resposta": null, "ordem": 3, "recapitulacao": false},
    {"numero": "R1", "textoBase": null, "pergunta": "Primeira pergunta de recapitulação?", "resposta": null, "ordem": 20, "recapitulacao": true},
    {"numero": "R2", "textoBase": null, "pergunta": "Segunda pergunta de recapitulação?", "resposta": null, "ordem": 21, "recapitulacao": true}
  ]
}

LEMBRE-SE: 
- Extraia TODOS os parágrafos do artigo, do primeiro ao último (geralmente 15-22 parágrafos)
- O campo "textoBase" deve conter o TEXTO COMPLETO do parágrafo, não um resumo
- Extraia também as PERGUNTAS DE RECAPITULAÇÃO no final (marque com "recapitulacao": true e numero "R1", "R2", etc.)`
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
        erro: "Erro ao interpretar a resposta da IA. Tente novamente." 
      }, { status: 500 })
    }

    // Retorna os dados diretamente no objeto raiz
    return Response.json(dados)

  } catch (error) {
    console.error("Erro ao processar texto:", error)
    return Response.json({ 
      erro: "Erro ao processar o texto. Verifique se o formato esta correto e tente novamente." 
    }, { status: 500 })
  }
}
