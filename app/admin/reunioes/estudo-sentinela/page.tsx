"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Music } from "lucide-react"
import Image from "next/image"

interface Pergunta {
  paragrafo: string
  pergunta: string
  resposta: string
  textoBase?: string
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
  imagem: string
  perguntas: Pergunta[]
  recapitulacao: PerguntaRecapitulacao[]
}

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
    titulo: "Continue cuidando da sua "necessidade espiritual"",
    textoTema: "Felizes os que têm consciência de sua necessidade espiritual.",
    textoTemaRef: "MAT. 5:3",
    objetivo: "Ver como podemos continuar nos beneficiando de tudo o que Jeová nos dá para ficarmos bem alimentados, vestidos e protegidos em sentido espiritual.",
    imagem: "/images/estudo-semana1.jpg",
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
        pergunta: "Que dois motivos temos para desenvolver um forte desejo por alimento espiritual sólido?",
        textoBase: "Primeiro, vamos aprender coisas sobre Jeová que aumentam nosso amor e respeito por ele. Segundo, vamos ficar mais motivados a falar com outros sobre o nosso maravilhoso Pai celestial.",
        resposta: "Primeiro, vamos aprender coisas sobre Jeová que aumentam nosso amor e respeito por ele. Segundo, vamos ficar mais motivados a falar com outros sobre o nosso maravilhoso Pai celestial. Quando nosso entendimento é ajustado, precisamos ser rápidos para adaptar nosso modo de pensar e agir."
      },
      {
        paragrafo: "10",
        pergunta: "De acordo com Colossenses 3:8-10, o que envolve estar bem vestido em sentido espiritual?",
        textoBase: "Devemos nos 'despir da velha personalidade' e nos 'revestir da nova personalidade'. Fazer isso é um processo contínuo, que exige tempo e esforço.",
        resposta: "Devemos nos 'despir da velha personalidade' e nos 'revestir da nova personalidade'. Fazer isso é um processo contínuo, que exige tempo e esforço. Paulo, quando jovem, não tinha conhecimento exato da vontade de Deus e era uma pessoa 'insolente', com várias características ruins de personalidade."
      },
      {
        paragrafo: "11",
        pergunta: "Contra que característica de personalidade Paulo lutava? Explique.",
        textoBase: "Paulo ficava irado com facilidade. Antes de se tornar cristão, ele tinha tanta raiva dos discípulos de Jesus que 'respirava ameaça e morte' contra eles.",
        resposta: "Paulo ficava irado com facilidade. Antes de se tornar cristão, ele tinha tanta raiva dos discípulos de Jesus que 'respirava ameaça e morte' contra eles. Depois de se tornar cristão, se esforçou para abandonar essa característica. Certa vez ele e Barnabé tiveram 'um forte acesso de ira', mas Paulo não desistiu de lutar contra suas imperfeições."
      },
      {
        paragrafo: "12",
        pergunta: "O que ajudou Paulo a conseguir fazer mudanças na sua personalidade?",
        textoBase: "Paulo era humilde e não confiava em si mesmo. Ele confiava 'na força que Deus fornece'. Às vezes ele se sentia um fracasso, mas quando ficava desanimado, pensava nas coisas boas que seu Pai celestial já tinha feito por ele.",
        resposta: "Paulo era humilde e não confiava em si mesmo. Ele confiava 'na força que Deus fornece'. Às vezes ele se sentia um fracasso, mas quando ficava desanimado, pensava nas coisas boas que seu Pai celestial já tinha feito por ele. Isso o deixava mais determinado a persistir em fazer mudanças."
      },
      {
        paragrafo: "13",
        pergunta: "Como podemos imitar Paulo?",
        textoBase: "Podemos reconhecer que, não importa há quanto tempo servimos a Jeová, precisamos continuar usando a vestimenta espiritual que ele nos dá. Se voltarmos a mostrar uma característica ruim, não precisamos achar que somos um fracasso.",
        resposta: "Podemos reconhecer que, não importa há quanto tempo servimos a Jeová, precisamos continuar usando a vestimenta espiritual que ele nos dá. Se voltarmos a mostrar uma característica ruim, não precisamos achar que somos um fracasso. Devemos continuar tentando mudar. Nós é que precisamos nos ajustar à vestimenta espiritual que Jeová nos dá."
      },
      {
        paragrafo: "14-15",
        pergunta: "De que forma Jeová protege seus servos em sentido espiritual? (Salmo 27:5)",
        textoBase: "Jeová protege seus servos de qualquer coisa ou pessoa que possa destruir sua fé nele. Ele promete que nenhuma arma fabricada contra nós vai ser bem-sucedida. Mesmo que tirem nossa vida, Jeová é capaz de nos trazer de volta na ressurreição.",
        resposta: "Jeová protege seus servos de qualquer coisa ou pessoa que possa destruir sua fé nele. Ele promete que nenhuma arma fabricada contra nós vai ser bem-sucedida. Mesmo que tirem nossa vida, Jeová é capaz de nos trazer de volta na ressurreição. Ele também nos ajuda a lidar com ansiedades e nos dá irmãos para nos apoiar e anciãos para nos pastorear."
      },
      {
        paragrafo: "16",
        pergunta: "De que maneiras Jeová protegeu Davi?",
        textoBase: "Quando Davi seguia os padrões de Jeová, ele era protegido porque Jeová o ajudava a tomar decisões sábias que traziam felicidade. Por outro lado, quando ignorava esses padrões, Davi não era protegido das consequências de suas ações.",
        resposta: "Quando Davi seguia os padrões de Jeová, ele era protegido porque Jeová o ajudava a tomar decisões sábias que traziam felicidade. Por outro lado, quando ignorava esses padrões, Davi não era protegido das consequências de suas ações. Quando sofria por causa de outros, ele contava para Jeová suas ansiedades, e Jeová o consolava e acalmava."
      },
      {
        paragrafo: "17",
        pergunta: "Como podemos imitar Davi?",
        textoBase: "Podemos buscar as orientações de Jeová antes de tomar decisões. Entendemos que às vezes sofremos não porque Jeová deixou de nos proteger, mas porque nós tomamos decisões ruins.",
        resposta: "Podemos buscar as orientações de Jeová antes de tomar decisões. Entendemos que às vezes sofremos não porque Jeová deixou de nos proteger, mas porque nós tomamos decisões ruins. Quando sofremos por causa de outros, abrimos nosso coração para Jeová, confiando que ele vai proteger nossa mente e nosso coração."
      },
      {
        paragrafo: "18",
        pergunta: "O que não devemos permitir, e como podemos continuar cuidando da nossa necessidade espiritual?",
        textoBase: "Não devemos permitir que a atitude de pessoas infelizes nos influencie. Podemos continuar cuidando da nossa necessidade espiritual por aproveitar o alimento espiritual que Jeová provê.",
        resposta: "Não devemos permitir que a atitude de pessoas infelizes nos influencie. Podemos continuar cuidando da nossa necessidade espiritual por aproveitar o alimento espiritual que Jeová provê, nos revestir da nova personalidade e buscar a proteção que Jeová nos dá."
      }
    ],
    recapitulacao: [
      {
        pergunta: "O que podemos fazer para aproveitar bem o ALIMENTO ESPIRITUAL que Jeová nos dá?",
        resposta: "Devemos nos alimentar regularmente das verdades básicas da Palavra de Deus. Também devemos desenvolver o desejo por alimento espiritual sólido, reservando tempo e nos esforçando para entender mais a fundo a Palavra de Deus. Quando nosso entendimento de uma verdade bíblica é ajustado, precisamos ser rápidos para adaptar nosso modo de pensar e de agir."
      },
      {
        pergunta: "O que podemos fazer para aproveitar bem a VESTIMENTA ESPIRITUAL que Jeová nos dá?",
        resposta: "Devemos nos despir da velha personalidade e nos revestir da nova personalidade. Se voltarmos a mostrar uma característica ruim, não devemos achar que somos um fracasso. Devemos continuar tentando mudar nosso modo de pensar e agir. Precisamos nos ajustar à vestimenta espiritual que Jeová nos dá, não o contrário."
      },
      {
        pergunta: "O que podemos fazer para aproveitar bem a PROTEÇÃO ESPIRITUAL que Jeová nos dá?",
        resposta: "Devemos buscar as orientações de Jeová antes de tomar decisões. Quando sofremos por causa de nossas próprias decisões ruins, não devemos achar que Jeová deixou de nos proteger. Quando sofremos por causa das ações de outros, devemos abrir nosso coração para Jeová, confiando que ele vai proteger nossa mente e nosso coração."
      }
    ]
  },
  {
    id: 2,
    semana: "Semana 2",
    dataInicio: "9",
    dataFim: "15 de março",
    canticoInicial: 45,
    canticoInicialTitulo: "As meditações do meu coração",
    canticoFinal: 34,
    canticoFinalTitulo: "Andarei em integridade",
    titulo: "Você é capaz de lutar contra sentimentos negativos!",
    textoTema: "Homem miserável que eu sou!",
    textoTemaRef: "ROM. 7:24",
    objetivo: "Aprender a lidar com pensamentos e sentimentos negativos.",
    imagem: "/images/estudo-semana2.jpg",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "Como o apóstolo Paulo se sentia às vezes? E por que podemos nos identificar com ele? (Romanos 7:21-24)",
        textoBase: "Paulo mostrou que tinha sentimentos que muitos de nós também temos. Mesmo sendo um cristão fiel, Paulo estava numa luta entre sua inclinação para fazer coisas erradas e seu desejo sincero de fazer a vontade de Deus.",
        resposta: "Paulo mostrou que tinha sentimentos que muitos de nós também temos. Mesmo sendo um cristão fiel, Paulo estava numa luta entre sua inclinação para fazer coisas erradas e seu desejo sincero de fazer a vontade de Deus. Às vezes, Paulo também tinha que lidar com sentimentos negativos relacionados a um problema persistente e a erros do passado."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Vamos considerar as perguntas: Por que às vezes Paulo se sentia 'miserável'? Como ele lidava com sentimentos negativos? E como podemos ser bem-sucedidos na luta contra nossos sentimentos negativos?",
        resposta: "Vamos considerar as perguntas: Por que às vezes Paulo se sentia 'miserável'? Como ele lidava com sentimentos negativos? E como podemos ser bem-sucedidos na luta contra nossos sentimentos negativos?"
      },
      {
        paragrafo: "4",
        pergunta: "Por que Paulo teve sentimentos negativos?",
        textoBase: "Antes de se tornar cristão, Paulo (Saulo) fez muitas coisas ruins. Ele aprovou o assassinato de um homem fiel chamado Estêvão e liderou uma perseguição cruel contra os cristãos.",
        resposta: "Antes de se tornar cristão, Paulo (Saulo) fez muitas coisas ruins. Ele aprovou o assassinato de um homem fiel chamado Estêvão e liderou uma perseguição cruel contra os cristãos."
      },
      {
        paragrafo: "5",
        pergunta: "Como Paulo se sentiu por causa do que tinha feito?",
        textoBase: "Depois que se tornou cristão, Paulo às vezes se sentiu culpado pelas coisas que tinha feito. Os erros do passado o deixaram cada vez mais triste. Ele disse: 'Não sou digno de ser chamado apóstolo, porque persegui a congregação de Deus.'",
        resposta: "Depois que se tornou cristão, Paulo às vezes se sentiu culpado pelas coisas que tinha feito. Os erros do passado o deixaram cada vez mais triste. Ele disse: 'Não sou digno de ser chamado apóstolo, porque persegui a congregação de Deus.' Mais tarde, falou que era 'menor que o menor de todos os santos'."
      },
      {
        paragrafo: "6",
        pergunta: "Que outra coisa deixava Paulo ansioso?",
        textoBase: "Paulo falou de um problema que era como 'um espinho na carne'. Pode ter sido um problema físico, emocional ou alguma outra coisa. Isso trazia muita dor para ele e o deixava ansioso.",
        resposta: "Paulo falou de um problema que era como 'um espinho na carne'. Pode ter sido um problema físico, emocional ou alguma outra coisa. Isso trazia muita dor para ele e o deixava ansioso."
      },
      {
        paragrafo: "7",
        pergunta: "Como Paulo se sentiu por causa das suas imperfeições? (Romanos 7:18,19)",
        textoBase: "Paulo às vezes se sentia desanimado por causa das suas imperfeições. Ele queria fazer o que era certo, mas se sentia incapaz. Paulo reconheceu que estava sempre lutando para não seguir suas tendências erradas.",
        resposta: "Paulo às vezes se sentia desanimado por causa das suas imperfeições. Ele queria fazer o que era certo, mas se sentia incapaz. Paulo reconheceu que estava sempre lutando para não seguir suas tendências erradas e se esforçava muito para melhorar a sua personalidade."
      },
      {
        paragrafo: "8",
        pergunta: "O que Paulo fazia para lidar com suas imperfeições?",
        textoBase: "Paulo pensava em quais eram seus pontos fracos, buscava a orientação das Escrituras e identificava os passos necessários para vencer essa luta.",
        resposta: "Paulo pensava em quais eram seus pontos fracos, buscava a orientação das Escrituras e identificava os passos necessários para vencer essa luta. Ele meditava em como ele e outros cristãos podiam lutar contra tendências erradas e melhorar sua personalidade com a ajuda do espírito santo."
      },
      {
        paragrafo: "9-10",
        pergunta: "Como Paulo lidou com a culpa por erros do passado? (1 Timóteo 1:12-14)",
        textoBase: "Paulo meditou na bondade imerecida de Jeová. Isso o ajudou a aceitar o perdão de Jeová e a se perdoar. Paulo reconheceu que Jeová teve misericórdia dele apesar de tudo o que tinha feito.",
        resposta: "Paulo meditou na bondade imerecida de Jeová. Isso o ajudou a aceitar o perdão de Jeová e a se perdoar. Paulo reconheceu que Jeová teve misericórdia dele apesar de tudo o que tinha feito. Ele aceitou que Jesus veio ao mundo para salvar pecadores, e isso incluía ele."
      },
      {
        paragrafo: "11",
        pergunta: "O que Paulo fez para lidar com o 'espinho na carne'? (2 Coríntios 12:8-10)",
        textoBase: "Paulo orou a Jeová três vezes pedindo que tirasse esse problema. Mas Jeová não tirou o problema. Mesmo assim, Jeová deu a Paulo a força para aguentar.",
        resposta: "Paulo orou a Jeová três vezes pedindo que tirasse esse problema. Mas Jeová não tirou o problema. Mesmo assim, Jeová deu a Paulo a força para aguentar. Paulo aprendeu que, quando estava fraco, o poder de Jeová o fortalecia."
      },
      {
        paragrafo: "12",
        pergunta: "Como Jeová ajudou Paulo a lidar com suas ansiedades? (Filipenses 4:6,7)",
        textoBase: "Paulo aprendeu a confiar em Jeová por meio de oração. Ele deixava suas preocupações com Jeová e recebia 'a paz de Deus que excede todo entendimento'.",
        resposta: "Paulo aprendeu a confiar em Jeová por meio de oração. Ele deixava suas preocupações com Jeová e recebia 'a paz de Deus que excede todo entendimento'. Essa paz guardava o coração e a mente de Paulo."
      },
      {
        paragrafo: "13-14",
        pergunta: "O que ajudou Paulo a continuar lutando contra sentimentos negativos? (Romanos 7:25)",
        textoBase: "Paulo expressou sua gratidão por Jesus Cristo, reconhecendo que só por meio de Jesus ele podia ser salvo. Pensar nisso deu a Paulo forças para continuar lutando contra sentimentos negativos.",
        resposta: "Paulo expressou sua gratidão por Jesus Cristo, reconhecendo que só por meio de Jesus ele podia ser salvo. Pensar nisso deu a Paulo forças para continuar lutando contra sentimentos negativos. Ele mantinha o foco nas bênçãos que recebia de Jeová."
      },
      {
        paragrafo: "15",
        pergunta: "O que você está determinado a fazer?",
        textoBase: "Estou determinado a continuar lutando contra sentimentos negativos. Vou meditar nas bênçãos que Jeová me dá e confiar nele para me dar forças.",
        resposta: "Estou determinado a continuar lutando contra sentimentos negativos. Vou meditar nas bênçãos que Jeová me dá e confiar nele para me dar forças. Vou orar a Jeová e aceitar seu perdão."
      }
    ],
    recapitulacao: [
      {
        pergunta: "O que pode nos ajudar a lidar com SENTIMENTOS DE CULPA por erros do passado?",
        resposta: "Meditar na bondade imerecida de Jeová nos ajuda a aceitar o perdão dele e a nos perdoar. Devemos lembrar que Jesus veio ao mundo para salvar pecadores, e isso nos inclui. Jeová tem misericórdia de nós apesar dos nossos erros."
      },
      {
        pergunta: "O que pode nos ajudar a lidar com PROBLEMAS PERSISTENTES?",
        resposta: "Devemos orar a Jeová pedindo ajuda. Mesmo que Jeová não tire o problema, ele vai nos dar a força para aguentar. Quando estamos fracos, o poder de Jeová nos fortalece."
      },
      {
        pergunta: "O que pode nos ajudar a lidar com ANSIEDADES?",
        resposta: "Devemos confiar em Jeová por meio de oração, deixando nossas preocupações com ele. Assim, receberemos 'a paz de Deus que excede todo entendimento', que guardará nosso coração e nossa mente."
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
    textoTema: "O Filho do homem veio . . . para dar a sua vida como resgate em troca de muitos.",
    textoTemaRef: "MAT. 20:28",
    objetivo: "Fortalecer nossa gratidão pelo resgate.",
    imagem: "/images/estudo-semana3.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "O que Jesus fez por nós?",
        textoBase: "Jesus deu a sua vida como resgate em troca de muitos. Ele sofreu e morreu para que pudéssemos ter a esperança de viver para sempre.",
        resposta: "Jesus deu a sua vida como resgate em troca de muitos. Ele sofreu e morreu para que pudéssemos ter a esperança de viver para sempre."
      },
      {
        paragrafo: "2",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Vamos considerar: O que é o resgate? Por que precisamos dele? E como o resgate foi providenciado?",
        resposta: "Vamos considerar: O que é o resgate? Por que precisamos dele? E como o resgate foi providenciado?"
      },
      {
        paragrafo: "3-4",
        pergunta: "O que Adão perdeu quando pecou? (Romanos 5:12)",
        textoBase: "Adão perdeu a vida perfeita que tinha. Por causa do pecado de Adão, todos nós nascemos imperfeitos e sujeitos ao pecado e à morte.",
        resposta: "Adão perdeu a vida perfeita que tinha. Por causa do pecado de Adão, todos nós nascemos imperfeitos e sujeitos ao pecado e à morte. O pecado entrou no mundo por meio de um só homem, e a morte por meio do pecado."
      },
      {
        paragrafo: "5",
        pergunta: "Por que precisamos de um resgate?",
        textoBase: "Precisamos de um resgate porque nascemos imperfeitos e não conseguimos nos salvar. Só uma vida humana perfeita poderia resgatar o que Adão perdeu.",
        resposta: "Precisamos de um resgate porque nascemos imperfeitos e não conseguimos nos salvar. Só uma vida humana perfeita poderia resgatar o que Adão perdeu."
      },
      {
        paragrafo: "6",
        pergunta: "Como Jeová providenciou o resgate? (João 3:16)",
        textoBase: "Jeová amou tanto o mundo que deu o seu Filho unigênito, para que todo aquele que nele exercer fé não seja destruído, mas tenha vida eterna.",
        resposta: "Jeová amou tanto o mundo que deu o seu Filho unigênito, para que todo aquele que nele exercer fé não seja destruído, mas tenha vida eterna. Jesus veio à Terra e viveu uma vida perfeita."
      },
      {
        paragrafo: "7-8",
        pergunta: "O que Jesus fez para nos resgatar?",
        textoBase: "Jesus se ofereceu para vir à Terra e dar sua vida em nosso favor. Ele viveu uma vida perfeita e depois morreu numa estaca de tortura.",
        resposta: "Jesus se ofereceu para vir à Terra e dar sua vida em nosso favor. Ele viveu uma vida perfeita e depois morreu numa estaca de tortura. Sua vida perfeita correspondia exatamente ao que Adão tinha perdido."
      },
      {
        paragrafo: "9",
        pergunta: "O que o resgate torna possível? (1 João 2:2)",
        textoBase: "O resgate torna possível o perdão dos nossos pecados. Jesus é um sacrifício propiciatório pelos nossos pecados, e não apenas pelos nossos, mas também pelos de todo o mundo.",
        resposta: "O resgate torna possível o perdão dos nossos pecados. Jesus é um sacrifício propiciatório pelos nossos pecados, e não apenas pelos nossos, mas também pelos de todo o mundo."
      },
      {
        paragrafo: "10",
        pergunta: "O que mais o resgate torna possível?",
        textoBase: "O resgate abre caminho para termos um relacionamento achegado com Jeová e a esperança de vida eterna no Paraíso na Terra.",
        resposta: "O resgate abre caminho para termos um relacionamento achegado com Jeová e a esperança de vida eterna no Paraíso na Terra."
      },
      {
        paragrafo: "11",
        pergunta: "Como devemos nos sentir em relação ao resgate?",
        textoBase: "Devemos sentir profunda gratidão pelo resgate. É o maior presente que já recebemos de Jeová.",
        resposta: "Devemos sentir profunda gratidão pelo resgate. É o maior presente que já recebemos de Jeová."
      },
      {
        paragrafo: "12",
        pergunta: "O que você está determinado a fazer?",
        textoBase: "Estou determinado a mostrar minha gratidão pelo resgate vivendo de um modo que honre a Jeová e ajudando outros a aprender sobre esse presente maravilhoso.",
        resposta: "Estou determinado a mostrar minha gratidão pelo resgate vivendo de um modo que honre a Jeová e ajudando outros a aprender sobre esse presente maravilhoso."
      }
    ],
    recapitulacao: [
      {
        pergunta: "O que é o resgate?",
        resposta: "O resgate é o preço pago por Jesus para nos libertar do pecado e da morte. Jesus deu sua vida humana perfeita como pagamento correspondente ao que Adão perdeu."
      },
      {
        pergunta: "Por que precisamos do resgate?",
        resposta: "Precisamos do resgate porque nascemos imperfeitos por causa do pecado de Adão. Não conseguimos nos salvar. Só uma vida humana perfeita poderia nos resgatar."
      },
      {
        pergunta: "Como podemos mostrar gratidão pelo resgate?",
        resposta: "Podemos mostrar gratidão vivendo de um modo que honre a Jeová, mantendo um relacionamento achegado com ele e ajudando outros a aprender sobre esse presente maravilhoso."
      }
    ]
  },
  {
    id: 4,
    semana: "Semana 4",
    dataInicio: "23",
    dataFim: "29 de março",
    canticoInicial: 18,
    canticoInicialTitulo: "O resgate — uma dádiva de Deus",
    canticoFinal: 14,
    canticoFinalTitulo: "O novo Rei da Terra",
    titulo: "Como você vai mostrar sua gratidão pelo resgate?",
    textoTema: "Pois vocês foram comprados por um preço.",
    textoTemaRef: "1 COR. 6:20",
    objetivo: "Considerar maneiras de mostrar gratidão pelo resgate.",
    imagem: "/images/estudo-semana4.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "O que a Celebração nos lembra?",
        textoBase: "A Celebração nos lembra do maior ato de amor já realizado — o sacrifício de resgate de Jesus Cristo.",
        resposta: "A Celebração nos lembra do maior ato de amor já realizado — o sacrifício de resgate de Jesus Cristo."
      },
      {
        paragrafo: "2",
        pergunta: "O que vamos considerar neste estudo?",
        textoBase: "Vamos considerar como podemos mostrar nossa gratidão pelo resgate em nossa vida diária.",
        resposta: "Vamos considerar como podemos mostrar nossa gratidão pelo resgate em nossa vida diária."
      },
      {
        paragrafo: "3-4",
        pergunta: "Como podemos mostrar gratidão pelo resgate em nossa adoração?",
        textoBase: "Podemos mostrar gratidão por dar a Jeová o melhor de nós mesmos em nossa adoração. Isso inclui preparar bem as reuniões e participar delas.",
        resposta: "Podemos mostrar gratidão por dar a Jeová o melhor de nós mesmos em nossa adoração. Isso inclui preparar bem as reuniões e participar delas."
      },
      {
        paragrafo: "5-6",
        pergunta: "Como podemos mostrar gratidão pelo resgate no ministério?",
        textoBase: "Podemos mostrar gratidão por participar regularmente no ministério e por ajudar as pessoas a conhecer Jeová e Jesus.",
        resposta: "Podemos mostrar gratidão por participar regularmente no ministério e por ajudar as pessoas a conhecer Jeová e Jesus. Assim, elas também podem se beneficiar do resgate."
      },
      {
        paragrafo: "7-8",
        pergunta: "Como podemos mostrar gratidão pelo resgate em nosso modo de viver?",
        textoBase: "Podemos mostrar gratidão por viver de acordo com os padrões de Jeová. Isso inclui evitar práticas que desagradam a Deus.",
        resposta: "Podemos mostrar gratidão por viver de acordo com os padrões de Jeová. Isso inclui evitar práticas que desagradam a Deus e imitar as qualidades de Jesus."
      },
      {
        paragrafo: "9-10",
        pergunta: "Como podemos mostrar gratidão pelo resgate no modo como tratamos outros?",
        textoBase: "Podemos mostrar gratidão por tratar os outros com amor e bondade, assim como Jesus nos tratou.",
        resposta: "Podemos mostrar gratidão por tratar os outros com amor e bondade, assim como Jesus nos tratou. Devemos perdoar de coração os que pecam contra nós."
      },
      {
        paragrafo: "11",
        pergunta: "Por que devemos mostrar gratidão pelo resgate todos os dias?",
        textoBase: "Porque fomos comprados por um preço. Pertencemos a Jeová. Cada dia é uma oportunidade de mostrar que valorizamos o sacrifício de Jesus.",
        resposta: "Porque fomos comprados por um preço. Pertencemos a Jeová. Cada dia é uma oportunidade de mostrar que valorizamos o sacrifício de Jesus."
      },
      {
        paragrafo: "12",
        pergunta: "O que você está determinado a fazer?",
        textoBase: "Estou determinado a mostrar minha gratidão pelo resgate todos os dias, não apenas na época da Celebração.",
        resposta: "Estou determinado a mostrar minha gratidão pelo resgate todos os dias, não apenas na época da Celebração. Quero viver de um modo que honre a Jeová e mostre que valorizo o sacrifício de Jesus."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Como podemos mostrar gratidão pelo resgate em nossa ADORAÇÃO?",
        resposta: "Podemos dar a Jeová o melhor de nós mesmos, preparando bem as reuniões e participando delas. Também podemos meditar no que o resgate significa para nós."
      },
      {
        pergunta: "Como podemos mostrar gratidão pelo resgate no MINISTÉRIO?",
        resposta: "Podemos participar regularmente no ministério e ajudar as pessoas a conhecer Jeová e Jesus. Assim, elas também podem se beneficiar do resgate."
      },
      {
        pergunta: "Como podemos mostrar gratidão pelo resgate em nosso MODO DE VIVER?",
        resposta: "Podemos viver de acordo com os padrões de Jeová, evitar práticas que o desagradam, imitar as qualidades de Jesus e tratar os outros com amor e bondade."
      }
    ]
  },
  {
    id: 5,
    semana: "Semana 5",
    dataInicio: "30 de março",
    dataFim: "5 de abril",
    canticoInicial: 76,
    canticoInicialTitulo: "Como é agradável",
    canticoFinal: 160,
    canticoFinalTitulo: "As boas novas sobre Jesus",
    titulo: "Fale a verdade de modo agradável",
    textoTema: "Jeová, [o] Deus da verdade.",
    textoTemaRef: "SAL. 31:5",
    objetivo: "Ver como podemos falar a verdade de uma forma que traga bons resultados.",
    imagem: "/images/estudo-semana5.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "O que precisamos fazer para nos tornar parte da família de Jeová?",
        textoBase: "A verdade da Palavra de Deus influencia toda a nossa vida. Só podemos nos tornar parte da família de Jeová se amarmos a verdade e vivermos de acordo com ela.",
        resposta: "A verdade da Palavra de Deus influencia toda a nossa vida. Só podemos nos tornar parte da família de Jeová se amarmos a verdade e vivermos de acordo com ela. Isso inclui sermos honestos no que falamos e fazemos."
      },
      {
        paragrafo: "2",
        pergunta: "Jesus sempre falava a verdade? Como as pessoas reagiam? (Mateus 10:35)",
        textoBase: "Jesus sempre falava a verdade, mesmo que suas palavras não agradassem a todos. Até mesmo os inimigos dele reconheciam isso.",
        resposta: "Jesus sempre falava a verdade, mesmo que suas palavras não agradassem a todos. Até mesmo os inimigos dele reconheciam isso. Jesus disse que viria causar divisão entre as pessoas. Ele sabia que a mensagem que pregava dividiria o mundo em dois grupos."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Vamos responder às perguntas: Onde podemos encontrar a verdade? Por que, como e quando devemos falar a verdade?",
        resposta: "Vamos responder às perguntas: Onde podemos encontrar a verdade? Por que, como e quando devemos falar a verdade? Isso vai nos ajudar a falar a verdade de maneira ainda mais agradável."
      },
      {
        paragrafo: "4",
        pergunta: "Por que podemos dizer que Jeová é a Fonte da verdade?",
        textoBase: "Tudo o que Jeová diz é verdadeiro. Ele fala a verdade quando diz o que é certo e o que é errado. Tudo o que ele prediz sobre o futuro se cumpre. Ele nunca quebra uma promessa.",
        resposta: "Tudo o que Jeová diz é verdadeiro. Ele fala a verdade quando diz o que é certo e o que é errado. Tudo o que ele prediz sobre o futuro se cumpre. Ele nunca quebra uma promessa. A Bíblia diz que é impossível Jeová mentir."
      },
      {
        paragrafo: "5",
        pergunta: "Por que não é difícil conhecer o 'Deus da verdade'? (Atos 17:27)",
        textoBase: "Para qualquer lugar que olhamos, vemos provas de que Deus existe. Paulo disse que Deus quer que 'o achemos' e que ele 'não está longe de cada um de nós'.",
        resposta: "Para qualquer lugar que olhamos, vemos provas de que Deus existe. Paulo disse que Deus quer que 'o achemos' e que ele 'não está longe de cada um de nós'. Jeová atrai pessoas humildes que estão procurando pela verdade."
      },
      {
        paragrafo: "6",
        pergunta: "Quais são algumas das verdades que encontramos na Bíblia?",
        textoBase: "A Bíblia ensina verdades sobre a origem do Universo e da vida na Terra, a origem do pecado, do sofrimento e da morte.",
        resposta: "A Bíblia ensina verdades sobre a origem do Universo e da vida na Terra, a origem do pecado, do sofrimento e da morte. Podemos confiar na promessa de que Jeová vai desfazer todos os danos causados pelo Diabo."
      },
      {
        paragrafo: "7-8",
        pergunta: "Faz diferença a nossa motivação ao falar a verdade? Dê um exemplo. (Marcos 3:11,12)",
        textoBase: "Sim, faz diferença. Quando Jesus pregava, algumas pessoas possuídas por demônios gritavam: 'Você é o Filho de Deus.' Os demônios disseram a verdade, mas a motivação deles era egoísta.",
        resposta: "Sim, faz diferença. Os demônios disseram a verdade sobre Jesus, mas a motivação deles era egoísta. Talvez quisessem ganhar a confiança das pessoas para depois desviá-las de servir a Jeová. Jesus ordenou que não pregassem sobre ele."
      },
      {
        paragrafo: "9",
        pergunta: "O que devemos evitar fazer, e por quê?",
        textoBase: "Devemos evitar chamar atenção para nós mesmos. Se divulgarmos informações confidenciais, podemos subir no conceito das pessoas, mas não no conceito de Jeová.",
        resposta: "Devemos evitar chamar atenção para nós mesmos. Se divulgarmos informações confidenciais, podemos subir no conceito das pessoas, mas não no conceito de Jeová. Estaríamos falando a verdade com a motivação errada."
      },
      {
        paragrafo: "10",
        pergunta: "O que significa falar palavras 'agradáveis'? (Colossenses 4:6)",
        textoBase: "Paulo lembrou que nossas palavras devem ser 'sempre agradáveis'. A expressão passa a ideia de que nossas palavras precisam ser bondosas e atraentes.",
        resposta: "Paulo lembrou que nossas palavras devem ser 'sempre agradáveis'. A expressão passa a ideia de que nossas palavras, além de beneficiar os nossos ouvintes, precisam ser bondosas e atraentes."
      },
      {
        paragrafo: "11-12",
        pergunta: "Por que devemos ensinar a verdade com cuidado? Dê um exemplo.",
        textoBase: "A Bíblia é comparada a uma espada afiada que pode revelar quem nós realmente somos por dentro. Mas se não usarmos a Bíblia com cuidado, podemos acabar ofendendo as pessoas.",
        resposta: "A Bíblia é comparada a uma espada afiada. Se não a usarmos com cuidado, podemos ofender as pessoas. Por exemplo, não seria sábio dizer logo na primeira conversa que uma comemoração não é aprovada por Deus."
      },
      {
        paragrafo: "13",
        pergunta: "O que significa temperar nossas palavras com sal?",
        textoBase: "Paulo disse que devemos 'temperar' nossas palavras para apresentar a verdade de uma forma que agrade o 'gosto' do nosso ouvinte.",
        resposta: "Devemos adaptar nossas palavras de acordo com o gosto e a cultura do nosso ouvinte. Assim como ao cozinhar pensamos no gosto dos outros, ao falar a verdade devemos pensar em como o ouvinte vai receber a mensagem."
      },
      {
        paragrafo: "14-15",
        pergunta: "Jesus ensinava tudo o que sabia para os seus discípulos? (Provérbios 25:11)",
        textoBase: "Jesus ensinava muitas coisas, mas não tentava ensinar tudo o que sabia. Ele levava em conta as limitações dos seus discípulos e entendia que não era a hora certa de eles aprenderem algumas verdades.",
        resposta: "Jesus não tentava ensinar tudo o que sabia porque levava em conta as limitações dos seus discípulos. Devemos dizer o que os estudantes precisam saber na hora em que eles precisam saber."
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
        pergunta: "Onde podemos encontrar a verdade?",
        resposta: "A verdade está na Palavra de Deus, a Bíblia. Jeová é a Fonte da verdade. Tudo o que ele diz é verdadeiro e tudo o que ele prediz se cumpre."
      },
      {
        pergunta: "Por que devemos falar a verdade com a motivação correta?",
        resposta: "Porque nossa motivação faz diferença. Devemos falar a verdade para honrar a Jeová e beneficiar nossos ouvintes, não para chamar atenção para nós mesmos."
      },
      {
        pergunta: "Como devemos falar a verdade?",
        resposta: "Devemos falar de modo agradável, usando palavras bondosas e atraentes. Devemos temperar nossas palavras com sal, adaptando-as ao nosso ouvinte, e ensinar no momento certo."
      }
    ]
  }
]

export default function EstudoSentinelaPage() {
  const [estudoAberto, setEstudoAberto] = useState<number | null>(null)
  const [perguntasExpandidas, setPerguntasExpandidas] = useState<{[key: string]: boolean}>({})

  const toggleEstudo = (id: number) => {
    setEstudoAberto(estudoAberto === id ? null : id)
    setPerguntasExpandidas({})
  }

  const togglePergunta = (estudoId: number, paragrafo: string) => {
    const key = `${estudoId}-${paragrafo}`
    setPerguntasExpandidas(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-200">
          Estudo de A Sentinela — Março 2026
        </h1>
        
        <div className="space-y-4">
          {estudosMarco.map((estudo) => (
            <div key={estudo.id} className="rounded-lg overflow-hidden">
              {/* Card de Resumo - Clicável */}
              <button
                onClick={() => toggleEstudo(estudo.id)}
                className="w-full flex items-center gap-4 p-4 bg-zinc-900 hover:bg-zinc-800 transition-colors text-left"
              >
                {/* Imagem placeholder */}
                <div className="w-24 h-16 md:w-32 md:h-20 bg-zinc-700 rounded-lg flex-shrink-0 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center">
                    <span className="text-3xl font-bold text-zinc-500">{estudo.id}</span>
                  </div>
                </div>
                
                {/* Info da Semana */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-blue-400 font-medium uppercase tracking-wide">
                    {estudo.dataInicio}-{estudo.dataFim} de 2026
                  </p>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-100 mt-1 line-clamp-2">
                    {estudo.titulo}
                  </h2>
                </div>

                {/* Indicador de expansão */}
                <div className="flex-shrink-0">
                  {estudoAberto === estudo.id ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Conteúdo Expandido */}
              {estudoAberto === estudo.id && (
                <div className="bg-zinc-950 border-t border-zinc-800">
                  {/* Cântico Inicial */}
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-blue-400 font-medium flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      CÂNTICO {estudo.canticoInicial} {estudo.canticoInicialTitulo}
                    </p>
                  </div>

                  {/* Título Principal */}
                  <div className="p-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-300 leading-tight">
                      {estudo.titulo}
                    </h2>
                  </div>

                  {/* Texto do Ano / Tema */}
                  <div className="px-4 pb-4">
                    <p className="text-gray-300">
                      <span className="font-bold text-gray-100">NOSSO TEXTO DO ANO PARA 2026: </span>
                      <span className="italic">"{estudo.textoTema}"</span>
                      <span className="text-gray-400"> — </span>
                      <span className="text-blue-400 underline">{estudo.textoTemaRef}</span>.
                    </p>
                  </div>

                  {/* Objetivo */}
                  <div className="mx-4 mb-6 border-l-4 border-yellow-500 bg-zinc-900 p-4">
                    <p className="text-yellow-500 font-bold text-sm mb-1">OBJETIVO</p>
                    <p className="text-gray-200">{estudo.objetivo}</p>
                  </div>

                  {/* Perguntas */}
                  <div className="px-4 pb-4 space-y-6">
                    {estudo.perguntas.map((pergunta, idx) => {
                      const key = `${estudo.id}-${pergunta.paragrafo}`
                      const isExpanded = perguntasExpandidas[key]

                      return (
                        <div key={idx} className="space-y-3">
                          {/* Pergunta */}
                          <button
                            onClick={() => togglePergunta(estudo.id, pergunta.paragrafo)}
                            className="w-full text-left"
                          >
                            <p className="text-gray-200">
                              <span className="font-bold text-white">{pergunta.paragrafo}. </span>
                              {pergunta.pergunta}
                            </p>
                          </button>

                          {/* Caixa de resposta */}
                          <div
                            onClick={() => togglePergunta(estudo.id, pergunta.paragrafo)}
                            className={`rounded-lg p-4 cursor-pointer transition-all ${
                              isExpanded 
                                ? 'bg-green-900/50 border border-green-700' 
                                : 'bg-zinc-800 border border-zinc-700'
                            }`}
                          >
                            {isExpanded ? (
                              <p className="text-green-100">{pergunta.resposta}</p>
                            ) : (
                              <p className="text-zinc-500 text-sm">Toque para ver a resposta</p>
                            )}
                          </div>

                          {/* Texto base do parágrafo */}
                          {pergunta.textoBase && (
                            <div className="text-gray-300 leading-relaxed">
                              <p>{pergunta.textoBase}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Perguntas de Recapitulação */}
                  <div className="mx-4 mb-6 bg-amber-900/30 border border-amber-700/50 rounded-lg p-4">
                    <h3 className="text-amber-400 font-bold text-lg mb-4">PERGUNTAS DE RECAPITULAÇÃO</h3>
                    <div className="space-y-4">
                      {estudo.recapitulacao.map((recap, idx) => {
                        const key = `recap-${estudo.id}-${idx}`
                        const isExpanded = perguntasExpandidas[key]

                        return (
                          <div key={idx}>
                            <button
                              onClick={() => {
                                setPerguntasExpandidas(prev => ({
                                  ...prev,
                                  [key]: !prev[key]
                                }))
                              }}
                              className="w-full text-left"
                            >
                              <p className="text-amber-200 font-medium">{recap.pergunta}</p>
                            </button>
                            {isExpanded && (
                              <div className="mt-2 p-3 bg-green-900/50 rounded-lg">
                                <p className="text-green-100">{recap.resposta}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Cântico Final */}
                  <div className="px-4 py-4 bg-zinc-900 border-t border-zinc-800">
                    <p className="text-blue-400 font-medium flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      CÂNTICO {estudo.canticoFinal} {estudo.canticoFinalTitulo}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
