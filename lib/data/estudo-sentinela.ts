// Dados do Estudo de A Sentinela

export interface EstudoSentinela {
  id: number
  mes: string
  semana: string
  dataInicio: string
  dataFim: string
  titulo: string
  textoTema?: string
  cantico: number
}

export const estudosSentinela: Record<string, EstudoSentinela[]> = {
  "marco-2026": [
    { 
      id: 1, 
      mes: "marco-2026",
      semana: "2-8 de Março de 2026", 
      dataInicio: "2026-03-02",
      dataFim: "2026-03-08",
      titulo: "Continue cuidando da sua 'necessidade espiritual'", 
      textoTema: "Mateus 5:3",
      cantico: 97 
    },
    { 
      id: 2, 
      mes: "marco-2026",
      semana: "9-15 de Março de 2026", 
      dataInicio: "2026-03-09",
      dataFim: "2026-03-15",
      titulo: "Você é capaz de lutar contra sentimentos negativos!", 
      textoTema: "Filipenses 4:6, 7",
      cantico: 45 
    },
    { 
      id: 3, 
      mes: "marco-2026",
      semana: "16-22 de Março de 2026", 
      dataInicio: "2026-03-16",
      dataFim: "2026-03-22",
      titulo: "Por que precisamos do resgate?", 
      textoTema: "Romanos 5:12",
      cantico: 20 
    },
    { 
      id: 4, 
      mes: "marco-2026",
      semana: "23-29 de Março de 2026", 
      dataInicio: "2026-03-23",
      dataFim: "2026-03-29",
      titulo: "Como você vai mostrar sua gratidão pelo resgate?", 
      textoTema: "2 Coríntios 5:14, 15",
      cantico: 18 
    },
    { 
      id: 5, 
      mes: "marco-2026",
      semana: "30 de Março - 5 de Abril de 2026", 
      dataInicio: "2026-03-30",
      dataFim: "2026-04-05",
      titulo: "Fale a verdade de modo agradável", 
      textoTema: "Colossenses 4:6",
      cantico: 76 
    },
  ],
  "abril-2026": [
    { 
      id: 1, 
      mes: "abril-2026",
      semana: "6-12 de Abril de 2026", 
      dataInicio: "2026-04-06",
      dataFim: "2026-04-12",
      titulo: "Como podemos ajudar nossos parentes descrentes?", 
      textoTema: "1 Pedro 3:1, 2",
      cantico: 82 
    },
    { 
      id: 2, 
      mes: "abril-2026",
      semana: "13-19 de Abril de 2026", 
      dataInicio: "2026-04-13",
      dataFim: "2026-04-19",
      titulo: "O significado e a importância do batismo", 
      textoTema: "Mateus 28:19, 20",
      cantico: 52 
    },
    { 
      id: 3, 
      mes: "abril-2026",
      semana: "20-26 de Abril de 2026", 
      dataInicio: "2026-04-20",
      dataFim: "2026-04-26",
      titulo: "Continue se esforçando para se batizar", 
      textoTema: "Atos 22:16",
      cantico: 49 
    },
    { 
      id: 4, 
      mes: "abril-2026",
      semana: "27 de Abril - 3 de Maio de 2026", 
      dataInicio: "2026-04-27",
      dataFim: "2026-05-03",
      titulo: "Como se preparar para desafios que podem surgir depois do batismo?", 
      textoTema: "2 Timóteo 3:12",
      cantico: 99 
    },
  ],
  "maio-2026": [
    { 
      id: 1, 
      mes: "maio-2026",
      semana: "4-10 de Maio de 2026", 
      dataInicio: "2026-05-04",
      dataFim: "2026-05-10",
      titulo: "Como melhorar nossa 'arte de ensino'", 
      textoTema: "1 Timóteo 4:16",
      cantico: 53 
    },
    { 
      id: 2, 
      mes: "maio-2026",
      semana: "11-17 de Maio de 2026", 
      dataInicio: "2026-05-11",
      dataFim: "2026-05-17",
      titulo: "Confie no Soberano do Universo", 
      textoTema: "Salmo 37:5",
      cantico: 7 
    },
    { 
      id: 3, 
      mes: "maio-2026",
      semana: "18-24 de Maio de 2026", 
      dataInicio: "2026-05-18",
      dataFim: "2026-05-24",
      titulo: "Tome cuidado com as distrações", 
      textoTema: "Lucas 21:34",
      cantico: 35 
    },
    { 
      id: 4, 
      mes: "maio-2026",
      semana: "25-31 de Maio de 2026", 
      dataInicio: "2026-05-25",
      dataFim: "2026-05-31",
      titulo: "Mostre perspicácia e você 'será bem-sucedido'", 
      textoTema: "Provérbios 17:8",
      cantico: 135 
    },
    { 
      id: 5, 
      mes: "maio-2026",
      semana: "1-7 de Junho de 2026", 
      dataInicio: "2026-06-01",
      dataFim: "2026-06-07",
      titulo: "Você pode ser feliz mesmo sendo odiado!", 
      textoTema: "Mateus 5:11, 12",
      cantico: 111 
    },
  ]
}

// Função para obter todos os estudos em uma lista única
export function getTodosEstudosSentinela(): EstudoSentinela[] {
  return Object.values(estudosSentinela).flat()
}

// Função para encontrar estudo por data
export function getEstudoSentinelaPorData(dataInicio: string): EstudoSentinela | null {
  const todos = getTodosEstudosSentinela()
  return todos.find(e => e.dataInicio === dataInicio) || null
}
