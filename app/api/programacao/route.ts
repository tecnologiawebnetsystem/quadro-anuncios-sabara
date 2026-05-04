import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/programacao?data=2026-05-08
// Retorna todos os dados do dia: campo, reunião quinta, reunião domingo, equipe técnica
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const data = searchParams.get("data")

  if (!data) {
    return NextResponse.json({ error: "Parâmetro data é obrigatório" }, { status: 400 })
  }

  const supabase = await createClient()

  // Descobrir dia da semana da data solicitada
  const dataObj = new Date(data + "T12:00:00")
  const diaSemana = dataObj.getDay() // 0=dom, 1=seg, 2=ter, 3=qua, 4=qui, 5=sex, 6=sab
  const nomeDia = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"][diaSemana]
  const mes = data.substring(0, 7) // YYYY-MM

  // Calcular data_inicio (domingo anterior da semana) para buscar limpeza.
  // A semana de limpeza começa no domingo. Para quinta (dia 4) e domingo (dia 0):
  //   quinta: retrocede 4 dias → domingo anterior
  //   domingo: o próprio dia é o domingo de início da semana
  let dataInicioLimpeza: string | null = null
  if (diaSemana === 4) {
    const d = new Date(dataObj); d.setDate(d.getDate() - 4)
    dataInicioLimpeza = d.toISOString().slice(0, 10)
  } else if (diaSemana === 0) {
    dataInicioLimpeza = data // o próprio domingo é o data_inicio
  }

  // Executa todas as queries em paralelo
  const [
    campoSemana,
    campoCartas,
    campoSabado,
    campoDomingo,
    equipe,
    vidaSemana,
    reuniaoPublicaDesig,
    reuniaoPublicaDiscurso,
    limpezaSalao,
  ] = await Promise.all([
    // Campo seg-sex (dirigente por dia/período)
    diaSemana >= 1 && diaSemana <= 5
      ? supabase
          .from("servico_campo_semana")
          .select("*")
          .eq("mes", mes)
          .ilike("dia_semana", nomeDia)
          .eq("ativo", true)
          .order("horario", { ascending: true })
      : Promise.resolve({ data: [] }),

    // Campo cartas — segunda-feira, somente o registro da data exata
    diaSemana === 1
      ? supabase
          .from("servico_campo_cartas")
          .select("*")
          .eq("data", data)
          .eq("ativo", true)
          .order("horario", { ascending: true })
      : Promise.resolve({ data: [] }),

    // Campo sábado
    diaSemana === 6
      ? supabase
          .from("servico_campo_sabado")
          .select("*")
          .eq("mes", mes)
          .eq("data", data)
          .order("horario", { ascending: true })
      : Promise.resolve({ data: [] }),

    // Campo domingo
    diaSemana === 0
      ? supabase
          .from("servico_campo_domingo")
          .select("*")
          .eq("mes", mes)
          .eq("data", data)
      : Promise.resolve({ data: [] }),

    // Equipe técnica (quinta=4 ou domingo=0)
    diaSemana === 4 || diaSemana === 0
      ? supabase
          .from("equipe_tecnica")
          .select("*")
          .eq("data", data)
          .maybeSingle()
      : Promise.resolve({ data: null }),

    // Semana de Vida e Ministério (cobre quinta=4)
    diaSemana === 4
      ? supabase
          .from("vida_ministerio_semanas")
          .select("*")
          .lte("data_inicio", data)
          .gte("data_fim", data)
          .maybeSingle()
      : Promise.resolve({ data: null }),

    // Reunião pública — designações (domingo)
    diaSemana === 0
      ? supabase
          .from("reunioes_publicas_designacoes")
          .select("*")
          .eq("data", data)
          .maybeSingle()
      : Promise.resolve({ data: null }),

    // Reunião pública — discurso (domingo)
    diaSemana === 0
      ? supabase
          .from("discursos_publicos")
          .select("*")
          .eq("data", data)
          .maybeSingle()
      : Promise.resolve({ data: null }),

    // Limpeza do salão — quinta e domingo (com join no local do grupo)
    dataInicioLimpeza
      ? supabase
          .from("limpeza_salao")
          .select("id, grupo_nome, limpeza_semanal_grupo_nome, semana, grupo_id, grupos:grupo_id(local)")
          .eq("data_inicio", dataInicioLimpeza)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  // Se for quinta, buscar também as partes da reunião
  let partes: unknown[] = []
  if (diaSemana === 4 && vidaSemana.data) {
    const { data: partesData } = await supabase
      .from("vida_ministerio_partes")
      .select("*")
      .eq("semana_id", (vidaSemana.data as { id: string }).id)
      .order("secao", { ascending: true })
      .order("ordem", { ascending: true })
    partes = partesData || []
  }

  return NextResponse.json({
    data,
    diaSemana,
    nomeDia,
    campo: {
      semana: campoSemana.data || [],
      cartas: campoCartas.data || [],
      sabado: campoSabado.data || [],
      domingo: campoDomingo.data || [],
    },
    equipe: equipe.data || null,
    vidaMinisterio: {
      semana: vidaSemana.data || null,
      partes,
    },
    reuniaoPublica: {
      designacao: reuniaoPublicaDesig.data || null,
      discurso: reuniaoPublicaDiscurso.data || null,
    },
    limpezaSalao: limpezaSalao.data || null,
  })
}
