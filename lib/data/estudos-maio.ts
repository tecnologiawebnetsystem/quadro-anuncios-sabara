// Estudos de A Sentinela - Maio 2026 (Edição de Março 2026)
// Textos completos do PDF original w_T_202603

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
  imagem?: string
  perguntas: Pergunta[]
  recapitulacao: Recapitulacao[]
}

export const estudosMaio: Estudo[] = [
  {
    id: 1,
    semana: "Semana 1",
    dataInicio: "4",
    dataFim: "10 de maio",
    canticoInicial: 53,
    canticoInicialTitulo: "Pronto para pregar",
    canticoFinal: 65,
    canticoFinalTitulo: "Confiantes, nós vamos continuar!",
    titulo: "Como melhorar nossa 'arte de ensino'",
    textoTema: "Pregue a palavra... com toda a paciência e arte de ensino.",
    textoTemaRef: "2 TIM. 4:2",
    objetivo: "Ver três coisas que podemos fazer para melhorar nossa habilidade de ensinar outros.",
    imagem: "/images/estudo-maio-semana1.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "Que habilidade precisamos desenvolver, e por quê? (2 Timóteo 4:2) (Veja também a imagem.)",
        textoBase: "Jesus disse para seus seguidores: 'Façam discípulos..., ensinando-os a obedecer a todas as coisas que lhes ordenei.' (Mat. 28:19, 20) Essa instrução mostra que todos os cristãos devem ensinar outros. É verdade que Jeová atrai aqueles que têm a 'disposição correta', e os anjos nos ajudam a encontrar essas pessoas. (Atos 13:48; João 6:44; Apo. 14:6) Mas ainda assim, precisamos fazer a nossa parte. Pense no exemplo deixado pelos apóstolos Paulo e Barnabé. A Bíblia diz que, quando eles pregaram na sinagoga em Icônio, eles 'falaram de tal maneira que uma grande multidão, tanto de judeus como de gregos, se tornou crente'. (Atos 14:1) Então, fica claro que Paulo e Barnabé tinham desenvolvido a 'arte de ensino'. (Leia 2 Timóteo 4:2.) E todos os cristãos também precisam desenvolver essa habilidade de ensinar.",
        resposta: "Jesus ordenou que fizéssemos discípulos, ensinando-os. Paulo e Barnabé 'falaram de tal maneira' que uma grande multidão se tornou crente. Isso mostra que eles tinham desenvolvido a 'arte de ensino', que todos os cristãos precisam desenvolver."
      },
      {
        paragrafo: "2",
        pergunta: "Por que alguns talvez achem que não conseguem melhorar suas habilidades de ensino?",
        textoBase: "Algumas pessoas talvez achem que não conseguem melhorar suas habilidades de ensino por terem pouco estudo ou por acharem que não têm o dom de ensinar. Alguns servos de Deus mencionados na Bíblia também se sentiram incapazes. (Êxo. 4:10; Jer. 1:6) Já outras pessoas ficam desanimadas com sua habilidade de ensino porque não têm os mesmos resultados que outros na pregação. É claro que nem todos com quem falamos ou encontramos vão querer aprender o que a Bíblia ensina. E os resultados que temos na pregação não dependem só dos nossos esforços. Como já mencionado, para encontrar pessoas de coração sincero, precisamos da ajuda de Jeová e dos anjos. Mesmo assim, queremos fazer o nosso melhor para apresentar as boas novas de uma maneira que seja interessante para as pessoas. Para nos ajudar, este estudo vai falar sobre três coisas que podemos fazer para melhorar nossa arte de ensino.",
        resposta: "Alguns acham que não têm estudo ou dom de ensinar. Outros ficam desanimados por não terem os mesmos resultados que outros. Mas os resultados não dependem só dos nossos esforços - precisamos da ajuda de Jeová e dos anjos para encontrar pessoas de coração sincero."
      },
      {
        paragrafo: "3",
        pergunta: "Por que Jesus conseguia tocar o coração das pessoas?",
        textoBase: "A Bíblia diz que Jesus 'sabia o que havia nos homens'. (João 2:25) Isso quer dizer que Jesus sabia como as pessoas pensavam e por que elas pensavam daquele jeito. Ele conseguia tocar o coração das pessoas porque entendia as necessidades delas. Jesus via que elas não tinham orientação e consolo, e que eram sobrecarregadas com tradições e regras criadas pelos líderes religiosos. (Mat. 9:36; 23:4) Jesus ensinou no Sermão do Monte várias coisas que ajudariam as pessoas a terem uma vida melhor. Muitos gostavam de ouvir Jesus porque ele falava sobre coisas que eram importantes para eles.",
        resposta: "Jesus 'sabia o que havia nos homens' - entendia como as pessoas pensavam e suas necessidades. Ele via que elas não tinham orientação e consolo, e eram sobrecarregadas com tradições e regras. Ele falava sobre coisas importantes para elas."
      },
      {
        paragrafo: "4",
        pergunta: "O que pode nos ajudar a mostrar interesse pelas pessoas? (Veja também as imagens.)",
        textoBase: "Algo que pode nos ajudar a mostrar interesse pelas pessoas é entender as preocupações delas. Todas as pessoas que encontramos na pregação estão enfrentando algum tipo de problema neste mundo de Satanás. Lembrar disso nos ajuda a ter empatia pelas pessoas do nosso território. Por exemplo, será que aconteceu algo na nossa região que talvez tenha deixado as pessoas abaladas? Os pais estão preocupados com o futuro dos filhos? O desemprego é comum onde moramos? Tente imaginar como deve ser a vida das pessoas: além de viver nestes 'tempos críticos', elas não sabem da esperança que a Bíblia dá. — 2 Tim. 3:1; Isa. 65:13, 14.",
        resposta: "Devemos entender as preocupações das pessoas. Todas enfrentam problemas neste mundo de Satanás. Pergunte-se: O que aconteceu na região? Os pais estão preocupados? O desemprego é comum? Tente imaginar como é a vida delas sem conhecer a esperança da Bíblia."
      },
      {
        paragrafo: "5",
        pergunta: "Como Jesus era diferente dos fariseus? (Mateus 11:28-30)",
        textoBase: "Jesus se interessava pelas pessoas, e elas podiam ver isso pela maneira como ele as tratava. Jesus era muito diferente dos fariseus. Esses líderes religiosos se achavam melhores do que os outros e muitas vezes tratavam mal as pessoas. (Mat. 23:13; João 7:49) Já Jesus tratava as pessoas com bondade e respeito. Ele era 'de temperamento brando e humilde de coração', e isso o ajudou a ser um bom instrutor. (Leia Mateus 11:28-30.) Nós também devemos tratar as pessoas com bondade e respeito.",
        resposta: "Os fariseus se achavam melhores e tratavam mal as pessoas. Já Jesus tratava as pessoas com bondade e respeito. Ele era 'de temperamento brando e humilde de coração', o que o ajudou a ser um bom instrutor. Devemos imitá-lo."
      },
      {
        paragrafo: "6",
        pergunta: "Como podemos mostrar bondade e respeito por aqueles que rejeitam a nossa mensagem ou se opõem a ela?",
        textoBase: "Alguns rejeitam a nossa mensagem ou até se opõem a ela. Qual deve ser a nossa reação quando isso acontece? Jesus disse que precisamos fazer mais do que simplesmente suportar oposição. Ele disse que devemos 'fazer o bem aos que nos odeiam', 'abençoar os que nos amaldiçoam' e até mesmo 'orar pelos que nos insultam'. (Luc. 6:27, 28) Vai ser mais fácil fazer isso se nos lembrarmos de que a pessoa que nos tratou mal talvez tenha um motivo para não querer nos ouvir. É verdade que alguns realmente querem nos fazer parar de pregar. Mas outros talvez não tenham nada contra nós. Pode ser que eles não queiram nos ouvir porque estão passando por um problema na família ou estão ansiosos com alguma outra situação. Talvez nós simplesmente chegamos numa hora ruim. Seja qual for o caso, devemos seguir o conselho que está em Colossenses 4:6: 'Que as suas palavras sejam sempre agradáveis, temperadas com sal, de modo que saibam como responder a cada pessoa.' Devemos ter empatia pelas pessoas e tentar entender as necessidades delas. Assim, vai ser mais difícil ficarmos ofendidos e vamos nos tornar melhores instrutores.",
        resposta: "Jesus disse para 'fazer o bem aos que nos odeiam' e 'orar pelos que nos insultam'. Lembre que a pessoa talvez tenha um motivo para não querer nos ouvir - pode estar passando por problemas ou chegamos numa hora ruim. Devemos ter empatia e seguir Colossenses 4:6."
      },
      {
        paragrafo: "7",
        pergunta: "Que exemplo Jesus deixou ao ensinar? (João 7:14-16)",
        textoBase: "Jesus não ensinava suas próprias ideias. Ele se baseava na Palavra de Deus e mostrava como as pessoas podiam aplicá-la na vida delas. Ele fazia isso de uma forma simples e que era fácil de se lembrar. A Bíblia diz que Jesus ensinava 'como quem tinha autoridade, e não como os escribas'. Por isso, as pessoas 'ficavam maravilhadas'. (Mar. 1:22; veja a nota de estudo 'não como os escribas'.) Os escribas nos dias de Jesus citavam instrutores religiosos respeitados para apoiar suas ideias. Já Jesus citava as Escrituras. Mesmo sendo o Filho de Deus e tendo vivido no céu, Jesus não usou sua imensa sabedoria para impressionar outros ou fazê-los se sentir inferiores. Em vez disso, ele ensinava qual era a vontade de Deus usando as Escrituras. (Leia João 7:14-16.) Assim, Jesus deixou um excelente exemplo para seus seguidores.",
        resposta: "Jesus não ensinava suas próprias ideias, mas se baseava na Palavra de Deus. Ele ensinava 'como quem tinha autoridade, e não como os escribas', que citavam instrutores religiosos. Jesus citava as Escrituras e ensinava a vontade de Deus de forma simples."
      },
      {
        paragrafo: "8",
        pergunta: "Como Pedro imitou o exemplo de Jesus?",
        textoBase: "Os discípulos de Jesus também ensinavam usando a Palavra de Deus. Por exemplo, pense no discurso que o apóstolo Pedro fez no Pentecostes do ano 33. Pedro não tinha recebido uma educação de alto nível. Mesmo assim, ele tocou o coração dos seus ouvintes explicando com base nas Escrituras como Jesus cumpriu várias profecias. (Atos 2:14-37) Qual foi o resultado? 'Os que aceitaram com alegria as suas palavras foram batizados, e naquele dia cerca de 3.000 pessoas se juntaram a eles.' — Atos 2:41.",
        resposta: "Pedro não tinha educação de alto nível, mas tocou o coração dos ouvintes explicando com base nas Escrituras como Jesus cumpriu profecias. Resultado: cerca de 3.000 pessoas foram batizadas naquele dia."
      },
      {
        paragrafo: "9",
        pergunta: "Por que devemos ensinar usando a Bíblia?",
        textoBase: "A melhor forma de tocar o coração dos nossos ouvintes é por meio da Palavra de Deus. (Heb. 4:12) Por isso, precisamos ensinar usando a Bíblia. Nós queremos 'pregar a palavra', não as nossas próprias ideias. (2 Tim. 4:2) Provérbios 2:6 diz: 'É Jeová quem dá sabedoria; da sua boca procedem conhecimento e discernimento.' Então, quando usamos a Bíblia, deixamos Jeová falar com as pessoas. (Mal. 2:7) Queremos que elas saibam que os conselhos da Bíblia são muito melhores do que qualquer conselho que um humano possa dar. Ela é inspirada por Deus e nos ensina o que precisamos fazer para agradar o nosso Criador e ter uma vida feliz. — 2 Tim. 3:16, 17.",
        resposta: "A Palavra de Deus toca o coração dos ouvintes. (Heb. 4:12) Queremos 'pregar a palavra', não nossas ideias. Quando usamos a Bíblia, deixamos Jeová falar com as pessoas. Os conselhos da Bíblia são inspirados e nos ensinam como ter uma vida feliz."
      },
      {
        paragrafo: "10",
        pergunta: "Como você pode mostrar para o seu estudante que aquilo que ele está aprendendo vem da Bíblia?",
        textoBase: "Quando estiver se preparando para dirigir um estudo bíblico, pense em como você vai direcionar a atenção para o que a Bíblia ensina. Embora usemos imagens e vídeos, nosso estudante precisa entender que aquilo que ele está aprendendo vem da Bíblia. Então, durante o estudo, leia os textos que vão ajudar seu estudante a entender o ponto principal. Depois, raciocinem juntos sobre o que ele pode aprender com esses textos. Ao usar imagens e vídeos, ajude o estudante a ver quais verdades bíblicas estão sendo ensinadas. Isso não significa que você precisa falar muito ou ler muitos textos bíblicos. Em vez disso, dê tempo para o estudante pensar e entender cada texto que é lido, e até leia o texto mais de uma vez se for necessário. Dessa forma, vamos estar realmente dirigindo um estudo da Bíblia, não o estudo de um livro, de uma imagem ou de um vídeo. — 1 Cor. 2:13.",
        resposta: "Direcione a atenção para o que a Bíblia ensina. Leia os textos e raciocine junto com o estudante. Ao usar imagens e vídeos, mostre quais verdades bíblicas estão sendo ensinadas. Dê tempo para o estudante pensar e entender cada texto."
      },
      {
        paragrafo: "11-12",
        pergunta: "Como podemos mostrar paciência com nossos estudantes? (Atos 17:1-4) (Veja também a imagem.)",
        textoBase: "Se o seu estudante acha difícil aceitar algo que está aprendendo, lembre-se de 'pregar a palavra com toda a paciência'. (2 Tim. 4:2) Cada um progride num ritmo diferente. Alguns estudantes talvez precisem de mais tempo para entender verdades que, para nós, são fáceis de entender. Devemos imitar o exemplo do apóstolo Paulo. Quando pregou para os judeus em Tessalônica, ele precisou raciocinar várias vezes com eles sobre as Escrituras para que alguns entendessem o que ele estava ensinando. — Leia Atos 17:1-4. Outra maneira de mostrarmos paciência com nossos estudantes é por fazer perguntas e dar tempo suficiente para eles responderem. Escute com atenção as respostas deles e tente entender por que eles pensam de determinada maneira. Daí, leia e converse sobre textos que os ajudem a entender o que Deus pensa sobre o assunto. E lembre-se: algumas pessoas não têm ideia de que a Bíblia está cheia de informações que podem ajudá-las. Então, você pode usar a seção 'Uma Introdução à Palavra de Deus' da Tradução do Novo Mundo para mostrar que a Bíblia fala de vários assuntos importantes. Daí talvez você possa mostrar como a Bíblia pode nos ajudar a ter uma vida mais feliz lendo um ou dois textos que estão na pergunta 15 dessa seção. Resumindo, para sermos bons instrutores, precisamos ajudar nossos estudantes a ver o poder que a Palavra de Deus tem.",
        resposta: "Lembre que cada um progride num ritmo diferente. Paulo precisou raciocinar várias vezes com os judeus em Tessalônica. Faça perguntas e dê tempo para responderem. Escute com atenção e ajude-os a ver o poder que a Palavra de Deus tem."
      },
      {
        paragrafo: "13",
        pergunta: "Ao ensinar, devemos direcionar a atenção para quem? Ilustre.",
        textoBase: "Nosso objetivo é ajudar nossos ouvintes a conhecer a Jeová e ser amigos dele. (Tia. 4:8) Nesse aspecto, nosso trabalho é parecido com o de uma pessoa responsável pela iluminação em uma apresentação de teatro. Durante a apresentação, ela não direciona a luz para ela mesma. Em vez disso, ela direciona a luz para os personagens principais, para que eles fiquem em destaque. Ao ensinar, nós precisamos fazer o mesmo: direcionar a atenção para Jeová, não para nós mesmos.",
        resposta: "Nosso objetivo é ajudar os ouvintes a conhecer a Jeová. É como a pessoa responsável pela iluminação no teatro - ela não direciona a luz para si mesma, mas para os personagens principais. Devemos direcionar a atenção para Jeová, não para nós."
      },
      {
        paragrafo: "14",
        pergunta: "O que podemos fazer para ajudar nosso estudante a agradar a Jeová?",
        textoBase: "Ao dirigir um estudo, ajude seu estudante a desenvolver o desejo de agradar a Jeová. (Pro. 27:11) Nosso objetivo não é que nosso estudante cumpra com uma lista de regras, como para entrar em um clube. Queremos que ele faça mudanças na vida porque quer agradar a Jeová. Por exemplo, se ele está tendo dificuldades para vencer um hábito ruim, faça para ele perguntas como: 'Por que Jeová odeia esse hábito? Por que Jeová pediria para você parar de fazer algo que você gosta? Como essa ordem mostra que Jeová te ama?' Quanto mais você ajudar seu estudante a pensar em Jeová e nas qualidades Dele, mais ele vai perceber que Jeová o ama. Isso vai ajudar seu estudante a querer agradar a Jeová.",
        resposta: "Ajude o estudante a desenvolver o desejo de agradar a Jeová, não apenas cumprir uma lista de regras. Faça perguntas como: 'Por que Jeová odeia esse hábito? Como essa ordem mostra que ele te ama?' Quanto mais ele pensar em Jeová, mais vai querer agradá-lo."
      },
      {
        paragrafo: "15",
        pergunta: "O que podemos fazer para continuar a melhorar nossa arte de ensino?",
        textoBase: "Podemos orar a Jeová pedindo que ele nos ajude a ver o que precisamos fazer para melhorar nossas habilidades de ensino. (1 João 5:14) Daí, precisamos agir de acordo com nossas orações. Uma maneira de fazer isso é por prestar atenção no treinamento que Jeová nos dá nas reuniões e colocá-lo em prática. Também, quando formos dirigir um estudo, podemos convidar irmãos experientes para nos acompanhar e depois pedir que eles nos digam no que podemos melhorar. Além disso, lembre-se de que as verdades que você conhece tão bem são novidade para o seu estudante. Então, tente imaginar o que ele pensa e sente sobre o assunto que vão estudar. E ajude o estudante a ver o valor do que ele está aprendendo. Esse conhecimento pode ajudá-lo a desenvolver uma amizade com Jeová e a ter uma vida realmente feliz. — Sal. 1:1-3.",
        resposta: "Ore a Jeová pedindo ajuda. Preste atenção no treinamento das reuniões. Convide irmãos experientes para acompanhar e dar sugestões. Lembre que as verdades são novidade para o estudante - ajude-o a ver o valor do que está aprendendo."
      },
      {
        paragrafo: "16",
        pergunta: "Por que é bom continuar melhorando a nossa arte de ensino?",
        textoBase: "Ensinar outros sobre Jeová é uma das maiores alegrias que podemos ter. E esse trabalho vai continuar sendo feito no novo mundo. Então, ao pregar as boas novas, queremos mostrar interesse pelas pessoas, usar a Bíblia ao ensinar e direcionar a atenção para Jeová. Dessa forma, vamos continuar melhorando a nossa arte de ensino.",
        resposta: "Ensinar outros sobre Jeová é uma das maiores alegrias e vai continuar no novo mundo. Devemos mostrar interesse pelas pessoas, usar a Bíblia ao ensinar e direcionar a atenção para Jeová."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Como você pode mostrar interesse pelas pessoas?",
        resposta: "Entendendo as preocupações delas, lembrando que todas enfrentam problemas, e tratando-as com bondade e respeito, mesmo quando rejeitam a mensagem."
      },
      {
        pergunta: "Por que é importante usar a Bíblia ao ensinar?",
        resposta: "Porque a Palavra de Deus toca o coração dos ouvintes. Quando usamos a Bíblia, deixamos Jeová falar com as pessoas, e os conselhos dela são inspirados por Deus."
      },
      {
        pergunta: "Como você pode direcionar a atenção do seu estudante para Jeová?",
        resposta: "Ajudando-o a desenvolver o desejo de agradar a Jeová, fazendo perguntas que o levem a pensar nas qualidades de Deus e em como Jeová o ama."
      }
    ]
  },
  {
    id: 2,
    semana: "Semana 2",
    dataInicio: "11",
    dataFim: "17 de maio",
    canticoInicial: 7,
    canticoInicialTitulo: "Jeová, nossa força e poder",
    canticoFinal: 153,
    canticoFinalTitulo: "Jeová, me dá coragem",
    titulo: "Confie no Soberano do Universo",
    textoTema: "Jeová, somente tu és o Altíssimo sobre toda a terra.",
    textoTemaRef: "SAL. 83:18",
    objetivo: "Fortalecer a nossa confiança de que Jeová é o Soberano do Universo e de que ele vai nos ajudar a enfrentar nossas provações atuais e futuras.",
    imagem: "/images/estudo-maio-semana2.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "Que tragédias Jó enfrentou?",
        textoBase: "De uma hora para outra, o fiel Jó perdeu quase tudo o que tinha: seus filhos, sua saúde e seus bens materiais. Além disso, ele perdeu o respeito das pessoas à sua volta. E seus supostos 'amigos' disseram muitas coisas que só o desanimaram. Até sua querida esposa ficou tão aflita que disse para ele 'amaldiçoar a Deus e morrer'. (Jó 2:9; 15:4, 5; 19:1-3) Essas tragédias poderiam ter diminuído a confiança que Jó tinha em Deus, fazendo com que ele começasse a duvidar se Jeová realmente protege quem ama e serve a Ele.",
        resposta: "Jó perdeu seus filhos, sua saúde e seus bens materiais. Perdeu o respeito das pessoas. Seus 'amigos' só o desanimaram, e sua esposa disse para ele 'amaldiçoar a Deus e morrer'. Isso poderia ter abalado sua confiança em Jeová."
      },
      {
        paragrafo: "2-3",
        pergunta: "O que podemos pensar quando passamos por provações? O que vamos aprender com o livro de Jó?",
        textoBase: "Nós vivemos em 'tempos críticos, difíceis de suportar'. (2 Tim. 3:1) Então, às vezes passamos por desafios que podem testar a nossa confiança em Jeová. Quando enfrentamos uma provação atrás da outra, podemos ficar muito ansiosos e pensar que não vamos conseguir aguentar. Alguns chegam até a duvidar se Jeová realmente se importa com eles. Se você já se sentiu assim alguma vez, não fique desanimado. Jó aprendeu que Jeová nunca abandona aqueles que são leais a ele. Nós podemos desenvolver essa mesma confiança em nosso Pai celestial. Algo que vai nos ajudar nisso é analisar o livro de Jó e ver como ele nos garante duas coisas: Primeira, apenas Jeová é o Soberano do Universo. Segunda, o nosso Deus tem o poder para controlar os eventos mundiais e assim garantir que seu propósito se cumpra e que seu povo não sofra danos permanentes em sentido espiritual e físico.",
        resposta: "Em tempos difíceis, podemos ficar ansiosos e duvidar se Jeová se importa conosco. Mas Jó aprendeu que Jeová nunca abandona os leais. O livro de Jó nos garante: apenas Jeová é o Soberano do Universo, e ele tem poder para garantir que seu propósito se cumpra."
      },
      {
        paragrafo: "4",
        pergunta: "Quem estava presente na reunião no céu mencionada no livro de Jó?",
        textoBase: "Certo dia, 'os filhos do verdadeiro Deus' se apresentaram perante Jeová. A Bíblia mostra que 'Satanás também foi no meio deles'. (Jó 1:6) Essa é a primeira vez na história da Bíblia que a palavra 'Satanás', que significa 'Opositor', é usada para se referir ao principal opositor de Jeová. Quando houve essa reunião no céu, Satanás já não era mais um filho fiel de Deus. Ele era um inimigo de Jeová e dos anjos e humanos fiéis. Em Gênesis 3:15, Jeová deixou claro que Satanás não fazia mais parte da sua família celestial, representada pela 'mulher'.",
        resposta: "Os 'filhos do verdadeiro Deus' se apresentaram perante Jeová, e 'Satanás também foi no meio deles'. Essa é a primeira vez que 'Satanás' (Opositor) é usado na Bíblia para se referir ao principal opositor de Jeová."
      },
      {
        paragrafo: "5",
        pergunta: "O que aprendemos por analisar a reunião que aconteceu no céu?",
        textoBase: "Jeová deixou registrado na Bíblia o que foi dito naquela reunião no céu. As palavras de Satanás mostram que ele é perverso e conta mentiras sobre os servos de Jeová. (Jó 1:9; veja também Apocalipse 12:10.) O que aconteceu naquela reunião também nos garante que Jeová sempre usa o seu poder de maneira correta e justa. Nós também aprendemos que o Todo-Poderoso estabelece limites no que outros podem fazer.",
        resposta: "As palavras de Satanás mostram que ele é perverso e conta mentiras sobre os servos de Jeová. A reunião nos garante que Jeová usa seu poder de maneira correta e justa, e que ele estabelece limites no que outros podem fazer."
      },
      {
        paragrafo: "6",
        pergunta: "Como Jeová mostrou que tinha total controle daquela reunião no céu? (Jó 1:7, 8)",
        textoBase: "Leia Jó 1:7, 8. Jeová mostrou que estava no controle daquela reunião. Foi ele quem iniciou a conversa e perguntou a Satanás: 'Você observou o meu servo Jó?' Jeová sabia muito bem que Satanás queria atacar Jó. Vamos ver como Jeová usou o seu grande poder para ajudar seu servo.",
        resposta: "Jeová iniciou a conversa e perguntou a Satanás: 'Você observou o meu servo Jó?' Jeová sabia que Satanás queria atacar Jó e usou seu grande poder para ajudar seu servo."
      },
      {
        paragrafo: "7",
        pergunta: "De acordo com Jó 1:10, 11, o que Satanás deu a entender sobre os humanos que servem a Jeová?",
        textoBase: "Leia Jó 1:10, 11. Jeová é o Soberano do Universo. Ele pode fazer o que quiser e sempre sabe qual é a melhor forma de usar o seu poder. (Jer. 32:17; Dan. 4:35) Mesmo assim, Satanás afirmou que Jeová não usava o seu poder da forma correta. Na verdade, Satanás disse que Deus dava para os humanos, incluindo Jó, muitas coisas boas para que eles servissem a Ele. Satanás também deu a entender que os humanos só servem a Jeová por interesse. O que Jeová fez então?",
        resposta: "Satanás afirmou que Jeová não usava seu poder da forma correta e que dava coisas boas para que os humanos o servissem. Satanás deu a entender que os humanos só servem a Jeová por interesse."
      },
      {
        paragrafo: "8-9",
        pergunta: "Que limites claros Jeová estabeleceu para Satanás, e por quê? (Jó 1:12) (Veja também a imagem.)",
        textoBase: "Leia Jó 1:12. Jeová permitiu que Satanás tentasse provar que estava certo. Mas ele estabeleceu limites claros. Falando sobre Jó, Jeová disse para Satanás: 'Não estenda a mão contra ele mesmo!' Todos os anjos ouviram Jeová dar essa ordem para Satanás. E Satanás não tinha escolha a não ser obedecer. Dessa forma, Jeová usou sua autoridade e poder para proteger Jó e para mostrar que ele é um Deus justo e amoroso. Satanás não tinha poder para ir além do que Jeová tinha permitido. É assim até hoje. Os ataques de Satanás foram um fracasso total. Jó continuou fiel a seu Pai celestial. (Jó 1:22) Mas Satanás queria testar Jó ainda mais.",
        resposta: "Jeová disse para Satanás: 'Não estenda a mão contra ele mesmo!' Todos os anjos ouviram essa ordem. Satanás não tinha escolha a não ser obedecer. Jeová protegeu Jó e mostrou que é justo e amoroso. Jó continuou fiel."
      },
      {
        paragrafo: "10",
        pergunta: "Por que Jeová permitiu que Satanás testasse Jó ainda mais? (Jó 2:2-6)",
        textoBase: "Leia Jó 2:2-6. Dessa vez, Satanás intensificou seus esforços para fazer com que Jó parasse de servir a Jeová. Ele disse que Jó com certeza iria abandonar a Jeová para salvar a própria vida. Para mostrar que Satanás estava errado, Jeová permitiu que ele atacasse Jó com uma doença. Só que, mais uma vez, Jeová estabeleceu limites. Ele disse: 'Não tire a vida dele!' E Satanás não teve escolha, a não ser obedecer. Vemos mais uma vez que o Soberano estava no controle durante a provação de Jó, tanto é que Satanás não pôde ir além dos limites que Jeová tinha colocado.",
        resposta: "Satanás disse que Jó abandonaria a Jeová para salvar a própria vida. Para mostrar que Satanás estava errado, Jeová permitiu que ele atacasse Jó com uma doença, mas estabeleceu limites: 'Não tire a vida dele!' Satanás teve que obedecer."
      },
      {
        paragrafo: "11",
        pergunta: "De acordo com Jó 42:10-13, como Jeová recompensou Jó depois de acabar com o sofrimento dele?",
        textoBase: "Leia Jó 42:10-13. Quando ficou claro que Jó iria permanecer fiel, Jeová não permitiu que Satanás continuasse com seus ataques. Além disso, Jeová agiu para acabar com o sofrimento de seu servo. Mais uma vez, não havia nada que Satanás pudesse fazer. Ele não tinha o poder para impedir Jeová de proteger e abençoar Jó.",
        resposta: "Quando ficou claro que Jó permaneceria fiel, Jeová não permitiu que Satanás continuasse com os ataques. Jeová acabou com o sofrimento de Jó e o abençoou. Satanás não tinha poder para impedir isso."
      },
      {
        paragrafo: "12",
        pergunta: "Dê um exemplo que mostra o resultado de confiarmos no poder que Jeová tem de salvar seus servos.",
        textoBase: "Durante os últimos dias, muitos têm visto Jeová usar seu poder em favor deles. Por exemplo, em 1945, durante o nazismo, 230 Testemunhas de Jeová que estavam em um campo de concentração sobreviveram a uma marcha da morte. Depois de passarem por essa situação terrível, elas escreveram o seguinte: 'Um longo período de prova passou sobre nós, e aqueles que foram preservados, tendo sido como que arrancados da fornalha ardente, não têm sobre si nem cheiro de fogo. Pelo contrário, estão cheios de vigor e de poder da parte de Jeová. Só temos um desejo depois de termos ficado na cova dos leões: que nos seja permitido servir a Jeová por toda a eternidade. Isso, em si, seria nossa maior recompensa.' — Veja também Daniel 3:27; 6:22.",
        resposta: "Em 1945, 230 Testemunhas sobreviveram a uma marcha da morte num campo de concentração nazista. Elas disseram que foram 'como que arrancadas da fornalha ardente' e estavam 'cheios de vigor e de poder da parte de Jeová'."
      },
      {
        paragrafo: "13",
        pergunta: "Quando passamos por situações difíceis, que confiança podemos ter? (Veja também as imagens.)",
        textoBase: "Nós também podemos passar por situações na vida em que nos sentimos como que numa cova de leões. (1 Ped. 5:8-10) Às vezes, ficamos muito desanimados porque parece que nossos problemas nunca vão acabar. Nesses momentos, lembrar do que aconteceu com Jó pode ser de ajuda. Podemos ter total confiança de que Jeová tem o poder para acabar com o nosso sofrimento, quer seja agora ou no novo mundo. E ele não vai permitir que este mundo mau dure nem um dia a mais do que ele determinou!",
        resposta: "Às vezes nos sentimos como numa cova de leões e parece que nossos problemas nunca vão acabar. Podemos confiar que Jeová tem poder para acabar com nosso sofrimento, agora ou no novo mundo. Ele não vai permitir que este mundo dure além do determinado!"
      },
      {
        paragrafo: "14-15",
        pergunta: "O que Jeová quer fazer por seus servos leais, e por quê? (Jó 14:15) (Veja também a imagem da capa.)",
        textoBase: "Leia Jó 14:15. Nosso Pai celestial é leal com aqueles que são leais a ele. Jeová os ama tanto que, se eles morrerem, ele vai trazê-los de volta à vida. Jeová vai transformar em alegria toda a dor causada pela morte. — Isa. 65:17. É verdade que Jó continuou vivendo num mundo dominado por Satanás. Mas a Bíblia diz que Jeová recompensou Jó por curá-lo e dar a ele muito mais bênçãos do que ele tinha antes. Essas bênçãos foram só uma amostra do que Jeová vai fazer por Jó no futuro. Na verdade, Jeová quer que todos os seus servos leais tenham verdadeira felicidade e prazer na vida. Ele vai recompensar a todos eles com vida eterna no Paraíso na Terra. (Apo. 21:3, 4) Como Jeová é o Soberano do Universo, ninguém pode impedi-lo de fazer o que ele quer pelos seus servos. Pensar em como Jeová vai nos recompensar nos consola muito quando passamos por problemas!",
        resposta: "Jeová é leal com os leais a ele. Se morrerem, ele vai trazê-los de volta à vida. Jeová recompensou Jó com bênçãos, uma amostra do futuro. Ele quer que seus servos tenham felicidade e vida eterna no Paraíso. Ningu��m pode impedi-lo!"
      },
      {
        paragrafo: "16",
        pergunta: "Que outro motivo temos para confiar em Jeová como Soberano do Universo?",
        textoBase: "Depois de viver uma vida longa, Jó por fim morreu. Mas como Jeová é o Soberano do Universo e o Todo-Poderoso, ele tem poder até mesmo sobre a morte. (Deut. 32:39) Jeová já escolheu o momento em que vai ressuscitar seus servos amados, e ninguém pode impedi-lo de fazer isso. — Rom. 8:38, 39.",
        resposta: "Jeová é o Todo-Poderoso e tem poder até mesmo sobre a morte. Ele já escolheu o momento de ressuscitar seus servos amados, e ninguém pode impedi-lo de fazer isso."
      },
      {
        paragrafo: "17",
        pergunta: "O que mostra que Satanás não consegue destruir o povo de Jeová?",
        textoBase: "Nós aprendemos com o livro de Jó que temos fortes motivos para confiar totalmente em Jeová. Somos muito gratos por Jeová não ter permitido que Satanás destruísse o povo Dele! Os cerca de 9 milhões de servos fiéis de Jeová que existem hoje são uma prova viva de que Jeová é realmente o Soberano do Universo. Vez após vez, nós temos visto que as armas usadas por Satanás contra o povo de Deus sempre falham. (Isa. 54:17) Embora o povo de Jeová possa parecer indefeso, governos e líderes religiosos poderosos não conseguem nos destruir. E nada pode nos impedir de contar para outros a verdade sobre Jeová, e de mostrar que Satanás é um mentiroso e um assassino. Nem mesmo a morte pode nos derrotar, porque Jeová vai ressuscitar todos aqueles que morrerem leais a ele. — Ose. 13:14.",
        resposta: "Os cerca de 9 milhões de servos fiéis de Jeová são prova de que ele é o Soberano do Universo. As armas de Satanás sempre falham. Ninguém pode nos impedir de pregar a verdade. Nem a morte nos derrota, pois Jeová vai ressuscitar os leais."
      },
      {
        paragrafo: "18",
        pergunta: "Por que não precisamos ter medo do que vai acontecer no futuro?",
        textoBase: "Quando meditamos no livro de Jó, fortalecemos nossa fé de que Jeová vai estar do nosso lado não importa o que aconteça. Durante a grande tribulação, Satanás e seus exércitos vão achar que o povo de Deus é um alvo fácil e vão atacá-lo. Mas assim como nos dias de Jó, Jeová vai estar no controle e não vai permitir que Satanás cause nenhum dano permanente ao seu povo. Muito em breve, Jeová vai acabar com todo o sofrimento que o Diabo tem causado à humanidade. Satanás e seus demônios vão ficar presos no abismo por mil anos. (Luc. 8:31; Apo. 20:1-3) Por fim, ele e todos os que ficarem do lado dele vão ser destruídos de uma vez por todas, exatamente como Jeová prometeu. — Gên. 3:15; Rom. 16:20; Apo. 20:10.",
        resposta: "Na grande tribulação, Satanás vai atacar o povo de Deus, mas Jeová vai estar no controle. Em breve, Satanás e seus demônios serão presos no abismo por mil anos e depois destruídos de uma vez por todas, como Jeová prometeu."
      },
      {
        paragrafo: "19",
        pergunta: "Que recompensa os que confiam totalmente em Jeová vão receber no futuro? (Veja também a imagem.)",
        textoBase: "Não vemos a hora de o novo mundo chegar e de termos vida perfeita e verdadeira felicidade. A vida vai ser muito melhor do que qualquer coisa que conseguimos imaginar. Jeová promete: 'Veja! Estou fazendo novas todas as coisas.' (Apo. 21:5) O que isso quer dizer? Pela primeira vez em milhares de anos, os humanos vão ficar livres da influência terrível de Satanás e seus demônios. Que alívio isso vai ser! Nunca mais vamos perder uma noite de sono por causa das ansiedades deste velho mundo. Os que sobreviverem ao Armagedom vão ver todas as doenças desaparecerem. E finalmente, a ressurreição das pessoas que amamos vai começar. Nós vamos ter a vida que o nosso Pai celestial queria desde o início!",
        resposta: "No novo mundo teremos vida perfeita e verdadeira felicidade. Pela primeira vez em milhares de anos, seremos livres da influência de Satanás. Todas as doenças desaparecerão e a ressurreição começará. Teremos a vida que Jeová planejou!"
      },
      {
        paragrafo: "20",
        pergunta: "O que você está determinado a fazer?",
        textoBase: "Precisamos de coragem para enfrentar os desafios destes últimos dias e continuar fiéis. Então, estamos determinados a confiar totalmente em Jeová e apoiar sua soberania. Queremos mostrar o nosso amor por nosso Pai celestial e provar que Satanás é um mentiroso. Podemos ter certeza de que, se continuarmos fiéis a Jeová, o Soberano do Universo, vamos ter um futuro maravilhoso, porque ele quer muito recompensar os seus servos fiéis!",
        resposta: "Estamos determinados a confiar totalmente em Jeová, apoiar sua soberania e provar que Satanás é mentiroso. Se continuarmos fiéis, teremos um futuro maravilhoso, pois Jeová quer muito recompensar seus servos fiéis!"
      }
    ],
    recapitulacao: [
      {
        pergunta: "Como o livro de Jó prova que Jeová é o Soberano do Universo?",
        resposta: "Jeová estava no controle durante a provação de Jó, estabelecendo limites claros para Satanás e mostrando que nada pode impedi-lo de proteger e abençoar seus servos."
      },
      {
        pergunta: "Por que Jeová quer muito recompensar seus servos leais?",
        resposta: "Porque ele é leal com os leais a ele e os ama tanto que vai trazê-los de volta à vida se morrerem. Ele quer que todos tenham verdadeira felicidade e vida eterna no Paraíso."
      },
      {
        pergunta: "Por que você pode confiar totalmente em Jeová, o Soberano do Universo?",
        resposta: "Porque as armas de Satanás sempre falham, ninguém pode impedir Jeová de cumprir seu propósito, e ele vai acabar com todo o sofrimento e recompensar os fiéis com vida eterna."
      }
    ]
  },
  {
    id: 3,
    semana: "Semana 3",
    dataInicio: "18",
    dataFim: "24 de maio",
    canticoInicial: 35,
    canticoInicialTitulo: "O que é mais importante",
    canticoFinal: 129,
    canticoFinalTitulo: "Eu vou perseverar",
    titulo: "Tome cuidado com as distrações",
    textoTema: "Compreendam qual é a vontade de Jeová.",
    textoTemaRef: "EFÉ. 5:17",
    objetivo: "Ver como não deixar que as distrações tirem nosso foco das atividades espirituais.",
    imagem: "/images/estudo-maio-semana3.jpg",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "Que exemplo mostra que algo importante pode virar uma distração?",
        textoBase: "Imagine que você está dirigindo e seu telefone começa a tocar. Você pensa: 'Será que alguém está precisando da minha ajuda?' Mas naquele momento, você não pode se distrair porque precisa prestar atenção ao trânsito. Em muitas situações na nossa vida, precisamos decidir o que é mais importante no momento. Todos nós temos muitas coisas importantes para fazer. Mas sabemos que o mais importante é nos concentrar em atividades espirituais. (Mat. 6:33) Assim como bons motoristas evitam se distrair, os servos de Jeová evitam distrações que os impeçam de colocar as coisas espirituais em primeiro lugar na vida. — Pro. 4:25; Mat. 6:22.",
        resposta: "Quando estamos dirigindo e o telefone toca, precisamos decidir o que é mais importante - prestar atenção ao trânsito. Da mesma forma, evitamos distrações que impeçam de colocar as coisas espirituais em primeiro lugar."
      },
      {
        paragrafo: "3",
        pergunta: "Por que vai ser de ajuda aprender a lidar com distrações?",
        textoBase: "Nenhum de nós tem a intenção de ficar distraído e deixar de colocar Jeová em primeiro lugar. Mas a verdade é que muitas situações em nossa vida podem facilmente nos distrair. (Luc. 21:34-36) Para nos ajudar a continuar concentrados no nosso serviço a Jeová, vamos considerar: (1) quais são algumas coisas que podem nos distrair, (2) o que Jesus fazia para evitar distrações e (3) o que nós podemos fazer para evitar distrações hoje.",
        resposta: "Muitas situações podem nos distrair de colocar Jeová em primeiro lugar. Vamos aprender o que pode nos distrair, o que Jesus fazia para evitar distrações, e o que podemos fazer hoje."
      },
      {
        paragrafo: "4-6",
        pergunta: "Quais são algumas coisas que podem nos distrair?",
        textoBase: "Muitas coisas na nossa vida exigem atenção. Por exemplo, pode ser que tenhamos preocupações com a nossa saúde ou com outros assuntos familiares e pessoais. É claro que essas coisas são importantes e precisam da nossa atenção. Mas elas podem acabar se transformando em distrações. Como? Elas podem começar a dominar os nossos pensamentos e consumir todo o nosso tempo e energia. Além disso, muitos de nós somos afetados por instabilidade política, crise econômica, surtos de doenças e conflitos constantes, que são comuns neste sistema. (2 Tim. 3:1) Quando passamos por problemas como esses, podemos ficar tão ansiosos que não conseguimos pensar em outra coisa. Pode ser que você conheça alguém que, do dia para a noite, viu sua vida virar de cabeça para baixo. Quando isso acontece, é normal a pessoa ficar emocionalmente abalada. Afinal, os humanos não foram feitos para viver sob constante pressão. Alguns ficam ansiosos quando percebem que não conseguem mais levar uma vida normal e, para aliviar o estresse, acabam gastando tempo demais com diversão e lazer. O que você pode fazer se estiver passando por essa situação? Vamos ver como o exemplo de Jesus pode nos ajudar a continuar dando prioridade às atividades espirituais.",
        resposta: "Preocupações com saúde, assuntos familiares, instabilidade política, crises econômicas e surtos de doenças podem nos distrair. Elas podem dominar nossos pensamentos e consumir nosso tempo e energia."
      },
      {
        paragrafo: "7",
        pergunta: "O que poderia ter deixado Jesus distraído?",
        textoBase: "Muitas coisas poderiam ter deixado Jesus distraído, como por exemplo questões sociais e políticas. Nos dias dele, muitas pessoas eram pobres e doentes. (Mat. 14:14; Mar. 14:7) Elas sofriam injustiças por parte de outros judeus e dos romanos. Quando as pessoas viram que Jesus tinha o poder de realizar milagres, elas quiseram que ele se tornasse o rei delas. (João 6:14, 15) Além disso, Jesus virou alvo do próprio Satanás, que tentou convencê-lo de que se tornar governante de todos os reinos do mundo seria uma boa ideia. (Mat. 4:8, 9) E o apóstolo Pedro, um dos melhores amigos de Jesus, uma vez o incentivou a ir pelo caminho mais fácil, dizendo: 'Tenha compaixão de si mesmo, Senhor!' — Mat. 16:21, 22.",
        resposta: "Jesus poderia ter se distraído com questões sociais e políticas, pobreza, doenças e injustiças. As pessoas quiseram fazê-lo rei. Satanás o tentou a se tornar governante do mundo. Pedro o incentivou a ir pelo caminho mais fácil."
      },
      {
        paragrafo: "8",
        pergunta: "O que Jesus fazia para evitar distrações?",
        textoBase: "O que Jesus fazia para evitar distrações? Primeiro, ele pensava como Jeová. (João 8:28; 14:9) Segundo, ele se mantinha ocupado com atividades espirituais. (Mat. 9:35) E terceiro, ele tinha bem em mente o que era mais importante. (João 4:34) Jesus rejeitou com firmeza as tentações de Satanás. E ele entendeu que a intenção de Pedro podia até ser boa, mas não era o que Jeová queria. (Mat. 4:10; 16:23) Jesus nunca deixou que as opiniões, palavras e ações de outros o distraíssem de fazer a vontade de Jeová. É verdade que as distrações da época de Jesus talvez fossem diferentes das de hoje. Mas o exemplo dele pode nos ajudar a imitá-lo e a evitar coisas que nos distraem.",
        resposta: "Jesus pensava como Jeová, se mantinha ocupado com atividades espirituais e tinha bem em mente o que era mais importante. Ele rejeitou as tentações de Satanás e nunca deixou que as opiniões de outros o distraíssem de fazer a vontade de Jeová."
      },
      {
        paragrafo: "9",
        pergunta: "O que Efésios 5:17 diz que devemos fazer?",
        textoBase: "Aprenda a pensar como Jeová. Fazendo isso, você vai conseguir 'compreender qual é a vontade dele'. (Leia Efésios 5:17.) A Bíblia mostra o que agrada ou não a Jeová, por isso precisamos ler o que ela diz e meditar nela. E mesmo quando a Bíblia não diz nada sobre uma situação específica, ainda assim é possível saber o que agrada a Jeová. Como? Conhecendo melhor o modo de Jeová pensar. É claro que também precisamos fazer a nossa parte e aplicar o que aprendemos.",
        resposta: "Devemos 'compreender qual é a vontade de Jeová' aprendendo a pensar como ele. Leia a Bíblia e medite nela para conhecer o que agrada a Jeová, e então aplique o que aprende."
      },
      {
        paragrafo: "10",
        pergunta: "Como podemos entender melhor o modo de Jeová pensar?",
        textoBase: "Podemos entender melhor como Jeová pensa por estudar os relatos da Bíblia prestando atenção à forma como ele lida com os humanos. (Jer. 45:5) Ao ler esses relatos, podemos meditar: 'O que isso me ensina sobre Jeová? Como eu posso usar isso para ajustar meu modo de pensar?' Sabemos que Jeová é muito mais sábio do que nós. (Isa. 55:9) Por isso, oramos para que ele nos ensine a pensar como ele, a ver as coisas como ele vê e a fazer sua vontade. — Sal. 143:10; 1 João 5:14.",
        resposta: "Estude os relatos da Bíblia prestando atenção à forma como Jeová lida com os humanos. Medite: 'O que isso me ensina sobre Jeová? Como posso ajustar meu modo de pensar?' Ore para que ele nos ensine a pensar como ele."
      },
      {
        paragrafo: "11",
        pergunta: "O que Jeová não quer que aconteça?",
        textoBase: "À medida que aprendemos a pensar como Jeová, entendemos que ele não quer que fiquemos distraídos, mas sim prontos para o fim deste sistema. (Mat. 24:44) Ele não quer nos ver preocupados com muitas coisas e ansiosos. (Mat. 6:31, 32) Mas se preocupações relacionadas a saúde, trabalho, casa ou outros assuntos pessoais e familiares começarem a dominar nossos pensamentos, podemos contar com a ajuda de Jeová. Ele vai nos dar a sabedoria e a força que precisamos para lidar com nossos desafios. — Sal. 55:22; Pro. 3:5-7.",
        resposta: "Jeová não quer que fiquemos distraídos, mas prontos para o fim deste sistema. Ele não quer que fiquemos ansiosos com muitas coisas. Se preocupações dominarem nossos pensamentos, ele vai nos dar sabedoria e força para lidar com os desafios."
      },
      {
        paragrafo: "12",
        pergunta: "O que vai nos ajudar a lidar com nossas ansiedades? (Mateus 5:3)",
        textoBase: "Continue ocupado com atividades espirituais. Todos nós sentimos certo grau de ansiedade por causa dos acontecimentos mundiais, que estão além do nosso controle. Mas em vez de ficarmos distraídos com o que não podemos controlar, mantemos o foco em nossas atividades espirituais. Quando fazemos isso, ficamos mais felizes, afinal Jeová nos criou com a necessidade de adorar a ele. (Leia Mateus 5:3.) Podemos satisfazer essa necessidade estudando a Palavra de Deus e também dando nosso melhor no serviço a ele. Assim, vamos usar o nosso tempo sabiamente e agradar a Jeová. — Pro. 23:15.",
        resposta: "Mantemos o foco em atividades espirituais em vez de ficar ansiosos com o que não controlamos. Jeová nos criou com a necessidade de adorá-lo. Satisfazemos essa necessidade estudando a Bíblia e dando nosso melhor no serviço a ele."
      },
      {
        paragrafo: "13",
        pergunta: "Como podemos 'usar o nosso tempo do melhor modo possível'?",
        textoBase: "Como servos de Jeová, estamos decididos a 'usar o nosso tempo do melhor modo possível', como diz Efésios 5:15, 16. (Veja a nota de estudo 'usando o seu tempo do melhor modo possível'.) Nesse texto, a Bíblia não está se referindo apenas ao modo como usamos as 24 horas do nosso dia. Na verdade, ela está nos alertando a prestar atenção a como estamos usando o tempo que resta antes do fim deste sistema. Como podemos usar o nosso tempo do melhor modo possível? Se passarmos muito tempo vendo notícias ruins, podemos ficar distraídos, desanimados e acabar nos dedicando menos no nosso serviço a Jeová. O melhor é limitar a quantidade de notícias que vemos ou ouvimos. Assim, vamos ter mais tempo e energia para atividades espirituais. Nós também podemos pensar em maneiras de melhorar nosso ministério, por exemplo, fazendo mais revisitas. Além disso, entendemos que é muito importante aproveitar toda oportunidade para ajudar as pessoas a 'ser salvas e a ter um conhecimento exato da verdade'. — 1 Tim. 2:4.",
        resposta: "Limite a quantidade de notícias que vê ou ouve para ter mais tempo e energia para atividades espirituais. Pense em maneiras de melhorar seu ministério, como fazendo mais revisitas. Aproveite toda oportunidade para ajudar as pessoas a conhecer a verdade."
      },
      {
        paragrafo: "14",
        pergunta: "Por que é bom nos manter ocupados com coisas espirituais? (Veja também a imagem.)",
        textoBase: "Quando nos mantemos ocupados com atividades espirituais, conseguimos ter um ponto de vista equilibrado sobre a época em que vivemos. Mesmo passando por instabilidade política, crise econômica e surtos de doenças, nós não ficamos desesperados. Encaramos essas coisas como elas realmente são: provas de que as profecias da Bíblia estão se cumprindo. Em vez de permitir que o medo nos distraia, temos certeza de que o propósito de Jeová vai se cumprir. Enquanto isso não acontece, mantemos a calma e confiamos que Jeová vai nos ajudar. — Sal. 16:8; 112:1, 6-8.",
        resposta: "Conseguimos ter um ponto de vista equilibrado sobre a época em que vivemos. Não ficamos desesperados - encaramos os problemas como provas de que as profecias estão se cumprindo. Mantemos a calma e confiamos em Jeová."
      },
      {
        paragrafo: "15",
        pergunta: "O que significa 'ser sensato' e por que isso é importante? (1 Pedro 4:7)",
        textoBase: "Tenha bem em mente o que é mais importante. Muitas pessoas hoje acabam gastando tempo demais com diversão, em vez de se preocupar com o fato de que o fim está próximo. Embora o lazer seja importante, precisamos 'ser sensatos', senão vamos acabar pensando como as pessoas deste mundo. (Leia 1 Pedro 4:7.) O que significa ser sensato? Entre outras coisas, significa pensar bem antes de tomar uma decisão, o que vai nos ajudar a ter um ponto de vista equilibrado sobre o lazer. Dessa forma, vamos pensar como Jeová e mostrar que entendemos o que é realmente importante. — 2 Tim. 1:7.",
        resposta: "'Ser sensato' significa pensar bem antes de tomar uma decisão. Isso nos ajuda a ter um ponto de vista equilibrado sobre o lazer, evitando gastar tempo demais com diversão e pensar como as pessoas deste mundo."
      },
      {
        paragrafo: "16",
        pergunta: "Em seus últimos momentos na Terra, no que Jesus se concentrou?",
        textoBase: "Jesus tinha bem em mente o que era mais importante. Em seus últimos momentos de vida na Terra, ele se concentrou totalmente em continuar leal e fazer a vontade de Deus. Para conseguir fazer isso, ele orou intensamente. Já os seus discípulos não continuaram alertas. Eles estavam 'exaustos de tristeza' e caíram no sono. — Luc. 22:39-46; João 19:30.",
        resposta: "Jesus se concentrou totalmente em continuar leal e fazer a vontade de Deus. Ele orou intensamente. Já seus discípulos não continuaram alertas - estavam 'exaustos de tristeza' e caíram no sono."
      },
      {
        paragrafo: "17",
        pergunta: "Por que muitos usam redes sociais, mas qual pode ser o resultado? (Veja também a imagem.)",
        textoBase: "Assim como os discípulos de Jesus, de vez em quando podemos nos sentir emocionalmente esgotados. Além disso, os acontecimentos nestes últimos dias podem nos deixar ansiosos. Na tentativa de fugir dos problemas, muitos recorrem às redes sociais. Por exemplo, eles usam as redes para manter contato com parentes e amigos ao redor do mundo, compartilhar fotos e acessar uma infinidade de vídeos e jogos. Mas muitos ficam tão envolvidos em se atualizar com o que está acontecendo que acabam gastando tempo e energia demais com isso. Para não cairmos nessa armadilha, podemos nos perguntar: 'Depois que uso as redes sociais, me sinto melhor? Será que elas estão tirando o meu foco do que é realmente importante?'",
        resposta: "Quando nos sentimos esgotados ou ansiosos, muitos recorrem às redes sociais. Mas muitos ficam tão envolvidos que gastam tempo e energia demais. Pergunte-se: 'Depois de usar as redes sociais, me sinto melhor? Estão tirando meu foco do que é importante?'"
      },
      {
        paragrafo: "18",
        pergunta: "Por que precisamos ter bom senso ao escolher o que vemos na internet?",
        textoBase: "Ao assistir a filmes ou séries em plataformas de streaming, ver vídeos curtos em redes sociais ou jogar videogames, precisamos ter bom senso. Tudo isso pode ser divertido e até relaxante. Mas o bom senso vai nos ajudar a decidir o tipo e a quantidade de conteúdo que vamos consumir. Em alguns aplicativos, assim que terminamos de ver um vídeo, já aparece outro. Passar muito tempo nesses aplicativos pode acabar nos expondo a conteúdos violentos ou imorais. Foi isso que aconteceu com um irmão na Ásia. Ele começou a usar uma plataforma para ver trechos de filmes. À medida que foi assistindo aos trechos sugeridos pela plataforma, começaram a aparecer para ele cenas imorais. Com o tempo, ele passou a ver pornografia. Felizmente, com a ajuda dos anciãos e de amigos próximos, ele conseguiu deletar alguns aplicativos e limitar o tempo que gastava no celular. O que aconteceu com ele mostra por que precisamos de bom senso ao escolher o que fazemos no nosso tempo livre.",
        resposta: "Precisamos de bom senso ao decidir o tipo e quantidade de conteúdo que consumimos. Passar muito tempo em aplicativos pode nos expor a conteúdos violentos ou imorais. Um irmão começou vendo trechos de filmes e acabou vendo pornografia."
      },
      {
        paragrafo: "19",
        pergunta: "O que pode acontecer se a nossa prioridade for viajar e relaxar?",
        textoBase: "Nós também precisamos ter bom senso em relação a viagens e outras coisas que fazemos para relaxar. É verdade que todos nós precisamos sair da rotina de vez em quando — isso é bom e contribui para a nossa saúde. Mas se essas coisas forem a nossa prioridade, corremos o risco de perder o equilíbrio e não ter tempo para as coisas mais importantes. (Fil. 1:10) Cada um deve decidir por conta própria como vai gastar seu tempo. Mas ao tomar essa decisão, pense: 'Será que o tempo que passo viajando ou relaxando mostra que eu tenho bom senso? Estou dando prioridade ao que é realmente importante e me preparando para "o fim de todas as coisas"?'",
        resposta: "Todos precisamos sair da rotina às vezes. Mas se viagens e lazer forem nossa prioridade, podemos perder o equilíbrio e não ter tempo para as coisas mais importantes. Pergunte-se se está dando prioridade ao realmente importante."
      },
      {
        paragrafo: "20",
        pergunta: "Por que é bom tomar cuidado com as distrações?",
        textoBase: "É muito importante tomar cuidado com coisas que podem nos distrair da nossa rotina espiritual. (Isa. 48:17) Se fizermos isso, com a ajuda de Jeová, poderemos lidar cada vez melhor com os desafios. Os acontecimentos mundiais não vão nos abalar e a diversão não vai ocupar o primeiro lugar na nossa vida. Então, queremos nos esforçar para pensar como Jeová, continuar ocupados com as atividades espirituais e ter bem em mente o que é mais importante. Agindo assim, não ficaremos distraídos e vamos nos 'apegar firmemente à verdadeira vida'. — 1 Tim. 6:19.",
        resposta: "Com a ajuda de Jeová, poderemos lidar melhor com os desafios. Os acontecimentos mundiais não vão nos abalar e a diversão não vai ocupar o primeiro lugar. Vamos nos 'apegar firmemente à verdadeira vida'."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Por que aprender a pensar como Jeová nos ajuda a evitar distrações?",
        resposta: "Porque entendemos que ele quer que estejamos prontos para o fim deste sistema, não ansiosos e distraídos. Ele nos dá sabedoria e força para lidar com os desafios."
      },
      {
        pergunta: "Por que continuar ocupado com atividades espirituais é importante?",
        resposta: "Porque ficamos mais felizes satisfazendo nossa necessidade de adorar a Jeová. Conseguimos ter um ponto de vista equilibrado e não ficamos desesperados com os problemas do mundo."
      },
      {
        pergunta: "Por que ter bem em mente o que é mais importante nos ajuda?",
        resposta: "Porque nos ajuda a ter bom senso com o lazer, redes sociais e viagens, evitando gastar tempo demais com diversão e perdendo de vista as coisas espirituais."
      }
    ]
  },
  {
    id: 4,
    semana: "Semana 4",
    dataInicio: "25",
    dataFim: "31 de maio",
    canticoInicial: 135,
    canticoInicialTitulo: "Seja sábio, meu filho",
    canticoFinal: 42,
    canticoFinalTitulo: "Minha oração a Jeová",
    titulo: "Mostre perspicácia e você 'será bem-sucedido'",
    textoTema: "Quem mostra entendimento [perspicácia] num assunto será bem-sucedido.",
    textoTemaRef: "PRO. 16:20",
    objetivo: "Ver por que é bom parar e pensar antes de agir ao lidar com situações difíceis.",
    imagem: "/images/estudo-maio-semana4.jpg",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "O que é perspicácia, e como essa qualidade nos ajuda?",
        textoBase: "Você já teve a sensação de que não foi tratado com o respeito que merecia? Já se sentiu ofendido por alguém? Ou já enfrentou uma situação que deixou você com medo? Então você sabe como pode ser difícil reagir bem quando algo assim acontece. Para nos ajudar, a Bíblia fala de uma qualidade muito útil nessas e em muitas outras situações: a perspicácia. Perspicácia é a habilidade de analisar bem uma situação — de olhar além do óbvio. Essa qualidade nos permite entender por que alguma coisa pode ter acontecido ou por que uma pessoa talvez tenha agido de certa maneira. A perspicácia nos ajuda a agir com sabedoria e bom senso. Por exemplo, pode nos ajudar a saber quando 'ficar quietos' e a 'controlar a língua'. (Sal. 4:4; Pro. 10:19) Quando alguém nos ofende, a perspicácia pode nos ajudar a manter nossa raiva sob controle e deixar o assunto pra lá. Além disso, nos ajuda a aceitar conselho e correção. (Pro. 19:20) Mostrar perspicácia, além de agradar a Jeová, faz bem a nós mesmos e às pessoas que talvez sejam afetadas por nossas palavras e ações. Essa qualidade é ainda mais importante quando enfrentamos situações que mexem tanto com a gente que acabamos agindo sem pensar. Vamos analisar três exemplos da Bíblia que mostram como a perspicácia pode nos ajudar a continuar humildes, calmos e a confiar totalmente em Jeová.",
        resposta: "Perspicácia é a habilidade de analisar bem uma situação - olhar além do óbvio. Nos ajuda a agir com sabedoria, saber quando ficar quietos, manter a raiva sob controle e aceitar conselhos. Faz bem a nós e aos outros."
      },
      {
        paragrafo: "3",
        pergunta: "Quem era Naamã?",
        textoBase: "Para fazer o que é certo, precisamos ser humildes. (1 Ped. 5:5) A perspicácia pode nos ajudar a fazer isso. Como? Veja o exemplo de Naamã. Ele morava na Síria, uma nação que ficava ao norte de Israel. Naamã era um homem importante, o chefe do exército da Síria. Mas ele sofria de lepra, uma terrível doença de pele. — 2 Reis 5:1.",
        resposta: "Naamã morava na Síria e era um homem importante, chefe do exército. Mas ele sofria de lepra, uma terrível doença de pele."
      },
      {
        paragrafo: "4",
        pergunta: "Como Naamã mostrou que tinha alguma perspicácia?",
        textoBase: "A esposa de Naamã tinha uma serva que era uma menina israelita. Essa menina disse para ela que havia um profeta em Israel que poderia curar a doença do marido dela. (2 Reis 5:2, 3) Naamã podia ter pensado: 'Quem essa menina pensa que é pra me dizer o que fazer? Ela não passa de uma escrava!' Mas Naamã mostrou que tinha alguma perspicácia. Em vez de ser orgulhoso e ignorar o que aquela menina de uma nação inimiga tinha dito, ele foi humilde e levou a sério suas palavras. Ele contou tudo ao rei da Síria, que permitiu que ele fosse a Israel para ser curado. — 2 Reis 5:4, 5.",
        resposta: "A serva israelita disse que um profeta em Israel poderia curá-lo. Naamã podia ter ignorado a menina, mas mostrou perspicácia - foi humilde e levou a sério suas palavras. Contou tudo ao rei da Síria."
      },
      {
        paragrafo: "5",
        pergunta: "O que aconteceu quando Naamã chegou em Israel?",
        textoBase: "Naamã foi até o rei de Israel, Jeorão, esperando ser curado da sua lepra. Mas Jeorão pensou que Naamã tinha ido até lá porque o rei da Síria estava procurando briga com ele, pedindo algo que parecia impossível. Quando o profeta Eliseu ficou sabendo disso, ele pediu que o rei Jeorão enviasse Naamã até ele. (2 Reis 5:6-9) Mas as coisas não saíram como Naamã esperava. Eliseu nem sequer saiu de casa para receber Naamã ou para falar com ele. Em vez disso, Eliseu enviou um mensageiro para dizer a Naamã o que ele precisava fazer para ser curado. — 2 Reis 5:10.",
        resposta: "Jeorão pensou que era uma armadilha. Eliseu pediu que enviassem Naamã até ele, mas nem saiu de casa para recebê-lo. Enviou um mensageiro com instruções para a cura."
      },
      {
        paragrafo: "6",
        pergunta: "O que pode ter levado Naamã a agir com orgulho quando ouviu as instruções de Eliseu? Como os servos de Naamã mostraram perspicácia, e qual foi o resultado? (2 Reis 5:13, 14)",
        textoBase: "De início, Naamã não gostou nem um pouco de não ter sido recebido pelo profeta nem das instruções dadas pelo mensageiro. Ele 'ficou indignado' e 'foi embora furioso'. (2 Reis 5:11, 12) Por que ele agiu assim? Talvez ele tenha sentido que não foi tratado com o respeito que um oficial de destaque merecia. Ou pode ser que Naamã tenha pensado que as instruções que Eliseu deu mostravam desrespeito pela Síria. Qualquer que tenha sido o motivo, Naamã quis desistir de tudo e voltar para casa sem ser curado. Mas seus servos mostraram perspicácia quando raciocinaram com ele e pediram que ele pensasse melhor no assunto. Então, Naamã deixou o orgulho de lado e, com humildade, fez o que Eliseu havia falado. E o resultado é que ele foi curado! — Leia 2 Reis 5:13, 14.",
        resposta: "Naamã 'ficou indignado' e 'foi embora furioso' - talvez por não ter sido tratado com respeito. Mas seus servos raciocinaram com ele. Naamã deixou o orgulho de lado, fez o que Eliseu falou e foi curado!"
      },
      {
        paragrafo: "7",
        pergunta: "O que podemos aprender do que aconteceu com Naamã? (Provérbios 22:4) (Veja também as imagens.)",
        textoBase: "O que podemos aprender desse exemplo da Bíblia? Nós mostramos perspicácia quando olhamos além do óbvio, o que pode incluir olhar além das aparências. Também mostramos perspicácia quando não nos deixamos levar pelas nossas emoções. A perspicácia pode nos ajudar a ser humildes e a reconhecer que não sabemos de tudo. Talvez a gente precise da ajuda de outros, principalmente da ajuda de Jeová. Naamã ainda não era um servo de Jeová, mas ele mostrou que tinha alguma perspicácia porque foi humilde e deu ouvidos a outros. Ele ouviu a menina israelita que era serva da sua esposa, seus próprios servos e, acima de tudo, o representante de Jeová, Eliseu. Naamã não se concentrou no seu orgulho ferido. Por fim, ele tomou uma boa decisão e conseguiu ser curado. Então, antes de fazer ou dizer alguma coisa, precisamos parar e pensar um pouco. Por exemplo, talvez não concordemos com um conselho que alguém nos deu ou não entendamos muito bem uma orientação que recebemos da organização. Quando isso acontece, precisamos pensar em como vamos reagir e nos perguntar: 'Será que o que eu fizer ou disser vai mostrar orgulho ou humildade?' — Leia Provérbios 22:4.",
        resposta: "A perspicácia nos ajuda a olhar além do óbvio e das aparências, não nos deixar levar pelas emoções, ser humildes e reconhecer que precisamos de ajuda. Antes de fazer ou dizer algo, pergunte-se: 'Isso vai mostrar orgulho ou humildade?'"
      },
      {
        paragrafo: "8",
        pergunta: "Em que situações pode ser difícil manter a calma?",
        textoBase: "A perspicácia pode nos ajudar a continuar calmos e a não reagir com raiva quando enfrentamos situações frustrantes. É verdade que nem sempre é fácil fazer isso, principalmente quando alguém não é bondoso com a gente ou nos trata de maneira injusta. (Efé. 4:26 e nota de estudo 'Fiquem irados') Vamos ver como Davi e Abigail mostraram perspicácia quando estavam numa situação tensa.",
        resposta: "A perspicácia nos ajuda a continuar calmos quando enfrentamos situações frustrantes, principalmente quando alguém não é bondoso conosco ou nos trata de maneira injusta."
      },
      {
        paragrafo: "9",
        pergunta: "Como Davi foi tratado por Nabal?",
        textoBase: "Imagine a seguinte cena: Davi e seus homens estão vivendo como fugitivos no deserto de Parã. (1 Sam. 25:1) Enquanto estão lá, eles bondosamente protegem os pastores e os rebanhos de um homem rico chamado Nabal. (1 Sam. 25:15, 16) Quando chega a época da tosquia, Davi envia mensageiros a Nabal para pedir, de forma humilde e respeitosa, que Nabal dê a eles qualquer coisa que puder. (1 Sam. 25:6-8) Só que Nabal não mostra nem um pingo de gratidão por tudo o que Davi e seus homens tinham feito por ele. Nabal responde ao pedido de Davi de forma grosseira e até mesmo insulta Davi e seus homens. — 1 Sam. 25:10, 11.",
        resposta: "Davi e seus homens protegeram os pastores e rebanhos de Nabal no deserto. Quando Davi pediu ajuda respeitosamente, Nabal respondeu de forma grosseira e insultou Davi e seus homens, sem nenhuma gratidão."
      },
      {
        paragrafo: "10",
        pergunta: "Como Davi e Abigail mostraram perspicácia? (1 Samuel 25:32, 33) (Veja também a imagem.)",
        textoBase: "Se estivesse no lugar de Davi, como você teria se sentido? Não é difícil de entender por que Davi ficou com tanta raiva. Ele era um homem de fortes sentimentos e, naquela situação, ele chegou a ponto de querer matar Nabal! (1 Sam. 25:13, 21, 22) Davi já estava indo fazer isso quando a esposa de Nabal, Abigail, que era uma mulher sensata, chegou para falar com ele. De que maneira Abigail mostrou que tinha perspicácia? Ela percebeu que Davi era um homem bom, apesar de estar reagindo de maneira extrema. Então, ela fez o que pôde para ajudá-lo a controlar sua raiva e agir com sabedoria. Abigail levou um presente generoso para Davi e, com humildade, deu um conselho sábio para ele. (1 Sam. 25:18, 23-31) Já Davi mostrou perspicácia por prestar atenção ao que Abigail disse e por reconhecer que as palavras dela refletiam o ponto de vista de Jeová sobre o assunto. O resultado foi que Davi se acalmou e evitou um erro grave. — Leia 1 Samuel 25:32, 33.",
        resposta: "Davi queria matar Nabal de tanta raiva. Abigail percebeu que Davi era bom, apesar de estar reagindo de maneira extrema. Ela levou um presente e deu conselho sábio. Davi reconheceu que as palavras dela refletiam o ponto de vista de Jeová e se acalmou."
      },
      {
        paragrafo: "11",
        pergunta: "Como a perspicácia pode nos ajudar quando alguém faz algo contra nós? (Provérbios 19:11)",
        textoBase: "O que podemos aprender desse exemplo da Bíblia? A perspicácia pode nos ajudar a reagir de maneira calma, mesmo se tivermos motivos para ficar com raiva. Também pode nos ajudar a pensar nas consequências das nossas palavras e ações. (Leia Provérbios 19:11.) Quando Abigail lembrou a Davi de como as ações dele fariam Jeová se sentir, Davi conseguiu controlar a raiva. Se alguém ou alguma coisa tirar você dos sérios, pense bem antes de tomar qualquer decisão. (Tia. 1:19) Ore a Jeová e tire tempo para entender o ponto de vista dele sobre o assunto. É bem provável que isso ajude você a manter a calma.",
        resposta: "A perspicácia nos ajuda a reagir com calma e pensar nas consequências de nossas palavras e ações. Quando Abigail lembrou Davi de como Jeová se sentiria, ele controlou a raiva. Ore a Jeová e entenda o ponto de vista dele."
      },
      {
        paragrafo: "12",
        pergunta: "Como outros podem nos ajudar a mostrar perspicácia e manter a calma?",
        textoBase: "Assim como Jeová usou Abigail para ajudar Davi a ver o quadro completo, Jeová pode usar outros para nos ajudar a entender o que ele pensa sobre um assunto. Então, se alguma coisa deixar você com raiva ou frustrado, converse com um cristão maduro que ajude você a ver as coisas de maneira mais clara. (Pro. 12:15; 20:18) Por outro lado, se um dos seus amigos está chateado com alguma coisa, como você pode imitar Abigail? Será que você pode ajudar seu amigo a ver o assunto assim como Jeová vê? Com certeza, Jeová vai te abençoar para que você fale a coisa certa e ajude outros a ter mais perspicácia e a manter a calma.",
        resposta: "Jeová pode usar outros para nos ajudar a entender o ponto de vista dele. Converse com um cristão maduro. Se um amigo está chateado, ajude-o a ver o assunto como Jeová vê, imitando Abigail."
      },
      {
        paragrafo: "13",
        pergunta: "Como a perspicácia pode nos ajudar a ver além dos nossos medos?",
        textoBase: "Quando enfrentamos situações que podem nos deixar assustados, a perspicácia nos ajuda a ver além dos nossos medos. Nunca se esqueça de que qualquer coisa no mundo, por mais assustadora que seja, é insignificante perto do poder sem igual de Jeová. (Sal. 27:1) Jeová pode nos ajudar a enfrentar qualquer problema, até mesmo aqueles que parecem não ter solução. A vida do profeta Jonas foi um exemplo claro disso. Ele era um homem espiritual, mas precisava de mais perspicácia para cumprir uma designação difícil.",
        resposta: "A perspicácia nos ajuda a ver além dos nossos medos. Qualquer coisa no mundo é insignificante perto do poder de Jeová. Ele pode nos ajudar a enfrentar qualquer problema, até os que parecem não ter solução."
      },
      {
        paragrafo: "14",
        pergunta: "Por que Jonas ficou com medo de fazer o que Jeová ordenou a ele?",
        textoBase: "Jeová deu a Jonas uma designação desafiadora: ir a Nínive e proclamar uma mensagem de julgamento para quem vivia lá. (Jonas 1:1, 2) Como você se sentiria se tivesse recebido essa designação? Jonas precisaria fazer uma viagem difícil, de Israel até Nínive, que levaria cerca de um mês a pé. As pessoas naquela região eram conhecidas por ser agressivas e violentas. Nínive foi até chamada de 'cidade de derramamento de sangue'. (Naum 3:1, 7) Em vez de aceitar aquela designação, Jonas decidiu fugir. — Jonas 1:3.",
        resposta: "Jonas precisaria viajar um mês a pé até Nínive, uma 'cidade de derramamento de sangue' com pessoas agressivas e violentas. Em vez de aceitar a designação, Jonas decidiu fugir."
      },
      {
        paragrafo: "15",
        pergunta: "O que ajudou Jonas a confiar mais em Jeová? (Jonas 2:6-9)",
        textoBase: "Jonas estava fugindo quando Jeová o lembrou do Seu poder. Ele fez isso por salvar a vida de Jonas de uma maneira espetacular. (Jonas 1:15, 17) Jonas aprendeu a lição. Ele começou a enxergar além das dificuldades que talvez enfrentasse naquela designação tão assustadora para ele. Jonas começou a se concentrar no fato de que Jeová poderia protegê-lo de qualquer perigo. (Leia Jonas 2:6-9.) Daí, quando Jeová deu para Jonas uma segunda chance para cumprir com sua designação, Jonas não ficou com medo. Ele foi para Nínive, e as pessoas de lá o escutaram e foram salvas. — Jonas 3:5.",
        resposta: "Jeová salvou Jonas de maneira espetacular. Jonas aprendeu e começou a se concentrar no fato de que Jeová poderia protegê-lo. Quando recebeu uma segunda chance, Jonas foi a Nínive, as pessoas o escutaram e foram salvas."
      },
      {
        paragrafo: "16",
        pergunta: "O que pode nos ajudar quando enfrentamos uma situação que nos deixa com medo? (Provérbios 29:25) (Veja também as imagens.)",
        textoBase: "O que podemos aprender desse exemplo da Bíblia? Nós não queremos deixar que nada, principalmente o medo do homem, atrapalhe nossa adoração a Jeová. (Leia Provérbios 29:25.) A perspicácia ajudou Jonas a ver além dos desafios da sua designação e a se concentrar no apoio de Jeová. Da mesma forma, nós queremos olhar além dos nossos medos e meditar em como Jeová já nos ajudou e nos protegeu no passado. Também podemos meditar no exemplo de irmãos e irmãs que confiaram em Jeová e conseguiram enfrentar situações assustadoras ou cumprir designações desafiadoras. (Heb. 13:6) Queremos mostrar que temos perspicácia e sabedoria por confiar totalmente em Jeová e ajudar outras pessoas a fazer isso também.",
        resposta: "Não deixe o medo do homem atrapalhar sua adoração. A perspicácia ajudou Jonas a se concentrar no apoio de Jeová. Medite em como Jeová já nos ajudou e no exemplo de irmãos que confiaram nele em situações difíceis."
      },
      {
        paragrafo: "17",
        pergunta: "O que pode nos ajudar a ter mais perspicácia?",
        textoBase: "Como vimos, a perspicácia nos ajuda a lidar da maneira certa com situações desafiadoras. Como podemos ter mais perspicácia? Não há ninguém melhor do que Jeová para nos ajudar; ele é a Fonte da perspicácia. Ele nos dá perspicácia por meio da Bíblia e do espírito santo. (Nee. 9:20; Sal. 32:8) Jeová nos dá conselhos que nos ajudam a tomar boas decisões e a controlar nossas emoções. (Sal. 119:97-101) Quando meditamos no que a Bíblia diz e oramos a Jeová pedindo seu espírito santo, nós aumentamos nossa perspicácia. Assim, vamos conseguir enxergar uma situação da maneira que Jeová enxerga e fazer as coisas da maneira que ele quer. — Pro. 21:11, notas.",
        resposta: "Jeová é a Fonte da perspicácia. Ele nos dá perspicácia por meio da Bíblia e do espírito santo. Quando meditamos na Bíblia e oramos pedindo espírito santo, aumentamos nossa perspicácia e enxergamos as coisas como Jeová enxerga."
      },
      {
        paragrafo: "18",
        pergunta: "O que você está decidido a fazer?",
        textoBase: "Queremos continuar buscando e dando muito valor à perspicácia que Jeová nos dá. (Sal. 14:2) Fazendo isso, nós nunca vamos nos desviar do 'caminho da perspicácia'. (Pro. 21:16, nota) Pelo contrário, vamos estar mais determinados a mostrar perspicácia todo tempo e em qualquer situação. Assim, 'seremos bem-sucedidos' e deixaremos Jeová feliz.",
        resposta: "Queremos continuar buscando e valorizando a perspicácia que Jeová nos dá. Nunca vamos nos desviar do 'caminho da perspicácia'. Vamos mostrar perspicácia em qualquer situação, 'seremos bem-sucedidos' e deixaremos Jeová feliz."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Como podemos mostrar perspicácia igual a Naamã?",
        resposta: "Sendo humildes e dando ouvidos a outros, mesmo quando nosso orgulho é ferido. Reconhecendo que precisamos da ajuda de Jeová e de outros."
      },
      {
        pergunta: "Como podemos mostrar perspicácia igual a Davi e Abigail?",
        resposta: "Davi mostrou perspicácia ao reconhecer que as palavras de Abigail refletiam o ponto de vista de Jeová e controlar sua raiva. Abigail ajudou com sabedoria e humildade."
      },
      {
        pergunta: "Como podemos mostrar perspicácia igual a Jonas?",
        resposta: "Olhando além dos nossos medos e nos concentrando no apoio de Jeová. Confiando que ele pode nos proteger de qualquer perigo e nos ajudar a cumprir nossas designações."
      }
    ]
  },
  {
    id: 5,
    semana: "Semana 5",
    dataInicio: "1",
    dataFim: "7 de junho",
    canticoInicial: 111,
    canticoInicialTitulo: "Nossos motivos de alegria",
    canticoFinal: 124,
    canticoFinalTitulo: "Seja leal a Jeová",
    titulo: "Você pode ser feliz mesmo sendo odiado!",
    textoTema: "Felizes serão vocês sempre que os homens os odiarem.",
    textoTemaRef: "LUCAS 6:22",
    objetivo: "Entender por que podemos ser felizes mesmo sendo odiados por servir a Jeová.",
    imagem: "/images/estudo-maio-semana5.jpg",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "Que declaração surpreendente Jesus fez?",
        textoBase: "Em seu Sermão do Monte, Jesus disse: 'Felizes serão vocês sempre que os homens os odiarem.' (Luc. 6:22) As pessoas que ouviram essas palavras devem ter ficado surpresas. Afinal de contas, ninguém gosta de ser odiado. Mas por que Jesus disse isso? Essa é uma boa pergunta porque os seguidores de Jesus hoje são odiados por muitas pessoas. Neste estudo, vamos ver por que somos odiados e por que podemos ser felizes apesar disso.",
        resposta: "Jesus disse: 'Felizes serão vocês sempre que os homens os odiarem.' As pessoas devem ter ficado surpresas, pois ninguém gosta de ser odiado. Vamos entender por que somos odiados e por que podemos ser felizes apesar disso."
      },
      {
        paragrafo: "2-3",
        pergunta: "Qual é um dos motivos de sermos perseguidos? (João 16:2, 3) Como isso pode mudar nosso ponto de vista sobre aqueles que nos perseguem?",
        textoBase: "Somos odiados porque adoramos a Jeová. Falando sobre aqueles que perseguiriam e até matariam alguns de seus seguidores, Jesus disse: 'Não conhecem nem ao Pai nem a mim.' (Leia João 16:2, 3.) Quem é o verdadeiro culpado pela perseguição do povo de Deus? Satanás. Ele é 'o deus deste mundo'. (2 Cor. 4:3, 4) Ele cega as pessoas para que elas não conheçam a Jeová e as influencia para que elas persigam quem conhece e ama a Deus. (João 8:42-44) Por que saber disso pode mudar nossos sentimentos com respeito àqueles que nos perseguem? Quando entendemos que essas pessoas estão sendo enganadas por Satanás, isso nos ajuda a não ter ódio delas. Veja o exemplo do irmão Pavel, que mora num país onde a nossa obra é proibida. Por continuar servindo a Jeová fielmente, ele foi preso, cruelmente espancado e colocado numa solitária por meses. Hoje Pavel diz: 'Fica claro pra mim que é Satanás e os demônios que estão tentando impedir a adoração verdadeira. Pelo que eu vejo, a maioria das pessoas que trabalha na prisão não nos odeia. Elas estão apenas fazendo seu trabalho.' Um irmão da Croácia, que perseverou apesar da forte perseguição de seus pais, diz: 'Agora eu entendo que meu verdadeiro inimigo é Satanás, e não meus pais.' — Efé. 6:12.",
        resposta: "Somos odiados porque adoramos a Jeová. As pessoas não conhecem a Deus e são enganadas por Satanás. Quando entendemos isso, não temos ódio delas. Pavel disse: 'A maioria das pessoas na prisão não nos odeia. Estão apenas fazendo seu trabalho.'"
      },
      {
        paragrafo: "4",
        pergunta: "O que aprendemos dos exemplos de Jesus e de Estêvão? (Veja também a imagem.)",
        textoBase: "Nós não odiamos aqueles que nos perseguem. Na verdade, nós devemos até mesmo orar por eles. (Mat. 5:44) Veja o que podemos aprender do exemplo de Jesus e do discípulo Estêvão. Jesus tinha sido pregado na estaca de tortura por soldados romanos. Mas mesmo sofrendo, ele orou: 'Pai, perdoa-lhes.' (Luc. 23:34) Jesus estava pedindo que Jeová perdoasse os soldados que tinham recebido a ordem de matá-lo. Jesus também deve ter pensado na multidão que, por pura influência dos líderes religiosos, gritava exigindo sua morte. Ele percebeu que aquelas pessoas não tinham ideia do que estavam fazendo. Da mesma forma, enquanto estava sendo apedrejado, Estêvão pediu que Deus perdoasse seus assassinos. (Atos 7:58-60) Será que Jeová respondeu às orações de Jesus e de Estêvão? Sim. Muitos envolvidos no julgamento e na morte de Jesus mais tarde se arrependeram, exerceram fé em Jesus e se batizaram. (Atos 2:36-41) E pelo menos uma pessoa que aprovou o assassinato de Estêvão, Saulo de Tarso, se tornou cristão e se arrependeu muito das coisas horríveis que tinha feito por ignorância. — 1 Tim. 1:13.",
        resposta: "Jesus orou: 'Pai, perdoa-lhes' pelos que o mataram. Estêvão também pediu perdão para seus assassinos. Muitos se arrependeram depois, incluindo Saulo de Tarso. Devemos orar por aqueles que nos perseguem."
      },
      {
        paragrafo: "5",
        pergunta: "O que você aprendeu da experiência de César?",
        textoBase: "Hoje em dia, Jeová continua respondendo às orações que fazemos pelos que nos perseguem. Veja a experiência de César, que mora na Venezuela. Seu pai era um opositor violento. César conta: 'Minha mãe era tudo que uma esposa e uma mãe deveria ser. Mesmo sempre colocando o Reino em primeiro lugar, ela nunca deixou meu pai de lado. Ela ensinou a mim e aos meus irmãos a respeitar nosso pai e a sempre obedecer a ele, a não ser que ele pedisse algo que fosse errado para Jeová.' Com o passar dos anos, o pai dele deixou de ser tão duro. César conta: 'Um dia, depois de abrir meu coração a Jeová em oração, eu perguntei ao meu pai se ele queria estudar a Bíblia comigo. Eu não sei nem explicar a alegria que senti quando ele aceitou o estudo.' Com o tempo, o pai de César se batizou. É verdade que isso não acontece com todos que nos perseguem, mas alguns acabam mudando de atitude por observar nosso modo de agir e a forma respeitosa que falamos. Nós ficamos muito felizes quando isso acontece! Queremos muito ver como Jeová, o misericordioso 'Juiz de toda a terra', vai ajudar alguns que nos perseguiam a aprender sobre ele. — Gên. 18:25.",
        resposta: "César conta que sua mãe sempre respeitou o pai, mesmo ele sendo opositor. Com o tempo, o pai mudou e acabou se batizando. Alguns mudam de atitude ao observar nosso modo de agir e forma respeitosa de falar."
      },
      {
        paragrafo: "6",
        pergunta: "Como entender que somos odiados por causa do 'nome' de Jesus pode nos ajudar? (Marcos 13:13)",
        textoBase: "Somos odiados porque apoiamos Jesus. Jesus disse que os verdadeiros cristãos seriam odiados por todas as pessoas 'por causa do [seu] nome'. (Leia Marcos 13:13.) Mas o que o 'nome' de Jesus representa? Representa quem ele é e o direito que ele tem de ser o Rei do Reino de Deus. Nós somos odiados pelas pessoas que preferem confiar nos governantes humanos, em vez de confiar naquele que Jeová escolheu para governar o Universo, Jesus Cristo. Mas essa situação não vai durar muito tempo. Jesus já está governando como Rei do Reino de Deus desde 1914 e logo ele vai acabar com todos os governos que são contra sua autoridade.",
        resposta: "Somos odiados porque apoiamos Jesus como Rei do Reino de Deus. As pessoas preferem confiar nos governantes humanos. Mas em breve, todos que se opõem ao Reino serão forçados a reconhecer a autoridade de Cristo."
      },
      {
        paragrafo: "7-8",
        pergunta: "Qual é ainda outra razão de o povo de Jeová ser alvo de ódio? (João 15:18-20) (Veja também as imagens.)",
        textoBase: "Somos odiados porque rejeitamos o mundo de Satanás. Jesus explicou que seus seguidores seriam odiados porque 'não fazem parte do mundo'. (Leia João 15:18-20.) Assim como os primeiros cristãos, nós nos recusamos a ter o mesmo modo de pensar, agir e falar que o mundo de Satanás. Por causa disso, muitos irmãos e irmãs são maltratados no trabalho ou na escola. (1 Ped. 4:3, 4) Mas ficamos felizes quando um opositor muda de atitude e começa a nos respeitar. Veja a experiência de Ignacio, da América Central. Por anos, um de seus professores da escola fazia piada do estilo de vida que ele levava por servir a Jeová. Mas antes de Ignacio terminar a escola, aquele professor perguntou como ele conseguia seguir os princípios da Bíblia, mesmo num ambiente tão desafiador. Ignacio explicou que, para ele, as leis de Deus são uma proteção. Daí ele convidou o professor para assistir a uma reunião e, para a surpresa de Ignacio, o professor aceitou o convite! O professor ficou tão impressionado com a forma amorosa que foi tratado que continuou assistindo às reuniões. Depois, o próprio professor sofreu oposição porque estava estudando a Bíblia, mas continuou fazendo progresso e foi batizado.",
        resposta: "Somos odiados porque rejeitamos o mundo de Satanás. Nos recusamos a ter o mesmo modo de pensar que o mundo. Ignacio convidou seu professor opositor para uma reunião. O professor ficou impressionado e acabou se batizando."
      },
      {
        paragrafo: "9-10",
        pergunta: "Por qual outro motivo os cristãos são diferentes do mundo de Satanás? O que podemos aprender do exemplo do apóstolo Paulo?",
        textoBase: "Outra coisa que deixa claro que somos diferentes do mundo de Satanás é que não nos envolvemos na política ou nas guerras. (João 18:36) É verdade que nós seguimos o conselho em Romanos 13:1 e nos esforçamos para obedecer às leis do governo. Mas, como cristãos, não tomamos nenhum lado na política. Por isso, não nos candidatamos a cargos políticos e nem votamos em nenhum candidato. Por quê? Porque somos leais a Jeová e ao seu Reino, que tem Cristo como Rei. Muitas Testemunhas de Jeová são presas por causa da sua fé. Mesmo assim, esses irmãos e irmãs continuam pregando. Fazendo isso, eles imitam o exemplo do apóstolo Paulo, que passou anos em prisão domiciliar e na cadeia. (Atos 24:27; 28:16, 30) Mesmo assim, ele continuou compartilhando as boas novas com quem quer que o escutasse, incluindo guardas da prisão, oficiais da corte, governadores, reis e talvez até oficiais do imperador romano Nero. (Atos 9:15) Nossos irmãos que estão presos também pregam a quem quer que os escute, o que inclui juízes, oficiais do governo e guardas da prisão. Certo irmão passou mais de seis anos preso por não se envolver na política. Ele conta que não encarava esse tempo na prisão como uma punição, mas como uma designação de Jeová para encontrar pessoas sinceras. Imagine só que alegria ser usado por Jeová para alcançar essas pessoas com as boas novas! — Col. 4:3.",
        resposta: "Não nos envolvemos na política ou nas guerras. Somos leais a Jeová e ao seu Reino. Paulo continuou pregando mesmo preso. Nossos irmãos presos também pregam a juízes, guardas e outros, como uma designação de Jeová."
      },
      {
        paragrafo: "11",
        pergunta: "Como a perseguição pode fortalecer nossa fé? Dê um exemplo.",
        textoBase: "Nós sabemos que o ódio do mundo cumpre a profecia da Bíblia. Logo na primeira profecia registrada na Bíblia, Jeová deixou claro que Satanás e sua descendência — ou seja, aqueles que o seguem — odiariam aqueles que amam e servem a Jeová. (Gên. 3:15) Jesus várias vezes confirmou que essa profecia era verdadeira. E as palavras dele foram registradas nos quatro Evangelhos. (Mat. 10:22; Mar. 13:9-12; Luc. 6:22, 23; João 15:20) Outros escritores da Bíblia também falaram sobre isso. (2 Tim. 3:12; Tia. 1:2; 1 Ped. 4:12-14; Judas 3, 17-19) Então, quando somos perseguidos, nós não ficamos surpresos. Na verdade, ficamos felizes de ver que a profecia da Bíblia está se cumprindo. Isso nos dá a certeza de que estamos servindo ao Deus verdadeiro. Uma irmã que vive num país onde a nossa obra está restrita diz: 'Quando me dediquei a Jeová, eu sabia que uma hora ou outra eu enfrentaria perseguição. Então, os desafios nunca me pegaram de surpresa nem me deixaram com medo.' Entre os muitos opositores que essa irmã enfrentou, estava seu próprio marido. Ele a maltratava e até mesmo queimou a Bíblia e as publicações dela. Mas em vez de deixar o medo tomar conta, ela ficou com a fé ainda mais forte. (Heb. 10:39) Ela conclui: 'A Bíblia já dizia que a gente seria perseguido, então eu sabia que isso iria acontecer. Passar por isso me convenceu de que essa é a religião verdadeira.'",
        resposta: "O ódio do mundo cumpre a profecia bíblica. Quando somos perseguidos, ficamos felizes de ver a profecia se cumprindo. Uma irmã disse: 'A Bíblia já dizia que seríamos perseguidos. Passar por isso me convenceu de que essa é a religião verdadeira.'"
      },
      {
        paragrafo: "12",
        pergunta: "O que ajudou um irmão a suportar perseguição?",
        textoBase: "Apesar de saber que vamos ser perseguidos, pode ser difícil perseverar. Um irmão escreveu o seguinte sobre o tempo que ficou na prisão: 'Às vezes, eu me sentia deprimido ou preocupado, e só chorava.' O que ajudou esse irmão a perseverar? Ele disse: 'Eu já começava o dia orando. Ao longo do dia, quando uma coisa ruim acontecia, eu orava de novo. E quando alguma injustiça me deixava com raiva, eu me trancava no banheiro e fazia outra oração.' Além disso, nosso irmão meditava nos exemplos, tanto do passado quanto do presente, de pessoas que perseveraram apesar de perseguição. Isso o ajudou a não desistir e a sentir a paz que Jesus prometeu a seus seguidores. — João 14:27; 16:33.",
        resposta: "Um irmão disse que orava várias vezes por dia na prisão. Ele também meditava nos exemplos de pessoas que perseveraram. Isso o ajudou a não desistir e a sentir a paz que Jesus prometeu."
      },
      {
        paragrafo: "13-14",
        pergunta: "O que pode nos ajudar a vencer o ódio? O que ajudou Paulo a continuar fiel mesmo diante da morte?",
        textoBase: "Nosso amor é mais forte do que o ódio. Até dar seu último suspiro, Jesus amou seu Pai de todo o coração. Ele também amou seus amigos. (João 13:1; 15:13) Quando cultivamos esse mesmo amor, tanto por Jeová como pelos nossos irmãos, nós também conseguimos vencer o ódio. Como? Pouco antes de ser morto, Paulo escreveu para o seu querido amigo Timóteo: 'Deus não nos deu um espírito de covardia, mas de poder, de amor.' (2 Tim. 1:7) O que ele quis dizer? Paulo estava dizendo que o forte amor por Jeová pode ajudar um cristão a estar disposto a enfrentar situações muito difíceis. (2 Tim. 1:8) E realmente foi o amor que Paulo tinha por Jeová que o ajudou a continuar fiel e a enfrentar a morte com coragem. — Atos 20:22-24.",
        resposta: "Nosso amor é mais forte do que o ódio. Paulo disse que o forte amor por Jeová pode ajudar a enfrentar situações difíceis. Foi o amor por Jeová que o ajudou a continuar fiel e enfrentar a morte com coragem."
      },
      {
        paragrafo: "15",
        pergunta: "Como nossos irmãos hoje têm mostrado amor abnegado uns pelos outros? (Veja também a imagem.)",
        textoBase: "Nós com certeza amamos muito nossos queridos irmãos que continuam fiéis mesmo sofrendo perseguição. Alguns hoje estão dispostos a se arriscar para ajudar seus irmãos, assim como Áquila e Priscila arriscaram suas vidas para ajudar Paulo. (Rom. 16:3, 4) Por exemplo, na Rússia, muitos vão a tribunais para encorajar os irmãos que são presos. Quando uma irmã que tinha sido presa viu vários irmãos e irmãs no tribunal, ela ficou tão emocionada que não conseguia nem falar. O amor abnegado deles a fortaleceu num momento em que ela precisava muito. Somos muito felizes em saber que nosso amor é mais forte do que o ódio!",
        resposta: "Alguns se arriscam para ajudar irmãos, como Áquila e Priscila. Na Rússia, muitos vão a tribunais para encorajar os presos. Uma irmã ficou tão emocionada ao ver os irmãos no tribunal que não conseguia falar."
      },
      {
        paragrafo: "16",
        pergunta: "Por que o apóstolo Pedro disse que aqueles que são maltratados por servirem a Deus podem ser felizes? (1 Pedro 4:14)",
        textoBase: "Nós sabemos que Jeová fica feliz quando perseveramos apesar do ódio. (Leia 1 Pedro 4:14.) O apóstolo Pedro disse que aqueles que perseveram, mesmo quando são maltratados por servirem a Deus, têm um bom motivo para serem felizes. Mas por quê? Porque isso é uma prova de que o espírito de Deus 'está repousando sobre [nós]'. Pedro se sentia feliz por perseverar apesar de perseguição porque sabia que tinha a aprovação de Deus. Logo depois do Pentecostes do ano 33, os guardas do templo foram enviados para prender Pedro e outros apóstolos porque eles estavam pregando. Mas Pedro defendeu sua fé com coragem. (Atos 5:24-29) Mesmo depois de terem sido açoitados, Pedro e seus companheiros não pararam de pregar. Muito pelo contrário, eles ficaram felizes porque tinham sido 'considerados dignos de ser desonrados por causa do nome [de Jesus]'. Nós também podemos sentir essa mesma alegria quando perseveramos apesar de oposição. — Atos 5:40-42.",
        resposta: "Pedro disse que aqueles que perseveram têm um bom motivo para serem felizes, porque o espírito de Deus 'está repousando sobre eles'. Mesmo depois de açoitados, os apóstolos ficaram felizes por serem 'considerados dignos de ser desonrados por causa de Jesus'."
      },
      {
        paragrafo: "17",
        pergunta: "O que Jesus disse aos seus discípulos na noite antes de morrer?",
        textoBase: "Na noite antes da sua morte, Jesus disse aos seus discípulos: 'Quem me ama será amado pelo meu Pai, e eu o amarei.' (João 14:21) Estamos ansiosos para o dia em que as pessoas vão nos amar — e não nos odiar — por servir a Jeová! (2 Tes. 1:6-8) Até que esse dia chegue, podemos encontrar consolo e força por nos concentrar nas muitas razões que temos para ser felizes mesmo sendo odiados.",
        resposta: "Jesus disse: 'Quem me ama será amado pelo meu Pai.' Estamos ansiosos para o dia em que as pessoas vão nos amar por servir a Jeová. Até lá, podemos encontrar consolo nas muitas razões que temos para ser felizes mesmo sendo odiados."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Por que os seguidores de Jesus são odiados?",
        resposta: "Porque adoramos a Jeová e as pessoas são enganadas por Satanás. Porque apoiamos Jesus como Rei do Reino de Deus. E porque rejeitamos o mundo de Satanás e não nos envolvemos na política ou nas guerras."
      },
      {
        pergunta: "Em que sentido nosso amor é mais forte do que o ódio?",
        resposta: "O forte amor por Jeová nos ajuda a enfrentar situações difíceis. Muitos irmãos se arriscam para ajudar outros que estão sendo perseguidos, mostrando amor abnegado."
      },
      {
        pergunta: "Por que podemos ser felizes mesmo sendo odiados?",
        resposta: "Porque a perseguição cumpre a profecia bíblica, confirmando que estamos servindo ao Deus verdadeiro. Porque o espírito de Deus 'está repousando sobre nós'. E porque Jeová e Jesus nos amam."
      }
    ]
  }
]
