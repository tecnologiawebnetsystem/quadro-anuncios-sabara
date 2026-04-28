import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { SobreContent } from "@/components/sobre/sobre-content"

export const metadata: Metadata = {
  title: "Congregação Pq. Sabará | Quadro de Anúncios",
  description: "Bem-vindo ao quadro de anúncios da Congregação Pq. Sabará.",
}

export const revalidate = 60 // Revalidar a cada 60 segundos

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

export default async function HomePage() {
  const anuncios = await getAnuncios()

  return <SobreContent anuncios={anuncios} />
}
