"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { ArrowLeft, Music, ChevronDown, ChevronUp, Download, ChevronLeft, ChevronRight, Minus, Plus, Maximize2, Minimize2, Star, Share2, CheckCircle2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { processarTextoBiblico } from "@/components/biblia-referencia"
import { BarraProgresso } from "@/components/sentinela/barra-progresso"
import { estudosAbril } from "@/lib/data/estudos-abril"
import { estudosMarco } from "@/lib/data/estudos-marco"
import { estudosMaio } from "@/lib/data/estudos-maio"

interface Pergunta {
  paragrafo: string
  pergunta: string
  resposta: string
  textoBase?: string
  imagem?: string
  imagemDescricao?: string
  imagemLegenda?: string
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

// Dados importados dos arquivos:
// - @/lib/data/estudos-marco.ts (estudosMarco)
// - @/lib/data/estudos-abril.ts (estudosAbril)
// - @/lib/data/estudos-maio.ts (estudosMaio)

// Componente auxiliar para o número do parágrafo em círculo (AZUL)
  const ParagrafoNumero = ({ numero }: { numero: string }) => (
  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
  {numero.split('-')[0]}
  </div>
  )

// INÍCIO DOS COMPONENTES - Dados importados dos arquivos externos
// estudosMarco importado de @/lib/data/estudos-marco.ts
// estudosAbril importado de @/lib/data/estudos-abril.ts
// estudosMaio importado de @/lib/data/estudos-maio.ts

/* Código antigo de dados removido - agora usa arquivos externos */

// Componente de Pergunta otimizado com memo (dados vêm dos arquivos importados)
const _dataSourceInfo = "Dados carregados de estudos-marco.ts, estudos-abril.ts e estudos-maio.ts"

/*
INÍCIO DO BLOCO A SER REMOVIDO - código antigo
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
        pergunta: "Com que necessidades básicas Jeová nos criou? (Mateus 5:3)",
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
        textoBase: "Certa vez, uma mulher fenícia foi até Jesus. A filha dela estava 'possuída por um demônio que a atormentava cruelmente'. (Mat. 15:21-28) A mulher se ajoelhou e implorou que Jesus a ajudasse. Vamos ver três qualidades que ela demonstrou e que nós podemos imitar.",
        resposta: "A filha dela estava 'possuída por um demônio que a atormentava cruelmente'. A mulher se ajoelhou e implorou que Jesus a ajudasse. Vamos ver três qualidades que ela demonstrou e que nós podemos imitar: humildade, persistência e fé."
      },
      {
        paragrafo: "5",
        pergunta: "Que qualidades a mulher fenícia demonstrou e qual foi a reação de Jesus? (Veja também a imagem.)",
        textoBase: "A mulher fenícia mostrou verdadeira humildade. Por que podemos dizer isso? Porque ela não ficou ofendida pelo modo como Jesus falou. Jesus a comparou a um cachorrinho, que talvez fosse um animal de estimação comum para os não judeus. Como você teria reagido se estivesse na situação dela? Teria ficado ofendido e desistido de pedir a ajuda de Jesus? Não foi isso que a mulher fenícia fez. Ela mostrou não apenas humildade, mas também persistência. Tanto é que ela continuou implorando que Jesus a ajudasse. Por quê? Por causa da sua fé em Jesus. E Jesus ficou tão impressionado com a fé dela que fez algo incrível. Ele tinha acabado de dizer: 'Fui enviado apenas às ovelhas perdidas da casa de Israel.' Mesmo assim, ele decidiu fazer o que a mulher tinha pedido e expulsou o demônio que atormentava a filha dela.",
        resposta: "A mulher fenícia mostrou verdadeira humildade, persistência e fé. Ela não ficou ofendida quando Jesus a comparou a um cachorrinho. Continuou implorando porque tinha fé em Jesus. E Jesus ficou tão impressionado com a fé dela que expulsou o demônio que atormentava a filha dela, mesmo tendo dito antes que foi enviado apenas às ovelhas perdidas da casa de Israel.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026001/univ/art/2026001_univ_lsr_xl.jpg",
        imagemLegenda: "A mulher fenícia precisou de humildade, persistência e fé para receber a ajuda que queria",
        imagemDescricao: "Mulher fenícia ajoelhada diante de Jesus, demonstrando humildade ao pedir ajuda para sua filha que estava possuída por um demônio."
      },
      {
        paragrafo: "6",
        pergunta: "O que aprendemos com o exemplo da mulher fenícia?",
        textoBase: "Para cuidarmos de nossa necessidade espiritual, temos que desenvolver essas mesmas qualidades. Precisamos ser humildes, persistentes e ter uma forte fé. Apenas uma pessoa humilde persiste em implorar a ajuda de Deus. Precisamos também ter uma forte fé em Jesus Cristo e confiar naqueles que ele está usando para orientar os seus discípulos. (Mat. 24:45-47) Se demonstrarmos essas qualidades, Jeová e seu Filho vão ficar felizes de nos ajudar a cuidar de nossa necessidade espiritual. (Veja também Tiago 1:5-7.) Agora vamos ver o que Jeová nos dá para ficarmos bem alimentados, vestidos e protegidos em sentido espiritual. O exemplo dos apóstolos Pedro e Paulo, e também do rei Davi, vai nos ajudar a saber o que temos que fazer para cuidar dessa necessidade.",
        resposta: "Para cuidarmos de nossa necessidade espiritual, temos que desenvolver humildade, persistência e uma forte fé. Apenas uma pessoa humilde persiste em implorar a ajuda de Deus. Precisamos também ter uma forte fé em Jesus Cristo e confiar naqueles que ele está usando para orientar os seus discípulos. Se demonstrarmos essas qualidades, Jeová e seu Filho vão ficar felizes de nos ajudar."
      },
      {
        paragrafo: "7",
        pergunta: "Que responsabilidade Pedro recebeu, mas o que ele precisava fazer? (Hebreus 5:14-6:1)",
        textoBase: "Veja o exemplo do apóstolo Pedro. Ele foi um dos primeiros judeus a reconhecer que Jesus era o Messias — aquele que Jeová estava usando para alimentar seu povo com 'declarações de vida eterna'. (João 6:66-68) Antes de voltar para o céu, Jesus disse a Pedro: 'Alimente as minhas ovelhinhas.' (João 21:17) Pedro cuidou dessa responsabilidade de modo fiel, e Jeová até o usou para escrever duas cartas que mais tarde passaram a fazer parte da Bíblia. Mesmo assim, Pedro também precisava se alimentar espiritualmente. Por exemplo, ele estudava as cartas que o apóstolo Paulo tinha escrito. Pedro reconheceu que algumas das coisas que Paulo escreveu eram 'difíceis de entender'. (2 Ped. 3:15, 16) Mas ele com certeza persistiu em estudar. Ele tinha fé de que Jeová o ajudaria a digerir, ou seja, a entender e aplicar, o 'alimento sólido' que Paulo tinha sido inspirado a servir em suas cartas. — Leia Hebreus 5:14–6:1.",
        resposta: "Jesus disse a Pedro: 'Alimente as minhas ovelhinhas.' Pedro cuidou dessa responsabilidade de modo fiel e Jeová até o usou para escrever duas cartas da Bíblia. Mesmo assim, Pedro também precisava se alimentar espiritualmente. Ele estudava as cartas de Paulo, reconhecendo que algumas coisas eram 'difíceis de entender', mas persistiu em estudar com fé de que Jeová o ajudaria a digerir o 'alimento sólido'."
      },
      {
        paragrafo: "8",
        pergunta: "Como Pedro reagiu a uma nova orientação que recebeu de um anjo?",
        textoBase: "Pedro mostrou que tinha fé em Jeová por obedecer às orientações que recebia. Por exemplo, quando estava na cidade de Jope, ele teve uma visão. Nela, um anjo disse para Pedro matar e comer animais que eram impuros de acordo com a Lei mosaica. Para um judeu, essa orientação deve ter sido chocante. Tanto que, de início, Pedro respondeu: 'De jeito nenhum, Senhor, porque nunca comi nada aviltado ou impuro.' Daí o anjo disse: 'Pare de chamar de impuras as coisas que Deus purificou.' (Atos 10:9-15) Pedro entendeu a vontade de Jeová e ajustou seu modo de pensar. Como sabemos disso? Pouco depois de receber essa visão, três homens enviados por um não judeu chamado Cornélio chegaram e convidaram Pedro para ir até a casa do seu senhor. Os judeus consideravam os não judeus impuros. Então, antes da visão, Pedro jamais teria aceitado entrar na casa daquele homem. (Atos 10:28, 29) Mas ele aceitou imediatamente a orientação que Jeová tinha acabado de dar. (Pro. 4:18) Pedro pregou a Cornélio e aos parentes e amigos que estavam na casa dele e teve a alegria de ver todos eles aceitar a verdade, receber espírito santo e ser batizados. — Atos 10:44-48.",
        resposta: "Pedro teve uma visão onde um anjo disse para matar e comer animais impuros segundo a Lei mosaica. De início, Pedro resistiu, mas depois entendeu a vontade de Jeová e ajustou seu modo de pensar. Ele aceitou imediatamente a orientação e foi até a casa de Cornélio, um não judeu, onde teve a alegria de ver todos aceitarem a verdade e serem batizados."
      },
      {
        paragrafo: "9",
        pergunta: "Que dois motivos temos para desenvolver um forte desejo por alimento espiritual sólido?",
        textoBase: "Assim como Pedro, devemos nos alimentar regularmente das verdades básicas, ou do leite, da Palavra de Deus. Também devemos desenvolver o desejo por alimento espiritual sólido, ou seja, verdades que talvez sejam mais difíceis de entender. Precisamos reservar um tempo e nos esforçar para entender mais a fundo a Palavra de Deus. Mas esse esforço vale a pena! Por quê? Por pelo menos dois motivos. Primeiro, vamos aprender coisas sobre Jeová que aumentam nosso amor e respeito por ele. E segundo, vamos ficar mais motivados a falar com outros sobre o nosso maravilhoso Pai celestial. (Rom. 11:33; Apo. 4:11) O exemplo de Pedro nos ensina outra lição: Quando o nosso entendimento de uma verdade bíblica é ajustado, precisamos ser rápidos para adaptar nosso modo de pensar e de agir. Só assim vamos continuar bem alimentados espiritualmente e úteis para Jeová.",
        resposta: "Primeiro, vamos aprender coisas sobre Jeová que aumentam nosso amor e respeito por ele. E segundo, vamos ficar mais motivados a falar com outros sobre o nosso maravilhoso Pai celestial. Quando o nosso entendimento de uma verdade bíblica é ajustado, precisamos ser rápidos para adaptar nosso modo de pensar e de agir."
      },
      {
        paragrafo: "10",
        pergunta: "De acordo com Colossenses 3:8-10, o que envolve estar bem vestido em sentido espiritual?",
        textoBase: "Para agradar a Deus, devemos aproveitar outra coisa que Jeová nos dá: nossa vestimenta espiritual. Como assim? O apóstolo Paulo escreveu que devemos nos 'despir da velha personalidade' e nos 'revestir da nova personalidade'. (Leia Colossenses 3:8-10.) Fazer isso é um processo contínuo, que exige tempo e esforço. Veja o exemplo de Paulo. Quando era jovem, ele se esforçava para agradar a Deus. (Gál. 1:14; Fil. 3:4, 5) Mas ele não tinha conhecimento exato da vontade de Deus e, por isso, era pobre em sentido espiritual. Por não conhecer os ensinos de Jesus e ser orgulhoso, Paulo se tornou uma pessoa 'insolente', com várias características ruins de personalidade. (1 Tim. 1:13) Era como se ele estivesse mal vestido em sentido espiritual.",
        resposta: "Devemos nos 'despir da velha personalidade' e nos 'revestir da nova personalidade'. Fazer isso é um processo contínuo, que exige tempo e esforço. Paulo, quando era jovem, não tinha conhecimento exato da vontade de Deus e era 'insolente', como se estivesse mal vestido em sentido espiritual."
      },
      {
        paragrafo: "11",
        pergunta: "Contra que característica de personalidade Paulo lutava? Explique.",
        textoBase: "Antes de se tornar cristão, Paulo ficava irado com facilidade. Um relato em Atos mostra que ele tinha tanta raiva dos discípulos de Jesus que 'respirava ameaça e morte' contra eles. (Atos 9:1) Depois de se tornar cristão, Paulo com certeza se esforçou bastante para abandonar essa característica da sua velha personalidade. (Efé. 4:22, 31) Mesmo assim, certa vez ele e Barnabé discutiram, e aquela discussão se tornou 'um forte acesso de ira'. (Atos 15:37-39, nota) Isso foi um passo atrás no progresso de Paulo, mas ele não desistiu. Paulo continuou 'surrando o seu corpo', ou seja, lutando contra as suas imperfeições, para não perder a aprovação de Jeová. — 1 Cor. 9:27.",
        resposta: "Antes de se tornar cristão, Paulo ficava irado com facilidade e 'respirava ameaça e morte' contra os discípulos de Jesus. Depois de se tornar cristão, ele se esforçou para abandonar essa característica. Mesmo assim, certa vez ele e Barnabé discutiram e aquela discussão se tornou 'um forte acesso de ira'. Mas Paulo não desistiu e continuou lutando contra as suas imperfeições."
      },
      {
        paragrafo: "12",
        pergunta: "O que ajudou Paulo a conseguir fazer mudanças na sua personalidade?",
        textoBase: "Paulo conseguiu fazer mudanças na sua personalidade porque era humilde e não confiava em si mesmo. (Fil. 4:13) Assim como Pedro, Paulo confiava 'na força que Deus fornece'. (1 Ped. 4:11) Mesmo assim, às vezes ele se sentia um fracasso. Mas quando ficava desanimado, Paulo pensava nas coisas boas que seu Pai celestial já tinha feito por ele. Isso o deixava mais determinado a persistir em fazer mudanças para agradar a Deus. — Rom. 7:21-25.",
        resposta: "Paulo conseguiu fazer mudanças na sua personalidade porque era humilde e não confiava em si mesmo, mas sim 'na força que Deus fornece'. Quando ficava desanimado, Paulo pensava nas coisas boas que seu Pai celestial já tinha feito por ele. Isso o deixava mais determinado a persistir em fazer mudanças para agradar a Deus."
      },
      {
        paragrafo: "13",
        pergunta: "Como podemos imitar Paulo?",
        textoBase: "Nós podemos imitar Paulo por reconhecer que, não importa há quanto tempo servimos a Jeová, precisamos continuar usando a vestimenta espiritual que ele nos dá. E como vimos, isso envolve nos livrar da velha personalidade e nos revestir da nova.",
        resposta: "Podemos imitar Paulo por reconhecer que precisamos continuar usando a vestimenta espiritual que Jeová nos dá. Se voltarmos a mostrar uma característica ruim de personalidade, como perder a cabeça ou falar de modo grosseiro, não precisamos achar que somos um fracasso. Devemos continuar tentando mudar nosso modo de pensar e agir."
      },
      {
        paragrafo: "14-15",
        pergunta: "De que forma Jeová protege seus servos em sentido espiritual? (Salmo 27:5)",
        textoBase: "Jeová protege seus servos de qualquer coisa ou pessoa que possa destruir sua fé nele. Ele promete que nenhuma arma fabricada contra nós vai ser bem-sucedida. Apesar de Satanás e seus apoiadores serem poderosos, eles jamais vão conseguir nos causar algum dano permanente.",
        resposta: "Jeová protege seus servos de qualquer coisa ou pessoa que possa destruir sua fé nele. Ele promete que nenhuma arma fabricada contra nós vai ser bem-sucedida. Mesmo que nos tirem a vida, Jeová é capaz de nos trazer de volta na ressurreição. Ele também nos protege por nos ajudar a lidar com as ansiedades e nos dá irmãos e anciãos para nos apoiar e pastorear."
      },
      {
        paragrafo: "16",
        pergunta: "De que maneiras Jeová protegeu Davi?",
        textoBase: "Quando Davi seguia os padrões de Jeová, ele era protegido porque Jeová o ajudava a tomar decisões sábias, que traziam felicidade. Por outro lado, quando ignorava esses padrões, Davi não era protegido das consequências de suas ações.",
        resposta: "Quando Davi seguia os padrões de Jeová, ele era protegido porque Jeová o ajudava a tomar decisões sábias. Quando Davi sofreu por causa das ações de outras pessoas, ele contou para Jeová todas as suas ansiedades. E Jeová consolava e acalmava Davi, garantindo que o amava muito e que cuidaria bem dele."
      },
      {
        paragrafo: "17",
        pergunta: "Como podemos imitar Davi?",
        textoBase: "Podemos imitar o exemplo de Davi buscando as orientações de Jeová antes de tomar decisões. Também entendemos que às vezes sofremos, não porque Jeová deixou de nos proteger, mas porque nós tomamos decisões ruins. (Gál. 6:7, 8) E quando sofremos por causa das ações de outros, abrimos nosso coração para Jeová, confiando que ele vai proteger nossa mente e nosso coração. — Fil. 4:6, 7.",
        resposta: "Podemos imitar Davi buscando as orientações de Jeová antes de tomar decisões. Também entendemos que às vezes sofremos, não porque Jeová deixou de nos proteger, mas porque nós tomamos decisões ruins. E quando sofremos por causa das ações de outros, abrimos nosso coração para Jeová, confiando que ele vai proteger nossa mente e nosso coração."
      },
      {
        paragrafo: "18",
        pergunta: "O que não devemos permitir, e como podemos continuar cuidando da nossa necessidade espiritual? (Veja também as imagens.)",
        textoBase: "Nosso texto do ano para 2026 diz: 'Felizes os que têm consciência de sua necessidade espiritual.' Hoje isso é mais verdade do que nunca. Em todo lugar, vemos pessoas infelizes. Por quê? Porque muitas negam que têm uma necessidade espiritual. Outras até acreditam em Deus, mas o adoram do jeito errado. E ainda outras confiam nas orientações de simples humanos. Não devemos permitir que a atitude dessas pessoas nos influencie. Como podemos continuar cuidando da nossa necessidade espiritual? Por aproveitar o alimento espiritual que Jeová provê, nos revestir da nova personalidade e buscar a proteção que Jeová nos dá.",
        resposta: "Nosso texto do ano para 2026 diz: 'Felizes os que têm consciência de sua necessidade espiritual.' Hoje isso é mais verdade do que nunca. Em todo lugar, vemos pessoas infelizes porque muitas negam que têm uma necessidade espiritual, outras adoram a Deus do jeito errado, e outras confiam nas orientações de simples humanos. Não devemos permitir que a atitude dessas pessoas nos influencie. Podemos continuar cuidando da nossa necessidade espiritual por aproveitar o alimento espiritual que Jeová provê, nos revestir da nova personalidade e buscar a proteção que Jeová nos dá."
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
        pergunta: "O que pode nos ajudar quando estamos ansiosos? (1 Pedro 5:7)",
        textoBase: "A oração pode nos ajudar muito quando estamos ansiosos. Podemos 'lançar sobre Jeová toda a nossa ansiedade'. Ele nos convida a contar nossos problemas a ele.",
        resposta: "A oração pode nos ajudar muito quando estamos ansiosos. Podemos 'lançar sobre Jeová toda a nossa ansiedade', porque ele cuida de nós. Jeová nos convida a contar nossos problemas a ele e promete nos dar paz."
      },
      {
        paragrafo: "9-10",
        pergunta: "O que mais pode nos ajudar a combater a ansiedade?",
        textoBase: "Além da oração, estudar a Bíblia e meditar nas promessas de Jeová pode nos ajudar. Também é importante manter uma rotina saudável, descansar o suficiente e buscar ajuda profissional se necessário.",
        resposta: "Além da oração, estudar a Bíblia e meditar nas promessas de Jeová pode nos ajudar. Também é importante manter uma rotina saudável, descansar o suficiente e buscar ajuda profissional se necessário. Os irmãos na congregação também podem nos apoiar."
      },
      {
        paragrafo: "11-12",
        pergunta: "O que podemos aprender de Paulo sobre lidar com dificuldades?",
        textoBase: "Paulo enfrentou muitas dificuldades, mas manteve a alegria. Ele disse que aprendeu o segredo de estar contente em qualquer situação. Paulo confiava em Jeová e sabia que com a ajuda dele poderia enfrentar qualquer coisa.",
        resposta: "Paulo enfrentou muitas dificuldades, mas manteve a alegria. Ele disse que aprendeu o segredo de estar contente em qualquer situação. Paulo confiava em Jeová e sabia que com a ajuda dele poderia enfrentar qualquer coisa. Podemos imitar essa atitude positiva."
      },
      {
        paragrafo: "13",
        pergunta: "O que você está determinado a fazer quando tiver sentimentos negativos?",
        textoBase: "Precisamos estar determinados a buscar a ajuda de Jeová quando tivermos sentimentos negativos. Isso inclui orar, estudar a Bíblia, participar das reuniões e buscar o apoio dos irmãos.",
        resposta: "Estou determinado a buscar a ajuda de Jeová quando tiver sentimentos negativos. Isso inclui orar, estudar a Bíblia, participar das reuniões e buscar o apoio dos irmãos. Sei que Jeová cuida de mim e quer me ajudar."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Como Jeová mostrou que entende nossos sentimentos?",
        resposta: "Jeová mostrou isso no modo como ajudou Elias. Ele não criticou Elias, mas cuidou das necessidades físicas e emocionais dele. Jeová nos convida a lançar sobre ele todas as nossas ansiedades."
      },
      {
        pergunta: "O que pode nos ajudar a combater sentimentos negativos?",
        resposta: "A oração, o estudo da Bíblia, as reuniões cristãs e o apoio dos irmãos podem nos ajudar. Também é importante cuidar da saúde, descansar e buscar ajuda profissional se necessário."
      },
      {
        pergunta: "Como podemos imitar Paulo ao enfrentar dificuldades?",
        resposta: "Podemos aprender a estar contentes em qualquer situação, confiar em Jeová e manter uma atitude positiva. Paulo sabia que com a ajuda de Jeová poderia enfrentar qualquer coisa."
      }
    ]
  },
  {
    id: 3,
    semana: "Semana 3",
    dataInicio: "16",
    dataFim: "22 de março",
    canticoInicial: 20,
    canticoInicialTitulo: "Tu deste teu querido Filho",
    canticoFinal: 19,
    canticoFinalTitulo: "A Ceia do Senhor",
    titulo: "Por que precisamos do resgate?",
    textoTema: "O Filho do homem veio para dar a sua vida como resgate em troca de muitos.",
    textoTemaRef: "MAT. 20:28",
    objetivo: "Fortalecer nossa gratidão pelo resgate entendendo por que precisamos dele.",
    imagem: "/images/estudo-marco-semana3.jpg",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "O que é o resgate e por que precisamos dele?",
        textoBase: "O resgate é o preço que Jesus pagou com sua vida perfeita para nos libertar do pecado e da morte. Precisamos do resgate porque Adão pecou e passou a imperfeição para todos os seus descendentes.",
        resposta: "O resgate é o preço que Jesus pagou com sua vida perfeita para nos libertar do pecado e da morte. Precisamos do resgate porque Adão pecou e passou a imperfeição para todos os seus descendentes. Sem o resgate, não teríamos esperança de vida eterna."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Vamos ver por que o resgate era necessário, como Jeová providenciou o resgate e como podemos mostrar gratidão por esse presente.",
        resposta: "Vamos ver por que o resgate era necessário, como Jeová providenciou o resgate e como podemos mostrar gratidão por esse presente maravilhoso de Jeová."
      },
      {
        paragrafo: "4-5",
        pergunta: "O que Adão e Eva perderam quando pecaram?",
        textoBase: "Adão e Eva perderam a perspectiva de viver para sempre no Paraíso. Eles também perderam a amizade íntima com Jeová. O pecado deles trouxe a morte para toda a humanidade.",
        resposta: "Adão e Eva perderam a perspectiva de viver para sempre no Paraíso. Eles também perderam a amizade íntima com Jeová. O pecado deles trouxe a morte para toda a humanidade, porque todos nós nascemos imperfeitos."
      },
      {
        paragrafo: "6-7",
        pergunta: "Por que Jeová providenciou o resgate?",
        textoBase: "Jeová providenciou o resgate por causa do seu grande amor pela humanidade. Ele não queria que os humanos sofressem para sempre as consequências do pecado de Adão.",
        resposta: "Jeová providenciou o resgate por causa do seu grande amor pela humanidade. Ele não queria que os humanos sofressem para sempre as consequências do pecado de Ad��o. Jeová encontrou uma forma justa de salvar a humanidade."
      },
      {
        paragrafo: "8-9",
        pergunta: "Como o resgate funciona? (Mateus 20:28)",
        textoBase: "Jesus deu sua vida perfeita como resgate. Como Adão era um homem perfeito, era necessário outro homem perfeito para pagar o resgate. Jesus era esse homem perfeito.",
        resposta: "Jesus deu sua vida perfeita como resgate. Como Adão era um homem perfeito, era necessário outro homem perfeito para pagar o resgate. Jesus era esse homem perfeito. Ele 'deu a sua vida como resgate em troca de muitos'."
      },
      {
        paragrafo: "10-11",
        pergunta: "O que o resgate torna possível?",
        textoBase: "O resgate torna possível termos nossos pecados perdoados, ter uma relação íntima com Jeová e receber a vida eterna. Também torna possível a ressurreição dos mortos.",
        resposta: "O resgate torna possível termos nossos pecados perdoados, ter uma relação íntima com Jeová e receber a vida eterna. Também torna possível a ressurreição dos mortos e a restauração do Paraíso na Terra."
      },
      {
        paragrafo: "12",
        pergunta: "Como você se sente por saber que Jeová providenciou o resgate?",
        textoBase: "Saber que Jeová providenciou o resgate nos enche de gratidão. Esse presente mostra o quanto Jeová nos ama e o quanto ele valoriza cada um de nós.",
        resposta: "Saber que Jeová providenciou o resgate nos enche de gratidão. Esse presente mostra o quanto Jeová nos ama e o quanto ele valoriza cada um de nós. Queremos mostrar nossa gratidão servindo a Jeová de todo o coração."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Por que precisamos do resgate?",
        resposta: "Precisamos do resgate porque Adão pecou e passou a imperfeição para todos os seus descendentes. Sem o resgate, não teríamos esperança de nos libertar do pecado e da morte."
      },
      {
        pergunta: "Como Jeová providenciou o resgate?",
        resposta: "Jeová enviou seu Filho unigênito, Jesus, para dar sua vida perfeita como resgate. Como Adão era um homem perfeito, era necessário outro homem perfeito para pagar o preço correspondente."
      },
      {
        pergunta: "O que o resgate torna possível para nós?",
        resposta: "O resgate torna possível termos nossos pecados perdoados, ter uma relação íntima com Jeová, receber a vida eterna e ter a esperança da ressurreição."
      }
    ]
  },
  {
    id: 4,
    semana: "Semana 4",
    dataInicio: "23",
    dataFim: "29 de março",
    canticoInicial: 18,
    canticoInicialTitulo: "O resgate — Dádiva de Deus",
    canticoFinal: 14,
    canticoFinalTitulo: "O novo Rei da Terra",
    titulo: "Como você vai mostrar sua gratidão pelo resgate?",
    textoTema: "O amor de Cristo nos compele.",
    textoTemaRef: "2 COR. 5:14",
    objetivo: "Ver como podemos mostrar gratidão pelo resgate em nossa vida diária.",
    imagem: "/images/estudo-marco-semana4.jpg",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "Por que devemos mostrar gratidão pelo resgate?",
        textoBase: "O resgate é o maior presente que já recebemos. Jeová e Jesus fizeram um enorme sacrifício por nós. É natural que queiramos mostrar nossa gratidão.",
        resposta: "O resgate é o maior presente que já recebemos. Jeová e Jesus fizeram um enorme sacrifício por nós. É natural que queiramos mostrar nossa gratidão por esse presente tão precioso."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Vamos ver maneiras práticas de mostrar gratidão pelo resgate em nossa vida diária. Isso inclui nossa adoração, nosso ministério e nosso modo de tratar os outros.",
        resposta: "Vamos ver maneiras práticas de mostrar gratidão pelo resgate em nossa vida diária. Isso inclui nossa adoração, nosso ministério e nosso modo de tratar os outros."
      },
      {
        paragrafo: "4-5",
        pergunta: "Como nossa adoração mostra gratidão pelo resgate?",
        textoBase: "Quando participamos das reuniões, oramos e estudamos a Bíblia, mostramos gratidão pelo resgate. Essas atividades nos ajudam a manter nosso relacionamento com Jeová forte.",
        resposta: "Quando participamos das reuniões, oramos e estudamos a Bíblia, mostramos gratidão pelo resgate. Essas atividades nos ajudam a manter nosso relacionamento com Jeová forte e a valorizar ainda mais o que ele fez por nós."
      },
      {
        paragrafo: "6-7",
        pergunta: "Como nosso ministério mostra gratidão pelo resgate? (2 Coríntios 5:14)",
        textoBase: "Quando pregamos e ensinamos outros sobre o resgate, mostramos gratidão. Paulo disse que 'o amor de Cristo nos compele' a falar sobre as boas novas.",
        resposta: "Quando pregamos e ensinamos outros sobre o resgate, mostramos gratidão. Paulo disse que 'o amor de Cristo nos compele' a falar sobre as boas novas. Queremos que outros também se beneficiem do resgate."
      },
      {
        paragrafo: "8-9",
        pergunta: "Como o modo de tratarmos os outros mostra gratidão pelo resgate?",
        textoBase: "Quando perdoamos os outros e os tratamos com amor, mostramos gratidão pelo resgate. Jeová nos perdoou por meio do resgate, então devemos perdoar os outros.",
        resposta: "Quando perdoamos os outros e os tratamos com amor, mostramos gratidão pelo resgate. Jeová nos perdoou por meio do resgate, então devemos perdoar os outros também."
      },
      {
        paragrafo: "10-11",
        pergunta: "O que a Celebração da morte de Cristo nos ajuda a lembrar?",
        textoBase: "A Celebração nos ajuda a lembrar do sacrifício de Jesus e do amor de Jeová por nós. É uma ocasião especial para meditar no valor do resgate.",
        resposta: "A Celebração nos ajuda a lembrar do sacrifício de Jesus e do amor de Jeová por nós. É uma ocasião especial para meditar no valor do resgate e renovar nossa gratidão."
      },
      {
        paragrafo: "12",
        pergunta: "O que você está determinado a fazer?",
        textoBase: "Precisamos estar determinados a mostrar gratidão pelo resgate todos os dias. Isso inclui nossa adoração, nosso ministério e nosso modo de tratar os outros.",
        resposta: "Estou determinado a mostrar gratidão pelo resgate todos os dias, não apenas na época da Celebração. Quero viver de um modo que honre a Jeová e mostre que valorizo o sacrifício de Jesus."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Como nossa adoração mostra gratidão pelo resgate?",
        resposta: "Nossa adoração mostra gratidão quando participamos das reuniões, oramos, estudamos a Bíblia e meditamos no que Jeová fez por nós por meio do resgate."
      },
      {
        pergunta: "Como nosso ministério mostra gratidão pelo resgate?",
        resposta: "Nosso ministério mostra gratidão quando pregamos e ensinamos outros sobre o resgate. O amor de Cristo nos compele a falar sobre as boas novas."
      },
      {
        pergunta: "Como devemos tratar os outros para mostrar gratidão pelo resgate?",
        resposta: "Devemos perdoar os outros e tratá-los com amor. Jeová nos perdoou por meio do resgate, então devemos perdoar os outros também."
      }
    ]
  },
  {
    id: 5,
    semana: "Semana 5",
    dataInicio: "30 de março",
    dataFim: "5 de abril",
    canticoInicial: 76,
    canticoInicialTitulo: "Como é agradável a união!",
    canticoFinal: 160,
    canticoFinalTitulo: "As boas novas sobre Jesus",
    titulo: "Fale a verdade de modo agradável",
    textoTema: "Jeová, [o] Deus da verdade.",
    textoTemaRef: "SAL. 31:5",
    objetivo: "Ver como podemos falar a verdade de uma forma que traga bons resultados.",
    imagem: "/images/estudo-marco-semana5.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "O que precisamos fazer para nos tornar parte da família de Jeová?",
        textoBase: "A verdade da Palavra de Deus influencia toda a nossa vida. Só podemos nos tornar parte da família de Jeová se amarmos a verdade e vivermos de acordo com ela. Isso inclui sermos honestos no que falamos e fazemos.",
        resposta: "A verdade da Palavra de Deus influencia toda a nossa vida. Só podemos nos tornar parte da família de Jeová se amarmos a verdade e vivermos de acordo com ela. Isso inclui sermos honestos no que falamos e fazemos."
      },
      {
        paragrafo: "2",
        pergunta: "Jesus sempre falava a verdade? Como as pessoas reagiam? (Mateus 10:35)",
        textoBase: "Jesus sempre falava a verdade, mesmo que suas palavras não agradassem a todos. Até mesmo os inimigos dele reconheciam isso. Jesus disse que viria causar divisão entre as pessoas.",
        resposta: "Jesus sempre falava a verdade, mesmo que suas palavras não agradassem a todos. Até mesmo os inimigos dele reconheciam isso. Jesus disse que viria causar divisão entre as pessoas. Ele sabia que a mensagem que pregava dividiria o mundo em dois grupos: aqueles que amam a verdade da Bíblia e aqueles que não amam."
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
        textoBase: "Tudo o que Jeová diz é verdadeiro. Ele fala a verdade quando diz o que �� certo e o que é errado. Tudo o que ele prediz sobre o futuro se cumpre. Ele nunca quebra uma promessa.",
        resposta: "Tudo o que Jeová diz é verdadeiro. Ele fala a verdade quando diz o que é certo e o que é errado. Tudo o que ele prediz sobre o futuro se cumpre. Ele nunca quebra uma promessa. Não é à toa que Jeová seja conhecido como o 'Deus da verdade'."
      },
      {
        paragrafo: "5",
        pergunta: "Por que não é difícil conhecer o 'Deus da verdade'? (Atos 17:27)",
        textoBase: "Para qualquer lugar que olhamos, vemos provas de que Deus existe. Paulo disse que Deus quer que 'o achemos' e que ele 'não está longe de cada um de nós'.",
        resposta: "Para qualquer lugar que olhamos, vemos provas de que Deus existe. Paulo disse que Deus quer que 'o achemos' e que ele 'não está longe de cada um de nós'. Na realidade, Jeová atrai pessoas humildes que estão procurando pela verdade."
      },
      {
        paragrafo: "6",
        pergunta: "Quais são algumas das verdades que encontramos na Bíblia?",
        textoBase: "A Bíblia ensina verdades sobre a origem do Universo e da vida na Terra, a origem do pecado, do sofrimento e da morte.",
        resposta: "A Bíblia ensina verdades sobre a origem do Universo e da vida na Terra, a origem do pecado, do sofrimento e da morte. Podemos confiar na promessa de que Jeová, por meio de seu Filho, vai desfazer todos os danos causados pelo Diabo."
      },
      {
        paragrafo: "7-8",
        pergunta: "Faz diferença a nossa motivação ao falar a verdade? (Marcos 3:11,12)",
        textoBase: "Sim, faz diferença. Quando Jesus pregava, algumas pessoas possuídas por demônios gritavam: 'Você é o Filho de Deus.' Os demônios disseram a verdade, mas talvez quisessem ganhar a confiança das pessoas para depois desviá-las de servir a Jeová.",
        resposta: "Sim, faz diferença. Quando Jesus pregava, algumas pessoas possuídas por demônios gritavam: 'Você é o Filho de Deus.' Os demônios disseram a verdade, mas talvez quisessem ganhar a confiança das pessoas para depois desviá-las de servir a Jeová. A motivação deles era egoísta. Jesus não gostou e ordenou que não pregassem sobre ele."
      },
      {
        paragrafo: "9",
        pergunta: "O que devemos evitar fazer, e por quê?",
        textoBase: "Devemos evitar chamar atenção para nós mesmos. Imagine que um irmão nos confiou uma informação confidencial e nós a divulgamos para outros. Isso pode nos fazer subir no conceito das pessoas, mas não no conceito de Jeová.",
        resposta: "Devemos evitar chamar atenção para nós mesmos. Imagine que um irmão nos confiou uma informação confidencial e nós a divulgamos para outros. Isso pode nos fazer subir no conceito das pessoas, mas não no conceito de Jeová. Por quê? Porque além de divulgarmos informações confidenciais, falamos a verdade com a motivação errada."
      },
      {
        paragrafo: "10",
        pergunta: "O que significa falar palavras 'agradáveis'? (Colossenses 4:6)",
        textoBase: "Paulo lembrou aos cristãos de Colossos que nossas palavras devem ser 'sempre agradáveis'. A expressão no idioma original passa a ideia de que nossas palavras, além de beneficiar os nossos ouvintes, precisam ser bondosas e atraentes.",
        resposta: "Paulo lembrou aos cristãos de Colossos que nossas palavras devem ser 'sempre agradáveis'. A expressão no idioma original passa a ideia de que nossas palavras, além de beneficiar os nossos ouvintes, precisam ser bondosas e atraentes."
      },
      {
        paragrafo: "11-12",
        pergunta: "Por que devemos ensinar a verdade com cuidado?",
        textoBase: "A Bíblia é comparada a uma espada afiada que pode revelar quem nós realmente somos por dentro. Mas se não usarmos a Bíblia com cuidado, podemos acabar ofendendo as pessoas.",
        resposta: "A Bíblia é comparada a uma espada afiada que pode revelar quem nós realmente somos por dentro. Mas se não usarmos a Bíblia com cuidado, podemos acabar ofendendo as pessoas. Por exemplo, se alguém comemora o Natal e nós logo na primeira conversa falamos que essa comemoração não é aprovada por Deus, isso não seria falar de modo agradável."
      },
      {
        paragrafo: "13",
        pergunta: "O que significa temperar nossas palavras com sal?",
        textoBase: "Paulo disse que devemos 'temperar' nossas palavras para apresentar a verdade de uma forma que agrade o 'gosto' do nosso ouvinte.",
        resposta: "Paulo disse que devemos 'temperar' nossas palavras para apresentar a verdade de uma forma que agrade o 'gosto' do nosso ouvinte. Assim como ao cozinhar para outros devemos pensar no gosto deles, não no nosso, ao falar a verdade devemos adaptar nossas palavras de acordo com o gosto e a cultura do nosso ouvinte."
      },
      {
        paragrafo: "14-15",
        pergunta: "Jesus ensinava tudo o que sabia para os seus discípulos? (Provérbios 25:11)",
        textoBase: "Jesus ensinava de forma agradável e bondosamente ensinava muitas coisas para seus seguidores. Mas ele não tentava ensinar tudo o que sabia porque levava em conta as limitações dos seus discípulos.",
        resposta: "Jesus ensinava de forma agradável e bondosamente ensinava muitas coisas para seus seguidores. Mas ele não tentava ensinar tudo o que sabia porque levava em conta as limitações dos seus discípulos. Ele entendia que não era a hora certa de eles aprenderem algumas verdades. Da mesma forma, devemos dizer o que os estudantes precisam saber na hora em que eles precisam saber."
      },
      {
        paragrafo: "16",
        pergunta: "Como podemos ajudar nossos estudantes a 'continuar andando na verdade'?",
        textoBase: "Devemos dar um bom exemplo, mostrar pelo nosso modo de vida que acreditamos nas promessas de Deus, ensinar a verdade com a motivação correta e no momento certo, falar de forma agradável usando palavras gentis e bondosas.",
        resposta: "Devemos dar um bom exemplo, mostrar pelo nosso modo de vida que acreditamos nas promessas de Deus, ensinar a verdade com a motivação correta e no momento certo, falar de forma agradável usando palavras gentis e bondosas, e dar todo o crédito a Jeová quando recebermos um elogio."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Onde podemos encontrar a verdade?",
        resposta: "Podemos encontrar a verdade na Palavra de Deus, a Bíblia. Jeová é o 'Deus da verdade' e tudo o que ele diz é verdadeiro. A criação também testifica sobre a existência de Deus."
      },
      {
        pergunta: "Por que e como devemos falar a verdade?",
        resposta: "Devemos falar a verdade com a motivação correta, não para chamar atenção para nós mesmos. Devemos usar palavras agradáveis, bondosas e atraentes, adaptando nossa mensagem ao ouvinte."
      },
      {
        pergunta: "Quando devemos falar a verdade?",
        resposta: "Devemos falar a verdade no momento certo, levando em conta as limitações do ouvinte. Assim como Jesus, devemos ensinar o que a pessoa precisa saber na hora em que ela precisa saber."
  }
FIM DO BLOCO A SER REMOVIDO */


// Componente de Pergunta otimizado com memo
const PerguntaItem = ({ 
  pergunta, 
  index, 
  estudoId, 
  isExpanded, 
  onToggle,
  forPrint = false 
}: { 
  pergunta: Pergunta
  index: number
  estudoId: number
  isExpanded: boolean
  onToggle: () => void
  forPrint?: boolean
}) => {
  return (
    <div className={`border-b border-zinc-800 pb-6 ${forPrint ? 'break-inside-avoid' : ''}`}>
      {/* Imagem do parágrafo */}
      {pergunta.imagem && (
        <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
          <img 
            src={pergunta.imagem} 
            alt={pergunta.imagemLegenda || `Imagem do parágrafo ${pergunta.paragrafo}`}
            className="w-full h-auto"
            loading="lazy"
          />
          {pergunta.imagemLegenda && (
            <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 p-4">
              <p className="text-zinc-200 text-sm font-medium italic">{pergunta.imagemLegenda}</p>
              {pergunta.imagemDescricao && (
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{pergunta.imagemDescricao}</p>
              )}
            </div>
          )}
        </div>
      )}

{/* Texto do Parágrafo - SEMPRE VISÍVEL */}
  {pergunta.textoBase && (
<div className="mb-4 p-4 bg-zinc-900/60 rounded-lg border-l-4 border-blue-500 flex gap-3">
  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
  {pergunta.paragrafo.split('-')[0]}
  </div>
      <p className="text-zinc-300 text-base leading-relaxed flex-1">{processarTextoBiblico(pergunta.textoBase)}</p>
    </div>
  )}

{/* Pergunta */}
  <div className="mb-3">
  <p className="text-zinc-200 text-lg leading-relaxed">
  <span className="font-bold text-white bg-red-600 px-1.5 py-0.5 rounded mr-2 text-sm">
  {pergunta.paragrafo}
  </span>
          {processarTextoBiblico(pergunta.pergunta)}
        </p>
      </div>
        
      {/* Caixa de resposta - CLICÁVEL */}
      <div 
        className={`${forPrint ? '' : 'cursor-pointer active:scale-[0.99] transition-transform'}`}
        onClick={forPrint ? undefined : onToggle}
      >
        <div className={`rounded-xl p-4 transition-all duration-200 ${
          isExpanded || forPrint
            ? "bg-gradient-to-br from-green-900/40 to-green-950/40 border-2 border-green-600/50 shadow-lg shadow-green-900/20" 
            : "bg-zinc-800/80 border border-zinc-700 hover:bg-zinc-700/80"
        }`}>
          {isExpanded || forPrint ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-sm font-bold uppercase tracking-wider">Resposta</span>
                {!forPrint && <ChevronUp className="w-4 h-4 text-green-400 ml-auto" />}
              </div>
              <p className="text-green-50 leading-relaxed text-base">{processarTextoBiblico(pergunta.resposta)}</p>
            </div>
          ) : (
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-sm font-medium">Toque para ver a resposta</span>
              <ChevronDown className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EstudoDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [expandedPergunta, setExpandedPergunta] = useState<string | null>(null)
  const [expandedRecap, setExpandedRecap] = useState<number | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Novos estados para acessibilidade e funcionalidades
  const [fontSize, setFontSize] = useState(16)
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [isFavorito, setIsFavorito] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [paragrafosLidos, setParagrafosLidos] = useState<string[]>([])
  
  const id = Number(params.id)
  const mes = params.mes as string

// Memoize estudo lookup - busca no mês correto
  const estudo = useMemo(() => {
  if (mes.startsWith("abril")) {
  return estudosAbril.find(e => e.id === id)
  }
  if (mes.startsWith("maio")) {
  return estudosMaio.find(e => e.id === id)
  }
  return estudosMarco.find(e => e.id === id)
  }, [id, mes])

  // Carregar dados do localStorage
  useEffect(() => {
    const favoritosStorage = localStorage.getItem("sentinela_favoritos")
    const concluidosStorage = localStorage.getItem("sentinela_concluidos")
    const progressoStorage = localStorage.getItem(`sentinela_progresso_${id}`)
    const fontSizeStorage = localStorage.getItem("sentinela_fontSize")
    
    if (favoritosStorage) {
      const favoritos = JSON.parse(favoritosStorage)
      setIsFavorito(favoritos.includes(id))
    }
    if (concluidosStorage) {
      const concluidos = JSON.parse(concluidosStorage)
      setIsComplete(concluidos.includes(id))
    }
    if (progressoStorage) {
      setParagrafosLidos(JSON.parse(progressoStorage))
    }
    if (fontSizeStorage) {
      setFontSize(parseInt(fontSizeStorage))
    }
  }, [id])

  // Salvar tamanho da fonte
  useEffect(() => {
    localStorage.setItem("sentinela_fontSize", fontSize.toString())
  }, [fontSize])

  // Toggle favorito
  const toggleFavorito = useCallback(() => {
    const favoritosStorage = localStorage.getItem("sentinela_favoritos")
    let favoritos = favoritosStorage ? JSON.parse(favoritosStorage) : []
    
    if (isFavorito) {
      favoritos = favoritos.filter((fId: number) => fId !== id)
    } else {
      favoritos.push(id)
    }
    
    localStorage.setItem("sentinela_favoritos", JSON.stringify(favoritos))
    setIsFavorito(!isFavorito)
  }, [isFavorito, id])

  // Toggle concluído
  const toggleComplete = useCallback(() => {
    const concluidosStorage = localStorage.getItem("sentinela_concluidos")
    let concluidos = concluidosStorage ? JSON.parse(concluidosStorage) : []
    
    if (isComplete) {
      concluidos = concluidos.filter((cId: number) => cId !== id)
    } else {
      concluidos.push(id)
    }
    
    localStorage.setItem("sentinela_concluidos", JSON.stringify(concluidos))
    setIsComplete(!isComplete)
  }, [isComplete, id])

  // Marcar parágrafo como lido
  const marcarParagrafoLido = useCallback((paragrafoKey: string) => {
    if (!paragrafosLidos.includes(paragrafoKey)) {
      const novosParagrafos = [...paragrafosLidos, paragrafoKey]
      setParagrafosLidos(novosParagrafos)
      localStorage.setItem(`sentinela_progresso_${id}`, JSON.stringify(novosParagrafos))
    }
  }, [paragrafosLidos, id])

  // Compartilhar
  const compartilhar = useCallback(async () => {
    if (!estudo) return
    
    const url = window.location.href
    const texto = `Estudo de A Sentinela: ${estudo.titulo}`
    
    if (navigator.share) {
      try {
        await navigator.share({ title: texto, url })
      } catch (err) {
        // Usuário cancelou
      }
    } else {
      // Fallback: copiar para clipboard
      await navigator.clipboard.writeText(`${texto}\n${url}`)
      alert('Link copiado para a área de transferência!')
    }
  }, [estudo])

  // Modo apresentação (fullscreen)
  const togglePresentationMode = useCallback(() => {
    if (!isPresentationMode) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsPresentationMode(!isPresentationMode)
  }, [isPresentationMode])

  // Navigation helpers
const { prevEstudo, nextEstudo } = useMemo(() => {
  const estudos = mes.startsWith("abril") ? estudosAbril : mes.startsWith("maio") ? estudosMaio : estudosMarco
    const currentIndex = estudos.findIndex(e => e.id === id)
    return {
      prevEstudo: currentIndex > 0 ? estudos[currentIndex - 1] : null,
      nextEstudo: currentIndex < estudos.length - 1 ? estudos[currentIndex + 1] : null
    }
  }, [id, mes])

  // Callbacks memoizados
  const togglePergunta = useCallback((key: string) => {
    setExpandedPergunta(prev => prev === key ? null : key)
  }, [])

  const toggleRecap = useCallback((index: number) => {
    setExpandedRecap(prev => prev === index ? null : index)
  }, [])

  // Função de exportar PDF
  const exportarPDF = useCallback(async () => {
    if (!estudo) return
    setIsExporting(true)
    
    try {
      // Cria uma nova janela para impressão
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Por favor, permita pop-ups para exportar o PDF')
        return
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${estudo.titulo} - Estudo de A Sentinela</title>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', system-ui, sans-serif; 
              padding: 40px; 
              line-height: 1.6;
              color: #1a1a1a;
              max-width: 800px;
              margin: 0 auto;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #2563eb;
            }
            .cantico { 
              color: #2563eb; 
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 10px;
            }
            .titulo { 
              font-size: 28px; 
              font-weight: bold; 
              color: #1e3a5f;
              margin-bottom: 15px;
            }
            .texto-tema {
              font-style: italic;
              color: #4b5563;
              margin-bottom: 10px;
            }
            .objetivo {
              background: #fef3c7;
              padding: 15px;
              border-left: 4px solid #f59e0b;
              margin: 20px 0;
              border-radius: 0 8px 8px 0;
            }
            .objetivo-label {
              font-weight: bold;
              color: #b45309;
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .pergunta-item {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            .pergunta-numero {
              display: inline-block;
              background: #2563eb;
              color: white;
              padding: 2px 10px;
              border-radius: 4px;
              font-weight: bold;
              margin-right: 8px;
            }
            .pergunta-texto {
              font-weight: 500;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .resposta {
              background: #d1fae5;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #10b981;
              margin-top: 10px;
            }
            .resposta-label {
              font-weight: bold;
              color: #047857;
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .texto-base {
              background: #f3f4f6;
              padding: 12px;
              border-radius: 6px;
              margin-top: 10px;
              font-size: 14px;
              color: #4b5563;
              border-left: 3px solid #9ca3af;
            }
            .recapitulacao {
              background: #fef3c7;
              padding: 20px;
              border-radius: 12px;
              margin-top: 30px;
            }
            .recapitulacao h3 {
              color: #b45309;
              margin-bottom: 15px;
              font-size: 18px;
            }
            .recap-item {
              margin-bottom: 15px;
              padding-bottom: 15px;
              border-bottom: 1px solid #fcd34d;
            }
            .recap-item:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .recap-pergunta {
              font-weight: 600;
              color: #92400e;
              margin-bottom: 8px;
            }
            .recap-resposta {
              color: #78350f;
            }
            .cantico-final {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #2563eb;
            }
            .imagem-container {
              margin: 15px 0;
              text-align: center;
            }
            .imagem-container img {
              max-width: 100%;
              border-radius: 8px;
            }
            .imagem-legenda {
              font-style: italic;
              color: #4b5563;
              font-size: 14px;
              margin-top: 8px;
            }
            .imagem-descricao {
              color: #6b7280;
              font-size: 12px;
              margin-top: 4px;
            }
            @media print {
              body { padding: 20px; }
              .pergunta-item { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="cantico">CANTICO ${estudo.canticoInicial} - ${estudo.canticoInicialTitulo}</div>
            <h1 class="titulo">${estudo.titulo}</h1>
            <p class="texto-tema">"${estudo.textoTema}" — ${estudo.textoTemaRef}</p>
          </div>
          
          <div class="objetivo">
            <div class="objetivo-label">Objetivo</div>
            <p>${estudo.objetivo}</p>
          </div>
          
          <div class="perguntas">
            ${estudo.perguntas.map(p => `
              <div class="pergunta-item">
                ${p.imagem ? `
                  <div class="imagem-container">
                    <img src="${p.imagem}" alt="${p.imagemLegenda || ''}" />
                    ${p.imagemLegenda ? `<p class="imagem-legenda">${p.imagemLegenda}</p>` : ''}
                    ${p.imagemDescricao ? `<p class="imagem-descricao">${p.imagemDescricao}</p>` : ''}
                  </div>
                ` : ''}
                <p class="pergunta-texto">
                  <span class="pergunta-numero">${p.paragrafo}</span>
                  ${p.pergunta}
                </p>
                <div class="resposta">
                  <div class="resposta-label">Resposta</div>
                  <p>${p.resposta}</p>
                </div>
                ${p.textoBase ? `<div class="texto-base">${p.textoBase}</div>` : ''}
              </div>
            `).join('')}
          </div>
          
          <div class="recapitulacao">
            <h3>O Que Voce Aprendeu?</h3>
            ${estudo.recapitulacao.map(r => `
              <div class="recap-item">
                <p class="recap-pergunta">${r.pergunta}</p>
                <p class="recap-resposta">${r.resposta}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="cantico-final">
            <div class="cantico">CANTICO ${estudo.canticoFinal} - ${estudo.canticoFinalTitulo}</div>
          </div>
        </body>
        </html>
      `

      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      // Espera carregar imagens e depois imprime
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      alert('Erro ao exportar PDF. Tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }, [estudo])

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
    <div 
      className={`min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white transition-all duration-300 ${
        isPresentationMode ? 'fixed inset-0 z-50 overflow-auto' : ''
      }`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Header fixo */}
      <header className={`sticky top-0 z-20 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 shadow-lg ${
        isPresentationMode ? 'bg-zinc-950' : ''
      }`}>
        <div className="max-w-3xl mx-auto px-4 py-3">
          {/* Linha 1: Navegação e ações principais */}
          <div className="flex items-center justify-between mb-2">
            <Button 
              onClick={() => router.back()} 
              variant="ghost"
              size="sm"
              className="text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            
            <span className="text-sm text-zinc-400">
              {estudo.dataInicio}-{estudo.dataFim}
            </span>
          </div>

          {/* Linha 2: Controles de acessibilidade */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Controle de fonte */}
            <div className="flex items-center bg-zinc-800 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                className="h-7 w-7 p-0 text-zinc-300 hover:text-white hover:bg-zinc-700"
                title="Diminuir fonte"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xs text-zinc-400 px-2 min-w-[36px] text-center">{fontSize}px</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                className="h-7 w-7 p-0 text-zinc-300 hover:text-white hover:bg-zinc-700"
                title="Aumentar fonte"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-1">
              {/* Modo apresentação */}
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePresentationMode}
                className={`h-8 w-8 p-0 ${
                  isPresentationMode 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-zinc-300 hover:text-white hover:bg-zinc-700"
                }`}
                title={isPresentationMode ? "Sair do modo apresentação" : "Modo apresentação"}
              >
                {isPresentationMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              {/* Favorito */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFavorito}
                className={`h-8 w-8 p-0 ${
                  isFavorito 
                    ? "text-yellow-400 hover:text-yellow-300" 
                    : "text-zinc-300 hover:text-white hover:bg-zinc-700"
                }`}
                title={isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Star className={`h-4 w-4 ${isFavorito ? "fill-current" : ""}`} />
              </Button>

              {/* Concluído */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleComplete}
                className={`h-8 w-8 p-0 ${
                  isComplete 
                    ? "text-green-400 hover:text-green-300" 
                    : "text-zinc-300 hover:text-white hover:bg-zinc-700"
                }`}
                title={isComplete ? "Marcar como não lido" : "Marcar como lido"}
              >
                <CheckCircle2 className={`h-4 w-4 ${isComplete ? "fill-green-400/20" : ""}`} />
              </Button>

              {/* Compartilhar */}
              <Button
                variant="ghost"
                size="sm"
                onClick={compartilhar}
                className="h-8 w-8 p-0 text-zinc-300 hover:text-white hover:bg-zinc-700"
                title="Compartilhar"
              >
                <Share2 className="h-4 w-4" />
              </Button>

              {/* Exportar PDF */}
              <Button
                onClick={exportarPDF}
                variant="outline"
                size="sm"
                disabled={isExporting}
                className="bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30 h-8"
              >
                {isExporting ? (
                  <span className="animate-pulse text-xs">...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1 text-xs">PDF</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="mt-3">
            <BarraProgresso 
              totalParagrafos={estudo.perguntas.length} 
              paragrafosLidos={paragrafosLidos.length} 
            />
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-3xl mx-auto px-4 py-6" ref={contentRef}>
        {/* Cântico Inicial */}
        <div className="flex items-center justify-center gap-3 py-4 mb-6 bg-gradient-to-r from-blue-900/30 via-blue-800/20 to-blue-900/30 rounded-xl border border-blue-700/30">
          <Music className="w-6 h-6 text-blue-400" />
          <div className="text-center">
            <p className="text-blue-400 font-bold text-lg">CANTICO {estudo.canticoInicial}</p>
            <p className="text-zinc-400 text-sm">{estudo.canticoInicialTitulo}</p>
          </div>
        </div>

        {/* Título e Tema */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {estudo.titulo}
          </h1>
          <p className="text-zinc-300 text-lg">
            <span className="italic">"{estudo.textoTema}"</span>
            <span className="text-blue-400 font-medium"> — {estudo.textoTemaRef}</span>
          </p>
        </div>

        {/* Objetivo */}
        <div className="border-l-4 border-amber-500 pl-4 py-3 mb-8 bg-gradient-to-r from-amber-900/20 to-transparent rounded-r-lg">
          <p className="text-amber-400 uppercase text-xs font-bold mb-1 tracking-wider">Objetivo</p>
          <p className="text-zinc-200 leading-relaxed">{estudo.objetivo}</p>
        </div>

        {/* Perguntas e Respostas */}
        <div className="space-y-6 mb-10">
          {estudo.perguntas.map((pergunta, index) => (
            <PerguntaItem
              key={index}
              pergunta={pergunta}
              index={index}
              estudoId={estudo.id}
              isExpanded={expandedPergunta === `${estudo.id}-${index}`}
              onToggle={() => {
                togglePergunta(`${estudo.id}-${index}`)
                marcarParagrafoLido(`${index}`)
              }}
            />
          ))}
        </div>

        {/* Perguntas de Recapitulação */}
        <Card className="bg-gradient-to-br from-amber-900/30 to-amber-950/20 border-amber-700/50 mb-8 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-amber-400 font-bold text-xl mb-6 uppercase tracking-wide flex items-center gap-2">
              <div className="w-8 h-1 bg-amber-500 rounded" />
              O Que Voce Aprendeu?
            </h3>
            <div className="space-y-4">
              {estudo.recapitulacao.map((recap, index) => (
                <div 
                  key={index}
                  className="cursor-pointer active:scale-[0.99] transition-transform"
                  onClick={() => toggleRecap(index)}
                >
                  <p className="text-amber-200 font-semibold mb-2 text-lg">{recap.pergunta}</p>
                  <div className={`rounded-xl p-4 transition-all duration-200 ${
                    expandedRecap === index
                      ? "bg-gradient-to-br from-amber-800/40 to-amber-900/30 border border-amber-600/50"
                      : "bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50"
                  }`}>
                    {expandedRecap === index ? (
                      <p className="text-amber-100 leading-relaxed">{recap.resposta}</p>
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
        <div className="flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-blue-900/30 via-blue-800/20 to-blue-900/30 rounded-xl border border-blue-700/30 mb-8">
          <Music className="w-6 h-6 text-blue-400" />
          <div className="text-center">
            <p className="text-blue-400 font-bold text-lg">CANTICO {estudo.canticoFinal}</p>
            <p className="text-zinc-400 text-sm">{estudo.canticoFinalTitulo}</p>
          </div>
        </div>

        {/* Navegação entre estudos */}
        <div className="flex items-center justify-between gap-4 py-4 border-t border-zinc-800">
          {prevEstudo ? (
            <Button
              onClick={() => router.push(`/admin/reunioes/estudo-sentinela/${mes}/${prevEstudo.id}`)}
              variant="ghost"
              className="text-zinc-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="text-sm hidden sm:inline">Estudo anterior</span>
            </Button>
          ) : (
            <div />
          )}
          
          <Button 
            onClick={() => router.back()} 
            variant="outline"
            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Lista de estudos
          </Button>
          
          {nextEstudo ? (
            <Button
              onClick={() => router.push(`/admin/reunioes/estudo-sentinela/${mes}/${nextEstudo.id}`)}
              variant="ghost"
              className="text-zinc-400 hover:text-white"
            >
              <span className="text-sm hidden sm:inline">Proximo estudo</span>
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  )
}
