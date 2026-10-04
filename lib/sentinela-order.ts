export interface ParagrafoOrdenavel {
  numero: string
  ordem: number
}

export function ehRecapitulacaoSentinela(numero: string) {
  return /^\s*rec(?:\.|:|apitula(?:ção|cao)?)/i.test(numero)
}

export function extrairNumeroParagrafoSentinela(numero: string) {
  const primeiroNumero = numero.match(/\d+/)?.[0]
  return primeiroNumero ? Number(primeiroNumero) : Number.POSITIVE_INFINITY
}

export function formatarNumeroParagrafoSentinela(numero: string) {
  if (!ehRecapitulacaoSentinela(numero)) return numero
  const numeroRecapitulacao = numero.match(/\d+/)?.[0]
  return numeroRecapitulacao ? `Rec.: ${numeroRecapitulacao}` : "Recapitulação"
}

export function ordenarParagrafosSentinela<T extends ParagrafoOrdenavel>(a: T, b: T) {
  const aEhRecapitulacao = ehRecapitulacaoSentinela(a.numero)
  const bEhRecapitulacao = ehRecapitulacaoSentinela(b.numero)
  if (aEhRecapitulacao !== bEhRecapitulacao) return aEhRecapitulacao ? 1 : -1

  const diferencaNumero = extrairNumeroParagrafoSentinela(a.numero) - extrairNumeroParagrafoSentinela(b.numero)
  if (diferencaNumero !== 0) return diferencaNumero

  const diferencaRotulo = a.numero.localeCompare(b.numero, "pt-BR", { numeric: true })
  return diferencaRotulo || a.ordem - b.ordem
}

export function formatarRotuloImpressaoSentinela(numero: string) {
  return ehRecapitulacaoSentinela(numero)
    ? formatarNumeroParagrafoSentinela(numero)
    : `Parágrafo ${numero}`
}
