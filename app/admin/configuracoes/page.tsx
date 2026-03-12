"use client"

import { useEffect, useState } from "react"
import { Settings, Clock, Calendar, Save, Loader2, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ConfiguracaoReuniao {
  dia: string
  horario: string
  nome: string
}

interface Configuracao {
  id: string
  chave: string
  valor: ConfiguracaoReuniao
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
  const [reuniaoMeioSemana, setReuniaoMeioSemana] = useState<ConfiguracaoReuniao>({
    dia: "quinta",
    horario: "19:30",
    nome: "Reunião de Meio de Semana"
  })
  const [reuniaoFimSemana, setReuniaoFimSemana] = useState<ConfiguracaoReuniao>({
    dia: "domingo",
    horario: "09:00",
    nome: "Reunião de Fim de Semana"
  })

  useEffect(() => {
    async function carregarConfiguracoes() {
      try {
        const response = await fetch("/api/configuracoes")
        if (response.ok) {
          const data: Configuracao[] = await response.json()
          
          const meioSemana = data.find(c => c.chave === "reuniao_meio_semana")
          const fimSemana = data.find(c => c.chave === "reuniao_fim_semana")
          
          if (meioSemana) {
            setReuniaoMeioSemana(meioSemana.valor)
          }
          if (fimSemana) {
            setReuniaoFimSemana(fimSemana.valor)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
      } finally {
        setLoading(false)
      }
    }
    
    carregarConfiguracoes()
  }, [])

  async function salvarConfiguracao(chave: string, valor: ConfiguracaoReuniao) {
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Configure os dias e horários das reuniões
        </p>
      </div>

      {/* Reuniões */}
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
            
            <Button 
              onClick={() => salvarConfiguracao("reuniao_meio_semana", reuniaoMeioSemana)}
              disabled={saving === "reuniao_meio_semana"}
              className="w-full"
            >
              {saving === "reuniao_meio_semana" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : saved === "reuniao_meio_semana" ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saved === "reuniao_meio_semana" ? "Salvo!" : "Salvar"}
            </Button>
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
            
            <Button 
              onClick={() => salvarConfiguracao("reuniao_fim_semana", reuniaoFimSemana)}
              disabled={saving === "reuniao_fim_semana"}
              className="w-full"
            >
              {saving === "reuniao_fim_semana" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : saved === "reuniao_fim_semana" ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saved === "reuniao_fim_semana" ? "Salvo!" : "Salvar"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
