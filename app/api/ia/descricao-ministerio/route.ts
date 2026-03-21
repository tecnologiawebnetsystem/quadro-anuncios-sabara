import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { titulo, tipo } = await request.json()

    if (!titulo) {
      return NextResponse.json({ error: "Título obrigatório" }, { status: 400 })
    }

    const prompt =
      tipo === "duas pessoas conversando"
        ? `Você é um assistente para reuniões das Testemunhas de Jeová. A parte do ministério chama-se "${titulo}" e será apresentada por DUAS PESSOAS conversando (com ajudante). Escreva uma instrução curta e objetiva para essa parte no estilo das revistas JW, indicando o método (ex: DE CASA EM CASA, VISITA DE RETORNO, ESTUDO BÍBLICO) e o que deve ser demonstrado. Inclua uma referência de lição se possível (ex: lmd lição 9 ponto 5). Responda apenas com a instrução, sem explicações adicionais.`
        : `Você é um assistente para reuniões das Testemunhas de Jeová. A parte do ministério chama-se "${titulo}" e será apresentada por apenas UMA PESSOA (discurso, sem ajudante). Escreva uma instrução curta e objetiva para essa parte no estilo das revistas JW, indicando o método (ex: TESTEMUNHO PÚBLICO, CARTA OU MENSAGEM) e o que deve ser feito. Inclua uma referência de lição se possível (ex: lmd lição 5 ponto 3). Responda apenas com a instrução, sem explicações adicionais.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Erro ao chamar OpenAI" }, { status: 500 })
    }

    const data = await response.json()
    const descricao = data.choices?.[0]?.message?.content?.trim() || ""

    return NextResponse.json({ descricao })
  } catch (error) {
    console.error("Erro ao gerar descrição ministério:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
