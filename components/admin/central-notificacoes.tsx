"use client"

import { useState } from "react"
import { Bell, Brain, Calendar, Loader2, Mail, MessageSquare, RefreshCw, Send, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ResumoSemanal {
  titulo: string
  saudacao: string
  destaques: string[]
  lembretes: string[]
  encorajamento: string
  semana: string
  dados: {
    reunioes: number
    limpeza: string
    proximoDiscurso: string
  }
}

interface Lembrete {
  participante: string
  parte: string
  data: string
  mensagem: string
}

export function CentralNotificacoes() {
  const [carregando, setCarregando] = useState(false)
  const [resumoSemanal, setResumoSemanal] = useState<ResumoSemanal | null>(null)
  const [lembretes, setLembretes] = useState<Lembrete[]>([])
  const [enviando, setEnviando] = useState(false)

  async function gerarResumoSemanal() {
    setCarregando(true)
    try {
      const response = await fetch("/api/ia/notificacoes?tipo=resumo_semanal")
      if (response.ok) {
        const data = await response.json()
        setResumoSemanal(data)
        toast.success("Resumo semanal gerado!")
      }
    } catch (error) {
      console.error("Erro ao gerar resumo:", error)
      toast.error("Erro ao gerar resumo")
    } finally {
      setCarregando(false)
    }
  }

  async function buscarLembretes() {
    setCarregando(true)
    try {
      const response = await fetch("/api/ia/notificacoes?tipo=lembretes_designacoes")
      if (response.ok) {
        const data = await response.json()
        setLembretes(data.lembretes || [])
        toast.success(`${data.total} lembretes encontrados!`)
      }
    } catch (error) {
      console.error("Erro ao buscar lembretes:", error)
      toast.error("Erro ao buscar lembretes")
    } finally {
      setCarregando(false)
    }
  }

  async function enviarNotificacao(tipo: string, mensagem: string) {
    setEnviando(true)
    try {
      // Simulação de envio
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Notificacao preparada para envio!")
    } catch (error) {
      toast.error("Erro ao enviar notificacao")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
            <Bell className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Central de Notificacoes</h2>
            <p className="text-sm text-muted-foreground">
              Gere resumos e lembretes automaticos com IA
            </p>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/70 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-600/20 p-3">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Resumo Semanal</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Gere um resumo completo da semana com todas as informacoes importantes
                </p>
                <Button
                  onClick={gerarResumoSemanal}
                  disabled={carregando}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  {carregando ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  Gerar Resumo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/70 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-amber-600/20 p-3">
                <Users className="h-6 w-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Lembretes de Designacoes</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Busque todos os lembretes para os designados da proxima semana
                </p>
                <Button
                  onClick={buscarLembretes}
                  disabled={carregando}
                  className="mt-4 bg-amber-600 hover:bg-amber-700"
                  size="sm"
                >
                  {carregando ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  Buscar Lembretes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Semanal Gerado */}
      {resumoSemanal && (
        <Card className="border-zinc-800 bg-gradient-to-br from-blue-600/10 to-cyan-600/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-blue-400" />
                {resumoSemanal.titulo}
              </CardTitle>
              <Badge variant="outline" className="border-blue-600/50 text-blue-400">
                {resumoSemanal.semana}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-300">{resumoSemanal.saudacao}</p>

            {/* Destaques */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-400">Destaques da Semana:</p>
              <ul className="space-y-1">
                {resumoSemanal.destaques.map((destaque, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-blue-400 mt-1">•</span>
                    {destaque}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lembretes */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-400">Lembretes:</p>
              <ul className="space-y-1">
                {resumoSemanal.lembretes.map((lembrete, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-amber-400 mt-1">•</span>
                    {lembrete}
                  </li>
                ))}
              </ul>
            </div>

            {/* Encorajamento */}
            <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/20">
              <p className="text-sm text-green-300 italic">{resumoSemanal.encorajamento}</p>
            </div>

            {/* Botão de Compartilhar */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const texto = `${resumoSemanal.titulo}\n\n${resumoSemanal.saudacao}\n\nDestaques:\n${resumoSemanal.destaques.map(d => `• ${d}`).join("\n")}\n\nLembretes:\n${resumoSemanal.lembretes.map(l => `• ${l}`).join("\n")}\n\n${resumoSemanal.encorajamento}`
                  navigator.clipboard.writeText(texto)
                  toast.success("Resumo copiado para a area de transferencia!")
                }}
                className="border-zinc-700"
              >
                <Mail className="h-4 w-4 mr-2" />
                Copiar para Compartilhar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Lembretes */}
      {lembretes.length > 0 && (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-amber-400" />
                Lembretes para Designados
              </CardTitle>
              <Badge variant="outline" className="border-amber-600/50 text-amber-400">
                {lembretes.length} lembretes
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lembretes.map((lembrete, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{lembrete.participante}</p>
                    <p className="text-sm text-zinc-400">{lembrete.parte}</p>
                    <p className="text-xs text-zinc-500 mt-1">{lembrete.mensagem}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(lembrete.mensagem)
                      toast.success("Mensagem copiada!")
                    }}
                    className="text-amber-400 hover:text-amber-300"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
