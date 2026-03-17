import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { tipo, paragrafo, pergunta, tema, textoBase } = await request.json()

    let prompt = ""

    if (tipo === "comentario_sentinela") {
      prompt = `Voce e um assistente especializado em ajudar Testemunhas de Jeova a preparar comentarios para o Estudo de A Sentinela.

TEMA DO ARTIGO: ${tema}

PARAGRAFO ${paragrafo}:
${textoBase || ""}

PERGUNTA: ${pergunta}

Gere 3 sugestoes de comentarios curtos e objetivos (maximo 2-3 frases cada) que:
1. Respondam diretamente a pergunta
2. Usem linguagem simples e natural
3. Possam incluir experiencias pessoais ou aplicacoes praticas
4. Estejam alinhados com os ensinamentos de jw.org

Responda APENAS em JSON valido neste formato:
{
  "comentarios": [
    {
      "texto": "comentario aqui",
      "tipo": "direto" | "experiencia" | "aplicacao"
    }
  ],
  "textosBiblicos": ["Texto 1", "Texto 2"],
  "pontoChave": "ponto principal do paragrafo"
}`
    } else if (tipo === "comentario_vida") {
      prompt = `Voce e um assistente especializado em ajudar Testemunhas de Jeova a preparar comentarios para a Reuniao Vida e Ministerio.

PARTE: ${tema}
CONTEUDO: ${textoBase || ""}

Gere 2-3 sugestoes de comentarios ou pontos de destaque que:
1. Sejam praticos e aplicaveis
2. Possam ser usados no ministerio de campo
3. Estejam alinhados com os ensinamentos de jw.org

Responda APENAS em JSON valido neste formato:
{
  "comentarios": [
    {
      "texto": "comentario aqui",
      "tipo": "pratico" | "ministerio" | "reflexao"
    }
  ],
  "dicasPraticas": ["dica 1", "dica 2"]
}`
    }

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

    return Response.json({ erro: "Nao foi possivel gerar comentarios" }, { status: 500 })
  } catch (error) {
    console.error("Erro ao gerar comentarios:", error)
    return Response.json({ erro: "Erro ao processar solicitacao" }, { status: 500 })
  }
}
