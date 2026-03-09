// Estudos de A Sentinela - Março 2026 (Edição de Janeiro 2026)
// Textos completos do PDF original

export interface Pergunta {
  paragrafo: string
  pergunta: string
  textoBase: string
  resposta: string
  imagem?: string
  imagemLegenda?: string
  imagemDescricao?: string
}

export interface Recapitulacao {
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
  imagem: string
  perguntas: Pergunta[]
  recapitulacao: Recapitulacao[]
}

export const estudosMarco: Estudo[] = [
  {
    id: 1,
    semana: "Semana 1",
    dataInicio: "2",
    dataFim: "8 de março",
    canticoInicial: 97,
    canticoInicialTitulo: "Que seu Espírito Santo nos dê vida",
    canticoFinal: 162,
    canticoFinalTitulo: "Preciso de ti",
    titulo: "Continue cuidando da sua 'necessidade espiritual'",
    textoTema: "Felizes os que têm consciência de sua necessidade espiritual.",
    textoTemaRef: "MAT. 5:3",
    objetivo: "Ver como cuidar de nossa necessidade espiritual e por que isso é tão importante.",
    imagem: "/images/estudo-marco-semana1.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "Por que as pessoas no mundo muitas vezes não cuidam de sua necessidade espiritual?",
        textoBase: "Muitas pessoas no mundo não cuidam de sua necessidade espiritual porque não acreditam em Deus ou acham que não precisam dele. Outras estão tão ocupadas com as atividades do dia a dia que não param para pensar em assuntos espirituais. E outras ainda acham que vão ficar bem apenas seguindo as tradições religiosas de sua família ou cultura.",
        resposta: "Muitas pessoas no mundo não cuidam de sua necessidade espiritual porque não acreditam em Deus ou acham que não precisam dele. Outras estão tão ocupadas com as atividades do dia a dia que não param para pensar em assuntos espirituais. E outras ainda acham que vão ficar bem apenas seguindo as tradições religiosas de sua família ou cultura."
      },
      {
        paragrafo: "2",
        pergunta: "O que Jesus disse em Mateus 5:3, e por que suas palavras são importantes?",
        textoBase: "Jesus disse: 'Felizes os que têm consciência de sua necessidade espiritual.' Essas palavras são importantes porque mostram que ter consciência de nossa necessidade espiritual é essencial para nossa felicidade. Jesus sabia que só Jeová pode satisfazer plenamente essa necessidade. Por isso, ele nos incentiva a reconhecer que precisamos de orientação espiritual e a buscar satisfazer essa necessidade.",
        resposta: "Jesus disse: 'Felizes os que têm consciência de sua necessidade espiritual.' Essas palavras são importantes porque mostram que ter consciência de nossa necessidade espiritual é essencial para nossa felicidade. Jesus sabia que só Jeová pode satisfazer plenamente essa necessidade."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Neste estudo, vamos ver o que significa ter consciência de nossa necessidade espiritual e como Jeová nos ajuda a cuidar dessa necessidade. Também vamos ver o exemplo de uma mulher fenícia que mostrou verdadeira humildade, persistência e fé. E vamos considerar como os apóstolos Pedro e Paulo, e o rei Davi, podem nos ajudar a cuidar de nossa necessidade espiritual.",
        resposta: "Neste estudo, vamos ver o que significa ter consciência de nossa necessidade espiritual e como Jeová nos ajuda a cuidar dessa necessidade. Também vamos ver exemplos da mulher fenícia, dos apóstolos Pedro e Paulo, e do rei Davi."
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
        textoBase: "Nós podemos imitar Paulo por reconhecer que, não importa há quanto tempo servimos a Jeová, precisamos continuar usando a vestimenta espiritual que ele nos dá. E como vimos, isso envolve nos livrar da velha personalidade e nos revestir da nova. Se voltarmos a mostrar uma característica ruim de personalidade, como perder a cabeça ou falar de modo grosseiro, não precisamos achar que somos um fracasso. Em vez disso, devemos continuar tentando mudar nosso modo de pensar e agir. E devemos confiar que Jeová vai nos ajudar a fazer isso. Ele nos dá o 'espírito de sabedoria e de revelação', que torna possível fazermos mudanças que vão agradar a ele. — Efé. 1:17.",
        resposta: "Podemos imitar Paulo por reconhecer que precisamos continuar usando a vestimenta espiritual que Jeová nos dá. Se voltarmos a mostrar uma característica ruim de personalidade, como perder a cabeça ou falar de modo grosseiro, não precisamos achar que somos um fracasso. Devemos continuar tentando mudar nosso modo de pensar e agir."
      },
      {
        paragrafo: "14-15",
        pergunta: "De que forma Jeová protege seus servos em sentido espiritual? (Salmo 27:5)",
        textoBase: "Jeová protege seus servos de qualquer coisa ou pessoa que possa destruir sua fé nele. (Leia Salmo 27:5.) Ele promete que nenhuma arma fabricada contra nós vai ser bem-sucedida. (Isa. 54:17) Apesar de Satanás e seus apoiadores serem poderosos, eles jamais vão conseguir nos causar algum dano permanente. Mesmo que nos tirem a vida, Jeová é capaz de nos trazer de volta na ressurreição. Jeová também nos protege por nos ajudar a lidar com as ansiedades da vida. A Bíblia diz que 'a paz de Deus guarda o coração e a mente' de seus servos fiéis. (Fil. 4:6, 7) Além disso, Jeová nos dá irmãos e irmãs que nos ajudam e nos apoiam quando estamos passando por dificuldades. E ele nos dá os anciãos, que pastoreiam o rebanho dele com amor e nos protegem de ensinos falsos. — Isa. 32:1, 2.",
        resposta: "Jeová protege seus servos de qualquer coisa ou pessoa que possa destruir sua fé nele. Ele promete que nenhuma arma fabricada contra nós vai ser bem-sucedida. Mesmo que nos tirem a vida, Jeová é capaz de nos trazer de volta na ressurreição. Ele também nos protege por nos ajudar a lidar com as ansiedades e nos dá irmãos e anciãos para nos apoiar e pastorear."
      },
      {
        paragrafo: "16",
        pergunta: "De que maneiras Jeová protegeu Davi?",
        textoBase: "Quando Davi seguia os padrões de Jeová, ele era protegido porque Jeová o ajudava a tomar decisões sábias, que traziam felicidade. Por outro lado, quando ignorava esses padrões, Davi não era protegido das consequências de suas ações. Quando Davi sofreu por causa das ações de outras pessoas, ele contou para Jeová todas as suas ansiedades. E Jeová consolava e acalmava Davi, garantindo que o amava muito e que cuidaria bem dele. — Sal. 23:1-6.",
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
        pergunta: "O que podemos fazer para aproveitar bem o alimento espiritual?",
        resposta: "Devemos nos alimentar regularmente das verdades básicas da Palavra de Deus e desenvolver o desejo por alimento espiritual sólido. Quando nosso entendimento de uma verdade bíblica é ajustado, precisamos ser rápidos para adaptar nosso modo de pensar e de agir."
      },
      {
        pergunta: "O que podemos fazer para aproveitar bem a vestimenta espiritual?",
        resposta: "Devemos nos 'despir da velha personalidade' e nos 'revestir da nova personalidade'. Isso é um processo contínuo que exige tempo e esforço. Se voltarmos a mostrar uma característica ruim, não devemos achar que somos um fracasso, mas continuar tentando mudar."
      },
      {
        pergunta: "O que podemos fazer para aproveitar bem a proteção espiritual?",
        resposta: "Podemos imitar Davi buscando as orientações de Jeová antes de tomar decisões. Quando sofremos por causa das ações de outros, abrimos nosso coração para Jeová, confiando que ele vai proteger nossa mente e nosso coração."
      }
    ]
  },
  {
    id: 2,
    semana: "Semana 2",
    dataInicio: "9",
    dataFim: "15 de março",
    canticoInicial: 45,
    canticoInicialTitulo: "Os pensamentos do meu coração",
    canticoFinal: 34,
    canticoFinalTitulo: "Andarei em integridade",
    titulo: "Você é capaz de lutar contra sentimentos negativos!",
    textoTema: "Homem miserável que eu sou!",
    textoTemaRef: "ROM. 7:24",
    objetivo: "Aprender a lidar com pensamentos e sentimentos negativos.",
    imagem: "/images/estudo-marco-semana2.jpg",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "Como o apóstolo Paulo se sentia às vezes? E por que podemos nos identificar com ele? (Romanos 7:21-24)",
        textoBase: "Do que você lembra quando pensa no apóstolo Paulo? Que ele era um missionário corajoso, um instrutor habilidoso ou alguém que escreveu vários livros da Bíblia? Tudo isso é verdade! Mas às vezes, como muitos de nós, ele tinha que lutar contra sentimentos negativos, como tristeza, desânimo e ansiedade. Em sua carta aos romanos, Paulo mostrou que tinha sentimentos que muitos de nós também temos. Mesmo sendo um cristão fiel, Paulo estava numa luta entre sua inclinação para fazer coisas erradas e seu desejo sincero de fazer a vontade de Deus. Às vezes, Paulo também tinha que lidar com sentimentos negativos relacionados a um problema persistente e a erros do passado.",
        resposta: "Paulo, apesar de ser um missionário corajoso e instrutor habilidoso, às vezes tinha que lutar contra sentimentos negativos, como tristeza, desânimo e ansiedade. Ele estava numa luta entre sua inclinação para fazer coisas erradas e seu desejo sincero de fazer a vontade de Deus. Às vezes também tinha que lidar com sentimentos negativos relacionados a um problema persistente e a erros do passado."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo? (Veja também 'Entenda Melhor'.)",
        textoBase: "Apesar de sua luta interna, Paulo não deixou que sentimentos negativos o controlassem. Neste estudo, vamos considerar as seguintes perguntas: Por que às vezes Paulo se sentia 'miserável'? Como ele lidava com sentimentos negativos? E como podemos ser bem-sucedidos na luta contra nossos sentimentos negativos? Nota: Neste estudo, a expressão 'sentimentos negativos' se refere à tristeza ou à ansiedade que todos nós podemos sentir de vez em quando. Ela não se refere à depressão crônica, que é um problema sério de saúde.",
        resposta: "Neste estudo, vamos considerar: Por que às vezes Paulo se sentia 'miserável'? Como ele lidava com sentimentos negativos? E como podemos ser bem-sucedidos na luta contra nossos sentimentos negativos? A expressão 'sentimentos negativos' se refere à tristeza ou ansiedade que todos podemos sentir de vez em quando, não à depressão crônica."
      },
      {
        paragrafo: "4",
        pergunta: "Por que Paulo teve sentimentos negativos?",
        textoBase: "Erros do passado. Antes de se tornar cristão, Paulo, que era conhecido como Saulo, fez muitas coisas ruins. Por exemplo, ele aprovou o assassinato de um homem fiel chamado Estêvão. (Atos 7:58; 8:1) Além disso, Saulo liderou uma perseguição cruel contra os cristãos. — Atos 8:3; 26:9-11.",
        resposta: "Paulo teve sentimentos negativos por causa de erros do passado. Antes de se tornar cristão, ele aprovou o assassinato de Estêvão e liderou uma perseguição cruel contra os cristãos."
      },
      {
        paragrafo: "5",
        pergunta: "Como Paulo se sentiu por causa do que tinha feito?",
        textoBase: "Depois que se tornou cristão, o apóstolo Paulo às vezes se sentiu culpado pelas coisas que tinha feito. Parece que, ao longo dos anos, os erros do passado o deixaram cada vez mais triste. Por exemplo, quando escreveu sua primeira carta aos coríntios, mais ou menos no ano 55, ele disse: 'Não sou digno de ser chamado apóstolo, porque persegui a congregação de Deus.' (1 Cor. 15:9) Uns cinco anos mais tarde, na sua carta aos efésios, ele falou que era 'menor que o menor de todos os santos'. (Efé. 3:8) Quando escreveu para Timóteo, Paulo também disse que costumava ser 'blasfemador, perseguidor e insolente'. (1 Tim. 1:13) Ao visitar as congregações, deve ter sido muito difícil para Paulo encontrar os irmãos que ele tinha perseguido ou os parentes deles.",
        resposta: "Depois de se tornar cristão, Paulo às vezes se sentiu culpado. Ele disse que não era 'digno de ser chamado apóstolo' porque perseguiu a congregação. Anos depois, disse que era 'menor que o menor de todos os santos'. Deve ter sido muito difícil para ele encontrar os irmãos que tinha perseguido ou os parentes deles."
      },
      {
        paragrafo: "6",
        pergunta: "Que outra coisa deixava Paulo ansioso? (Veja também a nota.)",
        textoBase: "Um espinho na carne. Paulo falou de um problema que o deixava ansioso e era como 'um espinho na carne'. (2 Cor. 12:7) Paulo não disse exatamente qual era o problema. Mas a expressão que ele usou indica que era algo que trazia muita dor para ele. Pode ter sido um problema físico, emocional ou alguma outra coisa. Nota: As palavras de Paulo dão a entender que ele tinha problema de visão. Por isso, pode ter sido difícil para ele escrever suas cartas e realizar seu ministério. (Gál. 4:15; 6:11) Ou o espinho na carne talvez fosse a ansiedade que Paulo estava sentindo por causa de alguns falsos instrutores. (2 Cor. 10:10; 11:5, 13) Não sabemos com certeza qual era o problema de Paulo, mas sabemos que isso o incomodava muito.",
        resposta: "Paulo falou de 'um espinho na carne' que o deixava ansioso. Não sabemos exatamente qual era o problema, mas a expressão indica que era algo que trazia muita dor para ele. Pode ter sido um problema de visão, a ansiedade por causa de falsos instrutores, ou outra coisa que o incomodava muito."
      },
      {
        paragrafo: "7",
        pergunta: "Como Paulo se sentiu por causa das suas imperfeições? (Romanos 7:18, 19)",
        textoBase: "Suas imperfeições. Paulo às vezes se sentia desanimado por causa das suas imperfeições. (Leia Romanos 7:18, 19.) Ele queria fazer o que era certo, mas se sentia incapaz. Paulo reconheceu que estava sempre lutando para não seguir suas tendências erradas. Ele se esforçava muito para melhorar a sua personalidade. (1 Cor. 9:27) Mas de vez em quando, algumas características negativas da sua personalidade voltavam a aparecer. Quando isso acontecia, Paulo devia se sentir muito frustrado.",
        resposta: "Paulo às vezes se sentia desanimado por causa das suas imperfeições. Ele queria fazer o que era certo, mas se sentia incapaz. Reconheceu que estava sempre lutando para não seguir suas tendências erradas e se esforçava muito para melhorar. Mas de vez em quando, algumas características negativas voltavam a aparecer, e isso o deixava frustrado."
      },
      {
        paragrafo: "8",
        pergunta: "O que Paulo fazia para lidar com suas imperfeições?",
        textoBase: "Em suas cartas, Paulo escreveu várias vezes sobre características e desejos errados que os cristãos tinham que combater. (Gál. 5:19-21, 26) Além disso, Paulo meditava em como ele e outros cristãos podiam lutar contra tendências erradas e melhorar sua personalidade com a ajuda do espírito santo. (Rom. 8:13; Gál. 5:16, 17) Isso mostra que, para lidar com suas imperfeições, Paulo pensava em quais eram seus pontos fracos, buscava a orientação das Escrituras e identificava os passos necessários para vencer essa luta. E já que ele aconselhava outros a fazer isso, podemos ter certeza que ele também colocava em prática esses conselhos.",
        resposta: "Paulo pensava em quais eram seus pontos fracos, buscava a orientação das Escrituras e identificava os passos necessários para vencer essa luta. Ele meditava em como poderia lutar contra tendências erradas com a ajuda do espírito santo. E já que aconselhava outros a fazer isso, ele também colocava em prática esses conselhos."
      },
      {
        paragrafo: "9-10",
        pergunta: "O que ajudou Paulo a lutar contra sentimentos negativos? (Efésios 1:7) (Veja também a imagem.)",
        textoBase: "Às vezes, Paulo se sentia desanimado, mas na maior parte do tempo ele tinha uma atitude positiva. Por exemplo, ele ficava feliz de ouvir boas notícias sobre congregações distantes. (2 Cor. 7:6, 7) A amizade que tinha com os irmãos também era uma fonte de alegria para ele. (2 Tim. 1:4) Além disso, Paulo ficava feliz porque tinha uma amizade forte com Jeová e o servia 'com uma consciência limpa'. (2 Tim. 1:3) Até quando estava numa prisão em Roma, ele incentivou os irmãos a 'se alegrar no Senhor'. (Fil. 4:4) As palavras de Paulo mostram que ele não ficava o tempo todo pensando em seus problemas e suas falhas. Quando pensamentos negativos vinham à sua mente, ele logo pensava em coisas que o ajudavam a ter novamente uma atitude feliz e positiva. Outra coisa que ajudava Paulo a lutar contra sentimentos negativos era que ele via o resgate como um presente especial de Deus para ele. (Gál. 2:20; leia Efésios 1:7.) Paulo tinha certeza de que receberia o perdão de Jeová por meio do sacrifício de Jesus Cristo. (Rom. 7:24, 25) Assim, ele podia continuar 'prestando serviço sagrado' a Deus com alegria, apesar de erros do passado e de suas imperfeições. — Heb. 9:12-14.",
        resposta: "Paulo ficava feliz de ouvir boas notícias das congregações, tinha amizade forte com os irmãos e com Jeová. Quando pensamentos negativos vinham, ele logo pensava em coisas positivas. Outra coisa que o ajudava era ver o resgate como um presente especial de Deus para ele. Ele tinha certeza de que receberia o perdão de Jeová por meio do sacrifício de Jesus."
      },
      {
        paragrafo: "11",
        pergunta: "Como o exemplo de Paulo faz você se sentir?",
        textoBase: "Assim como Paulo, temos uma luta dentro de nós. É um desafio pensar, agir e falar de um modo que agrade a Jeová. Pode ser que às vezes até pensemos: 'Que pessoa miserável eu sou!' Uma irmã de 26 anos chamada Eliza explica como ela se sente: 'É animador pra mim pensar na situação difícil que Paulo enfrentou. Eu fico aliviada de saber que não sou a única a me sentir assim. O exemplo dele também me lembra que Jeová entende os desafios que seus servos enfrentam.' O que podemos fazer para, assim como Paulo, continuarmos felizes e com a consciência limpa, apesar de nossos sentimentos negativos?",
        resposta: "Assim como Paulo, temos uma luta dentro de nós. É um desafio pensar, agir e falar de um modo que agrade a Jeová. É animador pensar na situação difícil que Paulo enfrentou. O exemplo dele nos lembra que Jeová entende os desafios que seus servos enfrentam."
      },
      {
        paragrafo: "12",
        pergunta: "Como manter uma boa rotina espiritual nos ajuda?",
        textoBase: "Mantenha uma boa rotina espiritual. Desenvolver uma boa rotina espiritual nos ajuda a focar em coisas positivas. Podemos comparar nossa rotina espiritual com hábitos saudáveis. Geralmente nos alimentar bem, fazer exercícios regularmente e dormir o suficiente contribui para o nosso bem-estar. Da mesma forma, todos nós já sentimos como é bom ler a Palavra de Deus regularmente, preparar, assistir e participar das reuniões e ir ao campo. Essas atividades nos animam e nos ajudam a lidar com pensamentos negativos. — Rom. 12:11, 12.",
        resposta: "Desenvolver uma boa rotina espiritual nos ajuda a focar em coisas positivas. Assim como nos alimentar bem e fazer exercícios contribui para o bem-estar físico, ler a Palavra de Deus, participar das reuniões e ir ao campo nos anima e nos ajuda a lidar com pensamentos negativos."
      },
      {
        paragrafo: "13-14",
        pergunta: "Dê exemplos que mostram como faz bem ter uma boa rotina espiritual.",
        textoBase: "Veja o exemplo de John, que aos 39 anos descobriu que tinha um tipo raro de câncer. No começo, ele ficou ansioso e com muito medo. Ele pensava: 'Não é justo! Eu sou muito jovem pra ficar doente.' Nessa época, o filho dele tinha apenas 3 anos. O que ajudou John a lidar com esses sentimentos negativos? Ele conta: 'Apesar de me sentir muito cansado, eu fiz questão que nossa família continuasse tendo uma rotina espiritual. A gente assistia a todas as reuniões, ia no campo toda semana e fazia adoração em família regularmente, mesmo tendo muitos compromissos.' Olhando para trás, ele conclui: 'Depois que passou o choque inicial, o amor e o poder de Jeová me ajudaram a superar os pensamentos negativos. Jeová me deu forças, e ele pode fazer o mesmo por você.' Eliza, citada antes, diz: 'Toda vez que vou às reuniões e faço o meu estudo pessoal, eu tenho mais certeza de que Jeová me escuta e me ama. Isso me deixa feliz.' Nolan, um superintendente de circuito na África, conta como ele e sua esposa, Diane, se sentem: 'Fazemos questão de manter nossa rotina espiritual mesmo quando estamos desanimados. Jeová sempre mostra de alguma forma que está do nosso lado nos ajudando a ter a atitude certa. Procuramos nos lembrar que Jeová vai nos ajudar e abençoar. Podemos até não saber como, mas temos certeza de que ele vai!'",
        resposta: "John, diagnosticado com câncer aos 39 anos, manteve a rotina espiritual da família mesmo cansado. Ele diz: 'O amor e o poder de Jeová me ajudaram a superar os pensamentos negativos.' Eliza diz: 'Toda vez que vou às reuniões, tenho mais certeza de que Jeová me escuta e me ama.' Nolan e Diane dizem: 'Fazemos questão de manter nossa rotina espiritual mesmo desanimados.'"
      },
      {
        paragrafo: "15",
        pergunta: "O que mais podemos fazer para superar pensamentos negativos? Ilustre.",
        textoBase: "Nós também podemos fazer outras coisas para superar pensamentos negativos. Por exemplo, imagine que você esteja com dor nas costas. Para melhorar, só fazer uma massagem talvez não seja suficiente. Pode ser preciso pesquisar mais sobre o assunto e até mesmo falar com um médico. Assim você vai conseguir identificar a causa da dor. Para lidar com sentimentos negativos, podemos fazer algo parecido. Talvez precisemos fazer pesquisas usando a Bíblia e nossas publicações e até conversar com um irmão maduro. Vamos ver outras sugestões que podem nos ajudar.",
        resposta: "Assim como para uma dor nas costas pode ser preciso pesquisar e falar com um médico para identificar a causa, para lidar com sentimentos negativos podemos fazer pesquisas usando a Bíblia e nossas publicações e até conversar com um irmão maduro."
      },
      {
        paragrafo: "16",
        pergunta: "O que pode ajudar você a identificar a causa dos seus sentimentos negativos? (Salmo 139:1-4, 23, 24)",
        textoBase: "Ore para entender melhor a sua situação. O rei Davi sabia que Jeová o conhecia muito bem. Por isso, ele pediu que Jeová o ajudasse a identificar a causa das 'suas ansiedades'. (Leia Salmo 139:1-4, 23, 24.) Você também pode pedir que Jeová o ajude a identificar o que te faz ter pensamentos negativos e como lidar com eles. Você pode se perguntar: 'O que talvez esteja me deixando ansioso? Existe algum gatilho que me leva a ter pensamentos negativos? Tenho a tendência de alimentar um pensamento negativo em vez de rejeitá-lo?'",
        resposta: "O rei Davi pediu que Jeová o ajudasse a identificar a causa das 'suas ansiedades'. Podemos fazer o mesmo, perguntando: 'O que talvez esteja me deixando ansioso? Existe algum gatilho que me leva a ter pensamentos negativos? Tenho a tendência de alimentar um pensamento negativo em vez de rejeitá-lo?'"
      },
      {
        paragrafo: "17",
        pergunta: "Que assuntos você pode incluir em seu estudo pessoal para ter pensamentos mais positivos? (Veja também a imagem.)",
        textoBase: "Adapte seu estudo pessoal à sua situação. De vez em quando, pode ser de ajuda estudar algumas características da personalidade de Jeová. Por exemplo, refletir sobre o perdão de Jeová e o resgate foi muito bom para o apóstolo Paulo. Então, imite o exemplo dele. Use o Guia de Pesquisa para Testemunhas de Jeová, o Índice das Publicações da Torre de Vigia ou outras ferramentas de estudo disponíveis em seu idioma para aprender mais sobre assuntos como a misericórdia, o perdão e o amor leal de Deus. Quando encontrar artigos que podem ser de ajuda para você, crie uma lista com eles e deixe essa lista num lugar visível. Daí quando começar a se sentir pra baixo, estude esses artigos e pense em como eles podem ajudar você em sua situação. — Fil. 4:8.",
        resposta: "Adapte seu estudo pessoal à sua situação. Estudar sobre a misericórdia, o perdão e o amor leal de Deus pode ajudar. Crie uma lista de artigos úteis e, quando começar a se sentir pra baixo, estude esses artigos e pense em como eles podem ajudar você em sua situação."
      },
      {
        paragrafo: "18",
        pergunta: "Que projetos de estudo têm ajudado alguns irmãos?",
        textoBase: "Eliza, citada antes, fez um projeto de estudo sobre Jó. Ela conta: 'Eu me identifico muito com Jó. Ele enfrentou um problema atrás do outro, sem nem saber por que aquilo estava acontecendo. Mesmo assim, em seu pior momento, Jó continuou confiando na ajuda de Jeová.' (Jó 42:1-6) Diane, já mencionada, diz: 'Eu e meu marido estamos fazendo um projeto de estudo usando o livro Achegue-se a Jeová. Agradecemos a Jeová por nos moldar, assim como um oleiro faz com o barro. Em vez de focarmos em nossos erros, tentamos imaginar Jeová nos moldando e nos ajudando a ser pessoas melhores. Isso nos achega ainda mais a ele.' — Isa. 64:8.",
        resposta: "Eliza fez um projeto de estudo sobre Jó e se identificou com ele, que enfrentou problemas sem saber por quê, mas continuou confiando em Jeová. Diane e seu marido estudam o livro Achegue-se a Jeová e tentam imaginar Jeová os moldando e ajudando a ser pessoas melhores."
      },
      {
        paragrafo: "19",
        pergunta: "O que vai acontecer de vez em quando, mas que certeza podemos ter?",
        textoBase: "Uma boa rotina espiritual e um programa de estudo adaptado às nossas necessidades não vão fazer os sentimentos e pensamentos negativos desaparecerem por completo. De vez em quando, ainda vamos ficar desanimados. Mas com a ajuda de Jeová, podemos parar de alimentar pensamentos negativos e nos acalmar. Podemos ter certeza de que, na maior parte do tempo, a nossa vida vai ser feliz porque temos uma consciência limpa e somos amigos de Jeová.",
        resposta: "De vez em quando, ainda vamos ficar desanimados. Mas com a ajuda de Jeová, podemos parar de alimentar pensamentos negativos e nos acalmar. Podemos ter certeza de que, na maior parte do tempo, nossa vida vai ser feliz porque temos uma consciência limpa e somos amigos de Jeová."
      },
      {
        paragrafo: "20",
        pergunta: "O que queremos fazer?",
        textoBase: "Queremos fazer o máximo para não ser controlados por sentimentos negativos relacionados ao nosso passado, aos nossos problemas ou às nossas imperfeições. Com a ajuda de Jeová, podemos ser bem-sucedidos na luta contra os pensamentos e sentimentos negativos! (Sal. 143:10) Não vemos a hora do novo mundo chegar. Lá, não vamos precisar lutar para conseguir pensar em coisas positivas. Pelo contrário, vamos acordar todo dia sem nenhuma ansiedade e felizes por servirmos nosso amoroso Deus, Jeová!",
        resposta: "Queremos fazer o máximo para não ser controlados por sentimentos negativos. Com a ajuda de Jeová, podemos ser bem-sucedidos na luta contra os pensamentos e sentimentos negativos! No novo mundo, vamos acordar todo dia sem nenhuma ansiedade e felizes por servirmos nosso amoroso Deus, Jeová!"
      }
    ],
    recapitulacao: [
      {
        pergunta: "Por que às vezes o apóstolo Paulo tinha sentimentos negativos?",
        resposta: "Paulo tinha sentimentos negativos por causa de erros do passado (perseguiu cristãos), um 'espinho na carne' que o incomodava muito, e suas imperfeições que o faziam se sentir frustrado quando características negativas voltavam a aparecer."
      },
      {
        pergunta: "O que ajudou Paulo a manter uma atitude positiva, apesar de às vezes ficar desanimado?",
        resposta: "Paulo focava em coisas positivas como as boas notícias das congregações, a amizade com os irmãos e com Jeová, e via o resgate como um presente especial de Deus para ele, tendo certeza do perdão de Jeová."
      },
      {
        pergunta: "Como podemos lutar contra sentimentos negativos?",
        resposta: "Podemos manter uma boa rotina espiritual, orar para entender nossa situação, adaptar nosso estudo pessoal às nossas necessidades, e confiar que Jeová vai nos ajudar a superar os pensamentos negativos."
      }
    ]
  },
  {
    id: 3,
    semana: "Semana 3",
    dataInicio: "16",
    dataFim: "22 de março",
    canticoInicial: 20,
    canticoInicialTitulo: "Jeová nos deu o seu melhor",
    canticoFinal: 19,
    canticoFinalTitulo: "A Ceia do Senhor",
    titulo: "Por que precisamos do resgate?",
    textoTema: "Quem me livrará do corpo que é submetido a essa morte?",
    textoTemaRef: "ROM. 7:24",
    objetivo: "Ver como o resgate traz perdão, cura e reconciliação.",
    imagem: "/images/estudo-marco-semana3.jpg",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "Por que precisamos que alguém nos resgate? (Romanos 7:22-24) (Veja também a imagem.)",
        textoBase: "Imagine a seguinte cena: um prédio desaba, e um homem acaba ficando preso nos escombros. Ele está vivo, mas não consegue sair dessa situação sozinho. Tudo que ele pode fazer é gritar por ajuda e esperar ser resgatado por alguém. Cada um de nós está numa situação parecida. Como assim? Por Adão ter desobedecido seu Criador, ele se tornou pecador. Como somos descendentes de Adão, nós também somos pecadores. Por causa disso, todos os humanos ficaram, por assim dizer, presos debaixo dos escombros do pecado. E não podemos nos livrar das consequências disso sozinhos. Em sua carta aos romanos, o apóstolo Paulo disse que todos somos 'cativos', ou seja, estamos presos, ao pecado. Ele implorou para ser salvo 'do corpo que é submetido a essa morte'. Paulo estava preso ao pecado herdado, que, por fim, levaria à sua morte. O mesmo acontece com a gente. Estamos em perigo e precisamos ser resgatados!",
        resposta: "Cada um de nós está preso aos escombros do pecado herdado de Adão. Não podemos nos livrar das consequências disso sozinhos. Paulo disse que todos somos 'cativos' ao pecado e implorou para ser salvo. Estamos em perigo e precisamos ser resgatados!"
      },
      {
        paragrafo: "3",
        pergunta: "De que formas o resgate nos salva?",
        textoBase: "Felizmente, depois de falar da situação difícil em que estava, Paulo nos deu esperança. Depois de perguntar: 'Quem me livrará do corpo que é submetido a essa morte?', ele respondeu com bastante confiança: 'Dou graças a Deus, por meio de Jesus Cristo, nosso Senhor!' Paulo estava se referindo ao sacrifício de resgate de Jesus. O resgate nos salva porque nos dá (1) o perdão dos nossos pecados, (2) a cura da nossa condição pecaminosa e (3) a reconciliação com nosso Criador. Ao estudar esses pontos, vamos aumentar nosso amor por Jeová, 'o Deus que dá esperança'. Também vamos ser mais gratos a Jesus, 'por meio de quem temos o nosso livramento por resgate'.",
        resposta: "O resgate nos salva de três formas: (1) o perdão dos nossos pecados, (2) a cura da nossa condição pecaminosa e (3) a reconciliação com nosso Criador. Isso aumenta nosso amor por Jeová e nossa gratidão a Jesus."
      },
      {
        paragrafo: "4-5",
        pergunta: "Por que todos nós precisamos do resgate? (Eclesiastes 7:20)",
        textoBase: "Nós precisamos do resgate para sermos perdoados pelos nossos pecados. Todo humano imperfeito comete pecados, seja em palavras ou em ações. Alguns pecados são bem graves. Por exemplo, de acordo com a Lei mosaica, o adultério e o assassinato eram crimes que deveriam ser punidos com a morte da pessoa. É claro que muitos pecados não são tão graves como esses. Mas ainda assim, são pecados. Por exemplo, Davi disse: 'Vou vigiar o meu caminho para não pecar com a minha língua.' Isso mostra que até algo que falamos pode ser um pecado. Pare e pense nas coisas que você já disse ou fez. Alguma vez você disse algo que preferia não ter dito? Você já fez alguma coisa e depois se arrependeu? Com certeza você respondeu que sim a essas duas perguntas. A Bíblia diz: 'Se fazemos a declaração: Não temos pecado, estamos enganando a nós mesmos e a verdade não está em nós.'",
        resposta: "Todo humano imperfeito comete pecados, seja em palavras ou em ações. Até algo que falamos pode ser um pecado. A Bíblia diz: 'Se fazemos a declaração: Não temos pecado, estamos enganando a nós mesmos.'"
      },
      {
        paragrafo: "6-7",
        pergunta: "O que torna possível que Jeová perdoe nossos pecados? (Veja também a imagem.)",
        textoBase: "O resgate é o que torna possível que Jeová perdoe os nossos pecados. Mas é claro que isso não significa que Jeová fecha os olhos para os nossos pecados e não se importa com eles. Na verdade, esse é um assunto muito sério para Jeová. Por causa de sua justiça perfeita, é preciso existir uma base sólida para ele perdoar nossos pecados. A Lei mosaica exigia que os israelitas oferecessem sacrifícios de animais para fazer expiação pelos seus pecados. Esses sacrifícios mostravam que os humanos precisavam de um sacrifício muito maior. Foi o sacrifício de Jesus que trouxe muitas bênçãos e que deu a base para Jeová perdoar nossos pecados. As palavras de Paulo aos cristãos em Corinto mostram que ele entendeu o grande valor da morte sacrificial de Jesus. Depois de falar sobre as coisas erradas que eles tinham feito no passado, Paulo disse: 'Vocês foram lavados; vocês foram santificados; vocês foram declarados justos no nome do Senhor Jesus Cristo e com o espírito do nosso Deus.'",
        resposta: "O resgate é o que torna possível que Jeová perdoe os nossos pecados. A Lei mosaica exigia sacrifícios de animais, que mostravam a necessidade de um sacrifício maior. Foi o sacrifício de Jesus que deu a base para Jeová perdoar nossos pecados."
      },
      {
        paragrafo: "8",
        pergunta: "No que você pode pensar enquanto se prepara para a Celebração deste ano?",
        textoBase: "Enquanto você se prepara para a Celebração deste ano, tire tempo para pensar no que o perdão de Jeová significa para você. Por exemplo, graças ao resgate, você não precisa ficar carregando o peso da culpa por pecados que cometeu no passado e já se arrependeu. Mas e se você achar difícil aceitar isso? Talvez você pense: 'Eu sei que Jeová pode me perdoar, mas eu não consigo perdoar a mim mesmo.' Se você se sente assim, lembre do seguinte: é Jeová quem perdoa, e ele deu ao seu Filho, Jesus, autoridade para nos julgar. Jeová não deu a você, nem a qualquer outro humano, a tarefa de decidir quem ele vai perdoar ou não. A Bíblia diz: 'Se estamos andando na luz assim como [Jeová] está na luz, ... o sangue de Jesus, seu Filho, nos purifica de todo o pecado.' Podemos confiar totalmente nisso, assim como confiamos em qualquer outro ensino da Bíblia. O resgate deu a Jeová a base legal para mostrar misericórdia a nós, e sua Palavra diz que ele está 'sempre pronto a perdoar'.",
        resposta: "Graças ao resgate, você não precisa ficar carregando o peso da culpa por pecados que cometeu no passado e já se arrependeu. É Jeová quem perdoa, e ele está 'sempre pronto a perdoar'. Podemos confiar totalmente nisso."
      },
      {
        paragrafo: "9",
        pergunta: "Além de ações erradas, o que o pecado envolve? (Salmo 51:5 e nota)",
        textoBase: "Na Bíblia, a palavra 'pecado' se refere não só a uma ação errada, mas também a uma condição, que nós herdamos desde o momento em que fomos concebidos. Por causa dessa condição, além de termos a tendência de fazer coisas erradas, nosso corpo não funciona da maneira como Jeová tinha projetado, e ficamos doentes, envelhecemos e morremos. É por isso que até bebês recém-nascidos, que ainda não fizeram nada de errado, podem ficar doentes e morrer. Também é por isso que tanto as pessoas boas como as ruins sofrem e morrem. Todos nós, descendentes de Adão, estamos nessa situação difícil.",
        resposta: "O pecado é também uma condição herdada. Por causa dela, nosso corpo não funciona como Jeová projetou - ficamos doentes, envelhecemos e morremos. Até bebês podem ficar doentes e morrer. Todos os descendentes de Adão estamos nessa situação."
      },
      {
        paragrafo: "10",
        pergunta: "Como a condição pecaminosa de Adão e Eva os afetou?",
        textoBase: "Como essa condição pecaminosa afetou o primeiro casal humano? O pecado produziu uma mudança drástica dentro deles. Depois que se rebelaram, Adão e Eva começaram a sentir imediatamente as consequências de desobedecer a lei de Deus, uma lei que estava 'escrita no coração' deles. Eles perceberam que algo no seu íntimo tinha mudado, e não foi para melhor. Eles sentiram a necessidade de cobrir partes do seu corpo e de se esconder do seu Criador, como se fossem criminosos. Pela primeira vez, Adão e Eva tiveram sentimentos de culpa, ansiedade, insegurança, dor e vergonha. E a partir daquele dia, eles teriam que lidar com esses sentimentos até a sua morte.",
        resposta: "O pecado produziu uma mudança drástica dentro de Adão e Eva. Eles perceberam que algo tinha mudado. Pela primeira vez, tiveram sentimentos de culpa, ansiedade, insegurança, dor e vergonha. Teriam que lidar com esses sentimentos até a morte."
      },
      {
        paragrafo: "11",
        pergunta: "Que efeito nossa condição pecaminosa tem em nós?",
        textoBase: "Assim como aconteceu com o primeiro casal humano, nossa condição pecaminosa nos faz sentir culpa, vergonha e ansiedade. É por causa da imperfeição que sofremos em sentido físico e emocional. Não importa o quanto tentemos melhorar nossa situação, não conseguimos ter uma vida livre de problemas e dificuldades. Por quê? Porque, como a Bíblia diz, nós fomos 'sujeitos à futilidade'. Isso se aplica não só a nós individualmente, mas à humanidade em geral. Por exemplo, pense em todos os esforços feitos para cuidar do meio ambiente, para controlar a violência, para eliminar a pobreza e para alcançar a paz entre as nações. Mesmo com certo progresso, esses esforços têm sido fúteis, ou em vão, porque não acabaram com problemas assim. Mas como o resgate pode nos livrar da nossa condição pecaminosa?",
        resposta: "Nossa condição pecaminosa nos faz sentir culpa, vergonha e ansiedade. Não conseguimos ter uma vida livre de problemas. Todos os esforços para cuidar do meio ambiente, controlar a violência, eliminar a pobreza têm sido fúteis porque não acabaram com esses problemas."
      },
      {
        paragrafo: "12",
        pergunta: "Que esperança o resgate nos dá?",
        textoBase: "O resgate nos dá a esperança de que 'a própria criação... será libertada da escravidão à decadência'. Isso significa que no novo mundo de Deus, quando nos tornarmos perfeitos, não vamos mais ser atormentados por doenças físicas, mentais e emocionais. Nem teremos mais sentimentos que podem nos deixar paralisados, como, por exemplo, culpa, ansiedade, insegurança, dor ou vergonha. Além disso, nossos esforços para cuidar do meio ambiente e para viver em paz uns com os outros não serão mais fúteis. Em vez disso, eles darão bons resultados porque viveremos debaixo do governo daquele que nos resgatou, o 'Príncipe da Paz', Jesus Cristo.",
        resposta: "O resgate nos dá a esperança de que seremos libertados da escravidão à decadência. No novo mundo, não teremos mais doenças nem sentimentos de culpa, ansiedade ou vergonha. Nossos esforços darão bons resultados sob o governo do 'Príncipe da Paz', Jesus Cristo."
      },
      {
        paragrafo: "13",
        pergunta: "Em que você pode pensar enquanto se prepara para a Celebração deste ano?",
        textoBase: "Pense um pouco em como será a sua vida quando você não for mais imperfeito. Imagine acordar todo dia se sentindo bem, e nunca mais se preocupar se você e as pessoas que você ama vão passar fome, ficar doentes ou morrer. Até mesmo agora você pode encontrar certa paz por se 'apegar firmemente à esperança... como âncora para a alma, tanto segura como firme'. Assim como uma âncora pode dar estabilidade a um barco, sua esperança pode dar estabilidade para a sua fé e ajudar você a enfrentar qualquer provação. Você pode ter certeza absoluta de que Jeová será 'o recompensador dos que o buscam seriamente'. Sua esperança para o futuro e o consolo que você sente desde agora só são possíveis graças ao resgate.",
        resposta: "Imagine acordar todo dia se sentindo bem, sem preocupações com fome, doenças ou morte. A esperança pode dar estabilidade para sua fé como uma âncora. Jeová será 'o recompensador dos que o buscam seriamente'. Isso só é possível graças ao resgate."
      },
      {
        paragrafo: "14",
        pergunta: "De que forma o pecado afeta nossa amizade com o Criador, e por quê?",
        textoBase: "Desde que Adão e Eva pecaram, os humanos ficaram separados de seu Criador. A Bíblia até mesmo diz que há inimizade entre a humanidade como um todo e Deus. Mas por quê? Os padrões de Jeová são perfeitos, por isso é impossível que ele simplesmente ignore o pecado. A Bíblia fala sobre Jeová: 'Teus olhos são puros demais para ver o que é mau; não podes tolerar a maldade.' Ou seja, o pecado criou um abismo entre Deus e o homem. Nenhum de nós pode ter uma amizade com Jeová a não ser que exista uma ponte nos reconciliando com ele. O resgate é essa ponte que possibilita nossa reconciliação com Deus.",
        resposta: "Desde que Adão e Eva pecaram, os humanos ficaram separados de Deus. Jeová não pode simplesmente ignorar o pecado. O pecado criou um abismo entre Deus e o homem. O resgate é a ponte que possibilita nossa reconciliação com Deus."
      },
      {
        paragrafo: "15",
        pergunta: "De que forma a morte de Jesus permitiu que Jeová recuperasse a amizade com os humanos?",
        textoBase: "A Bíblia diz que Jesus é 'um sacrifício propiciatório pelos nossos pecados'. A palavra grega traduzida como 'sacrifício propiciatório' pode se referir a um 'meio de pacificação'. Pacificar pode envolver a ideia de satisfazer as exigências de alguém para restabelecer a paz. Em que sentido o resgate satisfez Jeová? É claro que a morte de seu Filho não satisfez Jeová no sentido de que ele ficou feliz com isso. Na verdade, o resgate satisfez o padrão de justiça de Jeová. Agora ele tinha uma base para restabelecer a amizade entre ele e a humanidade. Jeová podia até mesmo 'creditar' justiça àqueles que o adoraram fielmente antes da morte de Cristo. Como? Com base no resgate que ainda viria. Jeová tinha absoluta certeza de que seu Filho, Jesus, pagaria o resgate. Assim, o resgate abriu o caminho para as pessoas se reconciliarem com Deus.",
        resposta: "Jesus é 'um sacrifício propiciatório pelos nossos pecados'. O resgate satisfez o padrão de justiça de Jeová, dando-lhe uma base para restabelecer a amizade com a humanidade. Jeová tinha certeza de que Jesus pagaria o resgate, abrindo o caminho para a reconciliação."
      },
      {
        paragrafo: "16",
        pergunta: "Em que outras coisas você pode meditar enquanto se prepara para a Celebração deste ano? (Veja também a imagem.)",
        textoBase: "Pense no que a reconciliação com Deus significa para você. Por exemplo, talvez você se refira a Jeová como seu 'Pai', assim como Jesus nos ensinou. E pode ser que, às vezes, você se refira a Jeová como seu 'Amigo'. Ao usar palavras como 'Pai' ou 'Amigo', devemos fazer isso com reverência e humildade. Por quê? Porque somos imperfeitos. Então, mesmo que nos sintamos muito próximos de Jeová, nós não merecemos isso. É apenas por causa do resgate que podemos pensar na ideia de ter uma amizade com Jeová. Por meio de Jesus, Jeová tornou possível 'reconciliar todas as outras coisas consigo mesmo, ... estabelecendo a paz por meio do sangue que [Jesus] derramou na estaca'. É por essa razão que nós podemos ter a alegria de ter uma amizade com Jeová — mesmo agora em nossa condição imperfeita.",
        resposta: "Podemos chamar Jeová de 'Pai' ou 'Amigo' com reverência e humildade. Não merecemos essa proximidade, mas é apenas por causa do resgate que podemos ter uma amizade com Jeová — mesmo agora em nossa condição imperfeita."
      },
      {
        paragrafo: "17",
        pergunta: "Como o resgate prova que Jeová é muito misericordioso? (Efésios 2:4, 5)",
        textoBase: "O resgate deixa claro que Jeová é 'rico em misericórdia'. Ele 'nos deu vida... quando estávamos mortos por causa das nossas falhas'. Assim como uma pessoa presa debaixo dos escombros de um prédio, os que têm 'a disposição correta para com a vida eterna' sabem que estão presos debaixo dos escombros do pecado e que precisam ser libertados. Por isso, eles gritam por ajuda. Por meio da mensagem do Reino, Jeová responde aos seus pedidos de ajuda para que eles possam conhecer a ele e a seu Filho, Jesus. Se Satanás achava que o desastre que aconteceu com Adão e Eva iria impedir Jeová de cumprir seu propósito, ele estava completamente enganado.",
        resposta: "O resgate deixa claro que Jeová é 'rico em misericórdia'. Ele 'nos deu vida quando estávamos mortos por causa das nossas falhas'. Por meio da mensagem do Reino, Jeová responde aos pedidos de ajuda dos que querem conhecê-lo."
      },
      {
        paragrafo: "18",
        pergunta: "Ao meditar no resgate, do que precisamos nos lembrar?",
        textoBase: "Ao meditar nos benefícios que o resgate nos oferece, precisamos ter em mente que uma questão maior está envolvida. Em vez de ver o resgate como algo apenas para o nosso benefício, devemos lembrar que é por meio do resgate que Jeová está respondendo ao desafio que Satanás lançou no jardim do Éden. Jeová também usa o resgate para santificar seu nome e limpá-lo de todas as mentiras que Satanás conta. Além disso, como o resgate nos livra do pecado e da morte, essa é uma maneira de Jeová mostrar que é um Deus de amor. E na sua bondade, Jeová nos permite ajudá-lo a provar que Satanás é um mentiroso, mesmo sem merecermos isso já que somos imperfeitos. Então, como você pode mostrar sua gratidão pelo resgate? Vamos responder a essa pergunta no próximo estudo.",
        resposta: "Devemos lembrar que o resgate responde ao desafio de Satanás, santifica o nome de Jeová e mostra que ele é um Deus de amor. Jeová nos permite ajudá-lo a provar que Satanás é um mentiroso, mesmo sendo imperfeitos."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Como o resgate nos dá perdão?",
        resposta: "O sacrifício de Jesus deu a base para Jeová perdoar nossos pecados. Graças ao resgate, não precisamos ficar carregando o peso da culpa por pecados que cometemos no passado."
      },
      {
        pergunta: "Como o resgate nos dá cura?",
        resposta: "O resgate nos dá a esperança de que seremos libertados da escravidão à decadência. No novo mundo, não teremos mais doenças físicas, mentais e emocionais, nem sentimentos de culpa, ansiedade ou vergonha."
      },
      {
        pergunta: "Como o resgate nos dá reconciliação?",
        resposta: "O resgate satisfez o padrão de justiça de Jeová, dando-lhe uma base para restabelecer a amizade com a humanidade. É apenas por causa do resgate que podemos ter uma amizade com Jeová."
      }
    ]
  },
  {
    id: 4,
    semana: "Semana 4",
    dataInicio: "23",
    dataFim: "29 de março",
    canticoInicial: 18,
    canticoInicialTitulo: "Obrigado pelo resgate!",
    canticoFinal: 14,
    canticoFinalTitulo: "Louvor ao nosso Deus",
    titulo: "Como você vai mostrar sua gratidão pelo resgate?",
    textoTema: "O amor do Cristo nos impele.",
    textoTemaRef: "2 COR. 5:14",
    objetivo: "Ver como todos nós podemos mostrar que somos gratos pelo resgate.",
    imagem: "/images/estudo-marco-semana4.jpg",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "O que o resgate de Jesus nos impele a fazer, e por quê? (2 Coríntios 5:14, 15) (Veja também a imagem.)",
        textoBase: "Se você tivesse sido resgatado dos escombros de um prédio que desabou, você se sentiria em dívida com a pessoa que salvou a sua vida, não é verdade? Mesmo que outros também tivessem sido salvos, com certeza você iria querer mostrar que é muito grato e que nunca vai esquecer do que a pessoa fez por você. Como vimos no estudo anterior, não podemos nos livrar sozinhos dos efeitos do pecado herdado. Mas o sacrifício de Jesus pode nos resgatar porque ele nos dá (1) o perdão dos pecados que cometemos, (2) a esperança de sermos totalmente curados da nossa condição pecaminosa e (3) a reconciliação com Deus. O resultado é que poderemos viver para sempre no novo mundo de Jeová. O resgate é mesmo uma prova do amor de Jesus pelas pessoas — um amor que ele já sentia muito tempo antes de vir à Terra. O apóstolo Paulo escreveu que 'o amor do Cristo nos impele'. Isso quer dizer que o amor de Jesus por nós deve nos motivar a agir, a fazer algo para mostrar que somos muito gratos e que nunca vamos esquecer do sacrifício que ele fez por nós.",
        resposta: "Se tivéssemos sido resgatados de um prédio, seríamos gratos. O sacrifício de Jesus nos dá perdão, cura e reconciliação. Paulo escreveu que 'o amor do Cristo nos impele' — deve nos motivar a agir e mostrar gratidão pelo sacrifício de Jesus."
      },
      {
        paragrafo: "3",
        pergunta: "Por que cada pessoa talvez tenha uma maneira diferente de mostrar gratidão pelo resgate?",
        textoBase: "O que você pode fazer para mostrar sua gratidão pelo presente amoroso do resgate? Sua resposta pode ser diferente da resposta de outras pessoas. Para ilustrar: imagine que três pessoas estão viajando para o mesmo lugar, mas cada uma vai sair de uma cidade diferente. Os caminhos que elas vão percorrer vão ser diferentes. Da mesma forma, o 'caminho' que você vai percorrer até o seu destino, ou seja, de mostrar gratidão pelo resgate de Jesus, depende de onde você está agora no que diz respeito à sua amizade com Jeová. Pensando nisso, este estudo vai falar sobre três grupos de pessoas: (1) os estudantes da Bíblia, (2) os cristãos batizados e (3) as ovelhas que se afastaram do rebanho.",
        resposta: "Assim como viajantes que partem de cidades diferentes para o mesmo destino, o caminho de cada um para mostrar gratidão depende de onde a pessoa está em sua amizade com Jeová. Vamos falar sobre estudantes da Bíblia, cristãos batizados e ovelhas que se afastaram."
      },
      {
        paragrafo: "4",
        pergunta: "No que Jeová presta atenção ao ver os estudantes da Bíblia?",
        textoBase: "Se você é um estudante da Bíblia, pense no seguinte: o fato de você querer aprender sobre Jeová e a Bíblia indica que Jeová está atraindo você a ele. 'É Jeová quem examina os corações.' Isso quer dizer que ele presta atenção em você. Ele vê seus esforços de aprender sobre ele e fica muito feliz com seu progresso e as mudanças que você faz para ser amigo dele. E essa amizade só é possível graças ao resgate. Nunca se esqueça disso.",
        resposta: "Se você é estudante da Bíblia, Jeová está atraindo você a ele. 'É Jeová quem examina os corações.' Ele vê seus esforços e fica feliz com seu progresso. Essa amizade só é possível graças ao resgate."
      },
      {
        paragrafo: "5",
        pergunta: "Como os estudantes da Bíblia podem seguir o conselho de Filipenses 3:16?",
        textoBase: "Como você, estudante da Bíblia, pode mostrar que é grato pelo resgate? Uma maneira é por seguir o conselho do apóstolo Paulo aos filipenses: 'Seja qual for o progresso que já fizemos, prossigamos andando nesse mesmo rumo.' Outra versão da Bíblia traduz esse versículo da seguinte forma: 'Vamos em frente, na mesma direção que temos seguido até agora.' Então, aplique esse conselho e não deixe que nada nem ninguém atrapalhe você de andar na estrada da vida.",
        resposta: "Paulo aconselhou: 'Seja qual for o progresso que já fizemos, prossigamos andando nesse mesmo rumo.' Aplique esse conselho e não deixe que nada nem ninguém atrapalhe você de andar na estrada da vida."
      },
      {
        paragrafo: "6",
        pergunta: "O que os estudantes da Bíblia podem fazer ao enfrentar certas dificuldades? (Deuteronômio 30:11-14) (Veja também a imagem.)",
        textoBase: "E se você achar difícil aceitar um ensino da Bíblia que acabou de aprender? Faça pesquisas e ore a Jeová para que ele ajude você a entender melhor o assunto. Se ainda assim achar difícil entender, não desista. Continue estudando a Bíblia e, com o tempo, você provavelmente vai conseguir entender melhor o assunto. Mas e se a sua dificuldade for abandonar um hábito que a Bíblia condena? Lembre que Jeová nunca pede de nós algo que seja 'difícil demais'. Ou seja, você consegue sim viver de uma maneira que agrade a ele. Jeová promete que vai te ajudar. Então continue se esforçando para obedecer a Jeová. Em vez de se preocupar demais com o desafio que você está enfrentando, se concentre no quanto você é grato por tudo o que Jeová tem feito por você, incluindo dar seu Filho como resgate. Quanto mais seu amor por Jeová crescer, mais você vai perceber que 'os seus mandamentos não são pesados'.",
        resposta: "Se achar difícil um ensino, faça pesquisas e ore. Se for difícil abandonar um hábito, lembre que Jeová nunca pede algo 'difícil demais'. Ele promete ajudar. Concentre-se na gratidão pelo que Jeová fez, incluindo dar seu Filho como resgate."
      },
      {
        paragrafo: "7",
        pergunta: "Os jovens que estão sendo criados na verdade podem meditar em quê?",
        textoBase: "Mas e se você é um jovem que está sendo criado na verdade? Você também é um estudante da Bíblia. Na verdade, você é o estudante da Bíblia mais importante dos seus pais. A Bíblia diz: 'Acheguem-se a Deus, e ele se achegará a vocês.' Quando você dá o primeiro passo para se aproximar de Jeová, ele corresponde por também se aproximar de você. Para Jeová, você não é só mais um na multidão. Ele não atraiu você por causa da sua família. Jeová atrai cada pessoa de forma individual, o que inclui aqueles que estão sendo criados na verdade. Ele lembra do que ele fez para que você tivesse uma amizade forte com ele: Jeová deu o seu Filho. Nunca esqueça que esse é um presente especial de Jeová para você. Então, antes de assistir à Celebração deste ano, o que acha de tirar um tempo para meditar no que Jeová e Jesus fizeram por você? Daí pense no que você quer fazer com sua vida e no próximo alvo que você pode ter — independente de qual seja — para mostrar o quanto você é grato pelo resgate.",
        resposta: "Se você é um jovem criado na verdade, você é o estudante da Bíblia mais importante dos seus pais. Jeová atrai cada pessoa individualmente. Ele deu seu Filho especialmente para você. Medite nisso e pense no próximo alvo para mostrar gratidão pelo resgate."
      },
      {
        paragrafo: "8",
        pergunta: "Como um cristão que é batizado já mostrou gratidão pelo resgate?",
        textoBase: "Se você é um cristão batizado, você já mostrou gratidão pelo resgate de várias maneiras. Por exemplo, você deu os passos para se achegar a Jeová e para viver de uma forma que agrade a ele. Você obedeceu a ordem de Jesus de pregar e fazer discípulos. Você se dedicou a Jeová e se batizou. E talvez você até sofreu oposição por decidir servir a Jeová. Mas você perseverou e continuou servindo a Jeová fielmente. Isso mostra o quanto você ama a Jeová e é grato pelo resgate.",
        resposta: "Se você é cristão batizado, já mostrou gratidão de várias maneiras: se achegou a Jeová, obedeceu a ordem de pregar, se dedicou e batizou, e perseverou mesmo com oposição. Isso mostra seu amor a Jeová e gratidão pelo resgate."
      },
      {
        paragrafo: "9",
        pergunta: "Um cristão batizado deve estar atento a qual perigo?",
        textoBase: "Sendo cristãos batizados, precisamos ficar atentos a um perigo. Com o tempo, podemos deixar de dar valor ao resgate. Como isso poderia acontecer? Pense no exemplo dos cristãos do primeiro século em Éfeso. Depois que já tinha sido ressuscitado, Jesus os elogiou por causa da sua perseverança. Só que ele também disse: 'Tenho o seguinte contra você: você abandonou o amor que tinha no princípio.' As palavras de Jesus indicam que um cristão, aos poucos, pode acabar deixando sua adoração a Jeová cair na rotina. Essa pessoa pode até estar orando, indo às reuniões e participando no ministério. Mas é só porque ela está acostumada a fazer isso; ela não é mais motivada por amor. Então, o que você pode fazer se achar que seu amor por Jeová já não é mais tão forte quanto antes?",
        resposta: "Com o tempo, podemos deixar de dar valor ao resgate. Jesus disse aos cristãos de Éfeso: 'Você abandonou o amor que tinha no princípio.' A adoração pode cair na rotina, sem ser motivada por amor. Precisamos ficar atentos a esse perigo."
      },
      {
        paragrafo: "10",
        pergunta: "Como você pode 'meditar' e 'se concentrar totalmente' em suas atividades cristãs? (1 Timóteo 4:13, 15)",
        textoBase: "O apóstolo Paulo disse para Timóteo 'meditar' e 'se concentrar totalmente' em suas atividades cristãs. Seguindo esse conselho, tente pensar no que você pode fazer para dar mais vida à sua adoração a Jeová e para continuar 'sendo fervoroso no espírito'. Por exemplo, talvez você possa ir mais a fundo ao preparar as reuniões, e isso vai ajudar você a se concentrar mais nelas. Ou talvez você possa procurar lugares sem distrações para fazer seu estudo pessoal, onde você possa ficar sozinho para meditar e aproveitar melhor o estudo. Assim como colocar lenha para alimentar as chamas de uma fogueira, você precisa fazer essas coisas para alimentar e manter viva sua gratidão por tudo que Jeová tem feito, o que inclui o resgate. Além disso, o que acha de aproveitar as semanas antes da Celebração para meditar nas bênçãos maravilhosas que temos como Testemunhas de Jeová? Sem dúvida isso vai aumentar sua gratidão pelo resgate, que é a base para você ser um amigo achegado de Jeová.",
        resposta: "Paulo disse para 'meditar' e 'se concentrar totalmente' em atividades cristãs. Vá mais a fundo na preparação das reuniões, procure lugares sem distrações para estudo pessoal. Isso alimenta sua gratidão por Jeová e pelo resgate."
      },
      {
        paragrafo: "11-12",
        pergunta: "Se às vezes você sente que não tem o mesmo zelo de antes, será que você perdeu o espírito de Deus? Explique. (Veja também a imagem.)",
        textoBase: "Se já por algum tempo você acha que não tem mais o mesmo zelo de antes na adoração a Jeová, não fique desanimado nem ache que perdeu o espírito santo de Deus. Lembre do que o apóstolo Paulo escreveu sobre seu ministério aos irmãos em Corinto: 'Mesmo se o fizer contra a minha vontade, ainda assim estou incumbido de uma responsabilidade.' O que ele quis dizer? Às vezes, algumas coisas sufocavam o desejo que Paulo tinha de pregar. Mas ele estava decidido a perseverar na pregação, com ou sem vontade. Você também pode ter essa mesma atitude. Esteja decidido a fazer o que é certo, mesmo se faltar motivação. Então, ore para ter 'tanto o desejo como o poder de agir'. Continue ocupado em suas atividades espirituais. Tenha certeza de que, com o tempo, isso vai influenciar seus sentimentos e reacender o amor que ainda há no seu coração.",
        resposta: "Se você sente que não tem o mesmo zelo, não fique desanimado nem ache que perdeu o espírito de Deus. Paulo disse que estava incumbido de responsabilidade 'mesmo contra sua vontade'. Esteja decidido a fazer o certo, mesmo se faltar motivação. Com o tempo, isso vai reacender seu amor."
      },
      {
        paragrafo: "13",
        pergunta: "Como podemos continuar examinando se 'estamos na fé'?",
        textoBase: "De vez em quando, é bom fazermos uma análise de nós mesmos. Em 2 Coríntios 13:5, Paulo nos aconselhou: 'Persistam em examinar se estão na fé; persistam em pôr à prova o que vocês mesmos são.' Então, podemos nos fazer perguntas como: 'Estou colocando o Reino em primeiro lugar na vida?' 'As coisas que eu escolho para me divertir mostram que eu odeio o que é mau?' 'Minhas palavras e ações estão ajudando a congregação a continuar unida?' A época da Celebração é um período especial para meditar no presente do resgate que Jeová nos deu. Ela nos dá uma oportunidade de fazer uma autoanálise e nos certificar de que estamos vivendo para Cristo, e não para nós mesmos.",
        resposta: "Paulo aconselhou: 'Persistam em examinar se estão na fé.' Pergunte-se: 'Estou colocando o Reino em primeiro lugar? Minhas escolhas mostram que odeio o que é mau? Minhas palavras ajudam a congregação?' A época da Celebração é especial para essa autoanálise."
      },
      {
        paragrafo: "14",
        pergunta: "O que devemos fazer pelas ovelhas que se afastaram do rebanho? (Lucas 15:4-7)",
        textoBase: "Alguns irmãos e irmãs param de se associar com a congregação. Às vezes, eles fazem isso depois de alguns meses ou até depois de anos servindo a Jeová fielmente. Por quê? Alguns estão sobrecarregados com as 'ansiedades da vida'. Outros tropeçaram por causa de algo que algum irmão disse ou fez. E outros talvez tiveram seus sentimentos feridos por causa de um conselho baseado na Bíblia. Não importa o motivo, sentimos muita falta de cada uma dessas pessoas. Jesus comparou essas pessoas a ovelhas que se afastaram do rebanho, e nós queremos ajudá-las a voltar. Por quê? Primeiro, porque as amamos. E segundo, porque se elas voltarem, 'haverá mais alegria no céu'.",
        resposta: "Alguns se afastam por ansiedades da vida, por tropeçar com algo que um irmão disse, ou por sentimentos feridos com conselhos. Sentimos falta de cada um. Jesus comparou essas pessoas a ovelhas perdidas. Queremos ajudá-las porque as amamos e haverá alegria no céu se voltarem."
      },
      {
        paragrafo: "15-16",
        pergunta: "Se você é uma ovelha que se afastou do rebanho, no que pode pensar?",
        textoBase: "Se você é uma ovelha que se afastou do rebanho, os irmãos da sua congregação talvez entraram em contato com você por telefone, por mensagens de texto ou por cartas. Ou talvez eles fizeram visitas para você. Nós esperamos que você tenha recebido bem essas visitas e que não tenha fechado a porta para a ajuda que os irmãos querem te dar. Antes da Celebração deste ano, o que acha de pensar um pouco no que você vai fazer para voltar a ter a amizade que tinha com Jeová? Ele abriu a porta para você ter uma amizade com ele por meio do resgate. Então, antes da Celebração deste ano, o que acha de 'entrar por essa porta'? Na ilustração da ovelha perdida, Jesus disse que quando a ovelha volta, o pastor — Jeová — fica muito feliz. Os irmãos também ficarão muito felizes quando você voltar. Então, por que não deixá-los ajudar você? Faça como a mulher fenícia: não desista até que suas orações sinceras sejam respondidas.",
        resposta: "Se você se afastou, talvez os irmãos entraram em contato. Pense no que fazer para voltar a ter amizade com Jeová. Ele abriu a porta por meio do resgate. Quando a ovelha volta, Jeová e os irmãos ficam muito felizes. Não desista até que suas orações sejam respondidas."
      },
      {
        paragrafo: "17",
        pergunta: "O que não devemos esquecer?",
        textoBase: "O sacrifício de resgate de Jesus é a maior prova de amor que Jeová e seu Filho nos deram. Não é possível calcular o preço que Jeová pagou para que tivéssemos vida eterna. Jesus também nos ama muito porque foi ele quem se ofereceu para morrer por nós. Não há nada que pudéssemos fazer para retribuir o que eles fizeram por nós. Mas, por estarmos tão gratos, queremos fazer o nosso melhor para viver de uma forma que agrade a Jeová. Não devemos esquecer que nunca estaremos sozinhos nessa luta. Jeová e Jesus vão sempre estar do nosso lado, nos ajudando.",
        resposta: "O sacrifício de resgate é a maior prova de amor de Jeová e Jesus. Não podemos retribuir, mas queremos viver de forma que agrade a Jeová. Nunca estaremos sozinhos — Jeová e Jesus vão sempre estar do nosso lado, nos ajudando."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Como os estudantes da Bíblia podem mostrar gratidão pelo resgate?",
        resposta: "Continuando a progredir na estrada da vida, não desistindo diante de dificuldades, e confiando que Jeová vai ajudá-los. Os jovens criados na verdade podem meditar no que Jeová e Jesus fizeram por eles pessoalmente."
      },
      {
        pergunta: "Como os cristãos batizados podem mostrar gratidão pelo resgate?",
        resposta: "Evitando deixar sua adoração cair na rotina, 'meditando' e 'se concentrando totalmente' em suas atividades cristãs, e fazendo autoanálise para verificar se estão na fé e vivendo para Cristo."
      },
      {
        pergunta: "O que as ovelhas que se afastaram do rebanho podem fazer?",
        resposta: "Elas podem aceitar a ajuda que os irmãos querem dar, pensar em como voltar a ter amizade com Jeová, e 'entrar pela porta' que ele abriu por meio do resgate."
      }
    ]
  },
  {
    id: 5,
    semana: "Semana 5",
    dataInicio: "30 de março",
    dataFim: "5 de abril",
    canticoInicial: 76,
    canticoInicialTitulo: "Como são belos os pés deles!",
    canticoFinal: 72,
    canticoFinalTitulo: "Fale a verdade",
    titulo: "Fale a verdade de modo agradável",
    textoTema: "Seus lábios sempre falem com graça, temperados com sal.",
    textoTemaRef: "COL. 4:6",
    objetivo: "Ver o que podemos aprender de Jesus sobre falar a verdade.",
    imagem: "/images/estudo-marco-semana5.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "Por que às vezes pode ser difícil falar a verdade?",
        textoBase: "Servos de Jeová amam a verdade e falam a verdade. Mas às vezes pode ser difícil saber como falar a verdade. Por exemplo, imagine que alguém te pergunte o que você achou de uma comida que ela preparou, mas a comida não ficou tão boa. Você diria exatamente o que achou? Será que não seria melhor elogiar o esforço da pessoa? Ou imagine que você vê um irmão fazendo algo errado. Você acha que deveria falar alguma coisa para ele?",
        resposta: "Às vezes pode ser difícil saber como falar a verdade. Por exemplo, se alguém perguntar o que você achou de uma comida que não ficou boa. Ou se você ver um irmão fazendo algo errado e precisar decidir se deve falar algo."
      },
      {
        paragrafo: "2-3",
        pergunta: "O que vamos aprender neste estudo?",
        textoBase: "Em algumas situações, falar a verdade é relativamente fácil. Por exemplo, quando estamos pregando a pessoas que estão interessadas na verdade. Mas em outras situações, pode ser bem mais difícil. Por exemplo, quando pregamos a pessoas que não estão interessadas ou que são contra a verdade. Ou quando precisamos dar um conselho para alguém. Neste estudo, vamos aprender com Jesus como falar a verdade de modo agradável. Vamos considerar: (1) Qual deve ser a nossa motivação ao falar a verdade? (2) Como devemos falar a verdade? e (3) Quando devemos falar a verdade?",
        resposta: "Vamos aprender com Jesus como falar a verdade de modo agradável. Vamos considerar: Qual deve ser nossa motivação ao falar a verdade? Como devemos falar a verdade? E quando devemos falar a verdade?"
      },
      {
        paragrafo: "4",
        pergunta: "Por que a motivação é importante?",
        textoBase: "Qual deve ser a nossa motivação ao falar a verdade? A motivação é importante porque ela influencia o modo como falamos e como as pessoas reagem às nossas palavras. Por exemplo, se nossa motivação for nos mostrar superiores ou humilhar a pessoa, provavelmente vamos falar de um jeito que a pessoa não vai gostar e ela vai se fechar. Por outro lado, se nossa motivação for realmente ajudar a pessoa, provavelmente vamos falar de um jeito mais amoroso e bondoso.",
        resposta: "A motivação é importante porque influencia o modo como falamos e como as pessoas reagem. Se quisermos nos mostrar superiores, vamos falar de um jeito que a pessoa não vai gostar. Se quisermos ajudar, vamos falar de modo mais amoroso e bondoso."
      },
      {
        paragrafo: "5",
        pergunta: "Qual era a motivação de Jesus ao falar a verdade? (João 18:37)",
        textoBase: "Qual era a motivação de Jesus ao falar a verdade? Ele disse a Pilatos: 'É para isso que nasci e é para isso que vim ao mundo: para dar testemunho da verdade.' Jesus veio ao mundo para dar testemunho da verdade sobre seu Pai, Jeová. Ele queria que as pessoas conhecessem a Jeová e tivessem vida eterna. Essa também deve ser nossa motivação. Quando pregamos, nossa motivação deve ser ajudar as pessoas a conhecerem a Jeová. Quando damos um conselho, nossa motivação deve ser ajudar a pessoa a ter um bom relacionamento com Jeová.",
        resposta: "Jesus disse: 'É para isso que nasci: para dar testemunho da verdade.' Ele queria que as pessoas conhecessem a Jeová e tivessem vida eterna. Essa deve ser nossa motivação ao pregar ou dar conselhos — ajudar as pessoas a conhecerem a Jeová."
      },
      {
        paragrafo: "6-7",
        pergunta: "Como Jesus mostrou que se importava com as pessoas?",
        textoBase: "Jesus mostrou que se importava com as pessoas. Ele não falava a verdade apenas para mostrar que sabia muitas coisas. Ele realmente se importava com as pessoas e queria ajudá-las. Por exemplo, certa vez Jesus viu uma grande multidão e 'ficou com pena deles, porque estavam maltratados e abandonados, como ovelhas sem pastor'. Então, 'começou a ensinar-lhes muitas coisas'. Jesus também mostrou que se importava com as pessoas por estar disposto a atender às necessidades delas. Por exemplo, quando ele viu que a multidão estava com fome, ele providenciou comida para todos. Jesus não só falava a verdade, mas também mostrava pelas suas ações que se importava com as pessoas.",
        resposta: "Jesus não falava a verdade apenas para mostrar que sabia muitas coisas. Ele realmente se importava com as pessoas. Ele 'ficou com pena' da multidão e 'começou a ensinar-lhes muitas coisas'. Também atendeu às necessidades práticas, como providenciar comida."
      },
      {
        paragrafo: "8",
        pergunta: "Como Paulo descreveu o modo como Jesus falava? (Colossenses 4:6)",
        textoBase: "Como devemos falar a verdade? Paulo escreveu aos cristãos de Colossos: 'Seus lábios sempre falem com graça, temperados com sal.' Isso descreve bem o modo como Jesus falava. Ele usava palavras agradáveis, bondosas e atraentes. Ele não era grosseiro nem ofensivo. Por exemplo, quando os fariseus criticaram Jesus por comer com cobradores de impostos, ele respondeu de um modo bondoso: 'As pessoas saudáveis não precisam de médico, mas sim os doentes.' Jesus comparou os cobradores de impostos a pessoas doentes que precisavam de ajuda. Isso mostrou que ele se importava com eles e queria ajudá-los.",
        resposta: "Paulo escreveu que nossos lábios devem 'falar com graça, temperados com sal'. Jesus usava palavras agradáveis, bondosas e atraentes. Quando os fariseus o criticaram, ele respondeu bondosamente comparando os cobradores de impostos a pessoas doentes que precisavam de ajuda."
      },
      {
        paragrafo: "9-10",
        pergunta: "Como Jesus adaptava sua mensagem?",
        textoBase: "Jesus adaptava sua mensagem de acordo com a pessoa com quem estava falando. Por exemplo, quando ele conversou com a mulher samaritana junto ao poço, ele usou a água como ilustração para falar sobre a vida eterna. Isso fazia sentido porque ela tinha acabado de buscar água. Quando Jesus conversou com pescadores, ele usou a pesca como ilustração. Ele disse que eles seriam 'pescadores de homens'. Jesus também adaptava sua mensagem de acordo com a atitude da pessoa. Por exemplo, ele tratou os escribas e fariseus de um modo diferente do modo como tratou as pessoas comuns. Ele sabia que os escribas e fariseus eram orgulhosos e hipócritas, então ele falou com mais firmeza para eles.",
        resposta: "Jesus adaptava sua mensagem de acordo com a pessoa. Com a mulher samaritana, usou a água como ilustração. Com pescadores, falou sobre ser 'pescadores de homens'. Ele também adaptava de acordo com a atitude — falou com mais firmeza para os escribas e fariseus orgulhosos."
      },
      {
        paragrafo: "11-12",
        pergunta: "Quando devemos falar a verdade?",
        textoBase: "Quando devemos falar a verdade? É importante falar a verdade no momento certo. Jesus sabia a hora certa de falar e a hora certa de ficar em silêncio. Por exemplo, quando Pilatos perguntou se ele era rei, Jesus respondeu. Mas quando os principais sacerdotes e anciãos o acusaram, Jesus ficou em silêncio. Por quê? Porque ele sabia que não adiantaria falar naquele momento. Aqueles homens já tinham decidido matá-lo e não iam mudar de ideia. Jesus também sabia que seus discípulos não estavam prontos para entender tudo de uma vez. Ele disse: 'Ainda tenho muitas coisas a dizer a vocês, mas vocês não são capazes de entendê-las agora.' Jesus esperou o momento certo para revelar certas verdades aos seus discípulos.",
        resposta: "Jesus sabia a hora de falar e a hora de ficar em silêncio. Ele respondeu a Pilatos, mas ficou em silêncio quando os principais sacerdotes o acusaram, porque não adiantaria falar. Ele também disse aos discípulos: 'Vocês não são capazes de entender agora' — e esperou o momento certo."
      },
      {
        paragrafo: "13",
        pergunta: "Que conclusão podemos tirar?",
        textoBase: "Que conclusão podemos tirar? Ao falar a verdade, devemos pensar na nossa motivação, no modo como falamos e no momento certo de falar. Se fizermos isso, vamos imitar a Jesus e vamos ser mais eficientes em ajudar as pessoas a conhecerem a Jeová. E isso vai nos trazer muita alegria!",
        resposta: "Devemos pensar na nossa motivação, no modo como falamos e no momento certo de falar. Se fizermos isso, vamos imitar a Jesus e ser mais eficientes em ajudar as pessoas a conhecerem a Jeová."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Qual deve ser a nossa motivação ao falar a verdade?",
        resposta: "Nossa motivação deve ser ajudar as pessoas a conhecerem a Jeová e terem vida eterna, não chamar atenção para nós mesmos ou humilhar a pessoa."
      },
      {
        pergunta: "Como devemos falar a verdade?",
        resposta: "Devemos usar palavras agradáveis, bondosas e atraentes, adaptando nossa mensagem de acordo com a pessoa e sua atitude."
      },
      {
        pergunta: "Quando devemos falar a verdade?",
        resposta: "Devemos falar no momento certo, levando em conta se a pessoa está pronta para ouvir e entender. Às vezes é melhor esperar o momento adequado."
      }
    ]
  }
]
