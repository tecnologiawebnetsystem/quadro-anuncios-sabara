import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { texto, pergunta } = await request.json()

    if (!texto || !pergunta) {
      return NextResponse.json(
        { error: "Texto e pergunta são obrigatórios" },
        { status: 400 }
      )
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `Você é um assistente especializado em estudar A Sentinela, publicação das Testemunhas de Jeová.
Sua tarefa é responder perguntas baseadas no texto do parágrafo fornecido.

Instruções:
- Responda de forma clara e concisa
- Base sua resposta APENAS no texto fornecido
- Use linguagem simples e direta
- A resposta deve ser adequada para ser lida em voz alta durante o estudo
- Responda em português do Brasil`,
      prompt: `Texto do parágrafo:
"""
${texto}
"""

Pergunta: ${pergunta}

Por favor, forneça uma resposta clara e concisa baseada no texto acima.`,
      maxTokens: 500,
    })

    return NextResponse.json({ resposta: text })
  } catch (error) {
    console.error("Erro ao gerar resposta:", error)
    return NextResponse.json(
      { error: "Erro ao gerar resposta" },
      { status: 500 }
    )
  }
}
