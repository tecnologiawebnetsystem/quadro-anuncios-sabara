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

    const { text: resposta } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: `Você é um assistente para estudo da Bíblia focado no estudo de A Sentinela das Testemunhas de Jeová.
Sua tarefa é fornecer respostas claras, concisas e baseadas no texto do parágrafo fornecido.
As respostas devem ser diretas e adequadas para serem lidas durante a reunião.
Use linguagem simples e acessível. Limite a resposta a 2-3 frases no máximo.`,
      prompt: `Com base no seguinte parágrafo do estudo da Sentinela, responda à pergunta de forma clara e concisa:

TEXTO DO PARÁGRAFO:
${texto}

PERGUNTA:
${pergunta}

Forneça uma resposta direta e breve (2-3 frases) que capture a essência do parágrafo e responda à pergunta.`,
    })

    return NextResponse.json({ resposta })
  } catch (error) {
    console.error("Erro ao gerar resposta:", error)
    return NextResponse.json(
      { error: "Erro ao gerar resposta com IA" },
      { status: 500 }
    )
  }
}
