import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { SobreContent } from "@/components/sobre/sobre-content"

export const metadata: Metadata = {
  title: "Sobre - Congregação Sabará | Testemunhas de Jeová",
  description: "Conheça a Congregação Sabará das Testemunhas de Jeová. Informações, eventos e anúncios da congregação.",
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

export default async function SobrePage() {
  const anuncios = await getAnuncios()
  
  return <SobreContent anuncios={anuncios} />
}
