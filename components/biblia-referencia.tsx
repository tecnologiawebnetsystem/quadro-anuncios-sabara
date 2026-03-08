"use client"

import { useState } from "react"
import { X, ExternalLink, Loader2 } from "lucide-react"

interface BibliaReferenciaProps {
  referencia: string
  children?: React.ReactNode
}

interface VersiculoData {
  referencia: string
  texto: string
  fonte: string
  link?: string
}

export function BibliaReferencia({ referencia, children }: BibliaReferenciaProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dados, setDados] = useState<VersiculoData | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const abrirModal = async () => {
    setIsOpen(true)
    setLoading(true)
    setErro(null)

    try {
      const response = await fetch(`/api/biblia?ref=${encodeURIComponent(referencia)}`)
      const data = await response.json()
      
      if (data.error && !data.texto) {
        setErro(data.error)
      } else {
        setDados(data)
      }
    } catch {
      setErro("Erro ao buscar o texto bíblico")
    } finally {
      setLoading(false)
    }
  }

  const fecharModal = () => {
    setIsOpen(false)
    setDados(null)
    setErro(null)
  }

  return (
    <>
      <button
        onClick={abrirModal}
        className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-medium transition-colors"
      >
        {children || referencia}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={fecharModal}
        >
          <div 
            className="bg-slate-800 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {dados?.referencia || referencia}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {dados?.fonte || "Bíblia de Estudo"}
                  </p>
                </div>
              </div>
              <button
                onClick={fecharModal}
                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
              )}

              {erro && !loading && (
                <div className="text-center py-4">
                  <p className="text-red-400">{erro}</p>
                </div>
              )}

              {dados && !loading && (
                <div className="space-y-4">
                  <p className="text-slate-200 text-lg leading-relaxed font-serif">
                    {dados.texto}
                  </p>

                  {dados.link && (
                    <a
                      href={dados.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Abrir no jw.org
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={fecharModal}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Função utilitária para processar texto e converter referências em componentes clicáveis
export function processarTextoBiblico(texto: string): React.ReactNode[] {
  // Regex para encontrar referências bíblicas
  // Exemplos: "Mateus 5:3", "Mat. 5:3", "1 Coríntios 13:4-7", "Leia Provérbios 25:11"
  const regex = /\(?\s*(?:Leia\s+)?(\d?\s?[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+\.?\s+\d+:\d+(?:\s*[-–,]\s*\d+)?)\s*\.?\)?/gi
  
  const partes: React.ReactNode[] = []
  let ultimoIndice = 0
  let match
  
  while ((match = regex.exec(texto)) !== null) {
    // Adiciona o texto antes da referência
    if (match.index > ultimoIndice) {
      partes.push(texto.slice(ultimoIndice, match.index))
    }
    
    // Adiciona a referência clicável
    const referencia = match[1]
    partes.push(
      <BibliaReferencia key={match.index} referencia={referencia}>
        {match[0]}
      </BibliaReferencia>
    )
    
    ultimoIndice = match.index + match[0].length
  }
  
  // Adiciona o texto restante
  if (ultimoIndice < texto.length) {
    partes.push(texto.slice(ultimoIndice))
  }
  
  return partes.length > 0 ? partes : [texto]
}
