import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { format, startOfWeek, endOfWeek, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get("tipo") || "resumo_semanal"
    
    const supabase = await createClient()
    const hoje = new Date()
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 })
    const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 })
    const mesAtual = format(hoje, "yyyy-MM")

    if (tipo === "resumo_semanal") {
      // Buscar dados da semana
      const [
        { data: equipeTecnica },
        { data: limpeza },
        { data: partes },
        { data: discurso }
      ] = await Promise.all([
        supabase.from("equipe_tecnica").select("*").eq("mes", mesAtual),
        supabase.from("limpeza_salao").select("*").eq("mes", mesAtual),
        supabase.from("vida_ministerio_partes").select("*, semana:vida_ministerio_semanas(data_inicio, data_fim)"),
        supabase.from("discursos_publicos").select("*").gte("data", format(hoje, "yyyy-MM-dd")).limit(1)
      ])

      // Filtrar reuniões da semana
      const reunioesSemana = equipeTecnica?.filter(e => {
        const dataReuniao = new Date(e.data)
        return dataReuniao >= inicioSemana && dataReuniao <= fimSemana
      }) || []

      // Encontrar limpeza da semana
      const limpezaSemana = limpeza?.find(l => {
        const inicio = new Date(l.data_inicio)
        const fim = new Date(l.data_fim)
        return hoje >= inicio && hoje <= fim
      })

      // Gerar resumo com IA
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        system: `Voce gera resumos semanais para congregacoes das Testemunhas de Jeova.
Seja conciso, pratico e encorajador. Use linguagem simples.
Responda em JSON:
{
  "titulo": "Titulo do resumo",
  "saudacao": "Saudacao inicial",
  "destaques": ["destaque1", "destaque2"],
  "lembretes": ["lembrete1", "lembrete2"],
  "encorajamento": "Mensagem final de encorajamento"
}`,
        prompt: `Gere um resumo semanal para a congregacao.
Dados da semana (${format(inicioSemana, "d", { locale: ptBR })} a ${format(fimSemana, "d 'de' MMMM", { locale: ptBR })}):

Reunioes:
${reunioesSemana.map(r => `- ${r.dia_semana === "quinta" ? "Quinta" : "Domingo"} (${format(new Date(r.data), "dd/MM")}): Som: ${r.som_nome || "A definir"}`).join("\n")}

Limpeza da Semana: ${limpezaSemana?.grupo_nome || "A definir"}

Proximo Discurso Publico: ${discurso?.[0]?.tema || "A definir"} por ${discurso?.[0]?.orador_nome || "A definir"}`
      })

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const resumo = JSON.parse(jsonMatch[0])
        return Response.json({
          tipo: "resumo_semanal",
          semana: `${format(inicioSemana, "d", { locale: ptBR })} a ${format(fimSemana, "d 'de' MMMM", { locale: ptBR })}`,
          ...resumo,
          dados: {
            reunioes: reunioesSemana.length,
            limpeza: limpezaSemana?.grupo_nome,
            proximoDiscurso: discurso?.[0]?.tema
          }
        })
      }
    }

    if (tipo === "lembretes_designacoes") {
      // Buscar designações da próxima semana
      const proximaSemana = addDays(inicioSemana, 7)
      const fimProximaSemana = addDays(fimSemana, 7)
      
      const { data: partes } = await supabase
        .from("vida_ministerio_partes")
        .select("*, semana:vida_ministerio_semanas(data_inicio, data_fim)")
        .not("participante_id", "is", null)

      // Filtrar partes da próxima semana
      const partesProximaSemana = partes?.filter(p => {
        if (!p.semana?.data_inicio) return false
        const dataInicio = new Date(p.semana.data_inicio)
        return dataInicio >= proximaSemana && dataInicio <= fimProximaSemana
      }) || []

      // Gerar lembretes personalizados
      const lembretes = partesProximaSemana.map(p => ({
        participante: p.participante_nome,
        parte: p.titulo,
        data: p.semana?.data_inicio,
        mensagem: `Lembrete: Voce foi designado para "${p.titulo}" na reuniao de ${format(new Date(p.semana?.data_inicio), "EEEE, d 'de' MMMM", { locale: ptBR })}.`
      }))

      return Response.json({
        tipo: "lembretes_designacoes",
        proximaSemana: `${format(proximaSemana, "d", { locale: ptBR })} a ${format(fimProximaSemana, "d 'de' MMMM", { locale: ptBR })}`,
        lembretes,
        total: lembretes.length
      })
    }

    return Response.json({ erro: "Tipo de notificacao invalido" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao gerar notificacoes:", error)
    return Response.json({ erro: "Erro ao gerar notificacoes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { tipo, destinatario, mensagem } = await request.json()
    
    // Aqui você poderia integrar com serviços de email/push
    // Por exemplo: Resend, SendGrid, OneSignal, etc.
    
    // Por enquanto, vamos apenas simular o envio
    const notificacao = {
      id: crypto.randomUUID(),
      tipo,
      destinatario,
      mensagem,
      enviado_em: new Date().toISOString(),
      status: "enviado"
    }

    return Response.json(notificacao)
  } catch (error) {
    console.error("Erro ao enviar notificacao:", error)
    return Response.json({ erro: "Erro ao enviar notificacao" }, { status: 500 })
  }
}
