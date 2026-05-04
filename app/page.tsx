import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { SobreContent } from "@/components/sobre/sobre-content"

export const metadata: Metadata = {
  title: "Congregação Pq. Sabará | Quadro de Anúncios",
  description: "Bem-vindo ao quadro de anúncios da Congregação Pq. Sabará — Testemunhas de Jeová, Taubaté SP.",
}

export const revalidate = 60

async function getAnuncios() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("anuncios")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .order("created_at", { ascending: false })
  return data || []
}

async function getProximasReunioes() {
  const supabase = await createClient()
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const hojeStr = hoje.toISOString().slice(0, 10)

  // Próximas 4 datas de reunião (quinta e domingo)
  const datas: string[] = []
  const d = new Date(hoje)
  while (datas.length < 4) {
    const dia = d.getDay()
    if (dia === 4 || dia === 0) {
      datas.push(d.toISOString().slice(0, 10))
    }
    d.setDate(d.getDate() + 1)
  }

  // Buscar equipe técnica dessas datas
  const { data: equipes } = await supabase
    .from("equipe_tecnica")
    .select("data, indicador_1, indicador_2, mic_volante_1, mic_volante_2, audio_video, palco")
    .in("data", datas)
    .gte("data", hojeStr)
    .order("data", { ascending: true })

  return { datas, equipes: equipes || [] }
}

export default async function HomePage() {
  const [anuncios, { datas, equipes }] = await Promise.all([
    getAnuncios(),
    getProximasReunioes(),
  ])

  return <SobreContent anuncios={anuncios} proximasDatas={datas} equipeTecnica={equipes} />
}
