// Dados da Reunião Vida e Ministério - Março 2026

export interface ParteReuniao {
  numero: number
  titulo: string
  duracao: string
  tipo?: string // "de casa em casa", "testemunho informal", etc.
  descricao?: string
  referencia?: string // ex: "lmd lição 4 ponto 3"
  textosBiblicos?: string[]
  perguntasPesquisa?: string
  joiasEspirituais?: {
    texto: string
    pergunta: string
    referencia?: string
  }[]
}

export interface SecaoReuniao {
  nome: string
  cor: string // para estilização
  icone: string
  partes: ParteReuniao[]
  cantico?: number
}

export interface ReuniaoVidaMinisterio {
  id: string
  semana: string
  dataInicio: string
  dataFim: string
  leituraSemana: string
  canticoInicial: number
  canticoMeio: number
  canticoFinal: number
  comentariosIniciais: string
  comentariosFinais: string
  tesouros: SecaoReuniao
  ministerio: SecaoReuniao
  vidaCrista: SecaoReuniao
}

export const reunioesMarco2026: ReuniaoVidaMinisterio[] = [
  {
    id: "semana-09-15-marco",
    semana: "9-15 de Março",
    dataInicio: "2026-03-09",
    dataFim: "2026-03-15",
    leituraSemana: "ISAÍAS 43-44",
    canticoInicial: 63,
    canticoMeio: 69,
    canticoFinal: 137,
    comentariosIniciais: "1 min",
    comentariosFinais: "3 min",
    tesouros: {
      nome: "TESOUROS DA PALAVRA DE DEUS",
      cor: "blue",
      icone: "diamond",
      partes: [
        {
          numero: 1,
          titulo: "Uma profecia escrita 200 anos antes de se cumprir",
          duracao: "10 min",
          descricao: "Jeová faria os rios de Babilônia secar. O governante persa chamado Ciro agiria como um 'pastor' da parte de Deus. Ciro enviaria o povo de Deus de volta a Jerusalém para reconstruir a cidade e o templo.",
          textosBiblicos: ["Isa. 44:27", "gm 123-124 §§ 16-17", "Isa. 44:28a", "it 'Ciro' § 6", "Esd. 1:1-3", "Isa. 44:28b", "it 'Ciro' § 16"],
          perguntasPesquisa: "Como Ciro cumpriu a profecia de Isaías 45:1-4?"
        },
        {
          numero: 2,
          titulo: "Joias espirituais",
          duracao: "10 min",
          joiasEspirituais: [
            {
              texto: "Isa. 44:28",
              pergunta: "Como sabemos que Jeová não interferiu no livre-arbítrio de Ciro?",
              referencia: "w24.02 30 § 8"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Leitura da Bíblia",
          duracao: "4 min",
          descricao: "Isa. 44:9-20",
          referencia: "th lição 10"
        }
      ]
    },
    ministerio: {
      nome: "FAÇA SEU MELHOR NO MINISTÉRIO",
      cor: "amber",
      icone: "wheat",
      partes: [
        {
          numero: 4,
          titulo: "Iniciando conversas",
          duracao: "1 min",
          tipo: "DE CASA EM CASA",
          descricao: "Deixe o convite da Celebração.",
          referencia: "lmd lição 4 ponto 3"
        },
        {
          numero: 5,
          titulo: "Iniciando conversas",
          duracao: "3 min",
          tipo: "TESTEMUNHO INFORMAL",
          descricao: "Convide alguém que você conhece para a Celebração.",
          referencia: "lmd lição 3 ponto 4"
        },
        {
          numero: 6,
          titulo: "Iniciando conversas",
          duracao: "3 min",
          tipo: "TESTEMUNHO INFORMAL",
          descricao: "Peça uma folga ao seu patrão para assistir à Celebração.",
          referencia: "lmd lição 6 ponto 3"
        },
        {
          numero: 7,
          titulo: "Cultivando o interesse",
          duracao: "4 min",
          tipo: "DE CASA EM CASA",
          descricao: "Ofereça um estudo bíblico para uma pessoa que aceitou o convite da Celebração numa conversa anterior.",
          referencia: "lmd lição 7 ponto 4"
        }
      ]
    },
    vidaCrista: {
      nome: "NOSSA VIDA CRISTÃ",
      cor: "red",
      icone: "heart",
      cantico: 69,
      partes: [
        {
          numero: 8,
          titulo: "Necessidades locais",
          duracao: "15 min"
        },
        {
          numero: 9,
          titulo: "Estudo bíblico de congregação",
          duracao: "30 min",
          descricao: "lfb introdução da seção 11 e histórias 68-69"
        }
      ]
    }
  },
  {
    id: "semana-16-22-marco",
    semana: "16-22 de Março",
    dataInicio: "2026-03-16",
    dataFim: "2026-03-22",
    leituraSemana: "ISAÍAS 45-47",
    canticoInicial: 2,
    canticoMeio: 38,
    canticoFinal: 148,
    comentariosIniciais: "1 min",
    comentariosFinais: "3 min",
    tesouros: {
      nome: "TESOUROS DA PALAVRA DE DEUS",
      cor: "blue",
      icone: "diamond",
      partes: [
        {
          numero: 1,
          titulo: '"Eu sou Deus, e não há ninguém igual a mim"',
          duracao: "10 min",
          descricao: "Não existe ninguém igual a Jeová. (Isa. 46:9; w20.06 5 § 14)\n\nNada pode impedir Jeová de fazer o que ele quer. (Isa. 46:10, 11; cl 42 § 14; it 'Exilados retornam de Babilônia' § 1)\n\nQuem confia em deuses falsos ficará decepcionado. (Isa. 46:6, 7; w99 15/5 14 §§ 18-19)"
        },
        {
          numero: 2,
          titulo: "Joias espirituais",
          duracao: "10 min",
          joiasEspirituais: [
            {
              texto: "Isa. 46:10",
              pergunta: "Será que Jeová sabia 'desde o princípio' que Adão e Eva iam pecar?",
              referencia: "w11 1/1 14 §§ 2-3"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Leitura da Bíblia",
          duracao: "4 min",
          descricao: "Isa. 45:1-11",
          referencia: "th lição 5"
        }
      ]
    },
    ministerio: {
      nome: "FAÇA SEU MELHOR NO MINISTÉRIO",
      cor: "amber",
      icone: "wheat",
      partes: [
        {
          numero: 4,
          titulo: "Iniciando conversas",
          duracao: "3 min",
          tipo: "TESTEMUNHO PÚBLICO",
          descricao: "Explique para uma pessoa de uma cultura não cristã como é a Celebração.",
          referencia: "lmd lição 5 ponto 3"
        },
        {
          numero: 5,
          titulo: "Cultivando o interesse",
          duracao: "4 min",
          tipo: "DE CASA EM CASA",
          descricao: "Ofereça um estudo bíblico para uma pessoa que aceitou o convite da Celebração numa conversa anterior.",
          referencia: "lmd lição 9 ponto 5"
        },
        {
          numero: 6,
          titulo: "Fazendo discípulos",
          duracao: "5 min",
          descricao: "lff lição 19 introdução e pontos 1-3",
          referencia: "lmd lição 11 ponto 3"
        }
      ]
    },
    vidaCrista: {
      nome: "NOSSA VIDA CRISTÃ",
      cor: "red",
      icone: "heart",
      cantico: 38,
      partes: [
        {
          numero: 7,
          titulo: "A única fonte de ajuda em que podemos confiar",
          duracao: "7 min",
          descricao: "Consideração. Quando passamos por problemas, a única pessoa em quem podemos confiar totalmente para nos ajudar é o nosso Deus, Jeová. — Heb. 13:5, 6.\n\nLeia Salmo 55:22. Depois, considere com a assistência as seguintes situações:\n\n• Perdemos o emprego, e fica difícil sustentar nossa família.\n• As autoridades nos proíbem de nos reunir e de pregar.\n• Enfrentamos sérios problemas de saúde.\n• Passamos por uma tragédia, como um desastre natural ou a morte de alguém que amamos."
        },
        {
          numero: 8,
          titulo: "Atualizações do Departamento Local de Projeto/Construção — 2026",
          duracao: "8 min",
          descricao: "Discurso. Mostre o VÍDEO."
        },
        {
          numero: 9,
          titulo: "Estudo bíblico de congregação",
          duracao: "30 min",
          descricao: "lfb histórias 70-71"
        }
      ]
    }
  },
  {
    id: "semana-23-29-marco",
    semana: "23-29 de Março",
    dataInicio: "2026-03-23",
    dataFim: "2026-03-29",
    leituraSemana: "ISAÍAS 47-49",
    canticoInicial: 22,
    canticoMeio: 88,
    canticoFinal: 114,
    comentariosIniciais: "1 min",
    comentariosFinais: "3 min",
    tesouros: {
      nome: "TESOUROS DA PALAVRA DE DEUS",
      cor: "blue",
      icone: "diamond",
      partes: [
        {
          numero: 1,
          titulo: "Jeová nunca se esquece de nós",
          duracao: "10 min",
          descricao: "Jeová compara seu amor por seu povo ao amor de uma mãe. Ele gravou Sião nas palmas de suas mãos."
        },
        {
          numero: 2,
          titulo: "Joias espirituais",
          duracao: "10 min",
          joiasEspirituais: [
            {
              texto: "Isa. 49:15, 16",
              pergunta: "Como esse texto nos consola?",
              referencia: "w22.08 20 § 10"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Leitura da Bíblia",
          duracao: "4 min",
          descricao: "Isa. 49:1-17",
          referencia: "th lição 12"
        }
      ]
    },
    ministerio: {
      nome: "FAÇA SEU MELHOR NO MINISTÉRIO",
      cor: "amber",
      icone: "wheat",
      partes: [
        {
          numero: 4,
          titulo: "Iniciando conversas",
          duracao: "2 min",
          tipo: "DE CASA EM CASA",
          descricao: "Fale sobre a esperança do Reino.",
          referencia: "lmd lição 10 ponto 1"
        },
        {
          numero: 5,
          titulo: "Fazendo revisitas",
          duracao: "3 min",
          tipo: "REVISITA",
          descricao: "Continue a conversa sobre o Reino.",
          referencia: "lmd lição 10 ponto 2"
        },
        {
          numero: 6,
          titulo: "Discurso",
          duracao: "5 min",
          descricao: "Por que devemos orar a Jeová?",
          referencia: "th lição 15"
        }
      ]
    },
    vidaCrista: {
      nome: "NOSSA VIDA CRISTÃ",
      cor: "red",
      icone: "heart",
      cantico: 88,
      partes: [
        {
          numero: 7,
          titulo: "Como se preparar para a Celebração",
          duracao: "15 min"
        },
        {
          numero: 8,
          titulo: "Estudo bíblico de congregação",
          duracao: "30 min",
          descricao: "lfb histórias 72-73"
        }
      ]
    }
  },
  {
    id: "semana-30-05-abril",
    semana: "30 de Março – 5 de Abril",
    dataInicio: "2026-03-30",
    dataFim: "2026-04-05",
    leituraSemana: "ISAÍAS 50-52",
    canticoInicial: 35,
    canticoMeio: 77,
    canticoFinal: 141,
    comentariosIniciais: "1 min",
    comentariosFinais: "3 min",
    tesouros: {
      nome: "TESOUROS DA PALAVRA DE DEUS",
      cor: "blue",
      icone: "diamond",
      partes: [
        {
          numero: 1,
          titulo: "Que boas novas anunciamos!",
          duracao: "10 min",
          descricao: "Os pés dos mensageiros que anunciam boas novas são belos. Essa profecia se aplica aos pregadores do Reino hoje."
        },
        {
          numero: 2,
          titulo: "Joias espirituais",
          duracao: "10 min",
          joiasEspirituais: [
            {
              texto: "Isa. 52:7",
              pergunta: "Por que a obra de pregação é tão importante?",
              referencia: "w23.01 10 § 5"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Leitura da Bíblia",
          duracao: "4 min",
          descricao: "Isa. 52:1-15",
          referencia: "th lição 13"
        }
      ]
    },
    ministerio: {
      nome: "FAÇA SEU MELHOR NO MINISTÉRIO",
      cor: "amber",
      icone: "wheat",
      partes: [
        {
          numero: 4,
          titulo: "Iniciando conversas",
          duracao: "3 min",
          tipo: "TESTEMUNHO INFORMAL",
          descricao: "Convide alguém para a Celebração.",
          referencia: "lmd lição 11 ponto 3"
        },
        {
          numero: 5,
          titulo: "Cultivando o interesse",
          duracao: "4 min",
          tipo: "DE CASA EM CASA",
          descricao: "Deixe o convite da Celebração.",
          referencia: "lmd lição 11 ponto 4"
        },
        {
          numero: 6,
          titulo: "Discurso",
          duracao: "5 min",
          descricao: "O que a Celebração significa para você?",
          referencia: "th lição 16"
        }
      ]
    },
    vidaCrista: {
      nome: "NOSSA VIDA CRISTÃ",
      cor: "red",
      icone: "heart",
      cantico: 77,
      partes: [
        {
          numero: 7,
          titulo: "Necessidades locais",
          duracao: "15 min"
        },
        {
          numero: 8,
          titulo: "Estudo bíblico de congregação",
          duracao: "30 min",
          descricao: "lfb histórias 74-75"
        }
      ]
    }
  }
]
