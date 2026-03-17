import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from "date-fns"

export async function POST(request: Request) {
  try {
    const { tipo, mes } = await request.json()
    const supabase = await createClient()

    if (tipo === "limpeza") {
      // Gerar escala de limpeza
      const { data: grupos } = await supabase
        .from("grupos")
        .select("id, nome")
        .order("nome")

      if (!grupos || grupos.length === 0) {
        return Response.json({ erro: "Nenhum grupo cadastrado" }, { status: 400 })
      }

      // Buscar histórico de limpeza dos últimos 3 meses
      const { data: historico } = await supabase
        .from("limpeza_salao")
        .select("grupo_id, grupo_nome")
        .not("grupo_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(20)

      // Contar vezes que cada grupo fez limpeza
      const contagem: Record<string, number> = {}
      historico?.forEach(h => {
        if (h.grupo_id) {
          contagem[h.grupo_id] = (contagem[h.grupo_id] || 0) + 1
        }
      })

      // Calcular semanas do mês
      const [ano, mesNum] = mes.split("-").map(Number)
      const dataInicio = startOfMonth(new Date(ano, mesNum - 1))
      const dataFim = endOfMonth(new Date(ano, mesNum - 1))
      
      const semanas: { numero: number; inicio: Date; fim: Date }[] = []
      let dataAtual = startOfWeek(dataInicio, { weekStartsOn: 0 })
      let numeroSemana = 1

      while (dataAtual <= dataFim) {
        const inicioSemana = dataAtual
        const fimSemana = endOfWeek(dataAtual, { weekStartsOn: 0 })
        
        if (fimSemana >= dataInicio && inicioSemana <= dataFim) {
          semanas.push({ numero: numeroSemana, inicio: inicioSemana, fim: fimSemana })
          numeroSemana++
        }
        dataAtual = addDays(fimSemana, 1)
      }

      // Distribuir grupos equilibradamente
      const gruposOrdenados = [...grupos].sort((a, b) => 
        (contagem[a.id] || 0) - (contagem[b.id] || 0)
      )

      const escala = semanas.map((semana, index) => {
        const grupo = gruposOrdenados[index % gruposOrdenados.length]
        return {
          semana: semana.numero,
          data_inicio: format(semana.inicio, "yyyy-MM-dd"),
          data_fim: format(semana.fim, "yyyy-MM-dd"),
          grupo_id: grupo.id,
          grupo_nome: grupo.nome
        }
      })

      return Response.json({ escala, tipo: "limpeza" })

    } else if (tipo === "equipe_tecnica") {
      // Gerar escala de equipe técnica
      const { data: publicadores } = await supabase
        .from("publicadores")
        .select("id, nome, anciao, servo_ministerial")
        .eq("ativo", true)
        .order("nome")

      if (!publicadores || publicadores.length === 0) {
        return Response.json({ erro: "Nenhum publicador cadastrado" }, { status: 400 })
      }

      // Buscar histórico de equipe técnica
      const { data: historico } = await supabase
        .from("equipe_tecnica")
        .select("indicador1_id, indicador2_id, microvolante1_id, microvolante2_id, som_id")
        .order("created_at", { ascending: false })
        .limit(20)

      // Contar participações
      const contagem: Record<string, number> = {}
      historico?.forEach(h => {
        [h.indicador1_id, h.indicador2_id, h.microvolante1_id, h.microvolante2_id, h.som_id].forEach(id => {
          if (id) contagem[id] = (contagem[id] || 0) + 1
        })
      })

      // Gerar reuniões do mês
      const [ano, mesNum] = mes.split("-").map(Number)
      const reunioes: { data: string; dia_semana: "quinta" | "domingo" }[] = []
      const primeiroDia = new Date(ano, mesNum - 1, 1)
      const ultimoDia = new Date(ano, mesNum, 0)

      for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        const data = new Date(ano, mesNum - 1, dia)
        const diaSemana = data.getDay()
        if (diaSemana === 4) reunioes.push({ data: format(data, "yyyy-MM-dd"), dia_semana: "quinta" })
        if (diaSemana === 0) reunioes.push({ data: format(data, "yyyy-MM-dd"), dia_semana: "domingo" })
      }

      // Usar IA para distribuir de forma inteligente
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        system: `Voce distribui publicadores para equipe tecnica de reunioes.
Funcoes: indicador1, indicador2, microvolante1, microvolante2, som
Regras:
1. Nao repetir a mesma pessoa na mesma reuniao
2. Priorizar quem participou menos
3. Alternar entre reunioes

Responda APENAS com JSON:
{ "escala": [{ "data": "yyyy-MM-dd", "dia_semana": "quinta|domingo", "indicador1_id": "id", "indicador1_nome": "nome", ... }] }`,
        prompt: `Reunioes: ${JSON.stringify(reunioes)}
Publicadores: ${JSON.stringify(publicadores.map(p => ({ id: p.id, nome: p.nome, participacoes: contagem[p.id] || 0 })))}`
      })

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const resultado = JSON.parse(jsonMatch[0])
        return Response.json({ ...resultado, tipo: "equipe_tecnica" })
      }

      // Fallback simples
      const escala = reunioes.map((reuniao, index) => {
        const offset = index * 5
        return {
          ...reuniao,
          indicador1_id: publicadores[offset % publicadores.length]?.id,
          indicador1_nome: publicadores[offset % publicadores.length]?.nome,
          indicador2_id: publicadores[(offset + 1) % publicadores.length]?.id,
          indicador2_nome: publicadores[(offset + 1) % publicadores.length]?.nome,
          microvolante1_id: publicadores[(offset + 2) % publicadores.length]?.id,
          microvolante1_nome: publicadores[(offset + 2) % publicadores.length]?.nome,
          microvolante2_id: publicadores[(offset + 3) % publicadores.length]?.id,
          microvolante2_nome: publicadores[(offset + 3) % publicadores.length]?.nome,
          som_id: publicadores[(offset + 4) % publicadores.length]?.id,
          som_nome: publicadores[(offset + 4) % publicadores.length]?.nome,
        }
      })

      return Response.json({ escala, tipo: "equipe_tecnica" })
    }

    return Response.json({ erro: "Tipo de escala invalido" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao gerar escala:", error)
    return Response.json({ erro: "Erro ao gerar escala" }, { status: 500 })
  }
}
