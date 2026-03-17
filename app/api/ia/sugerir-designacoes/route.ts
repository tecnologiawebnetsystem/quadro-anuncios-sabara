import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { tipo, parte, quantidade = 3 } = await request.json()
    const supabase = await createClient()

    // Buscar publicadores ativos com histórico
    const { data: publicadores } = await supabase
      .from("publicadores")
      .select("id, nome, anciao, servo_ministerial, pioneiro_regular, batizado")
      .eq("ativo", true)
      .order("nome")

    if (!publicadores || publicadores.length === 0) {
      return Response.json({ sugestoes: [] })
    }

    // Buscar histórico de designações recentes (últimas 8 semanas)
    const { data: historico } = await supabase
      .from("vida_ministerio_partes")
      .select("participante_id, participante_nome, secao, titulo")
      .not("participante_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(100)

    // Contar participações recentes por publicador
    const participacoes: Record<string, number> = {}
    historico?.forEach(h => {
      if (h.participante_id) {
        participacoes[h.participante_id] = (participacoes[h.participante_id] || 0) + 1
      }
    })

    // Criar lista de publicadores com contexto
    const publicadoresContext = publicadores.map(p => ({
      id: p.id,
      nome: p.nome,
      privilegio: p.anciao ? "anciao" : p.servo_ministerial ? "servo" : p.pioneiro_regular ? "pioneiro" : "publicador",
      participacoesRecentes: participacoes[p.id] || 0
    }))

    // Gerar sugestões com IA
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `Voce e um assistente que ajuda a designar publicadores para partes nas reunioes.
Considere:
1. Distribuir oportunidades de forma equilibrada (priorizar quem participou menos)
2. Adequar o privilegio ao tipo de parte
3. Variar as designacoes

Responda APENAS com um JSON valido:
{
  "sugestoes": [
    { "id": "uuid", "nome": "Nome", "motivo": "razao da sugestao" }
  ]
}`,
      prompt: `Tipo de parte: ${tipo || "geral"}
Nome da parte: ${parte || "Parte da reuniao"}
Quantidade de sugestoes: ${quantidade}

Publicadores disponiveis:
${JSON.stringify(publicadoresContext, null, 2)}

Sugira os ${quantidade} melhores candidatos para esta parte, priorizando quem participou menos recentemente.`
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const resultado = JSON.parse(jsonMatch[0])
      return Response.json(resultado)
    }

    // Fallback: retornar quem participou menos
    const ordenados = [...publicadoresContext]
      .sort((a, b) => a.participacoesRecentes - b.participacoesRecentes)
      .slice(0, quantidade)

    return Response.json({
      sugestoes: ordenados.map(p => ({
        id: p.id,
        nome: p.nome,
        motivo: p.participacoesRecentes === 0 
          ? "Ainda nao participou recentemente" 
          : `Participou ${p.participacoesRecentes}x nas ultimas semanas`
      }))
    })
  } catch (error) {
    console.error("Erro ao sugerir designacoes:", error)
    return Response.json({ erro: "Erro ao sugerir designacoes" }, { status: 500 })
  }
}
