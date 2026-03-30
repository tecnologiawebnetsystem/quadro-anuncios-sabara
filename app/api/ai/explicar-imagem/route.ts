import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { imagemUrl, textoBase, pergunta, modo } = await request.json()

    // Modo "descrever": IA analisa a imagem e gera uma descrição
    // Modo "explicar": IA explica a imagem com base no contexto do parágrafo
    if (!imagemUrl) {
      return NextResponse.json(
        { error: "URL da imagem é obrigatória" },
        { status: 400 }
      )
    }

    if (modo === "descrever") {
      // Usar modelo multimodal para analisar a imagem
      const { text } = await generateText({
        model: "openai/gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Você é um assistente especializado em analisar imagens de publicações das Testemunhas de Jeová (A Sentinela, livros de estudo, etc).

Descreva esta imagem de forma clara e objetiva em português do Brasil. Inclua:
- Quem está na imagem (pessoas, idades aproximadas, gênero)
- O que estão fazendo
- O cenário/ambiente
- Elementos visuais importantes (expressões, gestos, objetos)

A descrição deve ter 2-4 frases.${textoBase ? `\n\nContexto - Texto do parágrafo relacionado: "${textoBase}"` : ""}${pergunta ? `\n\nPergunta do parágrafo: "${pergunta}"` : ""}`
              },
              {
                type: "image",
                image: imagemUrl
              }
            ]
          }
        ],
        maxTokens: 400,
      })

      return NextResponse.json({ descricao: text })
    } else {
      // Modo explicar: analisar imagem e gerar explicação espiritual
      const { text } = await generateText({
        model: "openai/gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Você é um assistente especializado em estudar A Sentinela, publicação das Testemunhas de Jeová.

Analise esta imagem e forneça uma explicação edificante sobre como ela ilustra o ponto do parágrafo.

Instruções:
- Explique como a imagem se relaciona com o texto (se fornecido)
- Use linguagem simples e edificante
- A explicação deve ter 2-3 frases
- Destaque a lição espiritual que a imagem transmite
- Responda em português do Brasil${textoBase ? `\n\nTexto do parágrafo: "${textoBase}"` : ""}${pergunta ? `\n\nPergunta do parágrafo: "${pergunta}"` : ""}`
              },
              {
                type: "image",
                image: imagemUrl
              }
            ]
          }
        ],
        maxTokens: 300,
      })

      return NextResponse.json({ explicacao: text })
    }
  } catch (error) {
    console.error("Erro ao processar imagem:", error)
    return NextResponse.json(
      { error: "Erro ao processar imagem" },
      { status: 500 }
    )
  }
}
