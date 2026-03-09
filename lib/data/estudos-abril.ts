// Dados dos estudos de Abril 2026 (fonte: PDF w_T_202602)

export interface Pergunta {
  paragrafo: string
  pergunta: string
  resposta: string
  textoBase?: string
  imagem?: string
  imagemDescricao?: string
  imagemLegenda?: string
}

export interface PerguntaRecapitulacao {
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
  recapitulacao: PerguntaRecapitulacao[]
}

export const estudosAbril: Estudo[] = [
  {
    id: 1,
    semana: "Semana 1",
    dataInicio: "6",
    dataFim: "12 de abril",
    canticoInicial: 82,
    canticoInicialTitulo: "'Deixe a luz brilhar'",
    canticoFinal: 60,
    canticoFinalTitulo: "A mensagem de vida",
    titulo: "Como podemos ajudar nossos parentes descrentes?",
    textoTema: "Não desistamos de fazer o que é bom.",
    textoTemaRef: "GÁL. 6:9",
    objetivo: "Aprender a manter um bom relacionamento com parentes que não servem a Jeová e ver como podemos ajudá-los em sentido espiritual, se possível.",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "O que talvez tenha prejudicado seu relacionamento com seus parentes quando você começou a estudar a Bíblia?",
        textoBase: "JESUS falou o seguinte para um homem que queria ser seu seguidor: 'Vá para casa, para seus parentes, e conte-lhes tudo o que Jeová fez por você.' (Mar. 5:19) Jesus disse isso porque sabia que a maioria das pessoas gosta de compartilhar boas notícias com parentes e amigos. Você se lembra de como se sentiu quando começou a estudar a Bíblia? Talvez tenha ficado tão empolgado que queria falar com todos os seus parentes sobre o que estava aprendendo. Mas pode ser que eles não tenham reagido muito bem. Ou talvez a forma como você falou da verdade tenha causado algum desentendimento entre vocês.",
        resposta: "Quando começamos a estudar a Bíblia, ficamos tão empolgados que queremos falar com todos os nossos parentes sobre o que estamos aprendendo. Mas pode ser que eles não tenham reagido bem, ou a forma como falamos da verdade tenha causado algum desentendimento."
      },
      {
        paragrafo: "3",
        pergunta: "O que vamos ver neste estudo?",
        textoBase: "Neste estudo, vamos ver quatro passos que podemos dar para termos um bom relacionamento com nossos parentes descrentes: (1) ter empatia, mesmo que eles não queiram aprender sobre Jeová; (2) ser sábios ao lidar com palavras e ações negativas; (3) ser pacientes e não perder a esperança; e (4) mostrar amor.",
        resposta: "Vamos ver quatro passos: (1) ter empatia, mesmo que eles não queiram aprender sobre Jeová; (2) ser sábios ao lidar com palavras e ações negativas; (3) ser pacientes e não perder a esperança; e (4) mostrar amor."
      },
      {
        paragrafo: "4",
        pergunta: "Como Jesus lidava com as pessoas que não mostravam interesse na mensagem dele?",
        textoBase: "Jesus não desistia rapidamente das pessoas que não davam atenção à mensagem dele. Numa ilustração, ele se comparou a um agricultor que usou vários métodos para fazer uma figueira dar frutos. (Luc. 13:6-9) Quando Jesus contou essa ilustração, já fazia mais de três anos que ele estava tentando ajudar os judeus a desenvolver fé. Por que Jesus continuou tentando? Porque ele tinha empatia pelas pessoas, e isso o ajudava a ser paciente com elas.",
        resposta: "Jesus não desistia rapidamente das pessoas. Ele se comparou a um agricultor que usou vários métodos para fazer uma figueira dar frutos. Jesus continuou tentando porque tinha empatia pelas pessoas, e isso o ajudava a ser paciente com elas."
      },
      {
        paragrafo: "5",
        pergunta: "Por que Jesus sentiu pena dos judeus?",
        textoBase: "Jesus sentiu pena dos judeus porque os líderes religiosos não os ajudavam a desenvolver verdadeira fé em Deus. Para ele, aqueles judeus eram 'como ovelhas sem pastor'. (Mar. 6:34) Pouco antes de morrer, Jesus até chorou por Jerusalém porque ele sabia que a maioria dos seus habitantes morreria por causa da falta de fé deles. (Luc. 19:41-44) Da mesma forma, se tivermos empatia e pensarmos em por que nossos parentes precisam aprender a verdade, vamos querer ajudá-los.",
        resposta: "Jesus sentiu pena dos judeus porque os líderes religiosos não os ajudavam a desenvolver verdadeira fé em Deus. Para ele, aqueles judeus eram 'como ovelhas sem pastor'. Da mesma forma, se tivermos empatia e pensarmos em por que nossos parentes precisam aprender a verdade, vamos querer ajudá-los."
      },
      {
        paragrafo: "6",
        pergunta: "Por que devemos ser pacientes com nossos parentes descrentes? (Gálatas 6:9)",
        textoBase: "Pode ser que nossos parentes ainda não tenham mostrado interesse no que acreditamos. Mesmo assim, devemos ser pacientes e não desistir de 'fazer o que é bom'. Todos nós sabemos que leva tempo para uma pessoa que tem opiniões fortes mudar a forma de pensar e desenvolver fé. Talvez, no passado, você também 'não tinha esperança e estava sem Deus no mundo'. (Efé. 2:12) Mas alguém foi paciente e o ajudou. Pensar nisso pode motivar você a, se possível, ajudar seus parentes a conhecer a Jeová.",
        resposta: "Devemos ser pacientes porque leva tempo para uma pessoa que tem opiniões fortes mudar a forma de pensar e desenvolver fé. No passado, talvez nós também estávamos 'sem Deus no mundo', mas alguém foi paciente e nos ajudou. Pensar nisso pode nos motivar a ajudar nossos parentes."
      },
      {
        paragrafo: "7",
        pergunta: "O que pode ter levado os irmãos de Jesus a não ter fé nele?",
        textoBase: "Os irmãos de Jesus provavelmente ficaram sabendo dos milagres que ele realizou na Galileia. (Luc. 4:14, 22-24) Mas no começo, eles não tiveram fé em Jesus. (João 7:5) Por quê? A Bíblia não diz. Mas ela fala de pelo menos duas coisas que impediram alguns judeus de se tornar seguidores de Jesus. Alguns tinham medo de ser rejeitados ou perseguidos pelas pessoas à sua volta. (João 9:18-22) Outros viram Jesus crescer e achavam difícil acreditar que aquele homem simples era o Filho de Deus. (Mar. 6:1-4) Pode ser que os irmãos de Jesus também pensassem assim.",
        resposta: "A Bíblia menciona duas coisas que impediram alguns judeus de se tornar seguidores de Jesus: alguns tinham medo de ser rejeitados ou perseguidos; outros viram Jesus crescer e achavam difícil acreditar que aquele homem simples era o Filho de Deus. Os irmãos de Jesus também podem ter pensado assim."
      },
      {
        paragrafo: "8",
        pergunta: "O que pode levar nossos parentes a falar e agir de modo negativo?",
        textoBase: "Pense no que está por trás das palavras e ações dos seus parentes. É possível que os irmãos de Jesus estivessem entre aqueles que disseram que ele tinha 'perdido o juízo'. (Mar. 3:21) Por que eles talvez pensassem assim? O contexto mostra que Jesus estava tão ocupado pregando e curando as pessoas que não tinha tempo nem mesmo para comer. (Mar. 3:20) Será que os parentes dele achavam que ele era um fanático? É possível. Nossos parentes também podem pensar que gastamos tempo demais com a nossa religião. Nesse caso, o melhor que podemos fazer é mostrar por ações que, na verdade, somos pessoas equilibradas.",
        resposta: "Nossos parentes podem pensar que gastamos tempo demais com a nossa religião, assim como os parentes de Jesus pensaram que ele tinha 'perdido o juízo'. O melhor que podemos fazer é mostrar por ações que somos pessoas equilibradas."
      },
      {
        paragrafo: "9",
        pergunta: "O que pode ajudar nossos parentes a mudar de opinião sobre as Testemunhas de Jeová? (1 Pedro 3:1, 2)",
        textoBase: "Continue sendo bondoso e equilibrado. Nossas palavras e ações bondosas podem fazer nossos parentes mudar de opinião sobre as Testemunhas de Jeová. É comum um marido descrente se sentir deixado de lado ou até irritado quando sua esposa vai para as reuniões ou para a pregação. Uma esposa cristã jamais vai querer que seu marido se sinta assim. Por isso, ela talvez decida ajustar suas atividades espirituais e, assim, passar mais tempo com ele. Por ser equilibrada e adaptável, ela talvez ajude seu marido a repensar a opinião dele sobre as Testemunhas de Jeová.",
        resposta: "Nossas palavras e ações bondosas podem fazer nossos parentes mudar de opinião sobre as Testemunhas de Jeová. Uma esposa cristã pode ajustar suas atividades espirituais para passar mais tempo com seu marido descrente, sendo equilibrada e adaptável.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_xl.jpg",
        imagemLegenda: "Palavras e ações bondosas podem mudar a opinião que um marido ou esposa descrente tem sobre as Testemunhas de Jeová",
        imagemDescricao: "Antes de ir pregar, uma irmã fica feliz de preparar algo para o marido comer."
      },
      {
        paragrafo: "10",
        pergunta: "Como podemos imitar Jesus quando somos criticados?",
        textoBase: "Não se sinta na obrigação de se defender sempre que for criticado. Quando alguns acusaram Jesus de comer e beber demais, ele não ficou se defendendo. Em vez disso, ele incentivou as pessoas a analisar os fatos. (Mat. 11:19) Ele também mostrou por ações que era equilibrado e gostava de aproveitar as coisas boas da vida. (Veja também João 2:2, 6-10.) Quando seus parentes criticarem você, não fique tentando provar que eles estão errados. Assim como Jesus, mostre por ações que você é uma pessoa equilibrada e feliz, e deixe que eles tirem suas próprias conclusões.",
        resposta: "Não se sinta na obrigação de se defender sempre que for criticado. Assim como Jesus, mostre por ações que você é uma pessoa equilibrada e feliz, e deixe que seus parentes tirem suas próprias conclusões. Seu bom exemplo pode ajudá-los a perceber que as coisas negativas que ouviram sobre nós não são verdade."
      },
      {
        paragrafo: "11",
        pergunta: "Como Jesus lidou com os irmãos dele?",
        textoBase: "Os Evangelhos mostram que Jesus era paciente com seus irmãos. Por exemplo, tudo indica que eles estavam presentes quando Jesus realizou o seu primeiro milagre em Caná. (João 2:11, 12) Mesmo assim, os irmãos de Jesus não tiveram fé nele. Mas Jesus não se afastou deles. E a Bíblia mostra que, uns três anos depois do milagre em Caná, Jesus continuava sendo bondoso com seus irmãos. — João 7:5-8.",
        resposta: "Jesus era paciente com seus irmãos. Mesmo quando eles não tiveram fé nele após o milagre em Caná, Jesus não se afastou deles. A Bíblia mostra que, uns três anos depois, Jesus continuava sendo bondoso com seus irmãos."
      },
      {
        paragrafo: "12",
        pergunta: "O que pode nos ajudar a não perder a esperança de que alguns dos nossos parentes vão servir a Jeová?",
        textoBase: "Nós sabemos que Jeová é muito misericordioso. Lembrar disso pode nos ajudar a não perder a esperança de que um dia alguns dos nossos parentes vão se achegar a ele. Quando a religião falsa for destruída, nossos parentes talvez lembrem que falamos que isso ia acontecer. (Apo. 17:16) Pode até ser que eles decidam servir a Jeová junto com a gente depois que a grande tribulação começar. Até lá, dê todo o apoio que puder aos seus parentes quando eles passarem por dificuldades. Ao sentir que são amados de verdade, talvez eles aceitem melhor os ensinos da Bíblia.",
        resposta: "Lembrar que Jeová é muito misericordioso pode nos ajudar a não perder a esperança. Quando a religião falsa for destruída, nossos parentes talvez lembrem que falamos que isso ia acontecer. Dê todo o apoio que puder aos seus parentes quando eles passarem por dificuldades."
      },
      {
        paragrafo: "13",
        pergunta: "Que impressão não queremos dar aos nossos parentes?",
        textoBase: "É verdade que estamos bem ocupados no nosso serviço a Jeová. Mas não queremos dar aos nossos parentes a impressão de que não temos tempo para eles ou que não os amamos mais. (Mat. 7:12) Como podemos mostrar que nos importamos com eles? Vamos ver algumas maneiras.",
        resposta: "Não queremos dar aos nossos parentes a impressão de que não temos tempo para eles ou que não os amamos mais, mesmo estando bem ocupados no serviço a Jeová."
      },
      {
        paragrafo: "14-15",
        pergunta: "Como podemos mostrar que amamos nossos parentes que não são cristãos? Dê um exemplo.",
        textoBase: "Mantenha contato e mostre seu amor por eles. Uma forma de mostrar que amamos nossos parentes é sempre contar para eles como estamos. Algo que podemos fazer é mandar uma mensagem junto com algumas fotos que tiramos numa festinha com os amigos ou numa viagem. Um presente simples ou uma cartinha podem ser o suficiente para melhorar nosso relacionamento com eles. Quando fazemos todo o possível para ser bondosos com nossos parentes, eles conseguem sentir nosso amor.",
        resposta: "Mantenha contato e mostre seu amor por eles. Podemos mandar mensagens com fotos, dar presentes simples ou escrever cartinhas. Quando fazemos todo o possível para ser bondosos com nossos parentes, eles conseguem sentir nosso amor."
      },
      {
        paragrafo: "16",
        pergunta: "Como Jesus mostrou que se importava com seu irmão Tiago?",
        textoBase: "Depois de ser ressuscitado, Jesus fez questão de aparecer para o seu irmão Tiago e conversar com ele. (1 Cor. 15:7) Consegue imaginar como Tiago se sentiu quando percebeu que Jesus não tinha desistido dele? Provavelmente, foi nessa ocasião que Tiago se convenceu de que Jesus era o Messias. Depois disso, Tiago talvez tenha ajudado outros membros da família a chegar à mesma conclusão. — Atos 1:14.",
        resposta: "Depois de ser ressuscitado, Jesus fez questão de aparecer para o seu irmão Tiago e conversar com ele. Provavelmente, foi nessa ocasião que Tiago se convenceu de que Jesus era o Messias. Depois disso, Tiago talvez tenha ajudado outros membros da família a chegar à mesma conclusão."
      },
      {
        paragrafo: "17",
        pergunta: "Como podemos colocar em prática o que diz Romanos 12:15?",
        textoBase: "Quando ficamos do lado dos nossos parentes nos momentos mais importantes, tanto nos bons como nos ruins, podemos ajudá-los a ter um ponto de vista diferente sobre nós. Por exemplo, quando um parente vai ter um filho, podemos dar os parabéns e também um presente para mostrar que estamos felizes por ele. Quando nossos parentes perdem alguém na morte, podemos falar algo ou escrever uma mensagem para consolá-los e também dar alguma ajuda prática. É claro que não devemos nos esquecer de ligar, mandar uma mensagem ou visitá-los, principalmente quando eles estiverem enfrentando uma situação difícil.",
        resposta: "Quando ficamos do lado dos nossos parentes nos momentos mais importantes, tanto nos bons como nos ruins, podemos ajudá-los a ter um ponto de vista diferente sobre nós. Devemos dar os parabéns, presentes, consolar e dar ajuda prática quando necessário.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_03_xl.jpg",
        imagemLegenda: "Ficar do lado dos seus parentes quando eles mais precisam pode mudar o que eles pensam sobre você e suas crenças",
        imagemDescricao: "A mesma irmã tira um tempo para visitar a sogra, que não é Testemunha de Jeová."
      },
      {
        paragrafo: "18",
        pergunta: "Como podemos imitar André?",
        textoBase: "Apresente alguns irmãos para os seus parentes. Logo que entendeu que Jesus era o Messias, André o apresentou para seu irmão Pedro. (João 1:40-42) Será que você pode fazer algo parecido? Por exemplo, o que acha de convidar um parente para assistir a uma reunião ou para sair com seus amigos? À medida que nossos parentes conhecerem outras Testemunhas de Jeová, eles vão perceber que somos pessoas normais e que só queremos fazer o bem.",
        resposta: "Podemos imitar André apresentando irmãos para nossos parentes. Podemos convidar um parente para assistir a uma reunião ou para sair com nossos amigos. À medida que nossos parentes conhecerem outras Testemunhas, eles vão perceber que somos pessoas normais."
      },
      {
        paragrafo: "19",
        pergunta: "Mesmo que nossos parentes não entendam nossas crenças, como devemos tratá-los? (1 Pedro 3:15)",
        textoBase: "Nossos parentes podem até não entender por que não fazemos certas coisas, mas eles sempre vão lembrar que os tratamos com bondade e respeito. Já que não passamos tempo com eles em algumas celebrações e feriados, eles vão ficar felizes se compensarmos esse tempo em outro momento. Por exemplo, podemos visitá-los, convidá-los para um almoço e dar presentes para eles em outras ocasiões.",
        resposta: "Mesmo que nossos parentes não entendam por que não fazemos certas coisas, eles sempre vão lembrar que os tratamos com bondade e respeito. Podemos visitá-los, convidá-los para um almoço e dar presentes em outras ocasiões para compensar o tempo."
      },
      {
        paragrafo: "20",
        pergunta: "Por que o exemplo de Tiago nos anima?",
        textoBase: "Tiago não seguiu a Jesus durante o ministério dele na Terra. Mas com o tempo, ele se tornou um discípulo e passou a dar muito valor às coisas que Jesus tinha ensinado. (Gál. 1:18, 19; 2:9) Por exemplo, ele escreveu uma carta aos cristãos que contém muitas lições parecidas com as que Jesus ensinou no Sermão do Monte.",
        resposta: "Tiago não seguiu a Jesus durante o ministério dele na Terra, mas com o tempo, ele se tornou um discípulo e passou a dar muito valor às coisas que Jesus tinha ensinado. Ele escreveu uma carta aos cristãos que contém muitas lições parecidas com as que Jesus ensinou no Sermão do Monte."
      },
      {
        paragrafo: "21",
        pergunta: "Por que não devemos desistir dos nossos parentes descrentes?",
        textoBase: "Mesmo nos esforçando bastante, pode ser que nossos parentes continuem com uma atitude negativa ou não queiram aprender sobre Jeová. Mas por que não devemos desistir deles? Porque cada vez que somos bondosos, estamos imitando o nosso Deus misericordioso, Jeová, e seu Filho, Jesus. (Luc. 6:33, 36) Com o tempo, nossa atitude amorosa pode levar nossos parentes a mudar de opinião sobre as Testemunhas de Jeová. Pode até ser que eles se lembrem de alguns ensinos da Bíblia que compartilhamos com eles no passado. Se não desistirmos de nossos parentes, poderemos ter a alegria de ver alguns deles se juntar a nós para servir a Jeová!",
        resposta: "Porque cada vez que somos bondosos, estamos imitando o nosso Deus misericordioso, Jeová, e seu Filho, Jesus. Com o tempo, nossa atitude amorosa pode levar nossos parentes a mudar de opinião. Se não desistirmos deles, poderemos ter a alegria de ver alguns se juntar a nós para servir a Jeová!"
      }
    ],
    recapitulacao: [
      {
        pergunta: "Por que devemos ter empatia pelos nossos parentes descrentes?",
        resposta: "Porque ter empatia e pensar em por que eles precisam aprender a verdade vai nos ajudar a querer ajudá-los. Jesus sentiu pena das pessoas porque os líderes religiosos não as ajudavam a desenvolver verdadeira fé em Deus."
      },
      {
        pergunta: "Por que precisamos ser pacientes e não perder a esperança?",
        resposta: "Porque leva tempo para uma pessoa que tem opiniões fortes mudar a forma de pensar e desenvolver fé. Jeová é muito misericordioso, e nossos parentes podem decidir servir a ele até mesmo depois que a grande tribulação começar."
      },
      {
        pergunta: "Como podemos mostrar que amamos nossos parentes descrentes?",
        resposta: "Mantendo contato, mandando mensagens e fotos, dando presentes, ficando do lado deles nos momentos importantes (bons e ruins), apresentando nossos amigos a eles, e tratando-os sempre com bondade e respeito."
      }
    ]
  },
  {
    id: 2,
    semana: "Semana 2",
    dataInicio: "13",
    dataFim: "19 de abril",
    canticoInicial: 52,
    canticoInicialTitulo: "Nossa dedicação",
    canticoFinal: 161,
    canticoFinalTitulo: "Fazer tua vontade é o meu prazer",
    titulo: "O significado e a importância do batismo",
    textoTema: "'Façam discípulos, batizando-os.'",
    textoTemaRef: "MAT. 28:19",
    objetivo: "Entender por que o batismo é importante e o que está envolvido em se batizar.",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "O que mostra que o batismo é um ensino bíblico muito importante?",
        textoBase: "QUANDO alguém se batiza, nós ficamos muito felizes! Sabia que os primeiros cristãos também se sentiram assim? Logo na primeira reunião da congregação cristã, no Pentecostes do ano 33, eles viram muitas pessoas sendo batizadas. Nessa ocasião, o apóstolo Pedro fez um discurso explicando por que é importante se batizar. (Atos 2:38, 40, 41) Mais tarde, o apóstolo Paulo escreveu que 'o ensinamento sobre batismos' faz parte da 'doutrina básica a respeito do Cristo'. (Heb. 6:1, 2) Então, o batismo é um dos principais ensinos bíblicos, e nós precisamos entender bem seu significado.",
        resposta: "O apóstolo Paulo escreveu que 'o ensinamento sobre batismos' faz parte da 'doutrina básica a respeito do Cristo'. (Heb. 6:1, 2) No Pentecostes do ano 33, Pedro fez um discurso explicando a importância do batismo, e muitas pessoas foram batizadas."
      },
      {
        paragrafo: "2",
        pergunta: "Por que precisamos entender bem o significado do batismo?",
        textoBase: "Assim como um alicerce firme pode ajudar uma casa a se manter de pé, um entendimento completo do significado e da importância do batismo pode nos ajudar a ter uma fé forte. Não importa se ainda somos estudantes da Bíblia ou se já somos batizados há muitos anos, todos nós precisamos entender esses pontos.",
        resposta: "Assim como um alicerce firme pode ajudar uma casa a se manter de pé, um entendimento completo do significado e da importância do batismo pode nos ajudar a ter uma fé forte."
      },
      {
        paragrafo: "3",
        pergunta: "O que o batismo mostra?",
        textoBase: "O batismo mostra a todos que você aceitou a verdade sobre Jeová Deus e Jesus Cristo, se arrependeu dos seus pecados e fez mudanças na vida para servir a Jeová. Ele também simboliza que você entendeu que Deus usa Jesus para nos salvar do pecado e da morte. Além disso, o batismo mostra que você se dedicou a Jeová, ou seja, que fez uma oração prometendo que serviria a ele junto com a organização dele. A dedicação e o batismo são o início de uma jornada com Jeová que pode durar para sempre.",
        resposta: "O batismo mostra que você aceitou a verdade sobre Jeová e Jesus, se arrependeu dos pecados, fez mudanças na vida, entendeu que Deus usa Jesus para nos salvar, e se dedicou a Jeová prometendo servi-lo junto com sua organização."
      },
      {
        paragrafo: "4",
        pergunta: "Qual é o significado de ser totalmente imerso na água?",
        textoBase: "No batismo, uma pessoa é totalmente imersa na água e depois levantada. É como se ela fosse enterrada e daí ressuscitada. (Veja também Colossenses 2:12.) O batismo simboliza as mudanças profundas que você fez em sua vida. Como assim? Quando você é imerso na água, você mostra que colocou um ponto final no seu modo de vida anterior. Quando é levantado, você começa uma vida nova, focada em fazer a vontade de Deus.",
        resposta: "A imersão total simboliza ser 'enterrado' - colocar um ponto final no modo de vida anterior. Ser levantado simboliza 'ressuscitar' - começar uma vida nova, focada em fazer a vontade de Deus.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_05_xl.jpg",
        imagemLegenda: "Ao se batizar, você coloca um ponto final no seu modo de vida anterior e começa uma vida nova, focada em fazer a vontade de Deus",
        imagemDescricao: "Uma pessoa sendo batizada por imersão total na água."
      },
      {
        paragrafo: "5",
        pergunta: "Por que podemos dizer que o esforço para chegar ao batismo se parece com o esforço feito na construção da arca? (1 Pedro 3:18-21)",
        textoBase: "De certa forma, podemos comparar o esforço que alguém faz para se preparar para o batismo com o esforço que Noé fez para construir a arca. Se você começou a estudar a Bíblia há pouco tempo, pode parecer difícil demais fazer todas as mudanças necessárias para chegar ao batismo. Você talvez ache que é tão difícil quanto foi para Noé construir a arca. Será que é mesmo preciso fazer tanto esforço? Com certeza, assim como foi para Noé! O próprio Deus projetou a arca, e para sobreviver ao Dilúvio, Noé teve que seguir de perto as instruções que tinha recebido. Com fé e com a ajuda de Jeová, Noé foi obediente e construiu a arca. Ele 'fez tudo que Deus lhe havia mandado', e você pode fazer o mesmo. — Gên. 6:22.",
        resposta: "Assim como Noé teve que seguir de perto as instruções de Deus e fazer grande esforço para construir a arca, nós precisamos nos esforçar para fazer as mudanças necessárias para o batismo. Com fé e com a ajuda de Jeová, podemos fazer 'tudo que Deus nos manda'."
      },
      {
        paragrafo: "6",
        pergunta: "Em que sentido o batismo salva você?",
        textoBase: "No versículo 21, o apóstolo Pedro escreveu: 'O batismo... salva vocês.' É claro que o simples fato de ser imerso na água não traz salvação nem purifica você dos seus pecados. Isso é algo que apenas o sangue de Jesus pode fazer. (1 João 1:7) Mesmo assim, ser batizado é muito importante porque Jeová diz que você deve fazer isso. O batismo é uma forma de pedir 'uma boa consciência a Deus'. E Jeová vai ficar feliz de atender esse pedido, perdoando seus pecados com base no sacrifício de Jesus. É assim que o batismo salva — ele torna possível que você tenha vida eterna.",
        resposta: "O batismo salva no sentido de que é uma forma de pedir 'uma boa consciência a Deus'. Jeová vai atender esse pedido, perdoando seus pecados com base no sacrifício de Jesus. Isso torna possível que você tenha vida eterna."
      },
      {
        paragrafo: "7",
        pergunta: "Como o batismo deve ser feito?",
        textoBase: "Como vimos, a imersão total em água é um requisito. Fora isso, a Bíblia não dá muitos detalhes de como o batismo deve ser feito. Mas ela traz vários princípios que mostram como agir nessa ocasião. Por exemplo, ela nos ajuda a saber como os que vão se batizar devem se vestir e como os que estão presentes devem se comportar. (1 Cor. 14:40; 1 Tim. 2:9) Geralmente, quem faz a imersão é um ancião, mas nós não damos destaque para quem recebe esse privilégio. (1 Cor. 1:14, 15) E para Jeová, o batismo é válido não importa se o número de pessoas presentes é grande ou pequeno. — Atos 8:36.",
        resposta: "A imersão total em água é um requisito. Os que vão se batizar devem se vestir de forma apropriada. Geralmente um ancião faz a imersão, mas não se dá destaque a isso. O batismo é válido independente do número de pessoas presentes."
      },
      {
        paragrafo: "8",
        pergunta: "De acordo com a Bíblia, o que devemos fazer? E para isso, que perguntas são feitas aos que vão se batizar? (Atos 2:38-42)",
        textoBase: "A Bíblia mostra que devemos fazer uma 'declaração pública visando a salvação', ou seja, devemos expressar nossa fé. (Rom. 10:9, 10) E fazer isso no dia do nosso batismo é bem apropriado porque o batismo é um passo muito importante para a nossa salvação. É por isso que são feitas duas perguntas para aqueles que vão se batizar. A primeira é: 'Você se arrependeu dos seus pecados, dedicou sua vida a Jeová e aceitou que o meio de salvação escolhido por Jeová é Jesus Cristo?' Essa pergunta nos lembra do discurso que Pedro fez lá no Pentecostes, e o objetivo dela é saber o que a pessoa já fez para chegar ao batismo. A segunda pergunta é: 'Você entende que, ao se batizar, você se torna Testemunha de Jeová e passa a fazer parte da organização de Jeová?' O foco dessa pergunta é o que a pessoa vai fazer. Ela promete seguir as orientações da organização de Jeová e servir a ele junto com seus irmãos e irmãs.",
        resposta: "A primeira pergunta é sobre o que a pessoa já fez (arrependimento, dedicação, aceitar Jesus como meio de salvação). A segunda é sobre o que ela vai fazer (se tornar Testemunha de Jeová e fazer parte da organização). Aqueles que respondem 'sim' de coração podem ser batizados.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_07_xl.jpg",
        imagemLegenda: "No seu batismo, você faz uma 'declaração pública visando a salvação'",
        imagemDescricao: "Em uma assembleia, os que vão se batizar ficam em pé para fazer uma declaração pública da sua fé."
      },
      {
        paragrafo: "9",
        pergunta: "Que passos todos nós devemos dar para agradar a Deus?",
        textoBase: "Pode ser que, mesmo antes de aprender a verdade, você fosse uma pessoa boa e não tenha cometido nenhum pecado sério. Ou pode ser que você tenha sido criado por pais cristãos que o ajudaram a amar a Jeová. Será que mesmo assim você precisa se arrepender e ser batizado para agradar a Deus? Sim, não importa como era a nossa vida, todos nós devemos reconhecer que herdamos o pecado e que isso nos impede de ser amigos de Deus. (Sal. 51:5) Daí, à medida que conhecemos a Jeová, precisamos colocar a vontade dele à frente da nossa. Temos que nos arrepender do nosso modo de vida anterior e dar meia-volta, passando a viver de um modo que agrada ao nosso Pai celestial. Assim, podemos ser batizados. — Atos 3:19.",
        resposta: "Todos nós devemos reconhecer que herdamos o pecado e isso nos impede de ser amigos de Deus. Precisamos colocar a vontade de Jeová à frente da nossa, nos arrepender do modo de vida anterior e passar a viver de um modo que agrada a Deus."
      },
      {
        paragrafo: "10",
        pergunta: "O que você precisa fazer mesmo que já tenha se batizado quando fazia parte de outra religião?",
        textoBase: "Talvez no passado, quando fazia parte de outra religião, você já tenha se batizado. Mesmo assim, você precisa se batizar como Testemunha de Jeová. Por quê? Porque, naquela época, você não entendia claramente as verdades sobre Jeová Deus e Jesus. E mesmo que tenha feito uma oração se dedicando a Deus, sua promessa não se baseou no entendimento correto da vontade dele. Em Éfeso, o apóstolo Paulo conheceu alguns homens que já tinham se batizado, mas sem ter o entendimento necessário dos ensinos cristãos. Por isso, aqueles homens precisaram se batizar de novo. (Atos 19:1-5) Hoje também Jeová só aprova o batismo de uma pessoa quando ela tem um conhecimento exato da vontade dele.",
        resposta: "Você precisa se batizar como Testemunha de Jeová porque, quando fazia parte de outra religião, você não entendia claramente as verdades sobre Jeová e Jesus. Assim como os homens em Éfeso, é preciso se batizar de novo com o conhecimento exato da vontade de Deus."
      },
      {
        paragrafo: "11",
        pergunta: "O que significa ser batizado 'em nome do Pai, e do Filho, e do espírito santo'? (Mateus 28:18-20)",
        textoBase: "Jesus disse que os novos discípulos deviam ser batizados 'em nome do Pai, e do Filho, e do espírito santo'. O que ele quis dizer com isso? Na Bíblia, a palavra para 'nome' geralmente se refere à reputação de alguém. Também pode se referir ao papel e à autoridade que certo nome representa. Então, quando somos batizados em nome de Jeová e de Jesus, nós reconhecemos que eles têm a autoridade e o direito de nos dizer o que fazer. E quando somos batizados em nome do espírito santo, reconhecemos o papel que ele desempenha em nos orientar.",
        resposta: "Significa reconhecer a autoridade de Jeová e de Jesus de nos dizer o que fazer, e reconhecer o papel do espírito santo em nos orientar. A palavra 'nome' se refere à reputação, papel e autoridade."
      },
      {
        paragrafo: "12",
        pergunta: "O que está envolvido em se batizar em nome do Pai? (Apocalipse 4:11)",
        textoBase: "Em nome do Pai. Nós estamos convencidos de que Jeová é o nosso Pai celestial, aquele que nos deu a vida. Ele é o Deus Todo-Poderoso e o Criador de todas as coisas. Nós reconhecemos que ele ouve nossas orações e usamos o nome dele ao orar e ao falar com outros sobre ele. (Sal. 65:2) Só que ser batizado em nome do Pai envolve algo mais. Aqueles que ouviram Pedro no Pentecostes já conheciam a Jeová. Mas dali em diante, eles precisavam reconhecer Jeová como aquele que dá vida eterna por meio de Jesus Cristo. E nós também devemos reconhecer isso. — Rom. 5:8.",
        resposta: "Reconhecemos que Jeová é nosso Pai celestial, o Deus Todo-Poderoso e Criador de todas as coisas. Usamos seu nome ao orar e ao falar com outros. Também reconhecemos que ele dá vida eterna por meio de Jesus Cristo.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_09_xl.jpg",
        imagemLegenda: "Depois do batismo, continue reconhecendo a autoridade do Pai e do Filho, e também o papel do espírito santo",
        imagemDescricao: "Pessoas de diferentes idades e nacionalidades, ilustrando o reconhecimento do Pai, do Filho e do espírito santo."
      },
      {
        paragrafo: "13",
        pergunta: "O que está envolvido em se batizar em nome do Filho?",
        textoBase: "Em nome do Filho. Nós estamos convencidos de que Jesus é o Filho unigênito de Deus. Ele é 'o caminho', ou seja, é só com a ajuda dele que podemos ser amigos de Jeová. (João 14:6) Jesus também é nosso Resgatador. Ele morreu por nós para podermos ganhar a vida. Saber disso nos motiva a seguir o seu exemplo todos os dias, não apenas quando nos batizamos. (1 João 2:6) Assim como Jesus, nós pregamos com zelo e não deixamos nada nos impedir de fazer isso. (Luc. 4:43) Estamos dispostos até mesmo a enfrentar perseguição para servir a Deus lealmente. (2 Tim. 3:12) Nós também respeitamos Jesus como 'cabeça da congregação'. (Efé. 5:23) Por isso, ficamos felizes de seguir as orientações daqueles que ele designa para exercer a liderança na congregação e para cuidar dos seus seguidores. — Efé. 4:8, 11, 12.",
        resposta: "Reconhecemos que Jesus é o Filho unigênito de Deus, 'o caminho' para ser amigos de Jeová, nosso Resgatador. Seguimos seu exemplo, pregamos com zelo, enfrentamos perseguição se necessário, e respeitamos Jesus como 'cabeça da congregação'."
      },
      {
        paragrafo: "14",
        pergunta: "(a) O que está envolvido em se batizar em nome do espírito santo? (b) Que outros batismos existem para os ungidos?",
        textoBase: "Em nome do espírito santo. Nós reconhecemos a verdade sobre o espírito santo. Sabemos que ele não é uma pessoa nem faz parte de uma Trindade, mas é a força ativa de Deus. Entendemos que o espírito santo guiou os profetas e os escritores da Bíblia. Por isso, lemos regularmente a Palavra de Deus e seguimos o que ela ensina. (2 Ped. 1:20, 21) E nós fazemos de tudo para não cometer pecados graves, porque sabemos que isso poderia impedir a nós e até mesmo a congregação de receber espírito santo. — Efé. 4:30.",
        resposta: "Reconhecemos que o espírito santo é a força ativa de Deus, não uma pessoa nem parte de uma Trindade. Ele guiou os profetas e escritores da Bíblia. Lemos regularmente a Palavra de Deus e evitamos pecados graves para não impedir o recebimento do espírito santo."
      },
      {
        paragrafo: "15",
        pergunta: "O que devemos estar determinados a fazer?",
        textoBase: "Se você já é batizado, esteja determinado a entender bem o 'ensinamento sobre batismos' e a viver de acordo com a promessa que fez para Jeová quando se dedicou e se batizou. Mas se você ainda não é batizado? Será que algo está te impedindo? O próximo estudo vai falar sobre como você pode continuar se esforçando para chegar ao batismo.",
        resposta: "Se já é batizado, esteja determinado a entender bem o 'ensinamento sobre batismos' e viver de acordo com a promessa que fez a Jeová. Se ainda não é batizado, continue se esforçando para chegar ao batismo."
      }
    ],
    recapitulacao: [
      {
        pergunta: "O que significa ser imerso na água durante o batismo?",
        resposta: "Significa colocar um ponto final no modo de vida anterior (ser 'enterrado') e começar uma vida nova, focada em fazer a vontade de Deus (ser 'levantado')."
      },
      {
        pergunta: "Que perguntas são feitas aos que vão se batizar, e por quê?",
        resposta: "Duas perguntas: a primeira sobre o que a pessoa já fez (arrependimento, dedicação, aceitar Jesus); a segunda sobre o que ela vai fazer (se tornar Testemunha de Jeová e fazer parte da organização). Isso é uma 'declaração pública visando a salvação'."
      },
      {
        pergunta: "O que significa ser batizado 'em nome do Pai, e do Filho, e do espírito santo'?",
        resposta: "Significa reconhecer a autoridade de Jeová como Pai celestial e Criador, de Jesus como o caminho para Deus e nosso Resgatador, e o papel do espírito santo como força ativa de Deus que nos orienta."
      }
    ]
  },
  {
    id: 3,
    semana: "Semana 3",
    dataInicio: "20",
    dataFim: "26 de abril",
    canticoInicial: 49,
    canticoInicialTitulo: "Como alegrar a Jeová",
    canticoFinal: 38,
    canticoFinalTitulo: "Jeová vai te dar força",
    titulo: "Continue se esforçando para se batizar",
    textoTema: "Agora é o tempo especialmente aceitável.",
    textoTemaRef: "2 COR. 6:2",
    objetivo: "Entender que agora é a hora de desenvolver uma amizade forte com Jeová e se batizar.",
    perguntas: [
      {
        paragrafo: "1",
        pergunta: "(a) Por que se batizar é uma ótima decisão? (b) O que vamos ver neste estudo?",
        textoBase: "VOCÊ já se dedicou a Jeová e se batizou em água? Se já, você pediu a Deus uma consciência limpa. (1 Ped. 3:21) Ao fazer isso, você deixou um bom exemplo para os mais jovens e também para os que estão se achegando agora à congregação. Essa foi uma ótima decisão! Mas se você ainda não é batizado? É claro que você ama a Jeová e quer fazer a vontade dele. Você sabe que o batismo é essencial para que seus pecados sejam perdoados e você possa ganhar a aprovação de Jeová. (Atos 2:38-40) Mas algo pode estar te impedindo de dar esse passo. Para ajudá-lo, neste estudo vamos ver (1) por que alguns ficam adiando o batismo, (2) por que é sábio ter bem em mente que o fim está próximo e (3) por que é importante fazer as mudanças necessárias para se batizar o quanto antes.",
        resposta: "Se batizar é uma ótima decisão porque você pede a Deus uma consciência limpa. Neste estudo vamos ver: (1) por que alguns ficam adiando o batismo, (2) por que é sábio ter em mente que o fim está próximo e (3) por que é importante fazer as mudanças necessárias o quanto antes."
      },
      {
        paragrafo: "2",
        pergunta: "Por que algumas pessoas demoram para tomar a decisão de se batizar?",
        textoBase: "Algumas pessoas demoram para tomar a decisão de se batizar por medo. Por exemplo, alguns até querem servir a Jeová, mas têm medo de que nunca vão ser bons o suficiente para agradar a ele. Se você se sente assim, leia textos da Bíblia que o ajudem a ter certeza que Jeová não espera perfeição e que ele fica feliz quando você dá o seu melhor para ele. (Sal. 103:13, 14; Col. 3:23) Se você tem medo de sofrer perseguição, peça a ajuda de Jeová para ter a mesma confiança do salmista que escreveu: 'Jeová está do meu lado; não terei medo. O que me pode fazer o homem?' — Sal. 118:6.",
        resposta: "Algumas pessoas têm medo de não ser boas o suficiente para agradar a Deus, ou medo de sofrer perseguição. A Bíblia mostra que Jeová não espera perfeição e fica feliz quando damos o nosso melhor. Podemos ter a mesma confiança do salmista: 'Jeová está do meu lado'."
      },
      {
        paragrafo: "3",
        pergunta: "Que maneira de pensar pode impedir alguns de se batizar?",
        textoBase: "Alguns que amam a Jeová ficam adiando o batismo porque acham que não têm conhecimento suficiente. Mas quanto conhecimento uma pessoa precisa ter para se batizar? Veja um exemplo da Bíblia. Depois que um terremoto atingiu a prisão onde Silas e o apóstolo Paulo estavam presos, eles deram testemunho para o carcereiro da prisão e para a família dele. Aquele homem e sua família provavelmente entenderam que o terremoto tinha sido um milagre de Deus. Além disso, naquela noite eles aprenderam ensinos importantes sobre Jeová e Jesus. Isso foi o suficiente para eles serem 'batizados sem demora'. (Atos 16:25-33) Se você conhece a Jeová, o ama de todo o coração, aprendeu os ensinos básicos da Bíblia, se arrependeu dos seus pecados e está decidido a viver de acordo com os padrões de Jeová, então você está preparado para se batizar. — Mar. 12:30.",
        resposta: "Alguns acham que não têm conhecimento suficiente, mas o exemplo do carcereiro de Filipos mostra que, se você conhece a Jeová, o ama, aprendeu os ensinos básicos da Bíblia, se arrependeu e está decidido a viver de acordo com os padrões de Jeová, você está preparado.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_11_xl.jpg",
        imagemLegenda: "Paulo e Silas pregam para o carcereiro e para a família dele, que são 'batizados sem demora'",
        imagemDescricao: "Paulo e Silas pregando para o carcereiro da prisão e sua família, que depois foram batizados sem demora."
      },
      {
        paragrafo: "4",
        pergunta: "Que outra coisa pode impedir alguns de se batizar?",
        textoBase: "Alguns que querem agradar a Deus ficam pensando no preço que vão ter que pagar por essa decisão. É claro que, antes de tomar uma decisão, é importante sentar e calcular o custo. (Luc. 14:27-30) Mas alguns se preocupam demais com os sacrifícios que vão ter que fazer para servir a Deus. Candace, que teve contato com a verdade desde pequena, se sentiu assim quando começou a estudar a Bíblia já adulta. Ela disse: 'Eu sabia o que devia fazer para alegrar a Jeová, mas ficava em cima do muro porque eu gostava das coisas do mundo. E eu sabia que ia ser muito difícil abrir mão daquelas coisas.' Outros se preocupam com os elevados padrões de moral que aqueles que se batizam precisam seguir. Eles têm medo de cometer um pecado grave depois do batismo e ser removidos da congregação.",
        resposta: "Alguns ficam pensando no preço que vão ter que pagar - os sacrifícios para servir a Deus ou os elevados padrões de moral. Alguns têm medo de cometer um pecado grave depois do batismo.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_13_xl.jpg",
        imagemLegenda: "Alguns que querem agradar a Deus ficam pensando nos sacrifícios que vão ter que fazer para servir a ele",
        imagemDescricao: "Uma pessoa pensativa, considerando os sacrifícios necessários para servir a Deus."
      },
      {
        paragrafo: "5",
        pergunta: "No que devemos pensar ao decidir se vamos ou não nos batizar? (Mateus 13:44-46)",
        textoBase: "Quando queremos comprar alguma coisa, nós olhamos não apenas para o preço, mas também para os benefícios que vamos ter. Se o que vamos ganhar supera o que vamos pagar, entendemos que compensa fazer essa compra. Da mesma forma, ao decidir se vamos ou não nos batizar, devemos pensar não apenas no quanto essa decisão vai nos custar, mas em como nossa amizade com Jeová é preciosa. Para nos ensinar esse ponto, Jesus contou duas ilustrações. Em cada uma delas, um homem encontra algo de grande valor e fica feliz de vender tudo o que tem para poder comprar o que encontrou. Você também encontrou algo de grande valor: a verdade sobre o Reino. Se você fica na dúvida se vale a pena viver de acordo com a verdade, tire tempo para meditar nessas ilustrações de Jesus.",
        resposta: "Devemos pensar não apenas no custo, mas em como nossa amizade com Jeová é preciosa. Assim como os homens das ilustrações de Jesus que venderam tudo para comprar algo de grande valor, a verdade sobre o Reino vale muito mais do que qualquer coisa que deixamos para trás."
      },
      {
        paragrafo: "6",
        pergunta: "Como podemos desenvolver um bom coração?",
        textoBase: "Na ilustração do semeador, Jesus mostrou que o coração de uma pessoa pode impedi-la de fazer progresso espiritual. Mas ele também explicou que alguns ouviriam a mensagem do Reino 'com um coração sincero e bom' e agiriam de acordo com ela. (Luc. 8:5-15) Se você acha que o seu coração está dividido, não desista! Com a ajuda de Jeová, você pode 'desenvolver um novo coração', pronto para obedecer. Ore pedindo que Jeová o ajude a amolecer o solo do seu coração para que as verdades do Reino possam florescer. — Eze. 18:31; 36:26.",
        resposta: "Se você acha que seu coração está dividido, não desista! Com a ajuda de Jeová, você pode 'desenvolver um novo coração', pronto para obedecer. Ore pedindo que Jeová ajude a amolecer o solo do seu coração para que as verdades do Reino possam florescer."
      },
      {
        paragrafo: "7-8",
        pergunta: "Por que alguns jovens acabam não se batizando?",
        textoBase: "Alguns jovens que amam a Jeová acabam não chegando ao batismo por causa da influência de outros. Por exemplo, os professores talvez aconselhem os alunos a ter a 'mente aberta' com respeito a diferentes estilos de vida, mesmo que isso signifique desobedecer os padrões de Jeová. Mas esse conselho pode trazer terríveis consequências. (Sal. 1:1, 2; Pro. 7:1-5) Você pode evitar esse perigo seguindo o exemplo do salmista que disse a Jeová: 'Tenho mais perspicácia do que todos os meus mestres, porque medito nas tuas advertências.' — Sal. 119:99. Temos recebido relatórios que mostram que alguns pais ficam adiando o batismo dos filhos. Eles se concentram demais nos estudos e no tipo de emprego que os filhos vão ter, ou simplesmente não ajudam seus filhos a ter alvos espirituais.",
        resposta: "Alguns são influenciados por professores que aconselham ter 'mente aberta' sobre estilos de vida que desobedecem os padrões de Jeová. Outros têm pais que adiam o batismo dos filhos, concentrando-se demais nos estudos e no emprego.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_15_xl.jpg",
        imagemLegenda: "Converse com seus pais sobre o seu desejo de se batizar",
        imagemDescricao: "Um jovem conversando com seus pais sobre o desejo de se batizar."
      },
      {
        paragrafo: "9",
        pergunta: "Por que alguns demoram para se batizar?",
        textoBase: "Alguns que já estão preparados para o batismo acabam demorando para dar esse passo porque querem esperar para se batizar no mesmo dia que um amigo ou alguém da família. É claro que não tem nada de errado em querer se batizar junto com alguém que você ama. Mas será que isso deveria mesmo impedir você de se batizar agora? Lembre que a sua dedicação a Deus é uma promessa pessoal. O seu batismo não deve depender das ações de outra pessoa. — Rom. 14:12.",
        resposta: "Alguns querem esperar para se batizar no mesmo dia que um amigo ou familiar. Mas a dedicação a Deus é uma promessa pessoal. O batismo não deve depender das ações de outra pessoa."
      },
      {
        paragrafo: "10",
        pergunta: "O que mais pode levar alguns a ficar adiando o batismo?",
        textoBase: "Além das razões que já vimos até aqui, alguns talvez fiquem adiando o batismo porque acham que o fim ainda vai demorar para chegar. Mas será que é sábio pensar assim? Jesus alertou seus discípulos: 'Mantenham-se prontos, porque o Filho do Homem virá numa hora que vocês não acham provável.' — Luc. 12:40.",
        resposta: "Alguns acham que o fim ainda vai demorar para chegar. Mas Jesus alertou seus discípulos para se manterem prontos, porque o Filho do Homem virá numa hora que não acham provável."
      },
      {
        paragrafo: "11",
        pergunta: "De acordo com o Salmo 119:60, como nos sentimos em relação aos mandamentos de Jeová?",
        textoBase: "Nossa motivação para nos dedicar a Jeová deve ser o amor que sentimos por ele. Quanto mais conhecemos nosso amoroso Deus, mais amamos os seus mandamentos e nos sentimos motivados a obedecê-los o quanto antes. O discípulo Tiago destacou outra razão importante para obedecermos os mandamentos de Jeová sem demora: Ninguém sabe o que vai acontecer amanhã. Pode ser que não tenhamos nem mesmo mais um dia para 'fazer o que é certo'. (Tia. 4:13-17) Então, a hora de fazer o que sabemos que é certo é agora!",
        resposta: "O amor que sentimos por Jeová nos motiva a obedecer seus mandamentos o quanto antes. Ninguém sabe o que vai acontecer amanhã. A hora de fazer o que sabemos que é certo é agora!"
      },
      {
        paragrafo: "12",
        pergunta: "Que lição aprendemos da ilustração sobre os trabalhadores de um vinhedo?",
        textoBase: "Mas você talvez fique pensando na ilustração que Jesus contou sobre os trabalhadores de um vinhedo. Ele ensinou que alguns trabalharam apenas uma hora e, ainda assim, receberam o mesmo pagamento dos que trabalharam o dia todo. Mas veja por que aqueles homens não começaram a trabalhar antes. Eles disseram: 'Porque ninguém nos contratou.' Aqueles homens não estavam fugindo do trabalho; eles simplesmente não tinham sido contratados. Assim que foram chamados, eles começaram a trabalhar. (Mat. 20:1-16) Hoje, Jesus nos convida para ser seus discípulos e participar no trabalho de pregação. Nós devemos aceitar esse convite o mais rápido possível!",
        resposta: "Os trabalhadores que chegaram tarde disseram que 'ninguém os contratou' - eles não estavam fugindo do trabalho. Assim que foram chamados, começaram a trabalhar. Da mesma forma, devemos aceitar o convite de Jesus o mais rápido possível."
      },
      {
        paragrafo: "13",
        pergunta: "O que podemos aprender da mulher de Ló?",
        textoBase: "Alguns demoram para fazer mudanças porque acham que terão tempo de fazer isso antes de o fim chegar. Mas a verdade é que quanto mais você esperar, mais difícil vai ser fazer mudanças para agradar a Deus. Sabendo disso, Jesus alertou seus discípulos: 'Lembrem-se da mulher de Ló.' (Luc. 17:31-35) Ela estava bem ciente de que o julgamento de Deus contra Sodoma e Gomorra estava próximo. Mas parece que ela não conseguiu se desapegar totalmente das coisas que tinha deixado para trás. (Gên. 19:23-26) Esse exemplo nos lembra de que a porta para a salvação não vai ficar aberta para sempre. Na hora certa, Jeová vai fechar essa porta e trancá-la de forma definitiva. — Luc. 13:24, 25.",
        resposta: "Quanto mais você esperar, mais difícil vai ser fazer mudanças. A mulher de Ló não conseguiu se desapegar totalmente das coisas que tinha deixado para trás. A porta para a salvação não vai ficar aberta para sempre."
      },
      {
        paragrafo: "14",
        pergunta: "Por que você deve prestar atenção ao cumprimento das profecias sobre o fim?",
        textoBase: "A cada dia que passa, os acontecimentos mundiais deixam claro que as profecias da Bíblia sobre o fim deste sistema estão se cumprindo. Pode ser que você ainda não esteja sendo diretamente afetado por esses eventos. Mas ver o que está acontecendo num lugar após outro deve motivar você a progredir para se batizar o quanto antes.",
        resposta: "Os acontecimentos mundiais deixam claro que as profecias sobre o fim estão se cumprindo. Mesmo que você não seja diretamente afetado, ver isso deve motivá-lo a progredir para se batizar o quanto antes."
      },
      {
        paragrafo: "15",
        pergunta: "Como podemos ter bem em mente o dia de Jeová? (2 Pedro 3:10-13)",
        textoBase: "Na sua segunda carta, Pedro explicou como podemos nos preparar para o dia de Jeová que se aproxima. Para os cristãos da época de Pedro, esse dia ainda ia demorar muito para chegar. Mesmo assim, Pedro falou que eles deviam 'ter bem em mente' ou 'desejar ansiosamente' o dia de Jeová. E nós podemos fazer isso por sempre nos lembrar de que o fim está próximo e nos preparar para ele, 'sendo pessoas de conduta santa e praticando atos de devoção a Deus'. Jeová fica feliz quando fazemos coisas que agradam a ele. E ele vai ficar ainda mais feliz de ver você se dedicar e se batizar.",
        resposta: "Podemos ter bem em mente o dia de Jeová por sempre nos lembrar de que o fim está próximo e nos preparar para ele, 'sendo pessoas de conduta santa e praticando atos de devoção a Deus'. Jeová fica feliz quando nos dedicamos e nos batizamos."
      },
      {
        paragrafo: "16",
        pergunta: "Qual é a melhor hora para progredir até o batismo? (2 Coríntios 6:1, 2)",
        textoBase: "A melhor hora de fazer as mudanças necessárias para se batizar é agora. O eunuco etíope para quem Filipe pregou reconheceu como era importante agir rapidamente. Assim que ele entendeu as boas novas e teve a oportunidade de ser batizado, ele não ficou pensando: 'Antes de me batizar, acho melhor eu aprender um pouco mais. A gente vai passar por outro lugar com água ao longo da estrada.' Em vez disso, ele perguntou a Filipe: 'O que me impede de ser batizado?' (Atos 8:26, 27, 35-39) Ele é um excelente exemplo para nós! Depois que se batizou, o eunuco 'seguiu caminho cheio de alegria'.",
        resposta: "A melhor hora é agora! O eunuco etíope, assim que entendeu as boas novas, perguntou: 'O que me impede de ser batizado?' Ele não ficou adiando. Depois que se batizou, ele 'seguiu caminho cheio de alegria'.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_17_xl.jpg",
        imagemLegenda: "O exemplo do eunuco etíope nos ensina uma lição importante: A melhor hora de progredir e se batizar é agora!",
        imagemDescricao: "Assim como o eunuco etíope falou para Filipe que queria se batizar, uma estudante da Bíblia vai até os anciãos e fala que quer se batizar."
      },
      {
        paragrafo: "17",
        pergunta: "Como Jeová vai ajudar você?",
        textoBase: "Você talvez esteja adiando o batismo, mas pode ter certeza de que Jeová quer dar todo o apoio que você precisa para ter uma amizade forte com ele. (Rom. 2:4) Ele pode ajudá-lo a superar algumas coisas que talvez estejam impedindo o seu progresso, como medos, preocupações e a influência de outros. Quando se batizar, você vai ter uma consciência limpa e é provável que perceba que as 'coisas atrás' não têm mais valor para você. (Fil. 3:8, 13) Você vai poder se concentrar nas 'coisas à frente', ou seja, nas bênçãos que Jeová promete para os que dedicam sua vida a ele e são batizados. — Atos 3:19.",
        resposta: "Jeová quer dar todo o apoio que você precisa. Ele pode ajudá-lo a superar medos, preocupações e a influência de outros. Quando se batizar, você vai ter uma consciência limpa e vai poder se concentrar nas bênçãos que Jeová promete."
      }
    ],
    recapitulacao: [
      {
        pergunta: "Por que alguns demoram para se batizar?",
        resposta: "Alguns têm medo de não ser bons o suficiente, acham que não têm conhecimento suficiente, se preocupam com os sacrifícios, são influenciados por outros, ou acham que o fim ainda vai demorar."
      },
      {
        pergunta: "Por que não é sábio ficar adiando o batismo?",
        resposta: "Porque ninguém sabe o que vai acontecer amanhã. O fim está próximo e quanto mais esperamos, mais difícil fica fazer mudanças. A porta para a salvação não vai ficar aberta para sempre."
      },
      {
        pergunta: "Qual é a melhor hora para progredir até o batismo?",
        resposta: "Agora! O exemplo do eunuco etíope mostra que, assim que entendemos as boas novas e temos a oportunidade, devemos agir. Depois do batismo, teremos uma consciência limpa e poderemos nos concentrar nas bênçãos que Jeová promete."
      }
    ]
  },
  {
    id: 4,
    semana: "Semana 4",
    dataInicio: "27 de abril",
    dataFim: "3 de maio",
    canticoInicial: 99,
    canticoInicialTitulo: "Muitos irmãos ao meu lado",
    canticoFinal: 154,
    canticoFinalTitulo: "Eterno amor",
    titulo: "Como se preparar para desafios que podem surgir depois do batismo?",
    textoTema: "Que os meus passos permaneçam nos teus caminhos.",
    textoTemaRef: "SAL. 17:5",
    objetivo: "Ver como os que se batizaram há pouco tempo podem se preparar para os desafios que talvez enfrentem.",
    perguntas: [
      {
        paragrafo: "1-2",
        pergunta: "Como podemos nos preparar para os desafios que talvez enfrentemos depois do batismo? Ilustre.",
        textoBase: "NÓS sabemos que vamos enfrentar dificuldades no mundo de Satanás. Tanto é que Jesus avisou os seus discípulos: 'É inevitável que venham as pedras de tropeço.' (Mat. 18:7) Então, precisamos nos preparar para enfrentar desafios, o que pode incluir ter problemas com algum irmão. Pense na seguinte ilustração: o povo de Jeová tem sido incentivado a se preparar para desastres naturais. Como fazemos isso? Primeiro, tentamos descobrir quais desastres podem acontecer onde moramos. É ainda mais importante fazer isso quando somos novos na região. Depois, nós precisamos planejar o que fazer para estarmos preparados para cada um desses desastres. (Pro. 21:5) Da mesma forma, é bom pensar em quais desafios podemos enfrentar como servos de Jeová para que, quando esses desafios chegarem, nós estejamos preparados.",
        resposta: "Assim como nos preparamos para desastres naturais descobrindo quais podem acontecer e planejando o que fazer, devemos pensar em quais desafios podemos enfrentar como servos de Jeová para estarmos preparados quando chegarem."
      },
      {
        paragrafo: "3",
        pergunta: "Qual é um desafio que podemos enfrentar depois do batismo?",
        textoBase: "Você se lembra de como se sentiu quando foi pela primeira vez em uma reunião e viu o amor entre o povo de Jeová? Ver esse amor provavelmente convenceu você de que tinha encontrado a verdade. (João 13:35; Col. 3:12) Foi isso que aconteceu com Carmen. Mas depois que se batizou, ela enfrentou algo que não imaginava. Ela conta: 'Uma irmã me tratou muito mal. Eu também via que ela falava coisas negativas de outros irmãos. Eu não imaginava que isso pudesse acontecer. Eu tinha aprendido que as Testemunhas de Jeová se esforçavam para ser pacíficas e demonstrar amor.' É verdade que os irmãos e as irmãs se esforçam para imitar as qualidades de Jeová. Mas eles não são perfeitos. (Efé. 4:23, 24; 1 João 1:8) Então, uma hora ou outra, pode ser que algum irmão diga ou faça algo que magoe você. (Tia. 3:8) Infelizmente, alguns deixaram de servir a Jeová por causa disso.",
        resposta: "Um irmão ou irmã pode nos ofender ou magoar. Embora os irmãos se esforcem para imitar as qualidades de Jeová, eles não são perfeitos. Infelizmente, alguns deixaram de servir a Jeová por causa disso."
      },
      {
        paragrafo: "4",
        pergunta: "Como podemos nos preparar para quando um irmão nos magoar ou ofender? (Efésios 4:32)",
        textoBase: "Como você pode se preparar desde já para quando um irmão magoar ou ofender você? Tenha por alvo seguir o conselho de Efésios 4:32. Se você fizer o seu melhor para ser bondoso e mostrar compaixão, você vai evitar ter problemas desnecessários com os outros. Também, esteja decidido a ser rápido em perdoar quando alguém fizer algo que deixe você chateado. O que pode ajudar você a fazer isso? Pense em quantas vezes você pede perdão para Jeová pelos seus erros e ele sempre te perdoa. (Mat. 6:12) Meditar em como Jeová é generoso ao perdoar você vai tornar mais fácil para você perdoar os outros.",
        resposta: "Tenha por alvo ser bondoso e mostrar compaixão para evitar problemas desnecessários. Esteja decidido a ser rápido em perdoar. Meditar em como Jeová é generoso ao nos perdoar vai tornar mais fácil perdoar os outros."
      },
      {
        paragrafo: "5",
        pergunta: "Que princípio bíblico pode nos ajudar quando alguém nos ofende? (Provérbios 19:11)",
        textoBase: "A Bíblia diz que a perspicácia nos ajuda a ter paciência quando alguém nos ofende. Esse princípio bíblico ajudou Yasmin, que se batizou alguns anos atrás. Ela diz: 'Quando eu vejo irmãos e irmãs agindo de um jeito que eu acho ofensivo ou não muito bondoso, eu lembro de Provérbios 19:11. Eu penso nas circunstâncias deles e em como foram criados, e me esforço para entender por que eles agiram daquele jeito. Eu também tento sair com eles na pregação. Fazer isso me ajuda a conhecer melhor esses irmãos.' Esse é um bom conselho. Você pode se esforçar para conhecer melhor os irmãos desde já. Quanto mais você fizer isso, mais você vai entender os irmãos. Assim, vai ser mais fácil perdoar quando eles fizerem algo que deixe você chateado.",
        resposta: "A perspicácia nos ajuda a ter paciência. Podemos pensar nas circunstâncias dos irmãos e em como foram criados para entender por que agiram de certa forma. Trabalhar com eles na pregação ajuda a conhecê-los melhor.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_19_xl.jpg",
        imagemLegenda: "Se você teve um desentendimento com um irmão, trabalhe na pregação junto com ele",
        imagemDescricao: "Irmãs trabalhando juntas na pregação, fortalecendo seu relacionamento."
      },
      {
        paragrafo: "6",
        pergunta: "O que pode nos ajudar a nos dar bem com os irmãos na congregação?",
        textoBase: "O que você pode fazer para se dar bem com os irmãos na congregação? À medida que conhece melhor os irmãos, se esforce para se concentrar nas qualidades deles. (Veja também Provérbios 10:12; Rom. 12:10; Fil. 2:2, 3) Veja como isso ajudou um irmão recém-batizado chamado Mark. Ao passar mais tempo com os irmãos da congregação, ele foi percebendo algumas coisas neles que ele não gostava. O que ajudou Mark a não deixar que as falhas dos irmãos o afastassem de Jeová? Ele diz: 'Eu percebi que as falhas dos irmãos eram muito pequenas em comparação com as coisas horríveis que as pessoas fazem no mundo. Então, ficou claro pra mim que eu não devia ficar me concentrando nessas imperfeições. Em vez disso, decidi focar nas qualidades deles.' Se você também fizer isso, você vai se achegar mais aos irmãos e ter uma boa amizade com eles.",
        resposta: "Concentre-se nas qualidades dos irmãos em vez das imperfeições. As falhas dos irmãos são muito pequenas em comparação com as coisas horríveis que as pessoas fazem no mundo. Focar nas qualidades nos ajuda a ter uma boa amizade com eles."
      },
      {
        paragrafo: "7",
        pergunta: "O que poderia nos fazer sentir falta das coisas que deixamos para trás?",
        textoBase: "Quando você aprendeu a verdade, com certeza ficou muito feliz de não fazer mais parte do mundo de Satanás. Você talvez pense: 'Como alguém poderia querer voltar pra lá?' Mas ao passar por dificuldades, pode ser que você comece a pensar em algumas coisas que você abriu mão para servir a Jeová e até queira ter algumas dessas coisas de volta. (Veja também Números 11:4-6.) Por exemplo, alguns irmãos decidiram deixar para trás uma carreira que dava destaque para eles, mas que consumia muito de seu tempo. Outros perderam amigos achegados por terem começado a estudar a Bíblia. Ainda outros venceram um hábito impuro, mas que dava certo prazer. Imagine como seria triste se um cristão abandonasse a Jeová por causa de alguma coisa que deixou para trás! Então, o que você pode fazer desde já para que, não importa o que aconteça, você nunca volte para essas coisas?",
        resposta: "Ao passar por dificuldades, podemos começar a pensar nas coisas que abrimos mão - uma carreira de destaque, amigos achegados, ou hábitos impuros. Seria triste abandonar a Jeová por causa disso."
      },
      {
        paragrafo: "8",
        pergunta: "O que aprendemos com o exemplo de Abraão e Sara?",
        textoBase: "A Bíblia fala de servos fiéis de Deus que poderiam ter sentido falta do que deixaram para trás. Por exemplo, Abraão e Sara moravam em Ur, uma bela cidade protegida por muralhas. Mas em obediência a Jeová, eles saíram dessa cidade e foram morar em tendas. (Heb. 11:8, 9) Pode ser que de vez em quando eles pensassem nas muitas coisas boas que tinham em Ur. Só que, 'se eles continuassem se lembrando' disso ou até quisessem ter essas coisas de volta, eles poderiam se sentir tentados a voltar para lá. Mas em vez disso, eles se concentraram nas promessas de Jeová para o futuro. — Heb. 11:15, 16.",
        resposta: "Abraão e Sara deixaram uma bela cidade para morar em tendas. Se eles continuassem se lembrando das coisas boas que tinham, poderiam se sentir tentados a voltar. Em vez disso, eles se concentraram nas promessas de Jeová para o futuro."
      },
      {
        paragrafo: "9",
        pergunta: "O que Paulo achava das coisas que tinha deixado para trás? (Filipenses 3:7, 8, 13)",
        textoBase: "O apóstolo Paulo também abriu mão de algumas coisas para servir a Jeová. Antes de se tornar cristão, ele foi ensinado por Gamaliel, um instrutor da Lei muito respeitado pelos judeus. (Atos 22:3) Paulo poderia ter tido uma posição de destaque no judaísmo. (Gál. 1:13, 14) Mas quando ele aceitou as boas novas, ele deixou tudo isso para trás. Será que sua vida como cristão sempre foi fácil? Não. Ele foi espancado, preso e odiado pelo seu próprio povo. (2 Cor. 11:23-26) Se ele ficasse se concentrando nessas dificuldades e pensando em como a vida que tinha antes era mais fácil, ele poderia ter achado que foi um erro se tornar cristão. Mas, em vez disso, Paulo se concentrava no grande privilégio de ser seguidor de Cristo e na maravilhosa recompensa que teria no futuro. Ele estava convencido de que essas bênçãos eram muito mais valiosas do que qualquer coisa que ele tinha deixado para trás!",
        resposta: "Paulo deixou para trás uma possível posição de destaque no judaísmo. Apesar das dificuldades como cristão, ele se concentrava no grande privilégio de ser seguidor de Cristo e na maravilhosa recompensa futura, que eram muito mais valiosas do que qualquer coisa que deixou para trás."
      },
      {
        paragrafo: "10",
        pergunta: "No que devemos sempre meditar? (Marcos 10:29, 30)",
        textoBase: "Qual é a lição para nós? Se você começar a pensar nas coisas que abriu mão para servir a Jeová, lembre-se também de por que você fez isso. (Ecl. 7:10) Compare as coisas que deixou para trás com as bênçãos que você ganhou. Por exemplo, você tem uma amizade achegada com o Soberano do Universo. (Pro. 3:32) Você tem uma família amorosa de irmãos e irmãs no mundo todo. E você tem um futuro maravilhoso pela frente! (Isa. 65:21-23) Se você sempre meditar nas bênçãos que tem por servir a Jeová, vai ser mais difícil você sentir falta das coisas que deixou para trás.",
        resposta: "Compare as coisas que deixou para trás com as bênçãos que ganhou: amizade com Jeová, uma família amorosa de irmãos no mundo todo, e um futuro maravilhoso. Meditar nessas bênçãos torna mais difícil sentir falta das coisas que deixamos para trás.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_21_xl.jpg",
        imagemLegenda: "Em vez de ficar pensando nas coisas que você deixou para trás, concentre-se na alegria e no privilégio que você tem de participar na pregação",
        imagemDescricao: "Uma irmã na pregação vê um time de futebol jogando e se lembra de quando ela também era jogadora. Depois, a mesma irmã dá testemunho para uma das jogadoras."
      },
      {
        paragrafo: "11",
        pergunta: "O que você aprendeu com o exemplo de Rosemary?",
        textoBase: "Uma irmã chamada Rosemary se batizou quando tinha uns 50 anos. Veja o que ela fez para não ficar sentindo falta das coisas que deixou para trás. Ela conta: 'No começo eu senti falta do Natal, porque era uma ocasião muito feliz que eu passava com a minha família, que eu amo tanto. Eu gostava de dar presentes pra eles, de ver as crianças em volta da árvore de Natal e de ver as carinhas delas quando abriam os presentes que ganhavam.' O que a ajudou a lidar com isso? Ela diz: 'Eu descobri um jeito de substituir o Natal. Todo ano, eu escolho um dia pra reunir a minha família, dar presentes pra eles e explicar por que eu amo cada um deles.' Mas Rosemary enfrentou ainda outro desafio. Ela diz: 'Quando eu aprendi a verdade, meus amigos me abandonaram. Às vezes, eu tinha saudades deles e me sentia muito sozinha.' Para lidar com isso, ela começou a convidar várias irmãs diferentes para trabalhar com ela na pregação. Ela conta: 'Isso me ajudou a ter novas amigas que eu amo e valorizo muito.'",
        resposta: "Rosemary substituiu o Natal por um dia especial para reunir a família e dar presentes. Quando os amigos a abandonaram, ela convidou várias irmãs para trabalhar com ela na pregação e fez novas amigas. Podemos substituir coisas que gostávamos de fazer antes por algo melhor."
      },
      {
        paragrafo: "12",
        pergunta: "O que pode acontecer na congregação que talvez seja um desafio muito grande para nós?",
        textoBase: "Quando você se tornou Testemunha de Jeová, provavelmente você ficou aliviado de sair deste mundo mau e de começar a fazer parte do paraíso espiritual, onde as pessoas se esforçam para fazer o que é certo. (Isa. 65:14) Mas, às vezes, alguém na congregação comete um pecado grave. E alguns são até removidos da congregação. (1 Cor. 5:13) Veja como isso afetou uma irmã chamada Samara. Ela diz: 'Pouco tempo depois do meu batismo, um ancião cometeu um pecado grave e foi removido da congregação. Eu quase desisti de servir a Jeová, porque eu achava que era impossível um ancião fazer uma coisa dessas.' É claro que devemos sempre confiar que nossos irmãos e irmãs amam a Jeová e querem continuar fiéis a ele. (1 Cor. 13:4, 7) Mas devemos ser realistas: todos os anos, alguns são removidos da congregação.",
        resposta: "Às vezes alguém na congregação comete um pecado grave e é removido. Se essa pessoa for alguém que amamos ou admiramos muito, isso pode ser um desafio ainda maior. Devemos confiar nos irmãos, mas ser realistas de que isso pode acontecer."
      },
      {
        paragrafo: "13",
        pergunta: "O que podemos fazer agora para continuarmos fiéis se alguém próximo de nós abandonar a Jeová?",
        textoBase: "Você pode se preparar agora para que, se alguém próximo de você abandonar a Jeová, você permaneça fiel. Como? Continue fortalecendo sua amizade com Jeová. (Tia. 4:8) Não permita que essa amizade dependa de outras pessoas continuarem fiéis. Por exemplo, embora muitas vezes nós adoremos a Jeová com a nossa família e com a congregação, nós também precisamos ter nossa própria rotina de leitura da Bíblia e de oração. — Sal. 1:2; 62:8.",
        resposta: "Continue fortalecendo sua amizade com Jeová. Não permita que essa amizade dependa de outras pessoas continuarem fiéis. Tenha sua própria rotina de leitura da Bíblia e de oração, além de adorar com a família e a congregação."
      },
      {
        paragrafo: "14",
        pergunta: "O que aprendemos com o exemplo do apóstolo Pedro? (João 6:66-68)",
        textoBase: "Também podemos aprender uma lição com o apóstolo Pedro. Certa vez, muitos discípulos pararam de seguir a Jesus porque não entenderam algo que ele falou. Talvez Pedro também tenha ficado um pouco confuso com o que Jesus disse. Mas veja a reação dele em João 6:66-68. Em vez de se concentrar no que os outros estavam fazendo, Pedro se concentrou nas verdades que já tinha aprendido com Jesus. Assim, ele não permitiu que sua fé enfraquecesse. Da mesma forma hoje, o que os outros fazem não muda o valor das verdades que você aprendeu com a organização de Jeová. Então, se apegue a essas verdades e continue fiel a Jeová.",
        resposta: "Pedro se concentrou nas verdades que já tinha aprendido com Jesus, não no que os outros estavam fazendo. Da mesma forma, o que os outros fazem não muda o valor das verdades que aprendemos. Devemos nos apegar a essas verdades e continuar fiéis."
      },
      {
        paragrafo: "15",
        pergunta: "O que você aprendeu com o exemplo de Emily?",
        textoBase: "Veja o que aconteceu com Emily. Apenas uma semana depois de seu batismo, a mãe dela abandonou a família e foi removida da congregação. Emily diz: 'Eu nunca imaginei que isso pudesse acontecer. Esse tem sido o maior desafio da minha vida, e eu sinto muita falta da minha mãe.' O que tem ajudado Emily? Ela conta: 'Eu não estou sozinha. Eu tenho o apoio não só do meu pai, mas também de outros irmãos da congregação, que são como uma família pra mim. Todos nós estamos enfrentando alguma dificuldade. Por isso, é importante ficarmos próximos dos irmãos e encorajarmos uns aos outros.' (1 Ped. 5:9) Você não precisa esperar surgir um desafio para fortalecer sua amizade com os irmãos na congregação. Faça isso desde já. Assim, não importa o que aconteça, você nunca vai estar sozinho.",
        resposta: "Emily teve o apoio do pai e de outros irmãos da congregação. É importante ficar próximo dos irmãos e encorajar uns aos outros. Fortaleça sua amizade com os irmãos desde já, assim você nunca estará sozinho."
      },
      {
        paragrafo: "16",
        pergunta: "Do que devemos nos lembrar?",
        textoBase: "Lembre-se também que Jeová disciplina quem ele ama. (Heb. 12:6) Ele quer que todos os que foram removidos da congregação voltem para ele. (2 Ped. 3:9) Então, se alguém próximo de você for removido da congregação, você pode ter certeza de que os anciãos vão fazer de tudo para ajudar essa pessoa a voltar para Jeová. — 2 Tim. 2:24, 25.",
        resposta: "Jeová disciplina quem ele ama e quer que todos os removidos voltem para ele. Os anciãos vão fazer de tudo para ajudar essa pessoa a voltar para Jeová.",
        imagem: "https://assetsnffrgf-a.akamaihd.net/assets/m/2026086/univ/art/2026086_univ_lsr_23_xl.jpg",
        imagemLegenda: "Se alguém próximo de você for removido da congregação, lembre-se de que os anciãos querem ajudar essa pessoa a voltar para Jeová",
        imagemDescricao: "Dois anciãos fazem uma visita para um homem que foi removido da congregação e o incentivam a voltar para Jeová."
      },
      {
        paragrafo: "17",
        pergunta: "Que certeza podemos ter?",
        textoBase: "Neste estudo, falamos só de alguns dos desafios que você talvez enfrente depois do batismo. É verdade que alguns podem parecer bem difíceis, mas você não precisa ter medo. Você pode fazer muitas coisas para se preparar. E nunca se esqueça: a Pessoa mais poderosa do Universo, Jeová, vai te ajudar. Ele já fez isso no passado e quer continuar fazendo isso para sempre! (1 Ped. 5:10) Ele vai te dar forças para perseverar e enfrentar qualquer dificuldade. Se você continuar aceitando a ajuda de Jeová, nenhum desafio vai te afastar dele! — Sal. 119:165; Rom. 8:38, 39.",
        resposta: "Você pode fazer muitas coisas para se preparar. Jeová, a Pessoa mais poderosa do Universo, vai te ajudar e te dar forças para perseverar e enfrentar qualquer dificuldade. Se continuar aceitando a ajuda de Jeová, nenhum desafio vai te afastar dele!"
      }
    ],
    recapitulacao: [
      {
        pergunta: "Um irmão ou uma irmã ofende você",
        resposta: "Seja bondoso e mostre compaixão para evitar problemas. Seja rápido em perdoar, lembrando que Jeová nos perdoa. Use a perspicácia para entender por que a pessoa agiu daquela forma. Conheça melhor os irmãos e concentre-se nas qualidades deles."
      },
      {
        pergunta: "Sentir falta do que deixou para trás",
        resposta: "Compare as coisas que deixou para trás com as bênçãos que ganhou: amizade com Jeová, família de irmãos no mundo todo, futuro maravilhoso. Substitua coisas que gostava de fazer antes por algo melhor que agrade a Jeová."
      },
      {
        pergunta: "Outros abandonam a Jeová",
        resposta: "Fortaleça sua amizade com Jeová com sua própria rotina de leitura e oração. Não permita que sua amizade com Deus dependa de outros continuarem fiéis. Concentre-se nas verdades que aprendeu. Fique próximo dos irmãos e encoraje uns aos outros."
      }
    ]
  }
]
