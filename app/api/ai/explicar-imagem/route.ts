import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { descricao, textoBase, pergunta } = await request.json()

    if (!descricao) {
      return NextResponse.json(
        { error: "Descrição da imagem é obrigatória" },
        { status: 400 }
      )
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `Você é um assistente especializado em estudar A Sentinela, publicação das Testemunhas de Jeová.
Sua tarefa é fornecer uma explicação sobre uma imagem que ilustra um parágrafo do estudo.

Instruções:
- Explique como a imagem se relaciona com o texto do parágrafo (se fornecido)
- Use linguagem simples e edificante
- A explicação deve ser curta (2-3 frases)
- Destaque a lição espiritual que a imagem transmite
- Responda em português do Brasil`,
      prompt: `Descrição da imagem: "${descricao}"
${textoBase ? `\nTexto do parágrafo: "${textoBase}"` : ""}
${pergunta ? `\nPergunta do parágrafo: "${pergunta}"` : ""}

Por favor, forneça uma explicação breve e edificante sobre esta imagem e como ela ilustra o ponto do parágrafo.`,
      maxTokens: 300,
    })

    return NextResponse.json({ explicacao: text })
  } catch (error) {
    console.error("Erro ao gerar explicação:", error)
    return NextResponse.json(
      { error: "Erro ao gerar explicação" },
      { status: 500 }
    )
  }
}
