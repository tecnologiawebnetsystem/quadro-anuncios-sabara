import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { titulo, secao, tempo, textoBase } = await request.json()

    const prompt = `Voce e um assistente especializado em ajudar Testemunhas de Jeova a preparar partes para as reunioes.

PARTE: ${titulo}
SECAO: ${secao}
TEMPO: ${tempo || "Nao especificado"}
CONTEUDO BASE: ${textoBase || "Nao fornecido"}

Ajude a preparar esta parte gerando:
1. Pontos principais a destacar (maxido 3-4 pontos)
2. Sugestoes de ilustracoes simples e eficazes
3. Perguntas para envolver a audiencia (se aplicavel)
4. Dicas de apresentacao especificas para este tipo de parte
5. Textos biblicos chave para memorizar ou destacar

Considere:
- Se for parte de estudante: foque em naturalidade e clareza
- Se for parte de anciao/servo: foque em aplicacao pratica e encorajamento
- Se for leitura: foque em entonacao e compreensao

Baseie-se APENAS em materiais de jw.org e na Biblia.

Responda APENAS em JSON valido neste formato:
{
  "pontosPrincipais": [
    {
      "ponto": "ponto a destacar",
      "porque": "por que este ponto e importante"
    }
  ],
  "ilustracoes": [
    {
      "ideia": "ideia da ilustracao",
      "como_usar": "como aplicar na parte"
    }
  ],
  "perguntasAudiencia": ["pergunta 1", "pergunta 2"],
  "dicasApresentacao": [
    {
      "dica": "dica especifica",
      "exemplo": "exemplo pratico"
    }
  ],
  "textosBiblicos": [
    {
      "referencia": "Texto biblico",
      "aplicacao": "como usar"
    }
  ],
  "checklistPreparacao": ["item 1 para verificar", "item 2 para verificar"],
  "tempoSugerido": {
    "introducao": "X segundos",
    "desenvolvimento": "X minutos",
    "conclusao": "X segundos"
  }
}`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.7,
    })

    // Extrair JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const dados = JSON.parse(jsonMatch[0])
      return Response.json(dados)
    }

    return Response.json({ erro: "Nao foi possivel gerar preparacao" }, { status: 500 })
  } catch (error) {
    console.error("Erro ao gerar preparacao:", error)
    return Response.json({ erro: "Erro ao processar solicitacao" }, { status: 500 })
  }
}
