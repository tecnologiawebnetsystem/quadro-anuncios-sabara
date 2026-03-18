import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { tipo, pergunta, contexto, textoBase, imagemUrl } = await request.json()

    if (!tipo) {
      return NextResponse.json({ erro: "Tipo é obrigatório" }, { status: 400 })
    }

    let prompt = ""
    let systemPrompt = `Você é um assistente especializado em conteúdo bíblico das Testemunhas de Jeová. 
Suas respostas devem ser baseadas EXCLUSIVAMENTE em informações do jw.org e da Bíblia.
Seja claro, direto e edificante. Use linguagem simples e acessível.
NUNCA invente informações. Se não souber, diga que não tem essa informação.`

    if (tipo === "resposta_paragrafo") {
      // Gerar resposta para parágrafo da Sentinela
      prompt = `Com base no texto bíblico e nas publicações do jw.org, responda a seguinte pergunta de estudo:

Pergunta: ${pergunta}

${textoBase ? `Contexto do parágrafo: ${textoBase}` : ""}

Forneça uma resposta clara e concisa (2-3 frases) que seria apropriada para responder durante o Estudo de A Sentinela.
A resposta deve ser baseada na Bíblia e nas publicações das Testemunhas de Jeová.`

    } else if (tipo === "aplicacao_vida") {
      // Gerar textos de aplicação para Vida e Ministério
      prompt = `Com base no tema "${contexto}" da reunião Vida e Ministério, gere 4 textos curtos de aplicação prática para os nossos dias.

Cada texto deve:
- Ter 1-2 frases
- Ser prático e aplicável no dia a dia
- Ser baseado em princípios bíblicos
- Ajudar os publicadores a aplicar o que aprenderam

Formato da resposta (JSON):
{
  "aplicacoes": [
    "Texto de aplicação 1",
    "Texto de aplicação 2", 
    "Texto de aplicação 3",
    "Texto de aplicação 4"
  ]
}`

    } else if (tipo === "analise_imagem") {
      // Analisar imagem e gerar comentário
      if (!imagemUrl) {
        return NextResponse.json({ erro: "URL da imagem é obrigatória" }, { status: 400 })
      }

      prompt = `Analise esta imagem no contexto de uma reunião das Testemunhas de Jeová.
      
${contexto ? `Contexto: ${contexto}` : ""}

Descreva brevemente:
1. O que a imagem representa
2. Como ela se relaciona com o tema bíblico
3. Uma lição prática que podemos aprender

Mantenha a resposta em 3-4 frases, adequada para ser usada como comentário durante a reunião.`
    } else {
      return NextResponse.json({ erro: "Tipo inválido" }, { status: 400 })
    }

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt,
      ...(tipo === "analise_imagem" && imagemUrl ? {
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image", image: imagemUrl }
            ]
          }
        ]
      } : {})
    })

    // Para aplicações, fazer parse do JSON
    if (tipo === "aplicacao_vida") {
      try {
        const jsonMatch = result.text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const aplicacoes = JSON.parse(jsonMatch[0])
          return NextResponse.json(aplicacoes)
        }
      } catch {
        // Se falhar o parse, retornar como texto
        return NextResponse.json({ aplicacoes: [result.text] })
      }
    }

    return NextResponse.json({ resposta: result.text })

  } catch (error) {
    console.error("Erro ao gerar resposta IA:", error)
    
    // Verificar se é erro de rate limit
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorType = (error as { type?: string })?.type
    
    if (errorType === "rate_limit_exceeded" || errorMessage.includes("rate_limit") || errorMessage.includes("429")) {
      return NextResponse.json({ 
        erro: "Limite de uso da IA atingido. Aguarde alguns minutos e tente novamente." 
      }, { status: 429 })
    }
    
    return NextResponse.json({ 
      erro: "Erro ao gerar resposta. Tente novamente." 
    }, { status: 500 })
  }
}
