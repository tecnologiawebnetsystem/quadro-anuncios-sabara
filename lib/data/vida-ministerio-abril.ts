export interface ParteReuniao {
  numero: number
  titulo: string
  duracao: string
  tipo?: string
  descricao?: string
  referencia?: string
  joiasEspirituais?: {
    texto: string
    pergunta: string
    referencia: string
  }[]
}

export interface SecaoReuniao {
  nome: string
  cor: string
  icone: string
  cantico?: number
  partes: ParteReuniao[]
}

export interface SemanaVidaMinisterio {
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

export const semanasAbril: SemanaVidaMinisterio[] = [
  {
    id: "semana-6-12-abril",
    semana: "6-12 de Abril",
    dataInicio: "2026-04-06",
    dataFim: "2026-04-12",
    leituraSemana: "ISAÍAS 50-51",
    canticoInicial: 88,
    canticoMeio: 99,
    canticoFinal: 13,
    comentariosIniciais: "1 min",
    comentariosFinais: "3 min",
    tesouros: {
      nome: "TESOUROS DA PALAVRA DE DEUS",
      cor: "blue",
      icone: "diamond",
      partes: [
        {
          numero: 1,
          titulo: "Escute Aquele que foi instruído por Deus",
          duracao: "10 min",
          descricao: "Jeová ensinou Jesus antes de ele vir para a Terra. (Isa. 50:4; kr 182 § 5)\n\nJesus tinha muita vontade de aprender. (Isa. 50:5; cf 133 § 13)\n\nQuem teme a Jeová escuta a voz do Servo dele, Jesus. (Isa. 50:10; João 10:27)\n\nPARA MEDITAR: Como eu posso mostrar a mesma disposição que Jesus tinha de ser treinado por Jeová? — 1 Ped. 2:21."
        },
        {
          numero: 2,
          titulo: "Joias espirituais",
          duracao: "10 min",
          joiasEspirituais: [
            {
              texto: "Isa. 51:1",
              pergunta: "Como podemos entender esse versículo?",
              referencia: "it 'Pedreira' § 2"
            }
},
  {
    id: "semana-13-19-abril",
    semana: "13-19 de Abril",
    dataInicio: "2026-04-13",
    dataFim: "2026-04-19",
    leituraSemana: "ISAÍAS 52-53",
    canticoInicial: 18,
    canticoMeio: 20,
    canticoFinal: 57,
    comentariosIniciais: "1 min",
    comentariosFinais: "3 min",
    tesouros: {
      nome: "TESOUROS DA PALAVRA DE DEUS",
      cor: "blue",
      icone: "diamond",
      partes: [
        {
          numero: 1,
          titulo: "Jesus mostrou um grande amor!",
          duracao: "10 min",
          descricao: "Jesus seria desprezado. (Isa. 53:3; Mat. 26:67, 68; w10 15/11 7 § 2)\n\nJesus aceitaria passar por sofrimento. (Isa. 53:7; ip-2 205 § 25)\n\nPor amor, Jesus estava disposto a sofrer para fazer a vontade de Jeová e levar embora os nossos pecados. (Isa. 53:10-12; João 14:31; 15:13)"
        },
        {
          numero: 2,
          titulo: "Joias espirituais",
          duracao: "10 min",
          joiasEspirituais: [
            {
              texto: "Isa. 52:11",
              pergunta: "O que podemos aprender com essa ordem profética?",
              referencia: "it 'Utensílios' § 2"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Leitura da Bíblia",
          duracao: "4 min",
          descricao: "Isa. 53:3-12",
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
          duracao: "4 min",
          tipo: "DE CASA EM CASA",
          descricao: "Ofereça um estudo bíblico.",
          referencia: "lmd lição 4 ponto 4"
        },
        {
          numero: 5,
          titulo: "Iniciando conversas",
          duracao: "3 min",
          tipo: "DE CASA EM CASA",
          descricao: "Fale sobre uma das verdades do apêndice A da brochura Ame as Pessoas.",
          referencia: "lmd lição 3 ponto 3"
        },
        {
          numero: 6,
          titulo: "Cultivando o interesse",
          duracao: "5 min",
          tipo: "DE CASA EM CASA",
          descricao: "Ofereça um estudo bíblico para uma pessoa que assistiu à Celebração.",
          referencia: "lmd lição 8 ponto 3"
        }
      ]
    },
    vidaCrista: {
      nome: "NOSSA VIDA CRISTÃ",
      cor: "red",
      icone: "heart",
      cantico: 20,
      partes: [
        {
          numero: 7,
          titulo: "Torne-se Amigo de Jeová — O Melhor Presente de Todos",
          duracao: "15 min",
          descricao: "Consideração.\n\nMostre o VÍDEO. Depois, pergunte:\n\nPor que a morte de Jesus é um presente que Jeová nos deu?\n\nComo podemos mostrar gratidão pelo que Jesus fez por nós?"
        },
        {
          numero: 8,
          titulo: "Estudo bíblico de congregação",
          duracao: "30 min",
          descricao: "lfb histórias 76-77"
        }
      ]
    }
  }
]

        },
        {
          numero: 3,
          titulo: "Leitura da Bíblia",
          duracao: "4 min",
          descricao: "Isa. 50:1-11",
          referencia: "th lição 2"
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
          descricao: "Conte para um colega de trabalho como foi a Celebração.",
          referencia: "lmd lição 2 ponto 4"
        },
        {
          numero: 5,
          titulo: "Cultivando o interesse",
          duracao: "4 min",
          tipo: "DE CASA EM CASA",
          descricao: "O morador foi à Celebração. Convide-o para a próxima reunião.",
          referencia: "lmd lição 9 ponto 4"
        },
        {
          numero: 6,
          titulo: "Explicando suas crenças",
          duracao: "5 min",
          tipo: "Demonstração",
          descricao: "ijwbq artigo 140 § 4 — Tema: A fé em Jesus é tudo o que precisamos para ser salvos?",
          referencia: "lmd lição 11 ponto 5"
        }
      ]
    },
    vidaCrista: {
      nome: "NOSSA VIDA CRISTÃ",
      cor: "red",
      icone: "heart",
      cantico: 99,
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
          descricao: "lfb introdução da seção 12 e histórias 74-75"
        }
      ]
    }
  }
]
