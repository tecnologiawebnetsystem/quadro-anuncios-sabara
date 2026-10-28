"use client"

import { useEffect, useState } from "react"
import { CalendarDays, ClipboardCheck, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Pessoa = { id: string; nome: string }
type Grupo = { id: string; nome: string }
type Visita = { id: string; anciao_id: string; grupo_id: string; data: string; anciao: Pessoa | null; grupo: Grupo | null }

export function VisitasSupServicoManager() {
  const supabase = createClient()
  const [anciaos, setAnciaos] = useState<Pessoa[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [anciaoId, setAnciaoId] = useState("")
  const [grupoId, setGrupoId] = useState("")
  const [data, setData] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  async function carregarDados() {
    setCarregando(true)
    const [{ data: pessoas, error: pessoasError }, { data: gruposData, error: gruposError }, { data: visitasData, error: visitasError }] = await Promise.all([
      supabase.from("publicadores").select("id, nome").eq("anciao", true).eq("ativo", true).order("nome"),
      supabase.from("grupos").select("id, nome").order("nome"),
      supabase.from("visitas_sup_servico").select("id, anciao_id, grupo_id, data, anciao:publicadores!anciao_id(id, nome), grupo:grupos!grupo_id(id, nome)").order("data", { ascending: false }),
    ])

    if (pessoasError || gruposError || visitasError) {
      console.error("[v0] Erro ao carregar visitas sup. serviço", { pessoasError, gruposError, visitasError })
      toast.error("Não foi possível carregar os dados")
    } else {
      setAnciaos(pessoas || [])
      setGrupos(gruposData || [])
      setVisitas(
        ((visitasData || []) as unknown as Visita[]).sort((a, b) => b.data.localeCompare(a.data)),
      )
    }
    setCarregando(false)
  }

  useEffect(() => { carregarDados() }, [])

  async function cadastrar() {
    if (!anciaoId || !grupoId || !data) {
      toast.error("Selecione o ancião, o grupo e a data")
      return
    }
    setSalvando(true)
    const { error } = await supabase.from("visitas_sup_servico").insert({ anciao_id: anciaoId, grupo_id: grupoId, data })
    setSalvando(false)
    if (error) {
      console.error("[v0] Erro ao cadastrar visita sup. serviço", error)
      toast.error(error.code === "23505" ? "Este cadastro já existe" : "Não foi possível cadastrar")
      return
    }
    toast.success("Visita cadastrada com sucesso")
    setAnciaoId("")
    setGrupoId("")
    setData("")
    carregarDados()
  }

  async function excluir(id: string) {
    const { error } = await supabase.from("visitas_sup_servico").delete().eq("id", id)
    if (error) {
      toast.error("Não foi possível excluir o cadastro")
      return
    }
    setVisitas((atual) => atual.filter((item) => item.id !== id))
    toast.success("Cadastro excluído")
  }

  return (
    <main className="min-h-screen bg-background p-6 text-foreground md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Cadastros</p>
          <h1 className="text-3xl font-bold tracking-tight">Vista do Sup. Serviço</h1>
          <p className="mt-2 text-muted-foreground">Cadastre as visitas do supervisor de serviço aos grupos de campo.</p>
        </header>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="size-5 text-primary" />Novo cadastro</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_180px_auto] md:items-end">
            <div className="space-y-2"><Label>Ancião</Label><Select value={anciaoId} onValueChange={setAnciaoId}><SelectTrigger><SelectValue placeholder="Escolha um ancião" /></SelectTrigger><SelectContent>{anciaos.map((item) => <SelectItem key={item.id} value={item.id}>{item.nome}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Grupo de Campo</Label><Select value={grupoId} onValueChange={setGrupoId}><SelectTrigger><SelectValue placeholder="Escolha um grupo" /></SelectTrigger><SelectContent>{grupos.map((item) => <SelectItem key={item.id} value={item.id}>{item.nome}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="data-visita">Data</Label><Input id="data-visita" type="date" value={data} onChange={(event) => setData(event.target.value)} /></div>
            <Button onClick={cadastrar} disabled={salvando}>{salvando ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ClipboardCheck className="mr-2 size-4" />}Cadastrar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="size-5 text-primary" />Cadastros realizados</CardTitle></CardHeader>
          <CardContent>
            {carregando ? <div className="flex justify-center py-10"><Loader2 className="size-6 animate-spin text-primary" /></div> : visitas.length === 0 ? <p className="py-10 text-center text-muted-foreground">Nenhum cadastro realizado.</p> : <div className="overflow-x-auto rounded-lg border border-border/60"><table className="w-full text-sm"><thead><tr className="border-b border-border/70 bg-muted/35 text-left text-muted-foreground"><th className="px-4 py-3 font-semibold">Ancião</th><th className="px-4 py-3 font-semibold">Grupo de Campo</th><th className="px-4 py-3 font-semibold">Data da visita</th><th className="px-4 py-3 text-right font-semibold">Ações</th></tr></thead><tbody>{visitas.map((item, index) => <tr key={item.id} className={`border-b border-border/50 transition-colors hover:bg-muted/25 last:border-0 ${index % 2 === 1 ? "bg-muted/10" : ""}`}><td className="px-4 py-3.5 font-semibold">{item.anciao?.nome || "—"}</td><td className="px-4 py-3.5 text-muted-foreground">{item.grupo?.nome || "—"}</td><td className="px-4 py-3.5"><span className="inline-flex rounded-md bg-primary/10 px-2.5 py-1 font-semibold text-foreground">{new Date(`${item.data}T12:00:00`).toLocaleDateString("pt-BR")}</span></td><td className="px-4 py-2.5 text-right"><Button variant="ghost" size="icon" onClick={() => excluir(item.id)} aria-label={`Excluir visita de ${item.anciao?.nome || "ancião"}`}><Trash2 className="size-4 text-destructive" /></Button></td></tr>)}</tbody></table></div>}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
