'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Send, Loader2, BookOpen, RefreshCw, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const SUGESTOES = [
  "O que a Bíblia diz sobre o Reino de Deus?",
  "Como as Testemunhas de Jeová entendem a Trindade?",
  "O que é A Sentinela?",
  "Quando acontece o congresso de circuito?",
  "O que a Bíblia ensina sobre a ressurreição?",
  "Como funciona o estudo bíblico com as Testemunhas de Jeová?",
]

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [autoScroll, setAutoScroll] = useState(true)
  const bottomRef   = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll
  useEffect(() => {
    if (autoScroll) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, autoScroll])

  // Detecta scroll manual para desligar auto-scroll
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

  // Ajusta altura do textarea dinamicamente
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  const getMessageText = (msg: { parts: { type: string; text?: string }[] }) =>
    msg.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map(p => p.text)
      .join('')

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-card/80 backdrop-blur-sm z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <BookOpen className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">JW Assistente</p>
            <p className="text-[11px] text-muted-foreground leading-none mt-0.5">Baseado em JW.org</p>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {/* Badge de status */}
          <div className={cn(
            "flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border font-medium",
            isLoading
              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          )}>
            <span className={cn(
              "h-1.5 w-1.5 rounded-full",
              isLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
            )} />
            {isLoading ? "Respondendo..." : "Online"}
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => window.location.reload()}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
              title="Nova conversa"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* ── Mensagens ──────────────────────────────────────────────────── */}
      <div
        ref={messagesRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-5"
      >
        {/* Tela vazia */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20">
              <BookOpen className="h-9 w-9 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">JW Assistente</h1>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Faça perguntas sobre a Bíblia, publicações e ensinamentos baseados no <span className="text-primary font-medium">JW.org</span>
              </p>
            </div>

            {/* Sugestões */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-2">
              {SUGESTOES.map((s, i) => (
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

        {/* Mensagens */}
        {messages.map((msg) => {
          const text    = getMessageText(msg as any)
          const isUser  = msg.role === 'user'
          const isBot   = msg.role === 'assistant'

          return (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 max-w-3xl",
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold mt-0.5",
                isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
              )}>
                {isUser ? "EU" : <BookOpen className="h-3.5 w-3.5" />}
              </div>

              {/* Balão */}
              <div className={cn(
                "relative px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[80vw] md:max-w-[540px]",
                isUser
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border text-foreground rounded-tl-sm"
              )}>
                {isBot && !text && isLoading && (
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

        {/* Indicador de digitação (quando status === submitted mas sem mensagem ainda) */}
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

      {/* Botão de scroll para baixo */}
      {!autoScroll && (
        <button
          onClick={() => { setAutoScroll(true); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }}
          className="absolute bottom-24 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border shadow-lg text-muted-foreground hover:text-foreground transition-all z-10"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      )}

      {/* ── Input ──────────────────────────────────────────────────────── */}
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
          Respostas baseadas exclusivamente no conteúdo de <span className="text-primary">JW.org</span>
        </p>
      </div>

    </div>
  )
}
