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
    id: "semana-06-12-abril",
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
          descricao: "Jesus foi instruído pelo próprio Jeová. Ele ensinou seus discípulos e continua ensinando a congregação cristã hoje."
        },
        {
          numero: 2,
          titulo: "Joias espirituais",
          duracao: "10 min",
          joiasEspirituais: [
            {
              texto: "Isa. 51:1",
              pergunta: "O que significa 'olhem para a rocha de onde foram cortados'?",
              referencia: "w22.03 10 § 8"
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
          descricao: "Use uma pergunta para iniciar uma conversa.",
          referencia: "lmd lição 5 ponto 1"
        },
        {
          numero: 5,
          titulo: "Cultivando o interesse",
          duracao: "4 min",
          tipo: "DE CASA EM CASA",
          descricao: "Visite alguém que mostrou interesse.",
          referencia: "lmd lição 8 ponto 2"
        },
        {
          numero: 6,
          titulo: "Explicando suas crenças",
          duracao: "5 min",
          tipo: "ESTUDO BÍBLICO",
          descricao: "Explique por que servimos a Jeová.",
          referencia: "lmd lição 9 ponto 3"
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
          descricao: "lfb histórias 74-75"
        }
      ]
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
  },
  {
    id: "semana-20-26-abril",
    semana: "20-26 de Abril",
    dataInicio: "2026-04-20",
    dataFim: "2026-04-26",
    leituraSemana: "ISAÍAS 54-55",
    canticoInicial: 86,
    canticoMeio: 97,
    canticoFinal: 70,
    comentariosIniciais: "1 min",
    comentariosFinais: "3 min",
    tesouros: {
      nome: "TESOUROS DA PALAVRA DE DEUS",
      cor: "blue",
      icone: "diamond",
      partes: [
        {
          numero: 1,
          titulo: "Quanto você está disposto a pagar?",
          duracao: "10 min",
          descricao: "Jeová prometeu ensinar os filhos dele. (Isa. 54:13; w09 15/9 21 § 3)\n\nDevemos usar o nosso tempo para comprar a verdade. (Isa. 55:1, 2; w18.11 4 §§ 6-7)\n\nPara escutar com atenção é preciso esforço, mas isso pode salvar a nossa vida. (Isa. 55:3; be 14 §§ 3-5)\n\nPERGUNTE-SE: 'Como posso melhorar meu estudo pessoal?'"
        },
        {
          numero: 2,
          titulo: "Joias espirituais",
          duracao: "10 min",
          joiasEspirituais: [
            {
              texto: "Isa. 54:17",
              pergunta: "Que três fatos importantes a primeira parte desse versículo nos lembra?",
              referencia: "w19.01 6 §§ 14-15"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Leitura da Bíblia",
          duracao: "4 min",
          descricao: "Isa. 54:1-10",
          referencia: "th lição 11"
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
          descricao: "Fale sobre uma das verdades do apêndice A da brochura Ame as Pessoas.",
          referencia: "lmd lição 1 ponto 4"
        },
        {
          numero: 5,
          titulo: "Iniciando conversas",
          duracao: "2 min",
          tipo: "TESTEMUNHO PÚBLICO",
          descricao: "Fale sobre uma das verdades do apêndice A da brochura Ame as Pessoas.",
          referencia: "lmd lição 2 ponto 3"
        },
        {
          numero: 6,
          titulo: "Cultivando o interesse",
          duracao: "2 min",
          tipo: "TESTEMUNHO PÚBLICO",
          descricao: "Deixe um cartão de visita com a pessoa.",
          referencia: "lmd lição 9 ponto 3"
        },
        {
          numero: 7,
          titulo: "Discurso",
          duracao: "5 min",
          descricao: "be 28 § 3–31 § 2 — Tema: Como estudar.",
          referencia: "th lição 14"
        }
      ]
    },
    vidaCrista: {
      nome: "NOSSA VIDA CRISTÃ",
      cor: "red",
      icone: "heart",
      cantico: 97,
      partes: [
        {
          numero: 8,
          titulo: "Não deixe que nada atrapalhe seu estudo pessoal",
          duracao: "15 min",
          descricao: "Consideração.\n\nPode ser desafiador ter uma rotina regular de estudo pessoal. Imagine que você quer incentivar um irmão que está tendo dificuldades em manter uma boa rotina de estudo pessoal e leitura da Bíblia.\n\nEle fala que as seguintes coisas o atrapalham:\n• \"Eu não leio bem.\"\n• \"Eu não gosto de estudar.\"\n• \"Eu não sei por onde começar a leitura da Bíblia nem quanto eu tenho que ler cada dia.\"\n• \"Tem tanta coisa disponível! Como eu decido o que vou estudar cada semana?\"\n• \"Eu tenho tanta coisa pra fazer, que não é fácil arrumar tempo pra estudar.\"\n• \"É difícil me concentrar, e às vezes não consigo me lembrar do que acabei de ler.\"\n\nMostre o VÍDEO Tenha um Estudo Pessoal Profundo da Bíblia. Depois, pergunte:\nQuais sugestões do vídeo você mais gostou?"
        },
        {
          numero: 9,
          titulo: "Estudo bíblico de congregação",
          duracao: "30 min",
          descricao: "lfb histórias 78-79"
        }
      ]
    }
  }
]
