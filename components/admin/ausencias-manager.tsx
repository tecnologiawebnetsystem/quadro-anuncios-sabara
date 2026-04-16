"use client"

import { useState, useEffect } from "react"
import { CalendarOff, Plus, Trash2, User, Calendar, Search, Loader2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { 
  listarAusencias, 
  criarAusencia, 
  excluirAusencia,
  type Ausencia 
} from "@/lib/services/ausencias-service"
import { createClient } from "@/lib/supabase/client"
import { format, parseISO, isAfter } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

interface AusenciasManagerProps {
  className?: string
}

export function AusenciasManager({ className }: AusenciasManagerProps) {
  const [ausencias, setAusencias] = useState<Ausencia[]>([])
  const [publicadores, setPublicadores] = useState<{ id: string; nome: string }[]>([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [filtro, setFiltro] = useState("")
  const [mostrarAtivas, setMostrarAtivas] = useState(true)
  
  // Form
  const [publicadorSelecionado, setPublicadorSelecionado] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [motivo, setMotivo] = useState("")
  
  useEffect(() => {
    carregarDados()
  }, [mostrarAtivas])
  
  async function carregarDados() {
    setCarregando(true)
    try {
      // Carregar ausencias
      const ausenciasData = await listarAusencias({ ativas: mostrarAtivas })
      setAusencias(ausenciasData)
      
      // Carregar publicadores
      const supabase = createClient()
      const { data: pubData } = await supabase
        .from('publicadores')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome')
      
      setPublicadores(pubData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setCarregando(false)
    }
  }
  
  async function handleSalvar() {
    if (!publicadorSelecionado || !dataInicio || !dataFim) {
      toast.error('Preencha todos os campos obrigatorios')
      return
    }
    
    setSalvando(true)
    try {
      const resultado = await criarAusencia({
        publicador_id: publicadorSelecionado,
        data_inicio: dataInicio,
        data_fim: dataFim,
        motivo: motivo || undefined,
        criado_por: 'Administrador'
      })
      
      if (resultado.sucesso) {
        toast.success('Ausencia registrada com sucesso')
        setDialogAberto(false)
        limparForm()
        carregarDados()
      } else {
        toast.error(resultado.erro || 'Erro ao registrar ausencia')
      }
    } catch (error) {
      toast.error('Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }
  
  async function handleExcluir(id: string) {
    if (!confirm('Deseja realmente excluir esta ausencia?')) return
    
    const sucesso = await excluirAusencia(id)
    if (sucesso) {
      toast.success('Ausencia removida')
      setAusencias(prev => prev.filter(a => a.id !== id))
    } else {
      toast.error('Erro ao remover')
    }
  }
  
  function limparForm() {
    setPublicadorSelecionado("")
    setDataInicio("")
    setDataFim("")
    setMotivo("")
  }
  
  const ausenciasFiltradas = ausencias.filter(a =>
    a.publicador_nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    a.motivo?.toLowerCase().includes(filtro.toLowerCase())
  )
  
  const hoje = new Date()
  
  return (
    <Card className={cn("border-zinc-800 bg-zinc-900/50", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarOff className="h-5 w-5 text-amber-500" />
              Ausencias
            </CardTitle>
            <CardDescription>
              Registre ausencias de publicadores para evitar designacoes
            </CardDescription>
          </div>
          
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Ausencia
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle>Registrar Ausencia</DialogTitle>
                <DialogDescription>
                  Informe o periodo em que o publicador estara ausente
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Publicador *</Label>
                  <Select value={publicadorSelecionado} onValueChange={setPublicadorSelecionado}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Selecione um publicador" />
                    </SelectTrigger>
                    <SelectContent>
                      {publicadores.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data Inicio *</Label>
                    <Input
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data Fim *</Label>
                    <Input
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Motivo (opcional)</Label>
                  <Textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ex: Viagem, doenca, etc."
                    className="bg-zinc-800 border-zinc-700"
                    rows={2}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSalvar} disabled={salvando}>
                  {salvando ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Buscar por nome ou motivo..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pl-10 bg-zinc-800/50 border-zinc-700"
            />
          </div>
          <Button
            variant={mostrarAtivas ? "default" : "outline"}
            size="sm"
            onClick={() => setMostrarAtivas(!mostrarAtivas)}
          >
            {mostrarAtivas ? 'Ativas' : 'Todas'}
          </Button>
        </div>
        
        {/* Lista */}
        {carregando ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          </div>
        ) : ausenciasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <CalendarOff className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhuma ausencia registrada</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
            {ausenciasFiltradas.map(ausencia => {
              const ativa = isAfter(parseISO(ausencia.data_fim), hoje)
              
              return (
                <div
                  key={ausencia.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    ativa 
                      ? "border-amber-600/30 bg-amber-600/5" 
                      : "border-zinc-800 bg-zinc-800/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      ativa ? "bg-amber-600/20" : "bg-zinc-700/50"
                    )}>
                      <User className={cn(
                        "h-4 w-4",
                        ativa ? "text-amber-400" : "text-zinc-500"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">
                        {ausencia.publicador_nome}
                      </p>
                      <p className="text-xs text-zinc-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(parseISO(ausencia.data_inicio), "dd/MM", { locale: ptBR })} a{' '}
                        {format(parseISO(ausencia.data_fim), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      {ausencia.motivo && (
                        <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-[200px]">
                          {ausencia.motivo}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {ativa && (
                      <Badge variant="outline" className="text-xs text-amber-400 border-amber-600/30">
                        Ativa
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExcluir(ausencia.id)}
                      className="h-8 w-8 text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
