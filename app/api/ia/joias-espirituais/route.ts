import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { titulo, leituraSemanal, apenas } = await request.json()

    const systemPrompt = `Você é um assistente especializado em conteúdo bíblico das Testemunhas de Jeová.
Suas respostas devem ser baseadas EXCLUSIVAMENTE em informações do jw.org e da Bíblia.
Seja claro, direto e edificante. Use linguagem simples e acessível.
NUNCA invente informações bíblicas ou referências que não existam.`

    let prompt: string

    if (apenas === 1) {
      prompt = `Gere a Pergunta 1 para a parte "Joias Espirituais" da reunião Vida e Ministério.

Título do discurso principal: ${titulo || "Não informado"}
Leitura semanal: ${leituraSemanal || "Não informada"}

A pergunta deve ser sobre um texto ou passagem bíblica específica relacionada ao tema, no formato:
"[Referência bíblica] — [Pergunta sobre o versículo ou tema]"
com indicação de publicação de apoio (ex: w20.06 5 § 14) se possível.

Responda APENAS em JSON válido neste formato:
{
  "pergunta1": "Referência bíblica — Pergunta sobre o versículo (w/cl referência)",
  "pergunta2": null
}`
    } else if (apenas === 2) {
      prompt = `Gere a Pergunta 2 para a parte "Joias Espirituais" da reunião Vida e Ministério.

Título do discurso principal: ${titulo || "Não informado"}
Leitura semanal: ${leituraSemanal || "Não informada"}

A segunda pergunta normalmente é: "Que joias espirituais você encontrou na leitura da Bíblia desta semana?"
Pode variar ligeiramente de acordo com o tema da semana.

Responda APENAS em JSON válido neste formato:
{
  "pergunta1": null,
  "pergunta2": "Que joias espirituais você encontrou na leitura da Bíblia desta semana?"
}`
    } else {
      prompt = `Gere duas perguntas para a parte "Joias Espirituais" da reunião Vida e Ministério.

Título do discurso principal: ${titulo || "Não informado"}
Leitura semanal: ${leituraSemanal || "Não informada"}

A primeira pergunta deve ser sobre um texto ou passagem bíblica específica relacionada ao tema, no formato:
"[Referência bíblica] — [Pergunta sobre o versículo ou tema]"
com indicação de publicação de apoio (ex: w20.06 5 § 14) se possível.

A segunda pergunta deve ser: "Que joias espirituais você encontrou na leitura da Bíblia desta semana?"

Responda APENAS em JSON válido neste formato:
{
  "pergunta1": "Referência bíblica — Pergunta sobre o versículo (w/cl referência)",
  "pergunta2": "Que joias espirituais você encontrou na leitura da Bíblia desta semana?"
}`
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const dados = JSON.parse(jsonMatch[0])
      return NextResponse.json(dados)
    }

    return NextResponse.json({ erro: "Não foi possível gerar as perguntas" }, { status: 500 })
  } catch (error) {
    console.error("Erro ao gerar perguntas Joias Espirituais:", error)
    return NextResponse.json({ erro: "Erro ao processar solicitação" }, { status: 500 })
  }
}
