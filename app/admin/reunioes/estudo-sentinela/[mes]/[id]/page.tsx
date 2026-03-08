"use client"

import { useState } from "react"
import { ArrowLeft, Music, ChevronDown, ChevronUp } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Pergunta {
  paragrafo: string
  pergunta: string
  resposta: string
  textoBase?: string
  imagem?: string
}

interface PerguntaRecapitulacao {
  pergunta: string
  resposta: string
}

interface Estudo {
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

// Dados dos estudos de Março 2026
const estudosMarco: Estudo[] = [
  {
    id: 1,
    semana: "Semana 1",
    dataInicio: "2",
    dataFim: "8 de março",
    canticoInicial: 97,
    canticoInicialTitulo: "A Palavra de Deus nos ajuda a viver",
    canticoFinal: 162,
    canticoFinalTitulo: "Preciso de ti",
    titulo: "Continue cuidando da sua 'necessidade espiritual'",
    textoTema: "Felizes os que têm consciência de sua necessidade espiritual.",
    textoTemaRef: "MAT. 5:3",
    objetivo: "Ver como podemos continuar nos beneficiando de tudo o que Jeová nos dá para ficarmos bem alimentados, vestidos e protegidos em sentido espiritual.",
    imagem: "/images/estudo-marco-semana1.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "Com que necessidades básicas Jeová nos criou?",
        textoBase: "JEOVÁ criou os humanos com algumas necessidades básicas. Por exemplo, para continuarmos vivos, precisamos ter o que comer, o que vestir e também de um lugar onde ficamos protegidos. Se ficarmos sem alguma dessas coisas, mesmo que por pouco tempo, a vida se torna muito difícil. Além de ter nos criado com necessidades físicas, Jeová nos criou com uma necessidade espiritual. (Leia Mateus 5:3.) Para sermos felizes de verdade, precisamos ter consciência dessa necessidade e continuar cuidando dela.",
        resposta: "Jeová criou os humanos com necessidades físicas básicas como comida, roupa e abrigo. Além disso, ele nos criou com uma necessidade espiritual. Para sermos felizes de verdade, precisamos ter consciência dessa necessidade e continuar cuidando dela."
      },
      {
        paragrafo: "2",
        pergunta: "Que ilustração nos ajuda a entender o que significa 'ter consciência de nossa necessidade espiritual'?",
        textoBase: "A expressão 'ter consciência de nossa necessidade espiritual' passa a ideia de alguém saber que é pobre, ou mendigo, em sentido espiritual. Podemos imaginar um mendigo vestindo trapos, sentado numa calçada, fraco por não ter o que comer. Da mesma forma, quem tem consciência da sua necessidade espiritual — um mendigo do espírito — precisa de ajuda para melhorar sua situação e quer muito aproveitar tudo o que Jeová dá.",
        resposta: "A expressão passa a ideia de alguém saber que é pobre, ou mendigo, em sentido espiritual. Podemos imaginar um mendigo vestindo trapos, sentado numa calçada, fraco por não ter o que comer. Da mesma forma, quem tem consciência da sua necessidade espiritual precisa de ajuda para melhorar sua situação e quer muito aproveitar tudo o que Jeová dá."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Neste estudo, vamos aprender com uma mulher da Fenícia que implorou pela ajuda de Jesus. Esse relato destaca três qualidades que aqueles que têm consciência de sua necessidade espiritual precisam desenvolver. Depois vamos considerar os exemplos de Pedro, Paulo e Davi, homens que cuidaram de sua necessidade espiritual.",
        resposta: "Vamos aprender com uma mulher da Fenícia que implorou pela ajuda de Jesus. Esse relato destaca três qualidades que aqueles que têm consciência de sua necessidade espiritual precisam desenvolver. Depois vamos considerar os exemplos de Pedro, Paulo e Davi."
      },
      {
        paragrafo: "4",
        pergunta: "Por que uma mulher fenícia foi até Jesus?",
        textoBase: "A filha dela estava 'possuída por um demônio que a atormentava cruelmente'. A mulher se ajoelhou e implorou que Jesus a ajudasse.",
        resposta: "A filha dela estava 'possuída por um demônio que a atormentava cruelmente'. A mulher se ajoelhou e implorou que Jesus a ajudasse."
      },
      {
        paragrafo: "5",
        pergunta: "Que qualidades a mulher fenícia demonstrou e qual foi a reação de Jesus?",
        textoBase: "A mulher fenícia mostrou verdadeira humildade, persistência e fé. Ela não ficou ofendida quando Jesus a comparou a um cachorrinho. Continuou implorando porque tinha fé em Jesus. E Jesus ficou tão impressionado com a fé dela que expulsou o demônio.",
        resposta: "A mulher fenícia mostrou verdadeira humildade, persistência e fé. Ela não ficou ofendida quando Jesus a comparou a um cachorrinho. Continuou implorando porque tinha fé em Jesus. E Jesus ficou tão impressionado com a fé dela que expulsou o demônio que atormentava a filha dela."
      },
      {
        paragrafo: "6",
        pergunta: "O que aprendemos com o exemplo da mulher fenícia?",
        textoBase: "Para cuidarmos de nossa necessidade espiritual, temos que desenvolver humildade, persistência e uma forte fé. Apenas uma pessoa humilde persiste em implorar a ajuda de Deus. Precisamos também ter uma forte fé em Jesus Cristo.",
        resposta: "Para cuidarmos de nossa necessidade espiritual, temos que desenvolver humildade, persistência e uma forte fé. Apenas uma pessoa humilde persiste em implorar a ajuda de Deus. Precisamos também ter uma forte fé em Jesus Cristo e confiar naqueles que ele está usando para orientar os seus discípulos."
      },
      {
        paragrafo: "7",
        pergunta: "Que responsabilidade Pedro recebeu, mas o que ele precisava fazer? (Hebreus 5:14–6:1)",
        textoBase: "Jesus disse a Pedro: 'Alimente as minhas ovelhinhas.' Pedro cuidou dessa responsabilidade de modo fiel e Jeová até o usou para escrever duas cartas da Bíblia. Mesmo assim, Pedro também precisava se alimentar espiritualmente.",
        resposta: "Jesus disse a Pedro: 'Alimente as minhas ovelhinhas.' Pedro cuidou dessa responsabilidade de modo fiel e Jeová até o usou para escrever duas cartas da Bíblia. Mesmo assim, Pedro também precisava se alimentar espiritualmente. Ele estudava as cartas de Paulo, reconhecendo que algumas coisas eram 'difíceis de entender', mas persistiu em estudar com fé."
      },
      {
        paragrafo: "8",
        pergunta: "Como Pedro reagiu a uma nova orientação que recebeu de um anjo?",
        textoBase: "Pedro teve uma visão onde um anjo disse para matar e comer animais impuros segundo a Lei mosaica. De início, Pedro resistiu, mas depois entendeu a vontade de Jeová e ajustou seu modo de pensar.",
        resposta: "Pedro teve uma visão onde um anjo disse para matar e comer animais impuros segundo a Lei mosaica. De início, Pedro resistiu, mas depois entendeu a vontade de Jeová e ajustou seu modo de pensar. Pouco depois, ele aceitou o convite de ir até a casa de Cornélio, um não judeu, e teve a alegria de vê-los aceitar a verdade e ser batizados."
      },
      {
        paragrafo: "9",
        pergunta: "Por que Paulo achava que era importante continuar a crescer em sentido espiritual? (Hebreus 5:14–6:1)",
        textoBase: "Apesar de Paulo já ser bem maduro em sentido espiritual, ele mesmo assim achava que era importante continuar a crescer. Ele disse que ainda não tinha alcançado a perfeição, mas que estava 'correndo em direção ao alvo'. Paulo encorajou outros a fazer o mesmo.",
        resposta: "Apesar de Paulo já ser bem maduro em sentido espiritual, ele mesmo assim achava que era importante continuar a crescer. Ele disse que ainda não tinha alcançado a perfeição, mas que estava 'correndo em direção ao alvo'. Paulo encorajou outros a ter a mesma atitude, dizendo para 'avançarem para a maturidade'."
      },
      {
        paragrafo: "10",
        pergunta: "Por que devemos nos alimentar regularmente de comida espiritual, mesmo que a vida esteja corrida?",
        textoBase: "Quando a vida está corrida, pode ser difícil ter uma boa rotina de estudo pessoal e adoração em família. Mas precisamos continuar nos alimentando regularmente para manter nossa espiritualidade forte. Podemos orar a Jeová por ajuda e fazer ajustes na nossa rotina.",
        resposta: "Quando a vida está corrida, pode ser difícil ter uma boa rotina de estudo pessoal e adoração em família. Mas precisamos continuar nos alimentando regularmente para manter nossa espiritualidade forte. Podemos orar a Jeová por ajuda e fazer ajustes na nossa rotina para priorizar o alimento espiritual."
      },
      {
        paragrafo: "11",
        pergunta: "O que Davi fez para manter sua fé forte, e o que isso nos ensina?",
        textoBase: "Davi vestia a 'armadura' que Jeová fornecia. Ele refletia sobre as criações de Jeová e falava sobre as qualidades de Deus. Davi também estava determinado a proteger a sua mente de coisas prejudiciais.",
        resposta: "Davi vestia a 'armadura' que Jeová fornecia. Ele refletia sobre as criações de Jeová e falava sobre as qualidades de Deus. Davi também estava determinado a proteger a sua mente de coisas prejudiciais, dizendo: 'Não porei diante dos meus olhos nenhuma coisa imprestável.'"
      },
      {
        paragrafo: "12",
        pergunta: "O que podemos fazer para nos proteger espiritualmente? (1 Pedro 5:8, 9)",
        textoBase: "Podemos nos proteger espiritualmente ao vestir a armadura espiritual completa, que inclui a verdade, a justiça, as boas novas, a fé, a salvação e a Palavra de Deus. Também precisamos ficar alertas contra o nosso inimigo, o Diabo.",
        resposta: "Podemos nos proteger espiritualmente ao vestir a armadura espiritual completa, que inclui a verdade, a justiça, as boas novas, a fé, a salvação e a Palavra de Deus. Também precisamos ficar alertas contra o nosso inimigo, o Diabo, resistindo a ele firmes na fé."
      },
      {
        paragrafo: "13",
        pergunta: "O que você está determinado a fazer?",
        textoBase: "Precisamos estar determinados a continuar cuidando da nossa necessidade espiritual. Isso inclui nos alimentar regularmente com comida espiritual, vestir a armadura completa de Deus e nos proteger de influências prejudiciais.",
        resposta: "Estou determinado a continuar cuidando da minha necessidade espiritual. Isso inclui me alimentar regularmente com comida espiritual, vestir a armadura completa de Deus e me proteger de influências prejudiciais. Quero imitar a humildade, persistência e fé da mulher fenícia."
      }
    ],
    recapitulacao: [
      {
        pergunta: "O que podemos fazer para aproveitar bem o alimento espiritual que Jeová nos dá?",
        resposta: "Podemos manter uma rotina de estudo pessoal, participar das reuniões, estudar a Bíblia com a família e meditar no que aprendemos. Mesmo quando a vida está corrida, precisamos priorizar o alimento espiritual, assim como priorizamos a comida física."
      },
      {
        pergunta: "O que podemos fazer para aproveitar bem o revestimento espiritual que Jeová nos dá?",
        resposta: "Podemos vestir a armadura espiritual completa mencionada em Efésios 6:14-17, que inclui a verdade, a justiça, as boas novas da paz, a fé, a salvação e a Palavra de Deus. Precisamos usar essa armadura todos os dias para nos proteger dos ataques de Satanás."
      },
      {
        pergunta: "O que podemos fazer para aproveitar bem a proteção espiritual que Jeová nos dá?",
        resposta: "Podemos ficar alertas contra as tentações e ataques do Diabo, confiar em Jeová, buscar refúgio nele e manter associação com nossos irmãos. Devemos proteger nossa mente de conteúdo prejudicial e seguir o exemplo de Davi, que disse: 'Não porei diante dos meus olhos nenhuma coisa imprestável.'"
      }
    ]
  },
  {
    id: 2,
    semana: "Semana 2",
    dataInicio: "9",
    dataFim: "15 de março",
    canticoInicial: 45,
    canticoInicialTitulo: "A meditação do meu coração",
    canticoFinal: 34,
    canticoFinalTitulo: "Andarei em integridade",
    titulo: "Você é capaz de lutar contra sentimentos negativos!",
    textoTema: "Lancem sobre ele toda a sua ansiedade, porque ele cuida de vocês.",
    textoTemaRef: "1 PED. 5:7",
    objetivo: "Ver como podemos lutar contra sentimentos negativos e manter a nossa alegria no serviço a Jeová.",
    imagem: "/images/estudo-marco-semana2.jpg",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "Por que às vezes podemos ter sentimentos negativos?",
        textoBase: "Vivemos num mundo cheio de problemas e pressões. Às vezes enfrentamos doenças, dificuldades financeiras, problemas na família ou no trabalho. Essas situações podem nos deixar ansiosos, tristes ou desanimados.",
        resposta: "Vivemos num mundo cheio de problemas e pressões. Às vezes enfrentamos doenças, dificuldades financeiras, problemas na família ou no trabalho. Essas situações podem nos deixar ansiosos, tristes ou desanimados. Até servos fiéis de Jeová no passado tiveram esses sentimentos."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Vamos ver como Jeová ajudou servos fiéis no passado a lidar com sentimentos negativos. Também vamos ver o que podemos fazer para manter nossa alegria no serviço a Jeová.",
        resposta: "Vamos ver como Jeová ajudou servos fiéis no passado a lidar com sentimentos negativos. Também vamos ver o que podemos fazer para manter nossa alegria no serviço a Jeová, mesmo quando enfrentamos situações difíceis."
      },
      {
        paragrafo: "4-5",
        pergunta: "Por que Elias ficou desanimado, e como Jeová o ajudou?",
        textoBase: "Elias ficou desanimado quando a rainha Jezabel ameaçou matá-lo. Ele fugiu para o deserto e até pediu para morrer. Jeová o ajudou mandando um anjo com comida e água, deixando-o descansar e dando-lhe uma nova designação.",
        resposta: "Elias ficou desanimado quando a rainha Jezabel ameaçou matá-lo. Ele fugiu para o deserto e até pediu para morrer. Jeová o ajudou mandando um anjo com comida e água, deixando-o descansar, falando com ele de maneira bondosa e dando-lhe uma nova designação."
      },
      {
        paragrafo: "6-7",
        pergunta: "O que aprendemos do modo como Jeová ajudou Elias?",
        textoBase: "Jeová cuidou das necessidades físicas e emocionais de Elias. Ele não criticou Elias por seus sentimentos, mas o ajudou com paciência e bondade. Isso nos ensina que Jeová entende nossos sentimentos e quer nos ajudar.",
        resposta: "Jeová cuidou das necessidades físicas e emocionais de Elias. Ele não criticou Elias por seus sentimentos, mas o ajudou com paciência e bondade. Isso nos ensina que Jeová entende nossos sentimentos e quer nos ajudar quando estamos desanimados."
      },
      {
        paragrafo: "8",
        pergunta: "O que pode nos ajudar quando estamos ansiosos?",
        textoBase: "A oração pode nos ajudar muito quando estamos ansiosos. Podemos 'lançar sobre Jeová toda a nossa ansiedade'. Ele nos convida a contar nossos problemas a ele.",
        resposta: "A oração pode nos ajudar muito quando estamos ansiosos. Podemos 'lançar sobre Jeová toda a nossa ansiedade', porque ele cuida de nós. Jeová nos convida a contar nossos problemas a ele e promete nos dar paz."
      },
      {
        paragrafo: "9-10",
        pergunta: "Por que é importante termos amigos na congregação?",
        textoBase: "Ter amigos na congregação nos ajuda a lidar com sentimentos negativos. Podemos conversar com eles sobre nossos problemas e receber encorajamento. Também podemos ajudar outros, o que nos faz sentir melhor.",
        resposta: "Ter amigos na congregação nos ajuda a lidar com sentimentos negativos. Podemos conversar com eles sobre nossos problemas e receber encorajamento. Também podemos ajudar outros, o que nos faz sentir melhor. Jeová nos deu a congregação como uma fonte de apoio."
      },
      {
        paragrafo: "11-12",
        pergunta: "Como o ministério pode nos ajudar a lidar com sentimentos negativos?",
        textoBase: "O ministério nos ajuda a tirar o foco dos nossos problemas e a pensar em ajudar outros. Quando pregamos as boas novas, sentimos a alegria de fazer a vontade de Jeová e de ajudar pessoas a conhecer a verdade.",
        resposta: "O ministério nos ajuda a tirar o foco dos nossos problemas e a pensar em ajudar outros. Quando pregamos as boas novas, sentimos a alegria de fazer a vontade de Jeová. Isso nos dá um senso de propósito e nos ajuda a manter uma atitude positiva."
      },
      {
        paragrafo: "13",
        pergunta: "O que você está determinado a fazer?",
        textoBase: "Quando tiver sentimentos negativos, vou orar a Jeová, buscar ajuda dos irmãos e continuar ativo no ministério. Vou confiar que Jeová me ajudará a lidar com esses sentimentos.",
        resposta: "Quando tiver sentimentos negativos, vou orar a Jeová, buscar ajuda dos irmãos e continuar ativo no ministério. Vou confiar que Jeová me ajudará a lidar com esses sentimentos e manter minha alegria no serviço a ele."
      }
    ],
    recapitulacao: [
      {
        pergunta: "O que você aprendeu do modo como Jeová ajudou Elias?",
        resposta: "Aprendi que Jeová entende nossos sentimentos e não nos critica quando estamos desanimados. Ele cuida de nossas necessidades físicas e emocionais com paciência e bondade, assim como fez com Elias."
      },
      {
        pergunta: "O que pode ajudá-lo quando estiver ansioso ou desanimado?",
        resposta: "Posso orar a Jeová, conversar com amigos na congregação, me manter ativo no ministério e meditar nas promessas de Jeová. Também posso cuidar da minha saúde física, descansando e me alimentando bem."
      },
      {
        pergunta: "Por que você está determinado a não desistir quando tiver sentimentos negativos?",
        resposta: "Porque Jeová promete me ajudar e me dar forças. Ele já ajudou muitos servos fiéis no passado e vai me ajudar também. Confio que, com a ajuda de Jeová, posso vencer qualquer desafio."
      }
    ]
  },
  {
    id: 3,
    semana: "Semana 3",
    dataInicio: "16",
    dataFim: "22 de março",
    canticoInicial: 20,
    canticoInicialTitulo: "Dá-nos mais fé",
    canticoFinal: 19,
    canticoFinalTitulo: "A Ceia do Senhor",
    titulo: "Por que precisamos do resgate?",
    textoTema: "O Filho do homem veio para dar a sua vida como resgate em troca de muitos.",
    textoTemaRef: "MAT. 20:28",
    objetivo: "Fortalecer nossa gratidão pelo resgate ao entender por que precisamos dele.",
    imagem: "/images/estudo-marco-semana3.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "Qual é o maior presente que Jeová já deu à humanidade?",
        textoBase: "O resgate é o maior presente que Jeová já deu à humanidade. Por meio dele, temos a esperança de viver para sempre e de ter um relacionamento achegado com Deus.",
        resposta: "O resgate é o maior presente que Jeová já deu à humanidade. Por meio dele, temos a esperança de viver para sempre e de ter um relacionamento achegado com Deus. É a maior expressão do amor de Jeová por nós."
      },
      {
        paragrafo: "2",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Vamos ver por que precisamos do resgate, o que Jeová e Jesus fizeram para nos dar esse presente e como podemos mostrar gratidão por ele.",
        resposta: "Vamos ver por que precisamos do resgate, o que Jeová e Jesus fizeram para nos dar esse presente e como podemos mostrar gratidão por ele. Isso vai fortalecer nossa apreciação pelo sacrifício de Jesus."
      },
      {
        paragrafo: "3-4",
        pergunta: "Por que a humanidade precisa do resgate?",
        textoBase: "Adão e Eva pecaram e perderam a vida perfeita que tinham. Eles passaram o pecado e a morte para todos os seus descendentes. Por isso, todos nós nascemos imperfeitos e precisamos do resgate.",
        resposta: "Adão e Eva pecaram e perderam a vida perfeita que tinham. Eles passaram o pecado e a morte para todos os seus descendentes. Por isso, todos nós nascemos imperfeitos, adoecemos e morremos. Precisamos do resgate para sermos libertados do pecado e da morte."
      },
      {
        paragrafo: "5-6",
        pergunta: "O que Jeová fez para nos salvar do pecado e da morte?",
        textoBase: "Jeová providenciou o resgate ao enviar seu Filho amado, Jesus, à Terra. Jesus viveu uma vida perfeita e morreu como sacrifício para pagar pelos nossos pecados.",
        resposta: "Jeová providenciou o resgate ao enviar seu Filho amado, Jesus, à Terra. Mesmo amando muito seu Filho, Jeová estava disposto a vê-lo sofrer e morrer para nos salvar. Jesus viveu uma vida perfeita e morreu como sacrifício para pagar pelos nossos pecados."
      },
      {
        paragrafo: "7-8",
        pergunta: "O que Jesus fez para nos dar o resgate?",
        textoBase: "Jesus deixou o céu e veio à Terra como humano. Ele viveu uma vida perfeita, enfrentou sofrimento e morreu numa estaca de tortura. Jesus fez tudo isso de boa vontade porque nos ama.",
        resposta: "Jesus deixou o céu e veio à Terra como humano. Ele viveu uma vida perfeita, enfrentou sofrimento e morreu numa estaca de tortura. Jesus fez tudo isso de boa vontade porque nos ama e queria que tivéssemos a oportunidade de viver para sempre."
      },
      {
        paragrafo: "9-10",
        pergunta: "O que o resgate torna possível para nós?",
        textoBase: "O resgate torna possível sermos perdoados dos nossos pecados, ter um relacionamento com Jeová e ter a esperança de viver para sempre. Também nos dá paz de espírito, sabendo que Jeová nos ama.",
        resposta: "O resgate torna possível sermos perdoados dos nossos pecados, ter um relacionamento achegado com Jeová e ter a esperança de viver para sempre num paraíso na Terra. Também nos dá paz de espírito e a certeza do amor de Jeová."
      },
      {
        paragrafo: "11-12",
        pergunta: "O que você sente quando pensa no resgate?",
        textoBase: "Quando pensamos no que Jeová e Jesus fizeram por nós, sentimos profunda gratidão. Queremos mostrar essa gratidão vivendo de um modo que agrada a Jeová.",
        resposta: "Quando pensamos no que Jeová e Jesus fizeram por nós, sentimos profunda gratidão e amor. Queremos mostrar essa gratidão vivendo de um modo que agrada a Jeová e contando a outros sobre esse maravilhoso presente."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Por que a humanidade precisa do resgate?",
        resposta: "Porque Adão e Eva pecaram e passaram o pecado e a morte para todos os seus descendentes. Nascemos imperfeitos e não conseguimos nos salvar sozinhos. Só o resgate pode nos libertar do pecado e da morte."
      },
      {
        pergunta: "O que Jeová e Jesus fizeram para nos dar o resgate?",
        resposta: "Jeová enviou seu Filho amado à Terra, mesmo sabendo que ele iria sofrer e morrer. Jesus deixou o céu, viveu como humano perfeito e morreu como sacrifício pelos nossos pecados. Ambos fizeram isso por amor a nós."
      },
      {
        pergunta: "Como o resgate beneficia você pessoalmente?",
        resposta: "O resgate me permite ser perdoado dos meus pecados, ter um relacionamento com Jeová e ter a esperança de viver para sempre. Me dá paz de espírito e a certeza de que Jeová me ama, apesar das minhas imperfeições."
      }
    ]
  },
  {
    id: 4,
    semana: "Semana 4",
    dataInicio: "23",
    dataFim: "29 de março",
    canticoInicial: 18,
    canticoInicialTitulo: "Teu memorial",
    canticoFinal: 14,
    canticoFinalTitulo: "O novo Rei da Terra",
    titulo: "Como você vai mostrar sua gratidão pelo resgate?",
    textoTema: "O amor que o Cristo tem nos constrange.",
    textoTemaRef: "2 COR. 5:14",
    objetivo: "Ver como podemos mostrar nossa gratidão pelo resgate na nossa vida diária.",
    imagem: "/images/estudo-marco-semana4.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "O que devemos fazer por causa do resgate?",
        textoBase: "Devemos mostrar gratidão pelo resgate não apenas uma vez por ano, mas todos os dias. Isso envolve a maneira como vivemos e as escolhas que fazemos.",
        resposta: "Devemos mostrar gratidão pelo resgate não apenas uma vez por ano na Celebração, mas todos os dias. Isso envolve a maneira como vivemos, as escolhas que fazemos e como tratamos os outros."
      },
      {
        paragrafo: "2",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Vamos ver maneiras práticas de mostrar gratidão pelo resgate. Isso inclui nosso modo de viver, nossa pregação e como tratamos nossos irmãos.",
        resposta: "Vamos ver maneiras práticas de mostrar gratidão pelo resgate. Isso inclui nosso modo de viver, nossa participação na pregação e como tratamos nossos irmãos na fé."
      },
      {
        paragrafo: "3-4",
        pergunta: "Como nosso modo de viver mostra gratidão pelo resgate?",
        textoBase: "Mostramos gratidão pelo resgate quando vivemos de acordo com os padrões de Jeová. Evitamos práticas que Jeová condena e nos esforçamos para imitar Jesus.",
        resposta: "Mostramos gratidão pelo resgate quando vivemos de acordo com os padrões de Jeová. Evitamos práticas que ele condena, como imoralidade e desonestidade. Nos esforçamos para imitar Jesus em tudo o que fazemos."
      },
      {
        paragrafo: "5-6",
        pergunta: "Por que a pregação é uma maneira de mostrar gratidão pelo resgate?",
        textoBase: "Quando pregamos, ajudamos outros a aprender sobre o resgate e a ter a mesma esperança que nós temos. Isso mostra que valorizamos o presente de Jeová e queremos que outros também se beneficiem dele.",
        resposta: "Quando pregamos, ajudamos outros a aprender sobre o resgate e a ter a mesma esperança que nós temos. Isso mostra que valorizamos o presente de Jeová e queremos que outros também se beneficiem dele. É uma expressão de amor ao próximo."
      },
      {
        paragrafo: "7-8",
        pergunta: "Como devemos tratar nossos irmãos, e por quê?",
        textoBase: "Devemos tratar nossos irmãos com amor, paciência e perdão. Jesus morreu por eles também. Se Jeová estava disposto a dar seu Filho por eles, devemos tratá-los com o mesmo amor.",
        resposta: "Devemos tratar nossos irmãos com amor, paciência e perdão. Jesus morreu por eles também. Se Jeová estava disposto a dar seu Filho por eles, devemos tratá-los com o mesmo amor e respeito, perdoando uns aos outros."
      },
      {
        paragrafo: "9-10",
        pergunta: "O que a Celebração significa para você?",
        textoBase: "A Celebração é uma ocasião especial para meditar no resgate e renovar nossa gratidão. É um momento para refletir sobre o amor de Jeová e de Jesus por nós.",
        resposta: "A Celebração é uma ocasião especial para meditar no resgate e renovar nossa gratidão. É um momento para refletir sobre o amor de Jeová e de Jesus por nós, e para nos comprometermos a viver de um modo que honra esse sacrifício."
      },
      {
        paragrafo: "11-12",
        pergunta: "O que você está determinado a fazer?",
        textoBase: "Estou determinado a mostrar minha gratidão pelo resgate todos os dias. Quero viver de acordo com os padrões de Jeová, pregar as boas novas e tratar meus irmãos com amor.",
        resposta: "Estou determinado a mostrar minha gratidão pelo resgate todos os dias, não apenas na Celebração. Quero viver de acordo com os padrões de Jeová, pregar as boas novas e tratar meus irmãos com amor e perdão."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Como seu modo de viver pode mostrar gratidão pelo resgate?",
        resposta: "Posso viver de acordo com os padrões de Jeová, evitando práticas que ele condena e me esforçando para imitar Jesus. Minhas escolhas diárias mostram que valorizo o sacrifício que Jeová e Jesus fizeram por mim."
      },
      {
        pergunta: "Por que a pregação é uma maneira de mostrar gratidão pelo resgate?",
        resposta: "Porque ao pregar, ajudo outros a aprender sobre o resgate e a ter a esperança de vida eterna. Isso mostra que valorizo o presente de Jeová e quero que outros também se beneficiem dele."
      },
      {
        pergunta: "O que você vai fazer para mostrar gratidão pelo resgate?",
        resposta: "Vou me esforçar para viver de um modo que agrada a Jeová, participar zelosamente na pregação e tratar meus irmãos com amor e perdão. Vou meditar regularmente no resgate para manter minha gratidão viva."
      }
    ]
  },
  {
    id: 5,
    semana: "Semana 5",
    dataInicio: "30 de março",
    dataFim: "5 de abril",
    canticoInicial: 76,
    canticoInicialTitulo: "Como é bonita a paz",
    canticoFinal: 160,
    canticoFinalTitulo: "As boas novas sobre Jesus",
    titulo: "Fale a verdade de modo agradável",
    textoTema: "Jeová, o Deus da verdade.",
    textoTemaRef: "SAL. 31:5",
    objetivo: "Ver como podemos falar a verdade de uma forma que traga bons resultados.",
    imagem: "/images/estudo-marco-semana5.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "O que precisamos fazer para nos tornar parte da família de Jeová?",
        textoBase: "A verdade da Palavra de Deus influencia toda a nossa vida. Só podemos nos tornar parte da família de Jeová se amarmos a verdade e vivermos de acordo com ela.",
        resposta: "A verdade da Palavra de Deus influencia toda a nossa vida. Só podemos nos tornar parte da família de Jeová se amarmos a verdade e vivermos de acordo com ela. Isso inclui sermos honestos no que falamos e fazemos."
      },
      {
        paragrafo: "2",
        pergunta: "Jesus sempre falava a verdade? Como as pessoas reagiam?",
        textoBase: "Jesus sempre falava a verdade, mesmo que suas palavras não agradassem a todos. Até mesmo os inimigos dele reconheciam isso. Suas palavras dividiam o mundo em dois grupos: aqueles que amam a verdade e aqueles que não amam.",
        resposta: "Jesus sempre falava a verdade, mesmo que suas palavras não agradassem a todos. Até mesmo os inimigos dele reconheciam isso. Jesus sabia que a mensagem que pregava dividiria o mundo em dois grupos: aqueles que amam a verdade da Bíblia e aqueles que não amam."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Vamos responder às perguntas: Onde podemos encontrar a verdade? Por que, como e quando devemos falar a verdade?",
        resposta: "Vamos responder às perguntas: Onde podemos encontrar a verdade? Por que, como e quando devemos falar a verdade? Isso vai nos ajudar a falar a verdade de maneira ainda mais agradável, ou seja, com jeito e no momento certo."
      },
      {
        paragrafo: "4",
        pergunta: "Por que podemos dizer que Jeová é a Fonte da verdade?",
        textoBase: "Tudo o que Jeová diz é verdadeiro. Ele fala a verdade quando diz o que é certo e o que é errado. Tudo o que ele prediz sobre o futuro se cumpre. Ele nunca quebra uma promessa.",
        resposta: "Tudo o que Jeová diz é verdadeiro. Ele fala a verdade quando diz o que é certo e o que é errado. Tudo o que ele prediz sobre o futuro se cumpre. Ele nunca quebra uma promessa. Não é à toa que Jeová seja conhecido como o 'Deus da verdade'."
      },
      {
        paragrafo: "5",
        pergunta: "Por que não é difícil conhecer o 'Deus da verdade'?",
        textoBase: "Para qualquer lugar que olhamos, vemos provas de que Deus existe. Paulo disse que Deus quer que 'o achemos' e que ele 'não está longe de cada um de nós'.",
        resposta: "Para qualquer lugar que olhamos, vemos provas de que Deus existe. Paulo disse que Deus quer que 'o achemos' e que ele 'não está longe de cada um de nós'. Na realidade, Jeová atrai pessoas humildes que estão procurando pela verdade."
      },
      {
        paragrafo: "6",
        pergunta: "Quais são algumas das verdades que encontramos na Bíblia?",
        textoBase: "A Bíblia ensina verdades sobre a origem do Universo e da vida na Terra, a origem do pecado, do sofrimento e da morte. Podemos confiar na promessa de que Jeová vai desfazer todos os danos causados pelo Diabo.",
        resposta: "A Bíblia ensina verdades sobre a origem do Universo e da vida na Terra, a origem do pecado, do sofrimento e da morte. Podemos confiar na promessa de que Jeová, por meio de seu Filho, vai desfazer todos os danos causados pelo Diabo."
      },
      {
        paragrafo: "7-8",
        pergunta: "Faz diferença a nossa motivação ao falar a verdade? Dê um exemplo.",
        textoBase: "Sim, faz diferença. Quando Jesus pregava, algumas pessoas possuídas por demônios gritavam: 'Você é o Filho de Deus.' Os demônios disseram a verdade, mas a motivação deles era egoísta. Jesus não gostou e ordenou que não falassem.",
        resposta: "Sim, faz diferença. Quando Jesus pregava, algumas pessoas possuídas por demônios gritavam: 'Você é o Filho de Deus.' Os demônios disseram a verdade, mas talvez quisessem ganhar a confiança das pessoas para depois desviá-las. A motivação deles era egoísta."
      },
      {
        paragrafo: "9",
        pergunta: "O que devemos evitar fazer, e por quê?",
        textoBase: "Devemos evitar chamar atenção para nós mesmos. Divulgar informações confidenciais pode nos fazer subir no conceito das pessoas, mas não no conceito de Jeová.",
        resposta: "Devemos evitar chamar atenção para nós mesmos. Imagine que um irmão nos confiou uma informação confidencial e nós a divulgamos. Isso pode nos fazer subir no conceito das pessoas, mas não no conceito de Jeová."
      },
      {
        paragrafo: "10",
        pergunta: "O que significa falar palavras 'agradáveis'?",
        textoBase: "Paulo lembrou aos cristãos de Colossos que nossas palavras devem ser 'sempre agradáveis'. A expressão no idioma original passa a ideia de que nossas palavras precisam ser bondosas e atraentes.",
        resposta: "Paulo lembrou aos cristãos de Colossos que nossas palavras devem ser 'sempre agradáveis'. A expressão no idioma original passa a ideia de que nossas palavras, além de beneficiar os nossos ouvintes, precisam ser bondosas e atraentes."
      },
      {
        paragrafo: "11-12",
        pergunta: "Por que devemos ensinar a verdade com cuidado? Dê um exemplo.",
        textoBase: "A Bíblia é comparada a uma espada afiada que pode revelar quem nós realmente somos por dentro. Mas se não usarmos a Bíblia com cuidado, podemos acabar ofendendo as pessoas.",
        resposta: "A Bíblia é comparada a uma espada afiada. Mas se não usarmos a Bíblia com cuidado, podemos acabar ofendendo as pessoas. Por exemplo, se alguém comemora o Natal e nós logo na primeira conversa falamos que essa comemoração não é aprovada por Deus, isso não seria falar de modo agradável."
      },
      {
        paragrafo: "13",
        pergunta: "O que significa temperar nossas palavras com sal?",
        textoBase: "Paulo disse que devemos 'temperar' nossas palavras para apresentar a verdade de uma forma que agrade o 'gosto' do nosso ouvinte.",
        resposta: "Paulo disse que devemos 'temperar' nossas palavras para apresentar a verdade de uma forma que agrade o 'gosto' do nosso ouvinte. Assim como ao cozinhar devemos pensar no gosto de quem vai comer, ao falar a verdade devemos adaptar nossas palavras de acordo com nosso ouvinte."
      },
      {
        paragrafo: "14-15",
        pergunta: "Jesus ensinava tudo o que sabia para os seus discípulos? Por que devemos seguir o exemplo dele?",
        textoBase: "Jesus não tentava ensinar tudo o que sabia porque levava em conta as limitações dos seus discípulos. Ele entendia que não era a hora certa de eles aprenderem algumas verdades.",
        resposta: "Jesus ensinava de forma agradável e bondosamente ensinava muitas coisas para seus seguidores. Mas ele não tentava ensinar tudo o que sabia porque levava em conta as limitações dos seus discípulos. Devemos dizer o que os estudantes precisam saber na hora em que eles precisam saber."
      },
      {
        paragrafo: "16",
        pergunta: "Como podemos ajudar nossos estudantes a 'continuar andando na verdade'?",
        textoBase: "Devemos dar um bom exemplo, mostrar pelo nosso modo de vida que acreditamos nas promessas de Deus, ensinar a verdade com a motivação correta e no momento certo.",
        resposta: "Devemos dar um bom exemplo, mostrar pelo nosso modo de vida que acreditamos nas promessas de Deus, ensinar a verdade com a motivação correta e no momento certo, falar de forma agradável usando palavras gentis e bondosas."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Por que devemos falar a verdade com a motivação correta?",
        resposta: "Porque Jeová observa não apenas o que dizemos, mas também por que dizemos. Devemos falar a verdade para ajudar outros, não para chamar atenção para nós mesmos ou prejudicar alguém."
      },
      {
        pergunta: "Como podemos falar a verdade de modo agradável?",
        resposta: "Podemos usar palavras bondosas e atraentes, temperar nossas palavras com sal, levar em conta o gosto e a cultura do nosso ouvinte, e escolher o momento certo para falar. Devemos imitar Jesus, que ensinava com paciência."
      },
      {
        pergunta: "Como você pode ajudar seus estudantes a 'continuar andando na verdade'?",
        resposta: "Posso dar um bom exemplo pelo meu modo de vida, ensinar a verdade com a motivação correta, falar de forma agradável e ensinar o que os estudantes precisam saber na hora certa. Devo dar todo o crédito a Jeová."
      }
    ]
  }
]

export default function EstudoDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [expandedPergunta, setExpandedPergunta] = useState<string | null>(null)
  const [expandedRecap, setExpandedRecap] = useState<number | null>(null)

  const estudoId = Number(params.id)
  const estudo = estudosMarco.find(e => e.id === estudoId)

  if (!estudo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Estudo não encontrado</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header com botão voltar */}
      <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            className="text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Conteúdo do Estudo */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Cântico Inicial */}
        <div className="flex items-center gap-2 text-blue-400 mb-4">
          <Music className="w-5 h-5" />
          <span className="font-medium">CÂNTICO {estudo.canticoInicial}</span>
          <span className="text-zinc-400">{estudo.canticoInicialTitulo}</span>
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-300 mb-6 leading-tight">
          {estudo.titulo}
        </h1>

        {/* Texto Tema */}
        <div className="mb-6">
          <p className="text-zinc-300">
            <span className="font-bold uppercase">NOSSO TEXTO DO ANO PARA 2026: </span>
            <span className="italic">"{estudo.textoTema}"</span>
            <span className="text-blue-400"> — {estudo.textoTemaRef}</span>
          </p>
        </div>

        {/* Objetivo */}
        <div className="border-l-4 border-amber-500 pl-4 py-2 mb-8 bg-zinc-900/50">
          <p className="text-zinc-400 uppercase text-sm font-bold mb-1">OBJETIVO</p>
          <p className="text-zinc-200">{estudo.objetivo}</p>
        </div>

        {/* Perguntas e Respostas */}
        <div className="space-y-4 mb-8">
          {estudo.perguntas.map((pergunta, index) => (
            <div key={index} className="border-b border-zinc-800 pb-4">
              {/* Pergunta */}
              <div 
                className="cursor-pointer"
                onClick={() => setExpandedPergunta(
                  expandedPergunta === `${estudo.id}-${index}` ? null : `${estudo.id}-${index}`
                )}
              >
                <p className="text-zinc-300 mb-2">
                  <span className="font-bold text-white">{pergunta.paragrafo}. </span>
                  {pergunta.pergunta}
                </p>
                
                {/* Caixa de resposta */}
                <div className={`rounded-lg p-4 transition-colors ${
                  expandedPergunta === `${estudo.id}-${index}` 
                    ? "bg-green-900/30 border border-green-700" 
                    : "bg-zinc-800 border border-zinc-700"
                }`}>
                  {expandedPergunta === `${estudo.id}-${index}` ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-400 text-sm font-medium">RESPOSTA</span>
                        <ChevronUp className="w-5 h-5 text-green-400" />
                      </div>
                      <p className="text-green-100">{pergunta.resposta}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-sm">Toque para ver a resposta</span>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Texto Base */}
              {pergunta.textoBase && expandedPergunta === `${estudo.id}-${index}` && (
                <div className="mt-4 text-zinc-400 text-sm leading-relaxed">
                  <p>{pergunta.textoBase}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Perguntas de Recapitulação */}
        <Card className="bg-amber-900/20 border-amber-700/50 mb-8">
          <CardContent className="p-6">
            <h3 className="text-amber-400 font-bold text-lg mb-4 uppercase">
              O Que Você Aprendeu?
            </h3>
            <div className="space-y-4">
              {estudo.recapitulacao.map((recap, index) => (
                <div 
                  key={index}
                  className="cursor-pointer"
                  onClick={() => setExpandedRecap(expandedRecap === index ? null : index)}
                >
                  <p className="text-amber-200 font-medium mb-2">{recap.pergunta}</p>
                  <div className={`rounded-lg p-3 transition-colors ${
                    expandedRecap === index
                      ? "bg-amber-800/30 border border-amber-600"
                      : "bg-zinc-800/50 border border-zinc-700"
                  }`}>
                    {expandedRecap === index ? (
                      <p className="text-amber-100">{recap.resposta}</p>
                    ) : (
                      <div className="flex items-center justify-between text-zinc-400">
                        <span className="text-sm">Toque para ver a resposta</span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cântico Final */}
        <div className="flex items-center justify-center gap-3 py-6 border-t border-zinc-800">
          <Music className="w-6 h-6 text-blue-400" />
          <div className="text-center">
            <p className="text-blue-400 font-bold text-lg">CÂNTICO {estudo.canticoFinal}</p>
            <p className="text-zinc-400">{estudo.canticoFinalTitulo}</p>
          </div>
        </div>

        {/* Botão Voltar no final */}
        <div className="flex justify-center py-6">
          <Button 
            onClick={() => router.back()} 
            variant="outline"
            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lista de estudos
          </Button>
        </div>
      </div>
    </div>
  )
}
