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
    leituraSemana: "ISAÍAS 48-49",
    canticoInicial: 89,
    canticoMeio: 107,
    canticoFinal: 134,
    comentariosIniciais: "1 min",
    comentariosFinais: "3 min",
    tesouros: {
      nome: "TESOUROS DA PALAVRA DE DEUS",
      cor: "blue",
      icone: "diamond",
      partes: [
        {
          numero: 1,
          titulo: "Sinta os benefícios de prestar atenção ao que Jeová diz",
          duracao: "10 min",
          descricao: "Jeová ensina os servos dele. (Isa. 48:17; it 'Instrutor, Ensino' § 2)\n\nDevemos escolher prestar atenção ao que Jeová diz. (Isa. 48:18a; ijwbq artigo 44 §§ 2-3)\n\nAssim, nossa paz será 'como um rio', e a nossa justiça 'como as ondas do mar'. (Isa. 48:18b; lv 199 § 8)\n\nSIGNIFICADO: A palavra hebraica traduzida 'paz' pode passar a ideia de saúde, segurança, boas condições, bem-estar, amizade, inteireza ou totalidade."
        },
        {
          numero: 2,
          titulo: "Joias espirituais",
          duracao: "10 min",
          joiasEspirituais: [
            {
              texto: "Isa. 49:8",
              pergunta: "Quais são os três cumprimentos dessa profecia?",
              referencia: "it 'Tempo aceitável' §§ 1-3"
            }
          ]
        },
        {
          numero: 3,
          titulo: "Leitura da Bíblia",
          duracao: "4 min",
          descricao: "Isa. 48:9-20",
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
          duracao: "3 min",
          tipo: "TESTEMUNHO INFORMAL",
          descricao: "Convide um parente que está inativo para o discurso especial e para a Celebração.",
          referencia: "lmd lição 5 ponto 3"
        },
        {
          numero: 5,
          titulo: "Cultivando o interesse",
          duracao: "4 min",
          tipo: "TESTEMUNHO INFORMAL",
          descricao: "Explique o que acontece numa Celebração para alguém que está pensando em assistir.",
          referencia: "lmd lição 9 ponto 3"
        },
        {
          numero: 6,
          titulo: "Cultivando o interesse",
          duracao: "5 min",
          tipo: "TESTEMUNHO INFORMAL",
          descricao: "Depois que a Celebração terminar, responda as perguntas de alguém que assistiu à reunião.",
          referencia: "lmd lição 8 ponto 3"
        }
      ]
    },
    vidaCrista: {
      nome: "NOSSA VIDA CRISTÃ",
      cor: "red",
      icone: "heart",
      cantico: 107,
      partes: [
        {
          numero: 7,
          titulo: "Aproveite bem as oportunidades do dia mais importante do ano",
          duracao: "15 min",
          descricao: "Consideração.\n\nTodos os anos, quando assistimos à Celebração, temos a oportunidade de mostrar obediência a Jesus e gratidão pelo presente que Jeová nos deu, o resgate. (Luc. 22:19) Mas também é uma época em que somos lembrados de como é grande o amor de Jeová e de Jesus por nós. (Gál. 2:20; 1 João 4:9, 10) Como podemos aproveitar ao máximo a época da Celebração e mostrar gratidão a Jeová? Como podemos ajudar pessoas interessadas a fazer o mesmo?\n\n• Prepare seu coração lendo diariamente os trechos da Leitura da Bíblia para a Celebração;\n• Medite no presente do resgate e em como você pode viver de uma maneira que mostre gratidão por ele;\n• Faça o seu máximo na campanha, convidando parentes, pessoas que você conhece e pessoas do seu território para o discurso especial e a Celebração;\n• Seja simpático e receba com um sorriso as pessoas que forem assistir à Celebração;\n• Esteja disposto a tirar um tempo para responder as perguntas dos visitantes;\n• Fique atento para receber bem os inativos.\n\nMostre o VÍDEO Jesus 'Veio Procurar e Salvar o Que Estava Perdido'. Depois, pergunte:\nPor que é importante receber bem os inativos que forem à Celebração?"
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
