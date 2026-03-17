import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { format, startOfWeek, endOfWeek, subWeeks } from "date-fns"
import { ptBR } from "date-fns/locale"

export async function GET() {
  try {
    const supabase = await createClient()
    const hoje = new Date()
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 })
    const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 })
    const mesAtual = format(hoje, "yyyy-MM")

    // Buscar dados para análise
    const [
      { data: publicadores },
      { data: assistencia },
      { data: equipeTecnica },
      { data: limpeza },
      { data: partes }
    ] = await Promise.all([
      supabase.from("publicadores").select("*").eq("ativo", true),
      supabase.from("assistencia_reunioes").select("*").order("data", { ascending: false }).limit(16),
      supabase.from("equipe_tecnica").select("*").eq("mes", mesAtual),
      supabase.from("limpeza_salao").select("*").eq("mes", mesAtual),
      supabase.from("vida_ministerio_partes").select("*, semana:vida_ministerio_semanas(data_inicio)").is("participante_id", null)
    ])

    // Calcular estatísticas
    const totalPublicadores = publicadores?.length || 0
    const totalAnciaos = publicadores?.filter(p => p.anciao).length || 0
    const totalServos = publicadores?.filter(p => p.servo_ministerial).length || 0
    const totalPioneiros = publicadores?.filter(p => p.pioneiro_regular).length || 0

    const mediaAssistencia = assistencia?.length > 0
      ? Math.round(assistencia.reduce((acc, a) => acc + (a.presencial || 0) + (a.zoom || 0), 0) / assistencia.length)
      : 0

    const equipeIncompleta = equipeTecnica?.filter(e => !e.indicador1_nome || !e.som_nome).length || 0
    const limpezaPendente = limpeza?.filter(l => !l.grupo_id).length || 0
    const partesSemDesignacao = partes?.length || 0

    // Gerar insights com IA
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `Voce e um assistente para gestao de congregacoes das Testemunhas de Jeova.
Analise os dados e gere insights uteis, praticos e encorajadores.
Responda APENAS em JSON valido com a estrutura:
{
  "resumo": "Resumo geral da semana em 1-2 frases",
  "insights": ["insight1", "insight2", "insight3"],
  "alertas": ["alerta1", "alerta2"],
  "sugestoes": ["sugestao1", "sugestao2"],
  "saude": "otima" | "boa" | "atencao" | "critica"
}
Nao inclua explicacoes, apenas o JSON.`,
      prompt: `Dados da congregacao:
- Total de publicadores ativos: ${totalPublicadores}
- Anciaos: ${totalAnciaos}, Servos Ministeriais: ${totalServos}, Pioneiros: ${totalPioneiros}
- Media de assistencia (ultimas 8 semanas): ${mediaAssistencia}
- Reunioes com equipe tecnica incompleta este mes: ${equipeIncompleta}
- Semanas sem grupo de limpeza: ${limpezaPendente}
- Partes do Vida e Ministerio sem designacao: ${partesSemDesignacao}
- Data atual: ${format(hoje, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}

Gere insights relevantes para o corpo de anciaos.`
    })

    // Parse do JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const insights = JSON.parse(jsonMatch[0])
      return Response.json({
        ...insights,
        estatisticas: {
          totalPublicadores,
          totalAnciaos,
          totalServos,
          totalPioneiros,
          mediaAssistencia,
          equipeIncompleta,
          limpezaPendente,
          partesSemDesignacao
        }
      })
    }

    return Response.json({ erro: "Erro ao processar insights" }, { status: 500 })
  } catch (error) {
    console.error("Erro ao gerar insights:", error)
    return Response.json({ erro: "Erro ao gerar insights" }, { status: 500 })
  }
}
