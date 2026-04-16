"use client"

import { useEffect, useState } from "react"
import { CenteredLoader } from "@/components/ui/page-loader"
import { Settings, Clock, Calendar, Save, Loader2, Check, Building2, MapPin, Video, Globe, Lock, Eye, EyeOff, ShieldCheck, UserCheck, HardDrive, History, BarChart3, Shield, Upload } from "lucide-react"
import { BackupManager } from "@/components/admin/backup-manager"
import { HistoricoDesignacoesRelatorio } from "@/components/admin/historico-designacoes"
import { RelatoriosAvancados } from "@/components/admin/relatorios-avancados"
import { GestaoPermissoes } from "@/components/admin/gestao-permissoes"
import { ImportarCSV } from "@/components/admin/importar-csv"
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
    nome: "Congregação Pq. Sabará",
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
  
  // Configurações de senhas de acesso
  const [senhaAdmin, setSenhaAdmin] = useState({ atual: "", nova: "", confirmar: "" })
  const [senhaAnciao, setSenhaAnciao] = useState({ atual: "", nova: "", confirmar: "" })
  const [showSenhaAdmin, setShowSenhaAdmin] = useState({ atual: false, nova: false, confirmar: false })
  const [showSenhaAnciao, setShowSenhaAnciao] = useState({ atual: false, nova: false, confirmar: false })
  const [erroSenha, setErroSenha] = useState<string | null>(null)
  const [sucessoSenha, setSucessoSenha] = useState<string | null>(null)

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

  async function alterarSenha(perfil: "administrador" | "anciao") {
    const dados = perfil === "administrador" ? senhaAdmin : senhaAnciao
    const setDados = perfil === "administrador" ? setSenhaAdmin : setSenhaAnciao
    
    setErroSenha(null)
    setSucessoSenha(null)
    
    // Validações
    if (!dados.nova) {
      setErroSenha("Digite a nova senha")
      return
    }
    
    if (!/^\d{6}$/.test(dados.nova)) {
      setErroSenha("A senha deve ter exatamente 6 dígitos numéricos")
      return
    }
    
    if (dados.nova !== dados.confirmar) {
      setErroSenha("As senhas não coincidem")
      return
    }
    
    setSaving(`senha_${perfil}`)
    
    try {
      const response = await fetch("/api/senhas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          perfil,
          novaSenha: dados.nova,
          senhaAtual: dados.atual || undefined
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        setErroSenha(result.error || "Erro ao alterar senha")
        return
      }
      
      setSucessoSenha(`Senha do ${perfil === "administrador" ? "Administrador" : "Ancião"} alterada com sucesso!`)
      setDados({ atual: "", nova: "", confirmar: "" })
      setTimeout(() => setSucessoSenha(null), 3000)
    } catch {
      setErroSenha("Erro ao conectar com o servidor")
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

  if (loading) return <CenteredLoader />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl flex items-center gap-3">
          <Settings className="h-7 w-7 text-primary" />
          Configura��ões
        </h1>
        <p className="text-muted-foreground">
          Configure as informações da congregação, reuniões e serviço de campo
        </p>
      </div>

      <Tabs defaultValue="congregacao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 lg:w-auto">
          <TabsTrigger value="congregacao" className="gap-2">
            <Building2 className="h-4 w-4 hidden sm:inline" />
            <span className="hidden sm:inline">Congregação</span>
            <span className="sm:hidden">Cong.</span>
          </TabsTrigger>
          <TabsTrigger value="reunioes" className="gap-2">
            <Calendar className="h-4 w-4 hidden sm:inline" />
            <span className="hidden sm:inline">Reuniões</span>
            <span className="sm:hidden">Reun.</span>
          </TabsTrigger>
          <TabsTrigger value="campo" className="gap-2">
            <MapPin className="h-4 w-4 hidden sm:inline" />
            Campo
          </TabsTrigger>
          <TabsTrigger value="zoom" className="gap-2">
            <Video className="h-4 w-4 hidden sm:inline" />
            Zoom
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="gap-2">
            <Lock className="h-4 w-4 hidden sm:inline" />
            <span className="hidden sm:inline">Segurança</span>
            <span className="sm:hidden">Seg.</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2">
            <HardDrive className="h-4 w-4 hidden sm:inline" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="historico" className="gap-2">
            <History className="h-4 w-4 hidden sm:inline" />
            <span className="hidden sm:inline">Histórico</span>
            <span className="sm:hidden">Hist.</span>
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="gap-2">
            <BarChart3 className="h-4 w-4 hidden sm:inline" />
            <span className="hidden sm:inline">Relatórios</span>
            <span className="sm:hidden">Rel.</span>
          </TabsTrigger>
          <TabsTrigger value="permissoes" className="gap-2">
            <Shield className="h-4 w-4 hidden sm:inline" />
            <span className="hidden sm:inline">Permissões</span>
            <span className="sm:hidden">Perm.</span>
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

        {/* Tab Segurança */}
        <TabsContent value="seguranca">
          <div className="space-y-6">
            {/* Mensagens de feedback */}
            {erroSenha && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                {erroSenha}
              </div>
            )}
            {sucessoSenha && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 rounded-lg text-sm">
                {sucessoSenha}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Senha do Administrador */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-red-500" />
                    Senha do Administrador
                  </CardTitle>
                  <CardDescription>
                    Altere a senha de acesso do perfil Administrador
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha-admin-atual">Senha Atual (opcional)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="senha-admin-atual"
                        type={showSenhaAdmin.atual ? "text" : "password"}
                        value={senhaAdmin.atual}
                        onChange={(e) => setSenhaAdmin(prev => ({ ...prev, atual: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        className="pl-10 pr-10"
                        placeholder="******"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenhaAdmin(prev => ({ ...prev, atual: !prev.atual }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSenhaAdmin.atual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha-admin-nova">Nova Senha (6 dígitos)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="senha-admin-nova"
                        type={showSenhaAdmin.nova ? "text" : "password"}
                        value={senhaAdmin.nova}
                        onChange={(e) => setSenhaAdmin(prev => ({ ...prev, nova: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        className="pl-10 pr-10"
                        placeholder="******"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenhaAdmin(prev => ({ ...prev, nova: !prev.nova }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSenhaAdmin.nova ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha-admin-confirmar">Confirmar Nova Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="senha-admin-confirmar"
                        type={showSenhaAdmin.confirmar ? "text" : "password"}
                        value={senhaAdmin.confirmar}
                        onChange={(e) => setSenhaAdmin(prev => ({ ...prev, confirmar: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        className="pl-10 pr-10"
                        placeholder="******"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenhaAdmin(prev => ({ ...prev, confirmar: !prev.confirmar }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSenhaAdmin.confirmar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    onClick={() => alterarSenha("administrador")}
                    disabled={saving === "senha_administrador"}
                    className="w-full"
                  >
                    {saving === "senha_administrador" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Alterar Senha
                  </Button>
                </CardContent>
              </Card>

              {/* Senha do Ancião */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-amber-500" />
                    Senha do Ancião
                  </CardTitle>
                  <CardDescription>
                    Altere a senha de acesso do perfil Ancião
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha-anciao-atual">Senha Atual (opcional)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="senha-anciao-atual"
                        type={showSenhaAnciao.atual ? "text" : "password"}
                        value={senhaAnciao.atual}
                        onChange={(e) => setSenhaAnciao(prev => ({ ...prev, atual: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        className="pl-10 pr-10"
                        placeholder="******"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenhaAnciao(prev => ({ ...prev, atual: !prev.atual }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSenhaAnciao.atual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha-anciao-nova">Nova Senha (6 dígitos)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="senha-anciao-nova"
                        type={showSenhaAnciao.nova ? "text" : "password"}
                        value={senhaAnciao.nova}
                        onChange={(e) => setSenhaAnciao(prev => ({ ...prev, nova: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        className="pl-10 pr-10"
                        placeholder="******"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenhaAnciao(prev => ({ ...prev, nova: !prev.nova }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSenhaAnciao.nova ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha-anciao-confirmar">Confirmar Nova Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="senha-anciao-confirmar"
                        type={showSenhaAnciao.confirmar ? "text" : "password"}
                        value={senhaAnciao.confirmar}
                        onChange={(e) => setSenhaAnciao(prev => ({ ...prev, confirmar: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        className="pl-10 pr-10"
                        placeholder="******"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSenhaAnciao(prev => ({ ...prev, confirmar: !prev.confirmar }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSenhaAnciao.confirmar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    onClick={() => alterarSenha("anciao")}
                    disabled={saving === "senha_anciao"}
                    className="w-full"
                  >
                    {saving === "senha_anciao" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Alterar Senha
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Informações adicionais */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Lock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Dicas de Segurança</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>As senhas devem ter exatamente 6 dígitos numéricos</li>
                      <li>Evite usar sequências óbvias como 123456 ou 000000</li>
                      <li>Altere as senhas periodicamente para maior segurança</li>
                      <li>Não compartilhe as senhas com pessoas não autorizadas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Backup */}
        <TabsContent value="backup">
          <BackupManager />
        </TabsContent>

        {/* Tab Histórico */}
        <TabsContent value="historico">
          <HistoricoDesignacoesRelatorio />
        </TabsContent>

        {/* Tab Relatórios */}
        <TabsContent value="relatorios">
          <RelatoriosAvancados />
        </TabsContent>

        {/* Tab Permissões */}
        <TabsContent value="permissoes">
          <GestaoPermissoes />
        </TabsContent>

      </Tabs>
    </div>
  )
}
