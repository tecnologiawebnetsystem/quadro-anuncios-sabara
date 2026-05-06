'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import {
  Send, Loader2, BookOpen, RefreshCw, ChevronDown,
  MessageSquare, Mic, Copy, Check, ChevronRight,
  MapPin, School, Hospital, Home, ShoppingCart, Briefcase,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ── Constantes ────────────────────────────────────────────────────────────────

const SUGESTOES_CHAT = [
  "O que a Bíblia diz sobre o Reino de Deus?",
  "Como as Testemunhas de Jeová entendem a Trindade?",
  "O que é A Sentinela?",
  "O que a Bíblia ensina sobre a ressurreição?",
  "Como funciona o estudo bíblico?",
  "O que significa o nome de Deus?",
]

const TIPOS_PARTE = [
  { id: 'iniciando',   label: 'Iniciando Conversas',         duracoes: [2, 3],     desc: 'Primeiro contato com uma pessoa' },
  { id: 'aprofundando',label: 'Aprofundando a Conversa',     duracoes: [3, 4],     desc: 'Revisita ou continuação do contato' },
  { id: 'discipulos',  label: 'Fazendo Discípulos',          duracoes: [4, 6],     desc: 'Cena de estudo bíblico' },
  { id: 'discurso',    label: 'Discurso / Parte de Estudante',duracoes: [4, 5, 6, 8, 10], desc: 'Apresentação para a congregação' },
]

const CENARIOS = [
  { id: 'rua',         label: 'Na Rua',          icon: MapPin },
  { id: 'porta',       label: 'De Porta em Porta',icon: Home },
  { id: 'escola',      label: 'Na Escola',        icon: School },
  { id: 'hospital',    label: 'No Hospital',      icon: Hospital },
  { id: 'comercio',    label: 'No Comércio',      icon: ShoppingCart },
  { id: 'trabalho',    label: 'No Trabalho',      icon: Briefcase },
  { id: 'informal',    label: 'Situação Informal', icon: MessageSquare },
]

const PUBLICACOES = [
  'A Sentinela (artigo atual)',
  'Estude a Bíblia Conosco (Lição específica)',
  'Boas Novas Vindas de Deus',
  'Felicidade Duradoura é Possível!',
  'O Que a Bíblia Realmente Ensina?',
  'Examine as Escrituras Diariamente',
  'Deixe Que Deus Seja Verdadeiro',
  'Aplicação livre pelo usuário',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMessageText(msg: { parts?: { type: string; text?: string }[]; content?: string }): string {
  if (msg.parts && Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map(p => p.text)
      .join('')
  }
  return msg.content ?? ''
}

function renderFormattedText(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    // Cabeçalho com ---
    if (line.trim().startsWith('---')) {
      return <hr key={i} className="border-border/40 my-2" />
    }
    // Linhas de PERSONAGEM: em destaque
    const matchPersonagem = line.match(/^\[([^\]]+)\]:\s*(.*)/)
    if (matchPersonagem) {
      return (
        <p key={i} className="my-1">
          <span className="font-bold text-primary text-xs">[{matchPersonagem[1]}]</span>
          <span className="text-foreground"> {matchPersonagem[2]}</span>
        </p>
      )
    }
    // Cabeçalho PARTE / DURAÇÃO / etc
    const matchHeader = line.match(/^(PARTE|DURAÇÃO|TEMA|CENÁRIO|PUBLICAÇÃO|PONTOS DE ATENÇÃO):(.*)/)
    if (matchHeader) {
      return (
        <p key={i} className="my-0.5">
          <span className="font-bold text-amber-400 text-xs uppercase tracking-wide">{matchHeader[1]}:</span>
          <span className="text-foreground text-sm"> {matchHeader[2]}</span>
        </p>
      )
    }
    // Bullets
    if (line.trim().startsWith('•')) {
      return <p key={i} className="ml-3 text-sm text-muted-foreground">{line}</p>
    }
    // Linha vazia
    if (!line.trim()) return <div key={i} className="h-1" />
    // Texto normal
    return <p key={i} className="text-sm leading-relaxed">{line}</p>
  })
}

// ── Componente Criar Partes ───────────────────────────────────────────────────

function CriarPartes() {
  const [tipo, setTipo]             = useState(TIPOS_PARTE[0].id)
  const [duracao, setDuracao]       = useState(2)
  const [cenario, setCenario]       = useState(CENARIOS[0].id)
  const [tema, setTema]             = useState('')
  const [ponto, setPonto]           = useState('')
  const [publicacao, setPublicacao] = useState(PUBLICACOES[0])
  const [pubCustom, setPubCustom]   = useState('')
  const [copied, setCopied]         = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const tipoAtual = TIPOS_PARTE.find(t => t.id === tipo)!

  // Ajusta duração ao mudar tipo
  const handleTipo = (id: string) => {
    setTipo(id)
    const t = TIPOS_PARTE.find(t => t.id === id)!
    setDuracao(t.duracoes[0])
  }

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/partes' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleGerar = () => {
    if (!tema.trim()) return
    const pub = publicacao === 'Aplicação livre pelo usuário' ? pubCustom || 'escolha do publicador' : publicacao
    const cenarioLabel = CENARIOS.find(c => c.id === cenario)?.label ?? cenario

    const prompt = `Crie uma parte do tipo "${tipoAtual.label}" com duração de ${duracao} minutos.

Tema / Assunto: ${tema}
Ponto da lição ou texto bíblico: ${ponto || 'livre'}
Publicação de referência: ${pub}
Cenário: ${cenarioLabel}

Por favor, crie um roteiro completo, com linguagem popular e natural, pronto para ser apresentado na reunião Vida e Ministério.`

    sendMessage({ text: prompt })
  }

  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')
  const lastText = lastAssistant ? getMessageText(lastAssistant as any) : ''

  const handleCopy = () => {
    if (!lastText) return
    navigator.clipboard.writeText(lastText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNova = () => {
    setMessages([])
    setTema('')
    setPonto('')
  }

  return (
    <div className="flex flex-col gap-0 h-full overflow-hidden">

      {/* Painel de configuração */}
      <div className="flex-shrink-0 overflow-y-auto scrollbar-thin p-4 space-y-4 border-b border-border/50 max-h-[55vh]">

        {/* Tipo de parte */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Tipo de Parte
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TIPOS_PARTE.map(t => (
              <button
                key={t.id}
                onClick={() => handleTipo(t.id)}
                className={cn(
                  "flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl border text-left transition-all",
                  tipo === t.id
                    ? "border-primary/50 bg-primary/8 text-foreground"
                    : "border-border bg-card hover:border-border/80 hover:bg-muted/20 text-muted-foreground"
                )}
              >
                <span className={cn("text-sm font-semibold", tipo === t.id ? "text-primary" : "")}>{t.label}</span>
                <span className="text-[11px] opacity-70">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duração */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Duração
          </label>
          <div className="flex flex-wrap gap-2">
            {tipoAtual.duracoes.map(d => (
              <button
                key={d}
                onClick={() => setDuracao(d)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium border transition-all",
                  duracao === d
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                )}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        {/* Cenário */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Cenário
          </label>
          <div className="flex flex-wrap gap-2">
            {CENARIOS.map(c => {
              const Icon = c.icon
              return (
                <button
                  key={c.id}
                  onClick={() => setCenario(c.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    cenario === c.id
                      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                      : "border-border bg-card text-muted-foreground hover:border-cyan-500/30"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tema */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Tema / Assunto da Parte <span className="text-red-400">*</span>
          </label>
          <input
            value={tema}
            onChange={e => setTema(e.target.value)}
            placeholder="Ex: Como encontrar esperança em tempos difíceis"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Ponto da lição */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Ponto da Lição / Versículo Bíblico
          </label>
          <input
            value={ponto}
            onChange={e => setPonto(e.target.value)}
            placeholder="Ex: João 5:28,29 — ressurreição / Lição 5, ponto 3"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Publicação */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Publicação de Referência
          </label>
          <select
            value={publicacao}
            onChange={e => setPublicacao(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
          >
            {PUBLICACOES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {publicacao === 'Aplicação livre pelo usuário' && (
            <input
              value={pubCustom}
              onChange={e => setPubCustom(e.target.value)}
              placeholder="Digite a publicação ou tema específico"
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
            />
          )}
        </div>

        {/* Botão gerar */}
        <button
          onClick={handleGerar}
          disabled={!tema.trim() || isLoading}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all",
            tema.trim() && !isLoading
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {isLoading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando roteiro...</>
            : <><Mic className="h-4 w-4" /> Gerar Roteiro da Parte</>
          }
        </button>
      </div>

      {/* Resultado */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center text-muted-foreground">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/8 border border-primary/15">
              <Mic className="h-6 w-6 text-primary/60" />
            </div>
            <p className="text-sm max-w-xs leading-relaxed">
              Preencha os campos acima e clique em <span className="text-primary font-medium">Gerar Roteiro</span> para criar sua parte
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-left max-w-sm w-full">
              {[
                'Iniciando conversa na rua — 3 min',
                'Estudo bíblico sobre ressurreição',
                'Discurso sobre esperança — 10 min',
                'Revisita no hospital — 4 min',
              ].map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setTema(ex)}
                  className="text-xs px-3 py-2 rounded-lg border border-border bg-card hover:border-primary/30 hover:text-foreground transition-all text-left"
                >
                  <ChevronRight className="h-2.5 w-2.5 inline mr-1 text-primary" />
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mensagens geradas */}
        {messages.map((msg, i) => {
          const text = getMessageText(msg as any)
          if (msg.role === 'user') return null // não exibe a pergunta técnica
          return (
            <div key={msg.id ?? i} className="space-y-2">
              {/* Toolbar do resultado */}
              {text && (
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mic className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Roteiro Gerado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border bg-card hover:border-primary/40 transition-all text-muted-foreground hover:text-foreground"
                    >
                      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                    <button
                      onClick={handleNova}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border bg-card hover:border-border/80 transition-all text-muted-foreground hover:text-foreground"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Nova parte
                    </button>
                  </div>
                </div>
              )}

              {/* Conteúdo formatado */}
              <div className="rounded-2xl border border-border bg-card p-4 space-y-0.5">
                {isLoading && !text
                  ? (
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                    </span>
                  )
                  : renderFormattedText(text)
                }
              </div>
            </div>
          )
        })}

        {status === 'submitted' && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

// ── Componente Chat Geral ─────────────────────────────────────────────────────

function ChatGeral() {
  const [input, setInput]         = useState('')
  const [autoScroll, setAutoScroll] = useState(true)
  const bottomRef   = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (autoScroll) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, autoScroll])

  const handleScroll = () => {
    const el = messagesRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60
    setAutoScroll(atBottom)
  }

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || isLoading) return
    sendMessage({ text: msg })
    setInput('')
    setAutoScroll(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Mensagens */}
      <div
        ref={messagesRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-5"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5 text-center px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold">Pergunte sobre JW.org</h2>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Respostas baseadas na Bíblia e publicações das Testemunhas de Jeová
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-1">
              {SUGESTOES_CHAT.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="text-left text-xs px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground leading-relaxed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const text   = getMessageText(msg as any)
          const isUser = msg.role === 'user'
          return (
            <div key={msg.id} className={cn("flex gap-3 max-w-3xl", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
              <div className={cn(
                "flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold mt-0.5",
                isUser ? "bg-primary text-primary-foreground" : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
              )}>
                {isUser ? "EU" : <BookOpen className="h-3.5 w-3.5" />}
              </div>
              <div className={cn(
                "relative px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[80vw] md:max-w-[540px]",
                isUser
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border text-foreground rounded-tl-sm"
              )}>
                {!isUser && !text && isLoading && (
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                  </span>
                )}
                <p className="whitespace-pre-wrap">{text}</p>
              </div>
            </div>
          )
        })}

        {status === 'submitted' && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/30">
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {!autoScroll && (
        <button
          onClick={() => { setAutoScroll(true); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }}
          className="absolute bottom-24 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border shadow-lg text-muted-foreground hover:text-foreground transition-all z-10"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      )}

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="flex items-end gap-2 max-w-3xl mx-auto rounded-2xl border border-border bg-background px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre a Bíblia ou JW.org..."
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 py-1 max-h-40 scrollbar-thin"
            style={{ height: 'auto' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={cn(
              "flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all",
              input.trim() && !isLoading
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isLoading
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Send className="h-3.5 w-3.5" />
            }
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          Respostas baseadas em <span className="text-primary">JW.org</span>
        </p>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────

type Aba = 'chat' | 'partes'

export default function ChatPage() {
  const [aba, setAba] = useState<Aba>('chat')

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 z-10 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">JW Assistente</p>
              <p className="text-[11px] text-muted-foreground leading-none mt-0.5">Baseado em JW.org</p>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
              title="Nova conversa"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Abas */}
        <div className="flex px-4 gap-1 pb-0">
          {([
            { id: 'chat',   label: 'Perguntas Bíblicas', icon: MessageSquare },
            { id: 'partes', label: 'Criar Partes — Quinta',  icon: Mic },
          ] as { id: Aba; label: string; icon: typeof Mic }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all",
                aba === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Conteúdo ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {aba === 'chat'   && <ChatGeral />}
        {aba === 'partes' && <CriarPartes />}
      </div>

    </div>
  )
}
