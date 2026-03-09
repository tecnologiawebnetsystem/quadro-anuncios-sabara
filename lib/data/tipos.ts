// Tipos compartilhados para os estudos de A Sentinela

export interface Pergunta {
  paragrafo: string
  pergunta: string
  resposta: string
  textoBase?: string
  imagem?: string
  imagemDescricao?: string
  imagemLegenda?: string
}

export interface PerguntaRecapitulacao {
  pergunta: string
  resposta: string
}

export interface Estudo {
  id: number
  semana: string
  dataInicio: string
  dataFim: string
  canticoInicial: number
  canticoInicialTitulo: string
  canticoFinal: number
  canticoFinalTitulo: string
  titulo: string
  textoTema: string
  textoTemaRef: string
  objetivo: string
  imagem?: string
  perguntas: Pergunta[]
  recapitulacao: PerguntaRecapitulacao[]
}
