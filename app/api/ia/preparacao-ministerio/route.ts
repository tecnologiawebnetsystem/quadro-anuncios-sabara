import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { tipo, contexto, situacao } = await request.json()

    let prompt = ""

    if (tipo === "revisita") {
      prompt = `Voce e um assistente especializado em ajudar Testemunhas de Jeova a preparar revisitas.

CONTEXTO: ${contexto || "Revisita geral"}
SITUACAO: ${situacao || "Pessoa mostrou interesse em um tema biblico"}

Crie um roteiro de revisita que inclua:
1. Uma saudacao e introducao natural
2. Perguntas de sondagem para entender o interesse
3. Sugestao de texto biblico para compartilhar
4. Como fazer a transicao para uma proxima visita ou estudo

Baseie-se APENAS em materiais de jw.org e na Biblia.

Responda APENAS em JSON valido neste formato:
{
  "introducao": "frase de abertura",
  "perguntasSondagem": ["pergunta 1", "pergunta 2", "pergunta 3"],
  "textosBiblicos": [
    {
      "referencia": "Joao 3:16",
      "aplicacao": "como usar este texto"
    }
  ],
  "transicaoProximaVisita": "sugestao de como marcar proxima visita",
  "materiaisSugeridos": ["folheto ou brochura sugerida"]
}`
    } else if (tipo === "estudo_biblico") {
      prompt = `Voce e um assistente especializado em ajudar Testemunhas de Jeova a conduzir estudos biblicos.

TEMA DO ESTUDO: ${contexto || "Estudo biblico geral"}
SITUACAO DO ESTUDANTE: ${situacao || "Iniciante"}

Crie um roteiro de estudo que inclua:
1. Perguntas para revisar o estudo anterior
2. Pontos principais a destacar neste estudo
3. Ilustracoes simples para explicar conceitos
4. Perguntas de aplicacao pratica
5. Como incentivar o progresso espiritual

Baseie-se APENAS em materiais de jw.org e na Biblia.

Responda APENAS em JSON valido neste formato:
{
  "revisaoAnterior": ["pergunta de revisao 1", "pergunta de revisao 2"],
  "pontosPrincipais": [
    {
      "ponto": "ponto a destacar",
      "textoBase": "referencia biblica",
      "explicacao": "como explicar de forma simples"
    }
  ],
  "ilustracoes": [
    {
      "conceito": "conceito a ilustrar",
      "ilustracao": "ilustracao simples"
    }
  ],
  "aplicacaoPratica": ["pergunta de aplicacao 1", "pergunta de aplicacao 2"],
  "encorajamento": "frase de encorajamento para o estudante"
}`
    } else if (tipo === "apresentacao_inicial") {
      prompt = `Voce e um assistente especializado em ajudar Testemunhas de Jeova a fazer apresentacoes no ministerio de campo.

TEMA: ${contexto || "Apresentacao geral"}
SITUACAO: ${situacao || "Primeira visita"}

Crie 3 opcoes de apresentacoes curtas (30 segundos a 1 minuto) que:
1. Sejam naturais e amigaveis
2. Usem uma pergunta para despertar interesse
3. Apresentem um texto biblico ou oferta de publicacao
4. Deixem abertura para uma revisita

Baseie-se APENAS em materiais de jw.org e na Biblia.

Responda APENAS em JSON valido neste formato:
{
  "apresentacoes": [
    {
      "abertura": "frase de abertura",
      "pergunta": "pergunta para despertar interesse",
      "textoBiblico": "referencia biblica",
      "oferta": "publicacao ou video sugerido",
      "fechamento": "como encerrar deixando abertura"
    }
  ],
  "dicasGerais": ["dica 1", "dica 2"]
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

    return Response.json({ erro: "Nao foi possivel gerar roteiro" }, { status: 500 })
  } catch (error) {
    console.error("Erro ao gerar roteiro:", error)
    return Response.json({ erro: "Erro ao processar solicitacao" }, { status: 500 })
  }
}
