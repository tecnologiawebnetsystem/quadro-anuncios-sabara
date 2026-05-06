'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import {
  Send, Loader2, BookOpen, RefreshCw, ChevronDown,
  MessageSquare, Mic, Copy, Check, ChevronRight,
  MapPin, School, Hospital, Home, ShoppingCart, Briefcase,
  DoorOpen, Book, Lightbulb, Printer, Share2,
  AlertCircle, BookMarked, Search, Users, Heart,
  Scroll, Globe, Star, Music,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ── Paleta de personagens ─────────────────────────────────────────────────────

const PERSONAGEM_CORES = [
  { bg: 'bg-blue-500/12',    border: 'border-blue-500/25',    text: 'text-blue-300',    badge: 'bg-blue-600/20 text-blue-300 border border-blue-500/30'    },
  { bg: 'bg-amber-500/12',   border: 'border-amber-500/25',   text: 'text-amber-300',   badge: 'bg-amber-600/20 text-amber-300 border border-amber-500/30'   },
  { bg: 'bg-emerald-500/12', border: 'border-emerald-500/25', text: 'text-emerald-300', badge: 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'},
  { bg: 'bg-rose-500/12',    border: 'border-rose-500/25',    text: 'text-rose-300',    badge: 'bg-rose-600/20 text-rose-300 border border-rose-500/30'    },
  { bg: 'bg-violet-500/12',  border: 'border-violet-500/25',  text: 'text-violet-300',  badge: 'bg-violet-600/20 text-violet-300 border border-violet-500/30' },
  { bg: 'bg-cyan-500/12',    border: 'border-cyan-500/25',    text: 'text-cyan-300',    badge: 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'    },
]

// ── Dados ─────────────────────────────────────────────────────────────────────

const CATEGORIAS_CHAT = [
  {
    icon: BookMarked, label: 'Bíblia', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20',
    perguntas: [
      'O que a Bíblia diz sobre o Reino de Deus?',
      'O que a Bíblia ensina sobre a ressurreição?',
      'O que significa o nome de Deus, Jeová?',
    ],
  },
  {
    icon: Scroll, label: 'Publicações', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20',
    perguntas: [
      'O que é A Sentinela?',
      'Como funciona o livro "Que Ensina a Bíblia?"',
      'Onde encontrar o Examine as Escrituras Diariamente?',
    ],
  },
  {
    icon: Users, label: 'Organização', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20',
    perguntas: [
      'Como funciona a reunião Vida e Ministério?',
      'O que é uma assembleia regional?',
      'Como é organizada a congregação?',
    ],
  },
  {
    icon: Music, label: 'Cânticos', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20',
    perguntas: [
      'Quais são os cânticos do Reino mais usados nas reuniões?',
      'O que significa o cântico "Ó Jeová, és meu Deus e Rei"?',
      'Onde encontrar a letra dos cânticos no JW.org?',
    ],
  },
]

const TIPOS_PARTE = [
  { id: 'iniciando',    label: 'Iniciando Conversas',           duracoes: [2, 3],            desc: 'Primeiro contato com pessoa' },
  { id: 'aprofundando', label: 'Aprofundando',                  duracoes: [3, 4],            desc: 'Revisita ou continuação'     },
  { id: 'discipulos',   label: 'Fazendo Discípulos',            duracoes: [4, 6],            desc: 'Estudo bíblico'              },
  { id: 'discurso',     label: 'Discurso',                      duracoes: [4, 5, 6, 8, 10],  desc: 'Para a congregação'          },
]

const CENARIOS = [
  { id: 'rua',      label: 'Na Rua',            icon: MapPin        },
  { id: 'porta',    label: 'Porta em Porta',     icon: Home          },
  { id: 'escola',   label: 'Na Escola',          icon: School        },
  { id: 'hospital', label: 'No Hospital',        icon: Hospital      },
  { id: 'comercio', label: 'No Comércio',        icon: ShoppingCart  },
  { id: 'trabalho', label: 'No Trabalho',        icon: Briefcase     },
  { id: 'informal', label: 'Informal',           icon: MessageSquare },
]

const PUBLICACOES = [
  'A Sentinela (artigo atual)',
  'Que Ensina a Bíblia? (lição específica)',
  'Boas Novas Vindas de Deus!',
  'Felicidade Duradoura é Possível!',
  'Estude a Bíblia Conosco',
  'Examine as Escrituras Diariamente',
  'A Bíblia — A Palavra de Deus ou dos Homens?',
  'Livre (descreva abaixo)',
]

const EXEMPLOS_MORADOR = [
  { q: 'Por que Deus permite o sofrimento?',         icon: Heart    },
  { q: 'Os mortos vão para o céu ou para o inferno?', icon: BookOpen },
  { q: 'Por que vocês não celebram o Natal?',         icon: Star     },
  { q: 'Quem é Jesus para vocês?',                    icon: Scroll   },
  { q: 'O que acontece depois da morte?',             icon: BookMarked },
  { q: 'Por que só 144 mil vão para o céu?',          icon: Globe    },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMessageText(msg: { parts?: { type: string; text?: string }[]; content?: string }): string {
  if (msg.parts && Array.isArray(msg.parts)) {
    return msg.parts.filter((p): p is { type: 'text'; text: string } => p.type === 'text').map(p => p.text).join('')
  }
  return msg.content ?? ''
}

function buildPersonagemMap(text: string): Record<string, number> {
  const map: Record<string, number> = {}
  let idx = 0
  for (const m of text.matchAll(/^\[([^\]]+)\]:/gm)) {
    const nome = m[1].trim()
    if (!(nome in map)) { map[nome] = idx % PERSONAGEM_CORES.length; idx++ }
  }
  return map
}

// Verifica se a resposta é uma mensagem de bloqueio
function isBloqueado(text: string): boolean {
  return text.startsWith('⛔')
}

// Renderiza texto do chat geral com formatação markdown leve
function renderChatText(text: string) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />
    // Linha de versículo (contém " — " com texto entre aspas)
    if (line.match(/\w+\s+\d+:\d+.*—.*"/)) {
      return (
        <p key={i} className="text-sm leading-relaxed pl-3 border-l-2 border-amber-500/40 text-amber-200/90 my-1 italic">
          {line}
        </p>
      )
    }
    // Linha com 📖 Fonte
    if (line.startsWith('📖')) {
      return (
        <p key={i} className="text-xs text-blue-400/80 mt-3 pt-2 border-t border-border/30 flex items-center gap-1">
          {line}
        </p>
      )
    }
    // Bullet
    if (line.match(/^[•\-\*]\s/)) {
      return <p key={i} className="text-sm leading-relaxed ml-3 text-foreground/90">{line}</p>
    }
    // Cabeçalho com **
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="text-sm font-bold text-foreground mt-2">{line.replace(/\*\*/g, '')}</p>
    }
    return <p key={i} className="text-sm leading-relaxed text-foreground/95">{line}</p>
  })
}

// Renderiza roteiro com personagens coloridos
function renderRoteiro(text: string) {
  const map = buildPersonagemMap(text)
  return text.split('\n').map((line, i) => {
    if (line.trim() === '---') return <hr key={i} className="border-border/30 my-3" />

    const mP = line.match(/^\[([^\]]+)\]:\s*(.*)/)
    if (mP) {
      const nome  = mP[1].trim()
      const fala  = mP[2]
      const ci    = map[nome] ?? 0
      const cores = PERSONAGEM_CORES[ci]
      return (
        <div key={i} className={cn('flex gap-2.5 items-start my-2 rounded-xl px-3 py-2.5 border', cores.bg, cores.border)}>
          <span className={cn('flex-shrink-0 text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-1 mt-0.5 whitespace-nowrap', cores.badge)}>
            {nome}
          </span>
          <p className="text-sm leading-relaxed text-foreground flex-1">{fala}</p>
        </div>
      )
    }

    const mH = line.match(/^(PARTE|DURAÇÃO ESTIMADA|DURAÇÃO|TEMA|CENÁRIO|PUBLICAÇÃO|PONTOS DE ATENÇÃO):\s*(.*)/)
    if (mH) {
      return (
        <div key={i} className="flex flex-wrap items-baseline gap-1.5 mt-4 mb-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">{mH[1]}:</span>
          <span className="text-sm font-semibold text-foreground">{mH[2]}</span>
        </div>
      )
    }

    if (line.match(/^\[?NARRADOR\]?:?/i)) {
      const fala = line.replace(/^\[?NARRADOR\]?:?\s*/i, '')
      return (
        <p key={i} className="text-xs italic text-muted-foreground my-2 pl-3 border-l-2 border-border/50">
          <span className="font-semibold not-italic text-muted-foreground/60 mr-1.5 text-[10px] uppercase tracking-wider">Cena:</span>{fala}
        </p>
      )
    }

    if (line.match(/^[•\-]\s/)) {
      return <p key={i} className="text-sm text-muted-foreground ml-4 leading-relaxed my-0.5">{line}</p>
    }

    if (!line.trim()) return <div key={i} className="h-1" />
    return <p key={i} className="text-sm leading-relaxed text-foreground">{line}</p>
  })
}

// Renderiza resposta do campo com seções coloridas
function renderRespostaCampo(text: string) {
  const SECOES: Record<string, { color: string; bg: string; border: string }> = {
    'RESPOSTA PARA O MORADOR': { color: 'text-emerald-300', bg: 'bg-emerald-500/8 border-emerald-500/20', border: 'border-l-emerald-500' },
    'VERSÍCULO PRINCIPAL':     { color: 'text-amber-300',   bg: 'bg-amber-500/8 border-amber-500/20',    border: 'border-l-amber-500'   },
    'VERSÍCULO DE APOIO':      { color: 'text-amber-300/70',bg: 'bg-amber-500/5 border-amber-500/15',    border: 'border-l-amber-400/50'},
    'PUBLICAÇÃO SUGERIDA':     { color: 'text-blue-300',    bg: 'bg-blue-500/8 border-blue-500/20',      border: 'border-l-blue-500'    },
    'DICA PARA O PUBLICADOR':  { color: 'text-cyan-300',    bg: 'bg-cyan-500/8 border-cyan-500/20',      border: 'border-l-cyan-500'    },
  }

  const lines = text.split('\n')
  const sections: { key: string; content: string[] }[] = []
  let current: { key: string; content: string[] } | null = null

  for (const line of lines) {
    const matchKey = Object.keys(SECOES).find(k => line.startsWith(k + ':'))
    if (matchKey) {
      if (current) sections.push(current)
      current = { key: matchKey, content: [line.replace(matchKey + ':', '').trim()] }
    } else if (current) {
      current.content.push(line)
    }
  }
  if (current) sections.push(current)

  if (sections.length === 0) {
    return <p className="text-sm leading-relaxed text-foreground">{text}</p>
  }

  return sections.map((sec, i) => {
    const style = SECOES[sec.key]
    const body  = sec.content.filter(l => l.trim()).join('\n')
    return (
      <div key={i} className={cn('rounded-lg border border-l-4 px-3 py-2.5 mb-2', style.bg, style.border)}>
        <p className={cn('text-[10px] font-bold uppercase tracking-widest mb-1', style.color)}>{sec.key}</p>
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{body}</p>
      </div>
    )
  })
}

// ── Barra de Ações ────────────────────────────────────────────────────────────

function renderParaPDF(text: string): string {
  const map: Record<string, number> = {}
  let idx = 0
  for (const m of Array.from(text.matchAll(/^\[([^\]]+)\]:/gm))) {
    const n = m[1].trim(); if (!(n in map)) { map[n] = idx % 6; idx++ }
  }
  return text.split('\n').map(line => {
    if (line.trim() === '---') return '<hr/>'
    const mp = line.match(/^\[([^\]]+)\]:\s*(.*)/)
    if (mp) { const ci = map[mp[1].trim()] ?? 0; return `<div class="personagem p${ci}"><span class="badge b${ci}">${mp[1]}</span><span>${mp[2]}</span></div>` }
    const mh = line.match(/^(PARTE|DURAÇÃO ESTIMADA|TEMA|CENÁRIO|PUBLICAÇÃO|PONTOS DE ATENÇÃO):(.*)/)
    if (mh) return `<div class="header">${mh[1]}:</div><span style="font-size:14px">${mh[2]}</span>`
    if (line.match(/^\[?NARRADOR\]?:?/i)) return `<div class="narrador"><em>Cena:</em> ${line.replace(/^\[?NARRADOR\]?:?\s*/i,'')}</div>`
    if (line.startsWith('•') || line.startsWith('-')) return `<p class="bullet">${line}</p>`
    if (!line.trim()) return '<div style="height:6px"/>'
    return `<p>${line}</p>`
  }).join('')
}

function BarraAcoes({ texto, titulo }: { texto: string; titulo: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopiar = () => {
    navigator.clipboard.writeText(texto)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleImprimir = () => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/><title>${titulo}</title>
    <style>
      body{font-family:Arial,sans-serif;max-width:680px;margin:36px auto;padding:0 20px;color:#111;line-height:1.65}
      h1{font-size:17px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:8px;margin-bottom:20px}
      .personagem{display:flex;gap:10px;align-items:flex-start;margin:8px 0;padding:10px 12px;border-radius:8px;border-left:4px solid}
      .badge{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 6px;border-radius:4px;white-space:nowrap;margin-top:3px}
      .p0{border-color:#3b82f6;background:#eff6ff}.b0{background:#dbeafe;color:#1d4ed8}
      .p1{border-color:#f59e0b;background:#fffbeb}.b1{background:#fef3c7;color:#b45309}
      .p2{border-color:#10b981;background:#f0fdf4}.b2{background:#d1fae5;color:#065f46}
      .p3{border-color:#f43f5e;background:#fff1f2}.b3{background:#ffe4e6;color:#be123c}
      .p4{border-color:#8b5cf6;background:#f5f3ff}.b4{background:#ede9fe;color:#5b21b6}
      .p5{border-color:#06b6d4;background:#ecfeff}.b5{background:#cffafe;color:#0e7490}
      .header{color:#b45309;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-top:14px}
      .narrador{font-style:italic;color:#6b7280;font-size:13px;border-left:2px solid #d1d5db;padding-left:10px;margin:6px 0}
      .bullet{color:#374151;margin-left:16px;font-size:13px}
      hr{border:none;border-top:1px solid #e5e7eb;margin:12px 0}
      .footer{margin-top:28px;font-size:11px;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;padding-top:12px}
      @media print{body{margin:16px}}
    </style></head><body>
    <h1>${titulo}</h1>
    ${renderParaPDF(texto)}
    <div class="footer">Parque Sabará — JW Assistente &bull; jw.org</div>
    </body></html>`)
    w.document.close(); w.focus()
    setTimeout(() => w.print(), 400)
  }

  const handleWhatsApp = () => {
    const max = 1500
    const msg = texto.length > max ? texto.slice(0, max) + '...' : texto
    window.open(`https://wa.me/?text=${encodeURIComponent(`*${titulo}*\n\n${msg}`)}`, '_blank')
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/30">
      <button onClick={handleCopiar} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card/60 hover:border-primary/40 hover:text-foreground transition-all text-muted-foreground">
        {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
        {copied ? 'Copiado!' : 'Copiar'}
      </button>
      <button onClick={handleImprimir} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card/60 hover:border-amber-500/40 hover:text-amber-400 transition-all text-muted-foreground">
        <Printer className="h-3 w-3" />
        PDF / Imprimir
      </button>
      <button onClick={handleWhatsApp} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card/60 hover:border-emerald-500/40 hover:text-emerald-400 transition-all text-muted-foreground">
        <Share2 className="h-3 w-3" />
        WhatsApp
      </button>
    </div>
  )
}

// ── Micro ─────────────────────────────────────────────────────────────────────

function Dots() {
  return (
    <span className="flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
    </span>
  )
}

function BloqueioCard() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3">
      <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-semibold text-red-400 mb-0.5">Fora do escopo</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Esta pergunta está fora do meu escopo. Posso responder apenas sobre tópicos das Testemunhas de Jeová e do conteúdo disponível em JW.org.
        </p>
      </div>
    </div>
  )
}

// ── Criar Partes ──────────────────────────────────────────────────────────────

function CriarPartes() {
  const [tipo,       setTipo]       = useState(TIPOS_PARTE[0].id)
  const [duracao,    setDuracao]    = useState(2)
  const [cenario,    setCenario]    = useState(CENARIOS[0].id)
  const [tema,       setTema]       = useState('')
  const [ponto,      setPonto]      = useState('')
  const [publicacao, setPublicacao] = useState(PUBLICACOES[0])
  const [pubCustom,  setPubCustom]  = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const tipoAtual = TIPOS_PARTE.find(t => t.id === tipo)!

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/partes' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleTipo = (id: string) => {
    setTipo(id)
    setDuracao(TIPOS_PARTE.find(t => t.id === id)!.duracoes[0])
  }

  const handleGerar = () => {
    if (!tema.trim() || isLoading) return
    const pub = publicacao === 'Livre (descreva abaixo)' ? pubCustom || 'livre' : publicacao
    const cLabel = CENARIOS.find(c => c.id === cenario)?.label ?? cenario
    sendMessage({
      text: `Crie uma parte do tipo "${tipoAtual.label}" com duração de ${duracao} minutos.\nTema: ${tema}\nPonto da lição / versículo: ${ponto || 'livre'}\nPublicação: ${pub}\nCenário: ${cLabel}\nUse nomes reais brasileiros para os personagens. Roteiro completo e pronto para apresentação.`,
    })
  }

  const lastMsg = [...messages].reverse().find(m => m.role === 'assistant')
  const lastText = lastMsg ? getMessageText(lastMsg as any) : ''
  const titulo = `${tipoAtual.label} — ${duracao} min | ${tema || 'Sem tema'}`

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Config */}
      <div className="flex-shrink-0 overflow-y-auto max-h-[56vh] border-b border-border/40 p-4 space-y-4 scrollbar-thin">

        {/* Tipo */}
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Tipo de Parte</p>
          <div className="grid grid-cols-2 gap-2">
            {TIPOS_PARTE.map(t => (
              <button key={t.id} onClick={() => handleTipo(t.id)}
                className={cn('flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl border text-left transition-all',
                  tipo === t.id ? 'border-primary/60 bg-primary/10' : 'border-border/60 bg-card/40 hover:border-border text-muted-foreground'
                )}
              >
                <span className={cn('text-xs font-bold', tipo === t.id ? 'text-primary' : '')}>{t.label}</span>
                <span className="text-[10px] opacity-60">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duração */}
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Duração</p>
          <div className="flex flex-wrap gap-2">
            {tipoAtual.duracoes.map(d => (
              <button key={d} onClick={() => setDuracao(d)}
                className={cn('px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                  duracao === d ? 'border-primary bg-primary/15 text-primary' : 'border-border/60 bg-card/40 text-muted-foreground hover:border-primary/30'
                )}
              >{d} min</button>
            ))}
          </div>
        </div>

        {/* Cenário */}
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Cenário</p>
          <div className="flex flex-wrap gap-1.5">
            {CENARIOS.map(c => {
              const Icon = c.icon
              return (
                <button key={c.id} onClick={() => setCenario(c.id)}
                  className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all',
                    cenario === c.id ? 'border-cyan-500/50 bg-cyan-500/12 text-cyan-300' : 'border-border/60 bg-card/40 text-muted-foreground hover:border-cyan-500/25'
                  )}
                >
                  <Icon className="h-3 w-3" />{c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tema */}
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
            Tema / Assunto <span className="text-red-400 normal-case font-normal">*obrigatório</span>
          </p>
          <input value={tema} onChange={e => setTema(e.target.value)}
            placeholder="Ex: Como encontrar esperança em tempos difíceis"
            className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/15 transition-all"
          />
        </div>

        {/* Ponto */}
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Versículo / Ponto da Lição</p>
          <input value={ponto} onChange={e => setPonto(e.target.value)}
            placeholder="Ex: João 5:28,29 ou Lição 5 — ponto 3"
            className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>

        {/* Publicação */}
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Publicação de Referência</p>
          <select value={publicacao} onChange={e => setPublicacao(e.target.value)}
            className="w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
          >
            {PUBLICACOES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {publicacao === 'Livre (descreva abaixo)' && (
            <input value={pubCustom} onChange={e => setPubCustom(e.target.value)}
              placeholder="Descreva a publicação ou tema"
              className="mt-2 w-full rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
            />
          )}
        </div>

        {/* Botão */}
        <button onClick={handleGerar} disabled={!tema.trim() || isLoading}
          className={cn('w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all',
            tema.trim() && !isLoading ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/15' : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
          )}
        >
          {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Gerando roteiro...</> : <><Mic className="h-4 w-4" />Gerar Roteiro</>}
        </button>
      </div>

      {/* Resultado */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center text-muted-foreground py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 border border-primary/15">
              <Mic className="h-5 w-5 text-primary/50" />
            </div>
            <p className="text-sm max-w-xs leading-relaxed">
              Preencha o formulário acima e clique em <span className="text-primary font-semibold">Gerar Roteiro</span> para criar sua parte
            </p>
            <div className="grid grid-cols-2 gap-2 mt-1 text-left w-full">
              {['Conversa na rua — 3 min', 'Estudo sobre ressurreição', 'Discurso sobre esperança', 'Revisita no hospital'].map((ex, i) => (
                <button key={i} onClick={() => setTema(ex)}
                  className="text-[11px] px-3 py-2 rounded-lg border border-border/50 bg-card/40 hover:border-primary/30 hover:text-foreground transition-all text-left"
                >
                  <ChevronRight className="h-2.5 w-2.5 inline mr-1 text-primary/60" />{ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.role === 'user') return null
          const text = getMessageText(msg as any)
          return (
            <div key={msg.id ?? i} className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-amber-500/12 border border-amber-500/20 flex items-center justify-center">
                    <BookMarked className="h-3 w-3 text-amber-400" />
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Roteiro</span>
                </div>
                <button onClick={() => setMessages([])}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-border/50 bg-card/40 hover:border-border transition-all text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-3 w-3" />Nova
                </button>
              </div>
              <div className="rounded-2xl border border-border/40 bg-card/30 p-3.5 space-y-0.5">
                {isLoading && !text ? <Dots /> : renderRoteiro(text)}
              </div>
              {text && !isLoading && <BarraAcoes texto={text} titulo={titulo} />}
            </div>
          )
        })}

        {status === 'submitted' && (
          <div className="rounded-2xl border border-border/40 bg-card/30 p-4"><Dots /></div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

// ── Respostas ao Morador ──────────────────────────────────────────────────────

function RespostasMorador() {
  const [pergunta, setPergunta] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/campo' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleEnviar = (texto?: string) => {
    const msg = (texto ?? pergunta).trim()
    if (!msg || isLoading) return
    sendMessage({ text: `O morador perguntou: "${msg}"\n\nComo posso responder isso de forma simples e bíblica?` })
    setPergunta('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEnviar() }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPergunta(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-4">

        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
              <DoorOpen className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold">Respostas de Campo</h2>
              <p className="text-muted-foreground text-xs max-w-[260px] leading-relaxed">
                Digite o que o morador perguntou e receba uma resposta bíblica pronta para usar na hora
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full mt-1">
              {EXEMPLOS_MORADOR.map(({ q, icon: Icon }, i) => (
                <button key={i} onClick={() => handleEnviar(q)}
                  className="flex items-center gap-3 text-xs px-4 py-3 rounded-xl border border-border/50 bg-card/40 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-left text-muted-foreground hover:text-foreground"
                >
                  <Icon className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400/70" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const text   = getMessageText(msg as any)
          const isUser = msg.role === 'user'

          if (isUser) {
            const q = text.replace(/^O morador perguntou: "/, '').replace(/"\n\nComo posso responder isso de forma simples e bíblica\?$/, '')
            return (
              <div key={msg.id ?? i} className="flex justify-end">
                <div className="max-w-[82vw] bg-primary/90 text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-[10px] font-semibold opacity-60 mb-1 uppercase tracking-wide">Morador perguntou</p>
                  <p className="text-sm leading-relaxed">{q}</p>
                </div>
              </div>
            )
          }

          const bloqueado = isBloqueado(text)
          return (
            <div key={msg.id ?? i} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Book className="h-3 w-3 text-emerald-400" />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Resposta Bíblica</span>
              </div>
              <div className="space-y-1.5">
                {!text && isLoading ? (
                  <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3"><Dots /></div>
                ) : bloqueado ? (
                  <BloqueioCard />
                ) : (
                  renderRespostaCampo(text)
                )}
              </div>
              {text && !isLoading && !bloqueado && (
                <>
                  <BarraAcoes texto={text} titulo="Resposta de Campo — JW.org" />
                  <button onClick={() => { setMessages([]); setTimeout(() => inputRef.current?.focus(), 50) }}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />Nova pergunta
                  </button>
                </>
              )}
            </div>
          )
        })}

        {status === 'submitted' && (
          <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3"><Dots /></div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-border/40 bg-card/60 backdrop-blur-sm">
        <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-2 focus-within:border-emerald-500/40 focus-within:ring-1 focus-within:ring-emerald-500/15 transition-all">
          <Lightbulb className="h-4 w-4 text-emerald-400/70 flex-shrink-0 mb-2" />
          <textarea ref={inputRef} rows={1} value={pergunta}
            onChange={handleInputChange} onKeyDown={handleKeyDown}
            placeholder="O morador perguntou..."
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-50 py-1 max-h-36 scrollbar-thin"
            style={{ height: 'auto' }}
          />
          <button onClick={() => handleEnviar()} disabled={!pergunta.trim() || isLoading}
            className={cn('flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all mb-0.5',
              pergunta.trim() && !isLoading ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
            )}
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground/60 mt-2">
          Respostas baseadas em <span className="text-emerald-400">JW.org</span>
        </p>
      </div>
    </div>
  )
}

// ── Chat Geral ────────────────────────────────────────────────────────────────

function ChatGeral() {
  const [input,      setInput]      = useState('')
  const [autoScroll, setAutoScroll] = useState(true)
  const [categoriaAberta, setCategoriaAberta] = useState<number | null>(null)
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
    setAutoScroll(el.scrollHeight - el.scrollTop - el.clientHeight < 60)
  }

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || isLoading) return
    sendMessage({ text: msg })
    setInput('')
    setAutoScroll(true)
    setCategoriaAberta(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div ref={messagesRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-5 space-y-4">

        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-5 text-center px-2 pt-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20">
              <Search className="h-6 w-6 text-primary/70" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold">Pergunte sobre JW.org</h2>
              <p className="text-muted-foreground text-xs max-w-[260px] leading-relaxed">
                Respostas sobre a Bíblia e as Testemunhas de Jeová — somente com base em JW.org
              </p>
            </div>

            {/* Categorias */}
            <div className="w-full space-y-2">
              {CATEGORIAS_CHAT.map((cat, ci) => {
                const Icon = cat.icon
                const aberta = categoriaAberta === ci
                return (
                  <div key={ci} className={cn('rounded-xl border transition-all overflow-hidden', aberta ? cat.bg : 'border-border/50 bg-card/40')}>
                    <button
                      onClick={() => setCategoriaAberta(aberta ? null : ci)}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                    >
                      <Icon className={cn('h-4 w-4 flex-shrink-0', cat.color)} />
                      <span className="text-sm font-semibold flex-1">{cat.label}</span>
                      <ChevronRight className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', aberta && 'rotate-90')} />
                    </button>
                    {aberta && (
                      <div className="px-4 pb-3 space-y-1.5">
                        {cat.perguntas.map((p, pi) => (
                          <button key={pi} onClick={() => handleSend(p)}
                            className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-border/40 bg-background/40 hover:bg-background/80 hover:border-border/80 transition-all text-muted-foreground hover:text-foreground"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const text   = getMessageText(msg as any)
          const isUser = msg.role === 'user'
          const bloq   = !isUser && isBloqueado(text)
          return (
            <div key={msg.id} className={cn('flex gap-2.5 max-w-full', isUser ? 'ml-auto flex-row-reverse' : 'mr-auto')}>
              <div className={cn(
                'flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold mt-0.5',
                isUser ? 'bg-primary text-primary-foreground' : 'bg-amber-500/12 border border-amber-500/25 text-amber-400'
              )}>
                {isUser ? 'EU' : <BookOpen className="h-3.5 w-3.5" />}
              </div>
              <div className={cn(
                'relative px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[82vw]',
                isUser
                  ? 'bg-primary/90 text-primary-foreground rounded-tr-sm'
                  : bloq
                    ? 'bg-red-500/8 border border-red-500/20 text-foreground rounded-tl-sm'
                    : 'bg-card/50 border border-border/50 text-foreground rounded-tl-sm'
              )}>
                {!isUser && !text && isLoading && <Dots />}
                {!isUser && bloq && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{text.replace('⛔ ', '')}</p>
                  </div>
                )}
                {!bloq && <div className="space-y-0.5">{renderChatText(text)}</div>}
                {!isUser && text && !isLoading && !bloq && (
                  <BarraAcoes texto={text} titulo="Resposta — JW.org" />
                )}
              </div>
            </div>
          )
        })}

        {status === 'submitted' && (
          <div className="flex gap-2.5 mr-auto">
            <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/12 border border-amber-500/25">
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card/50 border border-border/50"><Dots /></div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {!autoScroll && (
        <button
          onClick={() => { setAutoScroll(true); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }}
          className="absolute bottom-24 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border shadow-lg text-muted-foreground hover:text-foreground z-10"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      )}

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-border/40 bg-card/60 backdrop-blur-sm">
        <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-2 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/15 transition-all">
          <textarea ref={inputRef} rows={1} value={input}
            onChange={handleInputChange} onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre a Bíblia ou JW.org..."
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-50 py-1 max-h-40 scrollbar-thin"
            style={{ height: 'auto' }}
          />
          <button onClick={() => handleSend()} disabled={!input.trim() || isLoading}
            className={cn('flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all',
              input.trim() && !isLoading ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
            )}
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground/60 mt-2">
          Somente respostas baseadas em <span className="text-primary/80">JW.org</span>
        </p>
      </div>
    </div>
  )
}

// ── Abas coloridas por contexto ───────────────────────────────────────────────

const ABA_CONFIG = {
  chat:   { label: 'Perguntas', icon: MessageSquare, activeColor: 'border-blue-400 text-blue-400'    },
  partes: { label: 'Criar Partes', icon: Mic,       activeColor: 'border-amber-400 text-amber-400'  },
  campo:  { label: 'Campo',     icon: DoorOpen,     activeColor: 'border-emerald-400 text-emerald-400'},
} as const

type Aba = keyof typeof ABA_CONFIG

export default function ChatPage() {
  const [aba, setAba] = useState<Aba>('chat')

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">

      <header className="flex-shrink-0 z-10 border-b border-border/40 bg-card/70 backdrop-blur-md">
        <div className="max-w-lg mx-auto w-full">
          <div className="flex items-center gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl overflow-hidden border border-border/50 group-hover:border-primary/40 transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/icon-192x192.jpg" alt="Parque Sabará" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none">Parque Sabará</p>
                <p className="text-[11px] text-muted-foreground/70 leading-none mt-0.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                  JW Assistente
                </p>
              </div>
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Nova conversa"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Abas */}
          <div className="flex px-2">
            {(Object.entries(ABA_CONFIG) as [Aba, typeof ABA_CONFIG[Aba]][]).map(([id, cfg]) => {
              const Icon = cfg.icon
              const ativa = aba === id
              return (
                <button key={id} onClick={() => setAba(id)}
                  className={cn(
                    'flex items-center justify-center gap-1.5 flex-1 py-2.5 text-[11px] font-bold border-b-2 transition-all uppercase tracking-wide',
                    ativa ? cfg.activeColor : 'border-transparent text-muted-foreground/60 hover:text-muted-foreground'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden max-w-lg mx-auto w-full relative">
        {aba === 'chat'   && <ChatGeral />}
        {aba === 'partes' && <CriarPartes />}
        {aba === 'campo'  && <RespostasMorador />}
      </div>

    </div>
  )
}
