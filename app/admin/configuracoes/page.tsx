"use client"

import { useEffect, useState } from "react"
import { Settings, Clock, Calendar, Save, Loader2, Check, Building2, MapPin, Video, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Configuracao {
  id: string
  chave: string
  valor: Record<string, string>
  descricao: string
}

const diasSemana = [
  { value: "domingo", label: "Domingo" },
  { value: "segunda", label: "Segunda-feira" },
  { value: "terca", label: "Terça-feira" },
  { value: "quarta", label: "Quarta-feira" },
  { value: "quinta", label: "Quinta-feira" },
  { value: "sexta", label: "Sexta-feira" },
  { value: "sabado", label: "Sábado" },
]

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  
  // Configurações de reuniões
  const [reuniaoMeioSemana, setReuniaoMeioSemana] = useState({
    dia: "quinta",
    horario: "19:30",
    nome: "Reunião de Meio de Semana"
  })
  const [reuniaoFimSemana, setReuniaoFimSemana] = useState({
    dia: "domingo",
    horario: "09:00",
    nome: "Reunião de Fim de Semana"
  })
  
  // Configurações da congregação
  const [congregacao, setCongregacao] = useState({
    nome: "Congregação Sabará",
    cidade: "Sabará",
    estado: "MG",
    circuito: "",
    numero: ""
  })
  
  // Configurações de horários de campo
  const [horariosCampo, setHorariosCampo] = useState({
    manha: "8:45",
    tarde: "16:45"
  })
  
  // Configurações do Zoom
  const [zoom, setZoom] = useState({
    link: "",
    senha: ""
  })

  useEffect(() => {
    async function carregarConfiguracoes() {
      try {
        const response = await fetch("/api/configuracoes")
        if (response.ok) {
          const data: Configuracao[] = await response.json()
          
          const meioSemana = data.find(c => c.chave === "reuniao_meio_semana")
          const fimSemana = data.find(c => c.chave === "reuniao_fim_semana")
          const congConfig = data.find(c => c.chave === "congregacao")
          const campoConfig = data.find(c => c.chave === "horarios_campo_padrao")
          const zoomConfig = data.find(c => c.chave === "zoom_link")
          
          if (meioSemana?.valor) setReuniaoMeioSemana(meioSemana.valor as typeof reuniaoMeioSemana)
          if (fimSemana?.valor) setReuniaoFimSemana(fimSemana.valor as typeof reuniaoFimSemana)
          if (congConfig?.valor) setCongregacao(congConfig.valor as typeof congregacao)
          if (campoConfig?.valor) setHorariosCampo(campoConfig.valor as typeof horariosCampo)
          if (zoomConfig?.valor) setZoom(zoomConfig.valor as typeof zoom)
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
      } finally {
        setLoading(false)
      }
    }
    
    carregarConfiguracoes()
  }, [])

  async function salvarConfiguracao(chave: string, valor: Record<string, string>) {
    setSaving(chave)
    setSaved(null)
    
    try {
      const response = await fetch("/api/configuracoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chave, valor })
      })
      
      if (response.ok) {
        setSaved(chave)
        setTimeout(() => setSaved(null), 2000)
      }
    } catch (error) {
      console.error("Erro ao salvar configuração:", error)
    } finally {
      setSaving(null)
    }
  }

  function BotaoSalvar({ chave, valor }: { chave: string; valor: Record<string, string> }) {
    return (
      <Button 
        onClick={() => salvarConfiguracao(chave, valor)}
        disabled={saving === chave}
        className="w-full"
      >
        {saving === chave ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : saved === chave ? (
          <Check className="h-4 w-4 mr-2 text-green-500" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        {saved === chave ? "Salvo!" : "Salvar"}
      </Button>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl flex items-center gap-3">
          <Settings className="h-7 w-7 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Configure as informações da congregação, reuniões e serviço de campo
        </p>
      </div>

      <Tabs defaultValue="congregacao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="congregacao" className="gap-2">
            <Building2 className="h-4 w-4 hidden sm:inline" />
            Congregação
          </TabsTrigger>
          <TabsTrigger value="reunioes" className="gap-2">
            <Calendar className="h-4 w-4 hidden sm:inline" />
            Reuniões
          </TabsTrigger>
          <TabsTrigger value="campo" className="gap-2">
            <MapPin className="h-4 w-4 hidden sm:inline" />
            Campo
          </TabsTrigger>
          <TabsTrigger value="zoom" className="gap-2">
            <Video className="h-4 w-4 hidden sm:inline" />
            Zoom
          </TabsTrigger>
        </TabsList>

        {/* Tab Congregação */}
        <TabsContent value="congregacao">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Informações da Congregação
              </CardTitle>
              <CardDescription>
                Configure o nome e localização da congregação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="nome-cong">Nome da Congregação</Label>
                  <Input
                    id="nome-cong"
                    value={congregacao.nome || ""}
                    onChange={(e) => setCongregacao(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Congregação Central"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero-cong">Número da Congregação</Label>
                  <Input
                    id="numero-cong"
                    type="number"
                    value={congregacao.numero || ""}
                    onChange={(e) => setCongregacao(prev => ({ ...prev, numero: e.target.value }))}
                    placeholder="Ex: 12345678"
                    maxLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="circuito">Circuito</Label>
                  <Input
                    id="circuito"
                    value={congregacao.circuito || ""}
                    onChange={(e) => setCongregacao(prev => ({ ...prev, circuito: e.target.value.toUpperCase() }))}
                    placeholder="Ex: SP-45"
                    maxLength={7}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={congregacao.cidade || ""}
                    onChange={(e) => setCongregacao(prev => ({ ...prev, cidade: e.target.value }))}
                    placeholder="Ex: São Paulo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={congregacao.estado || ""}
                    onChange={(e) => setCongregacao(prev => ({ ...prev, estado: e.target.value }))}
                    placeholder="Ex: SP"
                    maxLength={2}
                  />
                </div>
              </div>
              <BotaoSalvar chave="congregacao" valor={congregacao} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Reuniões */}
        <TabsContent value="reunioes">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Reunião de Meio de Semana */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Reunião de Meio de Semana
                </CardTitle>
                <CardDescription>
                  Vida e Ministério Cristão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dia-meio">Dia da Semana</Label>
                  <Select
                    value={reuniaoMeioSemana.dia}
                    onValueChange={(value) => setReuniaoMeioSemana(prev => ({ ...prev, dia: value }))}
                  >
                    <SelectTrigger id="dia-meio">
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {diasSemana.map((dia) => (
                        <SelectItem key={dia.value} value={dia.value}>
                          {dia.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horario-meio">Horário</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="horario-meio"
                      type="time"
                      value={reuniaoMeioSemana.horario}
                      onChange={(e) => setReuniaoMeioSemana(prev => ({ ...prev, horario: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <BotaoSalvar chave="reuniao_meio_semana" valor={reuniaoMeioSemana} />
              </CardContent>
            </Card>

            {/* Reunião de Fim de Semana */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Reunião de Fim de Semana
                </CardTitle>
                <CardDescription>
                  Estudo de A Sentinela
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dia-fim">Dia da Semana</Label>
                  <Select
                    value={reuniaoFimSemana.dia}
                    onValueChange={(value) => setReuniaoFimSemana(prev => ({ ...prev, dia: value }))}
                  >
                    <SelectTrigger id="dia-fim">
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {diasSemana.map((dia) => (
                        <SelectItem key={dia.value} value={dia.value}>
                          {dia.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horario-fim">Horário</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="horario-fim"
                      type="time"
                      value={reuniaoFimSemana.horario}
                      onChange={(e) => setReuniaoFimSemana(prev => ({ ...prev, horario: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <BotaoSalvar chave="reuniao_fim_semana" valor={reuniaoFimSemana} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Serviço de Campo */}
        <TabsContent value="campo">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                Horários Padrão do Serviço de Campo
              </CardTitle>
              <CardDescription>
                Configure os horários padrão para o serviço de campo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="horario-manha">Horário da Manhã</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="horario-manha"
                      value={horariosCampo.manha}
                      onChange={(e) => setHorariosCampo(prev => ({ ...prev, manha: e.target.value }))}
                      className="pl-10"
                      placeholder="8:45"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario-tarde">Horário da Tarde</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="horario-tarde"
                      value={horariosCampo.tarde}
                      onChange={(e) => setHorariosCampo(prev => ({ ...prev, tarde: e.target.value }))}
                      className="pl-10"
                      placeholder="16:45"
                    />
                  </div>
                </div>
              </div>
              <BotaoSalvar chave="horarios_campo_padrao" valor={horariosCampo} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Zoom */}
        <TabsContent value="zoom">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-500" />
                Configurações do Zoom
              </CardTitle>
              <CardDescription>
                Configure o link e senha do Zoom para as reuniões online
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zoom-link">Link da Reunião</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="zoom-link"
                    value={zoom.link}
                    onChange={(e) => setZoom(prev => ({ ...prev, link: e.target.value }))}
                    className="pl-10"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zoom-senha">Senha (opcional)</Label>
                <Input
                  id="zoom-senha"
                  value={zoom.senha}
                  onChange={(e) => setZoom(prev => ({ ...prev, senha: e.target.value }))}
                  placeholder="Senha da reunião"
                />
              </div>
              <BotaoSalvar chave="zoom_link" valor={zoom} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
